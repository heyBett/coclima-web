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
          logs: true,
          paid: true,
          value: true,
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
        log: item.logs,
        percentage: item.company.percentage,
        orderId: item.order_id,
        vendor: item.vendor,
        dateStr:
          month[item.created_at.getMonth()] +
          "/" +
          item.created_at.getFullYear(),
        dateInt:
          item.created_at.getMonth() + 1 + "/" + item.created_at.getFullYear(),
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
      console.log(req.query.id);

      const receipt = await prisma.receipts.update({
        where: {
          id: req.query.id,
        },
        data: {
          created_at: req.body.created_at,
          due_at: req.body.due_at,
          paid_at: req.body.paid_at,
          vendor: req.body.vendor,
          value: req.body.value,
          order_id: req.body.order_id,
          observations: req.body.observations,
          company: {
            connect: {
              id: req.body.company,
            },
          },
          paid: req.body.paid,
        },
      });

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
          event: "Recibo Atualizado",
          description: "Recibo atualizado via Dashboard",
        },
      });
      res.json(receipt);
    } else {
      res.json("");
    }
  }

  if (req.method === "DELETE") {
    if (session.user.role === "Admin") {
      const receipt = await prisma.receipts.update({
        where: {
          id: req.query.id,
        },
        data: {
          deleted_at: new Date(),
        },
      });
      res.json(receipt);
      res.status(200);
    }
  }
}
