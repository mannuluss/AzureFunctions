import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import database from "../shared/database";
import { Eror404 } from "../shared/util";

const getImage = async (idImage?: any): Promise<any[] | any> => {
  let query = "";
  if (idImage) {
    query = `SELECT * FROM config_repository.resources res WHERE res.id = ${idImage}`;
  } else {
    query = `SELECT * FROM config_repository.resources res`;
  }
  return new Promise((resolve, reject) => {
    database.query(query, (err, rows) => {
      if (err) {
        console.error(err);
        return reject(err);
      } else {
        return resolve(idImage ? rows[0] : rows);
      }
    });
  });
};

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("GET IMAGE " + req.params.id);
  if (req.params.id != "all") {
    let image = await getImage(req.params.id);
    if (image) {
      context.res = {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: image,
      };
    } else {
      Eror404(context);
      return;
    }
  } else {
    let images = await getImage();
    //Obtener todas las imagenes
    context.res = {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: images ? images : Eror404,
    };
  }
};

export default httpTrigger;
