import { prisma } from "../../db";
import { authOptions } from "./auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
const _ = require("lodash");

export default async function handle(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session) {
    const result = await prisma.companies.create({
      data: {
        name: req.body.busname,
        email: req.body.busemail,
        cep: req.body.cep,
        city: req.body.city,
        complement: req.body.complement,
        cpfcnpj: req.body.cpfcnpj,
        district: req.body.district,
        number: req.body.number,
        percentage: 2,
        phone: req.body.phone,
        role: "company",
        site: req.body.site,
        state: req.body.state,
        street: req.body.street,
        users: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });
    const user = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: req.body.busname,
        email: req.body.busemail,
        image: req.body.avatar.base64,
      },
    });

    res.json(user);
  } else {
    res.json("Not authorized");
    res.status(401);
  }
}
