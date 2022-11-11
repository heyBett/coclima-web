import { prisma } from "../../../db";
import { authOptions } from "../auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
const axios = require("axios");

export const config = {
  api: {
    responseLimit: false,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    bodyParser: {
      sizeLimit: "100mb",
    },
  },
};

export default async function handle(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (session.user.role === "Admin") {
    if (req.method === "POST") {
      const plantation = await prisma.plantations.create({
        data: {
          planted: req.body.planted,
          tree_value: req.body.tree_cost,
          description: req.body.description,
          date: req.body.date,
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

      const archive = req.body.photos.map(async (photo) => {
        const files = await prisma.archives.create({
          data: {
            name: photo.filename,
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

        photo.id = files.id;
        photo.plantation = files.plantation_id;
        const test = await axios({
          method: "post",
          url: process.env.UPLOAD_URL + "/api/fileUpload/upload",
          data: { photo: photo },
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        });
      });

      const handler = req.body.handler.map(async (company) => {
        await prisma.handler.create({
          data: {
            value: parseInt(company.value, 10),
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
      const plantation = await prisma.plantations.findUnique({
        where: {
          id: req.query.id,
        },
        include: {
          archives: true,
        },
      });

      const handler = await prisma.handler.findMany({
        where: {
          plantation_id: plantation.id,
        },
        include: {
          company: {
            include: {
              handler: true,
              receipts: {
                where: {
                  paid: true,
                },
              },
            },
          },
        },
      });

      res.json({ plantation: plantation, handler: handler });
    }

    if (req.method === "PATCH") {
      /*  const getHandlersToUnset = await prisma.handler.findMany({
        where: {
          plantation_id: req.query.id,
        },
        select: {
          id: true,
        },
      }); */

      const getArchivesToUnset = await prisma.archives.findMany({
        where: {
          plantation_id: req.query.id,
        },
        select: {
          id: true,
        },
      });

      getArchivesToUnset.map(async (archive) => {
        const unsetHandler = await prisma.archives.delete({
          where: {
            id: archive.id,
          },
        });
      });
      /* 
      getHandlersToUnset.map(async (handler) => {
        const unsetHandler = await prisma.handler.delete({
          where: {
            id: handler.id,
          },
        });
      }); */

      const plantation = await prisma.plantations.update({
        where: {
          id: req.query.id,
        },
        data: {
          planted: req.body.planted,
          tree_value: req.body.tree_cost,
          date: req.body.date,
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

      const archive = req.body.photos.map(async (photo) => {
        const files = await prisma.archives.create({
          data: {
            name: photo.filename,
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

        photo.id = files.id;
        photo.plantation = files.plantation_id;
        const test = await axios({
          method: "post",
          url: process.env.UPLOAD_URL + "/api/fileUpload/upload",
          data: { photo: photo },
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        });
      });

      /* const handler = req.body.handler.map(async (company) => {
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
      }); */

      res.json(await archive);
      res.status(201);
    }

    if (req.method === "DELETE") {
      if (session.user.role === "Admin") {
        const disconnect = await prisma.handler.deleteMany({
          where: {
            plantation_id: req.body.id,
          },
        });

        const plantation = await prisma.plantations.update({
          where: {
            id: req.query.id,
          },
          data: {
            deleted_at: new Date(),
          },
        });
        res.json(plantation);
        res.status(200);
      }
    }
  } else {
    res.json("Not authorized");
    res.status(401);
  }
}
