import {
  HttpRequest,
  InvocationContext,
  HttpResponseInit,
  app,
} from "@azure/functions";
import database from "../shared/database";
import { convertToFile } from "../shared/utils";

async function getFileById(id) {
  return new Promise<any>((resolve, reject) => {
    database.query(
      "SELECT * FROM config_repository.RESOURCE_FILE WHERE ID = ?",
      [id],
      (err, result, fields) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(result);
        }
      }
    );
  });
}

export async function getFile(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);
  context.log("Request:", request.query);
  let row = await getFileById(request.query.get("id"));
  //return { body: `Hello, ${name}!` };
  let registro = row[0];
  return {
    headers: {
      "Content-Type": registro["MIME_TYPE"],
      "Content-Disposition": "attachment; filename=download.png",
    },
    body: new Uint8Array(convertToFile(row[0]["BLOB_FILE"])),
  };
}

app.http("getfiles", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: getFile,
  route: "files/get",
});
