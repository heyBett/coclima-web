import FooterScript from "../../../components/nuvemshop/footerScript";
import { renderToString } from "react-dom/server";
import { prisma } from "../../../db";

export default async function Footer(req, res) {
  const store = req.query.store;

  const script = renderToString(<FooterScript />)
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;/g, "'");
  res.setHeader("Content-Type", "application/javascript; charset=UTF-8");
  res.write(script);
  res.end();
}
