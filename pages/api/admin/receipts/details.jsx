import { prisma } from "../../../../db";
import { authOptions } from "../../auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

export default async function handle(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session.user.role === "Admin") {
    if (req.method === "GET") {
      const receipts = await prisma.receipts.findUnique({
        where: {
          id: req.query.id,
        },

        select: {
          id: true,
          paid: true,
          value: true,
          date: true,
          order_id: true,
          vendor: true,
          created_at: true,
          due_at: true,
          paid_at: true,
          company_id: true,
          observations: true,
        },
      });
      res.json(receipts);
    }
  } else {
    res.json("Not authorized");
    res.status(401);
  }
}
