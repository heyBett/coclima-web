import fetch from "node-fetch";

export default function handler(req, res) {
//Get data from Coclima about this store access token
const company = prisma.companies.findFirst({
    where: {
      nsid: '"' + req.body.store_id + '"',
    },
  });  
  const access_token = company.access_token
  console.log(company)

  //Get data from Order
  const optionsStore = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'User-Agent': 'CoClima(https://coclima.com)', 'Agent': 'Luiz Bett(luiz@codx.dev', 'Authentication': 'bearer ' + access_token }
  };
  const urlStore = 'https://api.tiendanube.com/v1/' + req.body.store_id + '/orders/' + req.body.id
  const requestStore = await fetch(urlStore, optionsStore)
  const responseStore = await requestStore.json()
  const date = responseStore.created_at
  const subtotal = responseStore.subtotal
  console.log(responseStore)


  //Post Receipt with order information
  const receipt =  prisma.receipts.create({
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
  
  console.log(receipt) 

  return res.status(200).json({});
}
