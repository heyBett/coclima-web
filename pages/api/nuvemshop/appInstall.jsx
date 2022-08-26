import fetch from "node-fetch";
import { prisma } from "../../../db";
import { authOptions } from "../auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

export default async function handler(req, res) {
  const code = req.query.code;

  //Nuvemshop's OAuth
  const optionsNS = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "CoClima(https://coclima.com)",
      Agent: "Luiz Bett(luiz@codx.dev",
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: "3804",
      client_secret: "Bh6XbGgPd1GoW18rCj95m3ePSErdrAB8zv5OuFeVJEI6gt6R",
      code: code,
    }),
  };

  const requestNS = await fetch(
    "https://www.tiendanube.com/apps/authorize/token",
    optionsNS
  );
  const responseNS = await requestNS.json();
  const access_token = responseNS.access_token;
  const store_id = responseNS.user_id;
  console.log(responseNS);

  //Get Store's data

  const optionsStore = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "CoClima(https://coclima.com)",
      Agent: "Luiz Bett(luiz@codx.dev",
      Authentication: "bearer " + access_token,
    },
  };
  const urlStore = "https://api.tiendanube.com/v1/" + store_id + "/store";
  const requestStore = await fetch(urlStore, optionsStore);
  const responseStore = await requestStore.json();

  let email = responseStore.email;
  if (email === null) {
    email = "Sua Conta";
  }

  const password = "sen" + responseStore.id;

  let name = responseStore.name.pt;
  if (name === null) {
    name = "Sua Conta";
  }

  let street = responseStore.business_address;
  if (street === null) {
    street = "Sem Endereço";
  }

  let phone = responseStore.phone;
  if (phone === null) {
    phone = "Sem Telefone";
  }

  let cpfcnpj = responseStore.business_id;
  if (cpfcnpj === null) {
    cpfcnpj = "Sem CNPJ" + store_id;
  }
  console.log(responseStore);

  /*  //Creates company on CoClima's API
  
  const optionsCompany = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': access_token_coclima },
    body: JSON.stringify({ name: name, street: street, phone: phone, role: 'company', store_id: store_id, access_token: access_token, cpfcnpj: cpfcnpj })
  };
  let requestCompany = await fetch('https://api.coclima.com/companies', optionsCompany)
  let responseCompany = await requestCompany.json()
  let company_id = responseCompany.id
  console.log(responseCompany)
 */

  const existingCompany = await prisma.companies.findFirst({
    where: {
      nsid: '"' + store_id + '"',
    },
  });

  let company = existingCompany;

  if (existingCompany === null) {
    company = await prisma.companies.create({
      data: {
        name: name,
        street: street,
        phone: phone,
        role: "company",
        nsid: '"' + store_id + '"',
        nstoken: access_token,
        cpfcnpj: cpfcnpj,
        email: email,
        percentage: 2,
      },
    });
  } else {
    company = await prisma.companies.update({
      where: {
        id: existingCompany.id,
      },
      data: {
        name: name,
        street: street,
        phone: phone,
        role: "company",
        nsid: '"' + store_id + '"',
        nstoken: access_token,
        cpfcnpj: cpfcnpj,
        email: email,
      },
    });
  }
  console.log(company);

  //Creates user on CoClima's API

  const existingUser = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  let user = existingUser;

  if (existingUser === null) {
    user = await prisma.user.create({
      data: {
        name: name,
        role: "user",
        email: email,
        company_id: company.id,
      },
    });
  }
  console.log(user);

  //Create Webhooks for order/paid

  const optionsCreateWebhooks = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "CoClima(https://coclima.com)",
      Agent: "Luiz Bett(luiz@codx.dev",
      Authentication: "bearer " + access_token,
    },
    body: JSON.stringify({
      url: "https://co-clima-dashboard-v2.vercel.app/api/nuvemshop/orderUpdate",
      event: "order/paid",
    }),
  };
  const urlCreateWebhooks =
    "https://api.tiendanube.com/v1/" + store_id + "/webhooks";
  const requestCreateWebhooks = await fetch(
    urlCreateWebhooks,
    optionsCreateWebhooks
  );
  const responseCreateWebhooks = await requestCreateWebhooks.json();
  console.log(responseCreateWebhooks);

  const optionsCreateCancelledWebhooks = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "CoClima(https://coclima.com)",
      Agent: "Luiz Bett(luiz@codx.dev",
      Authentication: "bearer " + access_token,
    },
    body: JSON.stringify({
      url: "https://co-clima-dashboard-v2.vercel.app/api/nuvemshop/orderUpdate",
      event: "order/cancelled",
    }),
  };
  const urlCreateCancelledWebhooks =
    "https://api.tiendanube.com/v1/" + store_id + "/webhooks";
  const requestCreateCancelledWebhooks = await fetch(
    urlCreateCancelledWebhooks,
    optionsCreateCancelledWebhooks
  );
  const responseCreateCancelledWebhooks =
    await requestCreateCancelledWebhooks.json();
  console.log(responseCreateCancelledWebhooks);

  //Create Store's Modal

  const optionsModal = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "CoClima(https://coclima.com)",
      Agent: "Luiz Bett(luiz@codx.dev",
      Authentication: "bearer " + access_token,
    },
    body: JSON.stringify({
      src: "https://parceiros.coclima.com//api/nuvemshop/storeModal",
      event: "onload",
      where: "checkout",
    }),
  };

  const urlModal = "https://api.tiendanube.com/v1/" + store_id + "/scripts";
  const requestModal = await fetch(urlModal, optionsModal);
  const responseModal = await requestModal.json();
  console.log(responseModal);
  res
    .status(200)
    .redirect(307, "https://www.coclima.com/obrigado?email=" + email);
}
