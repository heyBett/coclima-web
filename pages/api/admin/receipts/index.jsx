import { prisma } from "../../../../db";
import { authOptions } from "../../auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

export default async function handle(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session.user.role === "Admin") {
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
  } else {
    res.json("Not authorized");
    res.status(401);
  }
}
