import { prisma } from "../../../../db";
import { authOptions } from "../../auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";

export default async function handle(req, res) {
  const id = req.query.id;

  const session = await unstable_getServerSession(req, res, authOptions);
  if (session) {
    const result = await prisma.plantations.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        date: true,
        handler: {
          select: {
            value: true,
          },
        },
        partner: {
          select: {
            name: true,
          },
        },
        geolocation: true,
        description: true,
        external: true,
        archives: true,
        tree_value: true,
      },
    });

    res.json(result);
  } else {
    res.json("Not authorized");
    res.status(401);
  }
}
