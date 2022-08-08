import fetch from "node-fetch";



export default function handler(req, res) {
 
//Login to get an Admin bearer Token
  const optionsLogin = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: process.env.COCLIMA_ADMIN_LOGIN, password: process.env.COCLIMA_ADMIN_PASSWORD })
  };
  const token = await fetch('https://api.coclima.com/login', optionsLogin)
  const bearer = await token.json()
  const access_token_coclima = 'Bearer ' + bearer.token
  console.log(bearer)

  //Get data from Coclima about this store access token
  const optionsGetCompany = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': access_token_coclima }
  };

  const getExistingCompany = await fetch('https://api.coclima.com/webhookCompanyNS/' + req.body.store_id, optionsGetCompany)
  const responsegetExistingCompany = await getExistingCompany.json()
  const access_token = responsegetExistingCompany.access_token
  const client_id = responsegetExistingCompany.id
  console.log(responsegetExistingCompany)

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
  const optionsReceipt = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': access_token_coclima },
    body: JSON.stringify({ date: date, value: subtotal, client_id: client_id })
  };
  const requestReceipt = await fetch('https://api.coclima.com/receipts', optionsReceipt)
  const responseReceipt = await requestReceipt.json()
  console.log(responseReceipt)

  return res.status(200).json({});


}
