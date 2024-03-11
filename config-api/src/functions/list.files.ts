import { HttpRequest, InvocationContext, HttpResponseInit, app } from "@azure/functions";
import database from "../shared/database";

async function getAllFiles(context: InvocationContext): Promise<any> {
    const query = 'select id, filename, mime_type, fecha from config_repository.RESOURCE_FILE';
    return new Promise((resolve, reject) => {
        database.query(query, (err, rows, fields) => {
            if (err) {
                context.error(err);
                return reject(err);
            } else {
                context.log("RESPONSE GET FILES");
                return resolve(rows);
            }
        });
    });
}


export async function loadFiles(
    request: HttpRequest,
    context: InvocationContext
  ): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    let row = await getAllFiles(context);
    //return { body: `Hello, ${name}!` };
    return { jsonBody: row };
  }
  
  app.http("filesSearch", {
    methods: ["GET"],
    authLevel: "anonymous",
    handler: loadFiles,
    route: "files/search"
  });