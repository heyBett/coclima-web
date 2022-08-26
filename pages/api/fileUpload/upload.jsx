var http = require("http");
var formidable = require("formidable");

const fs = require("fs");

export const config = {
  api: {
    responseLimit: false,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    bodyParser: {
      sizeLimit: "1000mb",
    },
  },
};

export default async function handle(req, res) {
  const photo = req.body.photo;
  /* console.log(photo); */

  fs.mkdir(
    "./public/plantations/" + photo.plantation,
    { recursive: true },
    (err) => {
      if (err) {
        throw err;
      } else {
        fs.writeFile(
          "./public/plantations/" +
            photo.plantation +
            "/" +
            photo.id +
            "_blur.jpg",
          Buffer.from(
            photo.blur.replace(/^data:image\/\w+;base64,/, ""),
            "base64"
          ),

          (err) => {
            console.log(err);
          }
        );
        fs.writeFile(
          "./public/plantations/" +
            photo.plantation +
            "/" +
            photo.id +
            "_thumbnail.jpg",
          Buffer.from(
            photo.thumbnail.replace(/^data:image\/\w+;base64,/, ""),
            "base64"
          ),

          (err) => {
            console.log(err);
          }
        );
        fs.writeFile(
          "./public/plantations/" +
            photo.plantation +
            "/" +
            photo.id +
            "_full.jpg",
          Buffer.from(
            photo.data.replace(/^data:image\/\w+;base64,/, ""),
            "base64"
          ),
          (err) => {
            console.log(err);
          }
        );
        fs.writeFile(
          "./public/plantations/" +
            photo.plantation +
            "/" +
            photo.id +
            "_social.jpg",
          Buffer.from(
            photo.social.replace(/^data:image\/\w+;base64,/, ""),
            "base64"
          ),
          (err) => {
            console.log(err);
          }
        );
      }
    }
  );

  res.json("ok");
}

/* http
  .createServer(async function (req, res) {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => { */
/*  console.log(JSON.parse(data)); // */
/*  res.end();
    });
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files, body) { */
/*  fs.readFile(files.fileupload.filepath, function read(err, data) {
         if (err) {
           throw err;
         } */

/*  resizeImage(data)
       async function resizeImage(data) {
 
         const thumbnail = await makeThumbnail(data);
         const blur = await makeBlur(data);
         console.log(blur);
         fs.writeFile("out.png", blur, "base64", (err) => {
           console.log(err);
         });
 
 
       } */

/* const base64Data = str.replace(/^data:image\/png;base64,/, "");

      const fs = require("fs");

      fs.writeFile("out.png", base64Data, "base64", (err) => {
        console.log(err);
      });

      var oldpath = files.fileupload.filepath;
      var newpath = files.fileupload.originalFilename;

      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        res.write("File uploaded and moved!");
        res.end();
      }); */
/*     });
  })
  .listen(80); */
