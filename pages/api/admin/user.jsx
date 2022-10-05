import { prisma } from "../../../db";
import { authOptions } from "../auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

export default async function handle(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session.user.role === "Admin") {
    if (req.method === "POST") {
      const exists = await prisma.user.findUnique({
        where: {
          email: req.body.email,
        },
      });
      if (exists) {
        res.json("Exists");
      } else {
        const user = await prisma.user.create({
          data: {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            image: req.body.avatar.base64,
            role: req.body.role,
            company: {
              connect: {
                id: req.body.company,
              },
            },
          },
        });
        res.json(user);
        res.status(201);
      }
    }

    if (req.method === "GET") {
      const user = await prisma.user.findUnique({
        where: {
          id: req.query.id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          company: {
            select: {
              id: true,
            },
          },
          carbonPercentage: true,
        },
      });
      res.json(user);
      res.status(201);
    }

    if (req.method === "PATCH") {
      if (session.user.role === "Admin") {
        const user = await prisma.user.update({
          where: {
            id: req.body.id,
          },
          data: {
            name: req.body.name,
            email: req.body.email,
            image: req.body.avatar.base64,
            role: req.body.role,
            company: {
              connect: {
                id: req.body.company,
              },
            },
          },
        });
        res.json(user);
        res.status(200);
      } else {
        const user = await prisma.user.update({
          where: {
            id: session.user.id,
          },
          data: {
            name: req.body.name,
            email: req.body.email,
            image: req.body.avatar.base64,
          },
        });
        res.json(user);
        res.status(200);
      }
    }

    if (req.method === "DELETE") {
      if (session.user.role === "Admin") {
        const user = await prisma.user.update({
          where: {
            id: req.query.id,
          },
          data: {
            deleted_at: new Date(),
          },
        });
        res.json(user);
        res.status(200);
      }
    }
  } else {
    res.json("Not authorized");
    res.status(401);
  }
}
