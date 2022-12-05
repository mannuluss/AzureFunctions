import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import database from "../shared/database";

const getImage = async (idImage: any): Promise<any> => {
  //var buffer = Buffer.from(await blobFile.arrayBuffer());//await blobFile.arrayBuffer();
  return new Promise((resolve, reject) => {
    database.query(
      `SELECT res.blobFile FROM config_repository.resources res WHERE res.id = ${idImage}`,
      (err, rows, fields) => {
        if (err) {
          console.error(err);
          return reject(err);
        } else {
          return resolve(rows);
        }
      }
    );
  });
};

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("GET IMAGE");
  let image = await getImage(req.params.id);
  const base64Image = image[0].blobFile; //Buffer.from(image[0].blobFile, 'base64');
  console.log("LENGTH GET DB " + base64Image.length);
  const buffer: Buffer = new Buffer(base64Image.split(",")[1], "base64");
  context.res = {
    status: 200 /* Defaults to 200 */,
    isRaw: true,
    headers: {
      //"Content-Disposition": "attachment; filename=imagen.png",
      "Content-Type": "text/plain",
      /*Connection: "Keep-Alive",
      "Keep-Alive": "timeout=5",*/
    },
    body: {img:base64Image.split(",")[1]}, //Buffer.from(fileBuffer, "base64"),
  };
};

export default httpTrigger;
