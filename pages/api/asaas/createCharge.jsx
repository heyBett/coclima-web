import { getYear } from "date-fns";
import fetch from "node-fetch";
import { prisma } from "../../../db";
const _ = require("lodash");

export default async function handler(req, res) {
  const validToken = process.env.VALIDATION_TOKEN === req.query.token;

  if (validToken) {
    let lastMonth = new Date().getMonth() - 1;
    let year = new Date().getFullYear();
    if (lastMonth === 0) {
      year = new Date().getFullYear() - 1;
    }

    const from = new Date();
    from.setFullYear(year, lastMonth, 1);

    let day = 28;
    if (
      lastMonth === 0 ||
      lastMonth === 2 ||
      lastMonth === 4 ||
      lastMonth === 6 ||
      lastMonth === 7 ||
      lastMonth === 9 ||
      lastMonth === 11
    ) {
      day = 31;
    } else if (
      lastMonth === 3 ||
      lastMonth === 5 ||
      lastMonth === 8 ||
      lastMonth === 10
    ) {
      day = 30;
    }
    const to = new Date();
    to.setFullYear(year, lastMonth, day);

    const receipts = await prisma.receipts.findMany({
      where: {
        AND: [
          {
            created_at: {
              gt: from,
            },
          },
          {
            created_at: {
              lt: to,
            },
          },
          {
            paid: false,
          },
        ],
      },
      include: {
        company: {
          select: {
            email: true,
            fees: true,
            penalty: true,
            name: true,
            cpfcnpj: true,
          },
        },
      },
    });

    const ordenedReceipts = _.groupBy(receipts, "company_id");

    const receiptsByCompany = Object.keys(ordenedReceipts).map((item) => ({
      company_id: item,
      email: ordenedReceipts[item][0].company.email,
      name: ordenedReceipts[item][0].company.name,
      fees: parseInt(ordenedReceipts[item][0].company.fees),
      penalty: parseInt(ordenedReceipts[item][0].company.penalty),
      cpfCnpj: ordenedReceipts[item][0].company.cpfcnpj,
      value: parseFloat(
        (_.sumBy(ordenedReceipts[item], "value") / 100).toFixed(2)
      ),
    }));

    const requests = receiptsByCompany.map(async (item) => {
      //Searching Customer on Asaas
      const optionsSearch = {
        method: "GET",
        headers: {
          access_token: process.env.ASAAS_TOKEN.replace("DOLLAR", "$"),
        },
      };

      const requestSearch = await fetch(
        "https://www.asaas.com/api/v3/customers?email=" + item.email,
        optionsSearch
      );

      const json = await requestSearch.json();
      const existent = json.data.length > 0;
      let customer_id = null;
      if (existent) {
        customer_id = json.data[0].id;
        console.log(customer_id);
      } else {
        //Creating Customer on Asaas
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            access_token: process.env.ASAAS_TOKEN.replace("DOLLAR", "$"),
          },
          body: JSON.stringify({
            name: item.name,
            email: item.email,
            cpfCnpj: item.cpfCnpj,
          }),
        };

        const request = await fetch(
          "https://www.asaas.com/api/v3/customers",
          options
        );

        const customerCreated = await request.json();

        customer_id = customerCreated.id;
        console.log(customer_id);
      }

      //Creating Charge on Asaas
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          access_token: process.env.ASAAS_TOKEN.replace("DOLLAR", "$"),
        },
        body: JSON.stringify({
          customer: customer_id,
          billingType: "UNDEFINED",
          dueDate: year + "-" + (lastMonth + 2) + "-" + 10,
          value: item.value,
          fine: {
            value: item.fees,
          },
          interest: {
            value: item.penalty,
          },
        }),
      };

      const request = await fetch(
        "https://www.asaas.com/api/v3/payments",
        options
      );

      const chargeCreated = await request.json();

      console.log(chargeCreated);
    });

    return res.status(200).json(receiptsByCompany);
  } else {
    res.status(401).json("Not authorized");
  }
}
