import ModalCSS from "../../../components/nuvemshop/modalCSS";
import { renderToString } from "react-dom/server";

export default async function Modal(req, res) {
  const css = renderToString(<ModalCSS />)
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");

  res.write(css);
  res.end();
}
