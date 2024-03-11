import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import database from "../shared/database";

const getAllHome = async (): Promise<any> => {
  return new Promise((resolve, reject) => {
    database.query(
      "SELECT p.* FROM config_repository.pages p where p.enable = 1",
      (err, rows, fields) => {
        if (err) {
          console.error(err);
          return reject(err);
        } else {
          console.debug("RESPONSE GET PAGES");
          return resolve(rows);
        }
      }
    );
  });
};

export async function pages(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  //const name = request.query.get('name') || await request.text() || 'world';

  //return { body: `Hello, ${name}!` };
  let AllPages: any[] = await getAllHome();
  let bodyResponse: any = [];
  for (const page of AllPages) {
    if (page.root == null) {
      page.children = AllPages.filter((value) => value.root == page.id);
      if (page.enable) {
        bodyResponse.push(page);
      }
    }
  }
  return { jsonBody: bodyResponse };
}

app.http("pages", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: pages,
});
