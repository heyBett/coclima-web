/* import { NextApiHandler } from 'next'; */

import bcrypt from "bcrypt";

export default async function handle(req, res) {
  res.json(await bcrypt.hash(req.query.hash, 10));
}
