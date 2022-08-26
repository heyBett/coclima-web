import { prisma } from "../../../../db";
import { authOptions } from "../../auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
const _ = require("lodash");

export default async function handle(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);
  const id = req.query.id;
  if (req.method === "GET") {
    if (session.user.role === "Admin") {
      const receipts = await prisma.receipts.findMany({
        where: {
          deleted_at: null,
          company_id: id,
        },
        select: {
          id: true,
          paid: true,
          value: true,
          date: true,
          order_id: true,
          vendor: true,
          company: {
            select: {
              name: true,
              percentage: true,
            },
          },
          company_id: true,
          created_at: true,
        },
      });

      const month = [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ];

      const dateArray = receipts.map((item) => ({
        value: item.value,
        id: item.id,
        paid: item.paid,
        percentage: item.company.percentage,
        orderId: item.order_id,
        vendor: item.vendor,
        dateStr: month[item.date.getMonth()] + "/" + item.date.getFullYear(),
        dateInt: item.date.getMonth() + 1 + "/" + item.date.getFullYear(),
      }));

      const orderedByMonth = _.orderBy(dateArray, ["dateInt"], ["asc"]);

      const groupedByMonth = _.groupBy(orderedByMonth, "dateStr");

      res.json({
        receipts: orderedByMonth,
        client: receipts[0].company.name,
      });
    } else {
      res.json("Not authorized");
      res.status(401);
    }
  }

  if (req.method === "PATCH") {
    if (session.user.role === "Admin") {
      const receipt = await prisma.receipts.update({
        where: {
          id: req.body.id,
        },
        data: {
          paid: req.body.paid,
        },
      });
      res.json(receipt);
      res.status(200);
    }
  }
}
