import fetch from "node-fetch";
import { prisma } from "../../../db";

export default async function handler(req, res) {
  const crypto = require("crypto");
  const header = req.headers["x-linkedstore-hmac-sha256"];
  const secret = "Bh6XbGgPd1GoW18rCj95m3ePSErdrAB8zv5OuFeVJEI6gt6R";
  const data = req.body;
  const validated = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(data))
    .digest("hex");

  const authenticatedWebhook = validated === header;

  console.log("Came from Nuvemshop: " + authenticatedWebhook);

  if (authenticatedWebhook) {
    //Get data from Coclima about this store access token
    const company = await prisma.companies.findFirst({
      where: {
        nsid: String(req.body.store_id),
      },
    });
    const access_token = company.nstoken;

    console.log(company);

    //Get data from Order
    const optionsStore = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "CoClima(https://coclima.com)",
        Agent: "Luiz Bett(luiz@codx.dev",
        Authentication: "bearer " + access_token,
      },
    };
    console.log(access_token);
    const urlStore =
      "https://api.tiendanube.com/v1/" +
      req.body.store_id +
      "/orders/" +
      req.body.id;
    const requestStore = await fetch(urlStore, optionsStore);
    const responseStore = await requestStore.json();
    const date = responseStore.created_at;
    const subtotal = responseStore.subtotal;
    console.log(responseStore);

    //Post Receipt with order information
    const receipt = await prisma.receipts.create({
      data: {
        date: new Date(),
        vendor: "nuvemshop",
        value: parseInt(subtotal.replace(".", ""), 10),
        order_id: String(req.body.id),
        company: {
          connect: {
            id: company.id,
          },
        },
      },
    });

    console.log(receipt);

    const log = await prisma.logs.create({
      data: {
        receipt: {
          connect: {
            id: receipt.id,
          },
        },
        content: receipt,
        value: String(receipt.value),
        status: receipt.paid,
        owner: session.user.name,
        event: "Recibo Criado",
        description: "Criado pela API da Nuvemshop",
      },
    });

    return res.status(200).json({});
  }
  return res.status(403).json("Not authorized");
}
