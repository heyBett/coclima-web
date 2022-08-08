import { prisma } from "../../../../db";
import { authOptions } from "../../auth/[...nextauth]";
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
            value: true,
            plantations: {
              select: {
                planted: true,
                tree_value: true,
                date: true,
                geolocation: true,
                /* archives: true, */
                created_at: true,
                partner: {
                  select: {
                    name: true,
                    id: true,
                  },
                },
              },
            },
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

    const plantations = await prisma.plantations.findMany({
      where: {
        handler: {
          some: {
            id: result.handler.id,
          },
        },
      },
      select: {
        id: true,
        date: true,
        geolocation: true,
        planted: true,
        external: true,
        description: true,
        tree_value: true,
        handler: {
          select: {
            value: true,
            company_id: true,
          },
        },
      },
    });

    res.json({
      data: result,
      photos: photos,
      plantations: plantations,
    });
  } else {
    res.json("Not authorized");
    res.status(401);
  }
}
