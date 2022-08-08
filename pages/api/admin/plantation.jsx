import { prisma } from "../../../db";
import { authOptions } from "../auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

export const config = {
  api: {
    responseLimit: false,
    bodyParser: {
      sizeLimit: "100mb",
    },
  },
};

export default async function handle(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);
  console.log(req.body.geolocation);
  if (session.user.role === "Admin") {
    if (req.method === "POST") {
      const plantation = await prisma.plantations.create({
        data: {
          planted: req.body.planted,
          tree_value: req.body.tree_cost,
          description: req.body.description,
          observations: req.body.observations,
          geolocation: req.body.geolocation,
          external: req.body.external,
          partner: {
            connect: {
              id: req.body.partner,
            },
          },
        },
      });
      console.log(plantation);

      const archive = req.body.photos.map(async (photo) => {
        await prisma.archives.create({
          data: {
            name: photo.filename,
            data: photo.data,
            type: photo.contentType,
            partner: {
              connect: {
                id: req.body.partner,
              },
            },
            plantation: {
              connect: {
                id: plantation.id,
              },
            },
          },
        });
      });

      const handler = req.body.handler.map(async (company) => {
        await prisma.handler.create({
          data: {
            value: company.value,
            company: {
              connect: {
                id: company.id,
              },
            },
            plantations: {
              connect: {
                id: plantation.id,
              },
            },
          },
        });
      });

      res.json({ plantation });
      res.status(201);
    }

    if (req.method === "GET") {
    }

    if (req.method === "PATCH") {
    }

    if (req.method === "DELETE") {
    }
  } else {
    res.json("Not authorized");
    res.status(401);
  }
}
