import { prisma } from "../../db";
import { authOptions } from "./auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import bcrypt from "bcrypt";

export default async function handle(req, res) {
  const SALT_ROUNDS = 10;
  const pass = "123456";
  console.log(await bcrypt.hash("123456", SALT_ROUNDS));
  res.json(
    await bcrypt.compare(
      pass,
      "$2b$10$FatFdKIZrF.pU7KhHm3LSel/gjEugnEJxL00FHDDpUE18jfeSRMSe"
    )
  );

  /* const session = await unstable_getServerSession(req, res, authOptions);

  if (session.user.Admin) {
    const result = await prisma.user.findMany({
      select: {
        email: true,
        name: true,
        id: true,
        Admin: true,
        Designer: true,
        image: true,
      },
    });
    res.json(result);
  } else {
    res.json("Not authorized");
    res.status(401);
  } */
}
