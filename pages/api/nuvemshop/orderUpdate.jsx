import fetch from "node-fetch";
import { prisma } from "../../../db";

export default function handler(req, res) {
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
    const company = /* await */ prisma.companies.findFirst({
      where: {
        nsid: '"' + req.body.store_id + '"',
      },
    });
    const access_token = company.access_token;

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
    const urlStore =
      "https://api.tiendanube.com/v1/" +
      req.body.store_id +
      "/orders/" +
      req.body.id;
    const requestStore = /*  await */ fetch(urlStore, optionsStore);
    const responseStore = /* await */ requestStore.json();
    const date = responseStore.created_at;
    const subtotal = responseStore.subtotal;
    console.log(responseStore);

    //Post Receipt with order information
    const receipt = /* await  */ prisma.receipts.create({
      data: {
        date: date,
        vendor: "nuvemshop",
        value: subtotal,
        order_id: req.body.id,
        company: {
          connect: {
            id: company.id,
          },
        },
      },
    });

    console.log(receipt);

    const log = prisma.log.create({
      data: {
        receipt: {
          connect: {
            id: receipt.id,
          },
        },
        value: receipt.value,
        description: "Criado pela API da Nuvemshop",
        event: "Criado",
        status: false,
      },
    });

    return res.status(200).json({});
  }
  return res.status(403).json("Not authorized");
}
