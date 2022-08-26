import { prisma } from "../../../../db";
import { authOptions } from "../../auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
const _ = require("lodash");

export default async function handle(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session) {
    if (session.user.role === "Admin") {
      const result = await prisma.companies.findMany({
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

      const allHandlers = result.map((item) => item.handler);

      const wrappedArray = _.flatten(allHandlers);

      const photos = await prisma.archives.findMany({
        take: 9,
        where: {
          plantation: {
            handler: {
              some: {
                company_id: session.user.company_id,
              },
            },
          },
        },
      });

      const plantations = await prisma.plantations.findMany({
        where: {
          handler: {
            some: {
              id: { in: wrappedArray.map((item) => item.id) },
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

      const handlerMap = result.handler.map((item) => item.id);

      const photos = await prisma.archives.findMany({
        take: 9,
        where: {
          plantation: {
            handler: {
              some: {
                company_id: session.user.company_id,
              },
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
    }
  } else {
    res.json("Not authorized");
    res.status(401);
  }
}
