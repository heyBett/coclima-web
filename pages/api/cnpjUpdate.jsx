import { prisma } from "../../db";
import { authOptions } from "./auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
const _ = require("lodash");

export default async function handle(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session) {
    const company = await prisma.companies.update({
      where: {
        id: session.user.company_id,
      },
      data: {
        cpfcnpj: req.body.cpfcnpj,
      },
    });

    const user = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: req.body.name,
        email: req.body.email,
        image: req.body.avatar.base64,
        company: {
          connect: {
            id: company.id,
          },
        },
      },
    });

    res.json(user);
  } else {
    res.json("Not authorized");
    res.status(401);
  }
}
