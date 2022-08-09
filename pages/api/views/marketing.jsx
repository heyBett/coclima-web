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

    const plantations = await prisma.plantations.findMany({
      where: {
        handler: {
          some: {
            id: { in: result.handler.map((item) => item.id) },
          },
        },
      },
      select: {
        id: true,
        planted: true,
        date: true,
        geolocation: true,
        external: true,
        archives: { take: 1 },
        tree_value: true,
        handler: {
          select: {
            value: true,
            company_id: true,
          },
        },
      },
    });

    res.json(plantations);
  } else {
    res.json("Not authorized");
    res.status(401);
  }
}
