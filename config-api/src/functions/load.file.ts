import {
  HttpRequest,
  InvocationContext,
  HttpResponseInit,
  app,
} from "@azure/functions";
import database from "../shared/database";

async function insertFileTable(
  file: any,
  context: InvocationContext
): Promise<any> {
  const insertQuery =
    "INSERT INTO config_repository.RESOURCE_FILE (FILENAME, MIME_TYPE, BLOB_FILE) VALUES (?, ?, ?)";

  let fileBlob = await file.arrayBuffer();
  fileBlob = Buffer.from(fileBlob);
  return new Promise((resolve, reject) => {
    database.query(
      insertQuery,
      [file.name, file.type, fileBlob],
      (err, result, fields) => {
        if (err) {
          context.error("Error al insertar el archivo en MySQL:", err);
          return reject(err);
        }
        context.log("Archivo insertado en MySQL:", result, fields);
        return resolve(result);
      }
    );
  });
}

export async function loadFiles(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);
  const file = (await request.formData()).get("file");
  context.log("Request:", file);
  let row = await insertFileTable(file, context);
  //return { body: `Hello, ${name}!` };
  return { jsonBody: { id: row.insertId } };
}

app.http("loadFile", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: loadFiles,
});
