import { PrimaryLogo } from "../../../components/vectors/custom";
/*
Project structure:
.
├── images_folder
│   └── next.jpg
├── package.json
├── pages
│   ├── api
│   │   └── image.js
│   └── index.js
├── README.md
└── yarn.lock
*/

// pages/api/image.js

import fs from "fs";
import path from "path";

const filePath = path.resolve(".", "public/images/logo.png");
const imageBuffer = fs.readFileSync(filePath);

export default function (req, res) {
  res.setHeader("Content-Type", "image/jpg");
  res.send(imageBuffer);
}
