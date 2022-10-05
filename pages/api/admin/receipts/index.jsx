import { prisma } from "../../../../db";
import { authOptions } from "../../auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

export default async function handle(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session.user.role === "Admin") {
    if (req.method === "GET") {
      const receipts = await prisma.companies.findMany({
        where: {
          deleted_at: null,
        },
        select: {
          name: true,
          percentage: true,
          id: true,
          receipts: {
            where: {
              deleted_at: null,
            },
            select: {
              id: true,
              paid: true,
              value: true,
              date: true,
              order_id: true,
              vendor: true,
              created_at: true,
            },
          },
        },
      });
      res.json(receipts);
    }
    if (req.method === "POST") {
      const receipt = await prisma.receipts.create({
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
          event: "Recibo Criado",
          description: "Recibo criado via Dashboard",
        },
      });
      res.json(receipt);
    }
  } else {
    res.json("Not authorized");
    res.status(401);
  }
}
