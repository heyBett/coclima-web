import { prisma } from "../../../db";
import { authOptions } from "../auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
const _ = require("lodash");

export default async function handle(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session) {
    const result = await prisma.companies.findUnique({
      where: {
        id: session.user.company_id,
      },
      select: {
        handler: {
          select: {
            id: true,
          },
        },
      },
    });

    const photos = await prisma.archives.findMany({
      take: 9,
      where: {
        plantation: {
          handler: {
            some: {
              id: result.handler.id,
            },
          },
        },
      },
    });

    res.json(photos);
  } else {
    res.json("Not authorized");
    res.status(401);
  }
}
