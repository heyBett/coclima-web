import { prisma } from "../../../db";
import { authOptions } from "../auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

export default async function handle(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session.user.role === "Admin") {
    if (req.method === "POST") {
      const company = await prisma.companies.create({
        data: {
          name: req.body.name,
          email: req.body.email,
          role: req.body.role,
          cpfcnpj: req.body.cpfcnpj,
          street: req.body.street,
          number: req.body.number,
          complement: req.body.complement,
          district: req.body.district,
          city: req.body.city,
          state: req.body.state,
          cep: req.body.cep,
          phone: req.body.phone,
          site: req.body.site,
          percentage: req.body.percentage,
        },
      });
      res.json(company);
      res.status(201);
    }

    if (req.method === "GET") {
      const company = await prisma.companies.findUnique({
        where: {
          id: req.query.id,
        },
      });
      res.json(company);
      res.status(201);
    }

    if (req.method === "PATCH") {
      const company = await prisma.companies.update({
        where: {
          id: req.query.id,
        },
        data: req.body.data,
      });
      res.json(company);
      res.status(200);
    }

    if (req.method === "DELETE") {
    }
  } else {
    res.json("Not authorized");
    res.status(401);
  }
}
