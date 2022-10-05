import ModalScript from "../../../components/nuvemshop/modalScript";
import { renderToString } from "react-dom/server";
import { prisma } from "../../../db";

export default async function Modal(req, res) {
  const store = req.query.store;
  const plantedTrees = await prisma.companies.findFirst({
    where: {
      nsid: store,
    },
    select: {
      percentage: true,
      receipts: true,
    },
  });

  let totalValue = 1;

  if (plantedTrees?.receipts?.length > 0) {
    totalValue = Math.ceil(
      plantedTrees.receipts
        .map(
          (item) =>
            (parseFloat(item.value) / 100 / 100 / 25) *
            parseInt(plantedTrees.percentage)
        )
        .reduce((a, b) => a + b)
    );
  }

  let word = "àrvores";
  if (totalValue === 1) {
    word = "àrvore";
  }

  console.log(totalValue, word);

  const logoB64 =
    "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";
  let data = { store: store, logo: logoB64, word: word, trees: totalValue };
  const script = renderToString(<ModalScript data={data} />)
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
