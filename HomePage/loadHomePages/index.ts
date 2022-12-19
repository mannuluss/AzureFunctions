import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as multipart from "parse-multipart";
import database from "../shared/database";
import * as FileReader from "filereader";
import { generateReadOnlySASUrl } from "../shared/azure-storage-blob-sas-url";
import * as File from "File";
import parseMultipartFormData from "@anzp/azure-function-multipart";
import { ParsedFile } from "@anzp/azure-function-multipart/dist/types/parsed-file.type";

const setImage = async (
  fileMultipart: ParsedFile,
  filename?: string
): Promise<any> => {
  //var buffer = Buffer.from(await blobFile.arrayBuffer());//await blobFile.arrayBuffer();

  return new Promise((resolve, reject) => {
    database.query(
      `INSERT INTO config_repository.resources(blobFile,filename,type) VALUES ("${
        `data:${fileMultipart.mimeType};base64,` +
        fileMultipart.bufferFile.toString("base64")
      }","${filename ?? fileMultipart.filename}","${fileMultipart.mimeType}")`,
      (err, rows, fields) => {
        if (err) {
          console.error(err);
          return reject(err);
        } else {
          console.debug("SUCCESS SET PAGES");
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
  console.log(req.body);
  const { fields, files } = await parseMultipartFormData(req);
  if (files != null) {
    let file = files[0];
    console.log(fields, file);
    let registro = await setImage(
      file,
      fields.find((f) => f.name == "filename")?.value
    );

    context.res = {
      body: { id: registro.insertId, length: file.bufferFile.length },
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
};
export default httpTrigger;
