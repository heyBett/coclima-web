import { prisma } from "../../../db";
import { authOptions } from "../auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

export default async function handle(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session.user.role === "Admin") {
    const users = await prisma.user.findMany({
      where: {
        deleted_at: null,
      },
      include: {
        company: {
          select: {
            name: true,
          },
        },
      },
    });
    const companies = await prisma.companies.findMany({
      where: {
        deleted_at: null,
        role: "company",
      },
      include: {
        handler: true,
        receipts: {
          where: {
            paid: true,
          },
        },
      },
    });
    const partners = await prisma.companies.findMany({
      where: {
        deleted_at: null,
        role: "partner",
      },
      include: {
        plantations: {
          include: {
            handler: true,
          },
        },
      },
    });
    const plantations = await prisma.plantations.findMany({
      where: {
        deleted_at: null,
      },
      include: {
        handler: true,
        partner: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });
    res.json({
      users: users,
      companies: companies,
      partners: partners,
      plantations: plantations,
    });
  } else {
    res.json("Not authorized");
    res.status(401);
  }
}
