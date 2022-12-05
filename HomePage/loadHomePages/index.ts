import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as multipart from "parse-multipart";
import database from "../shared/database";
import * as FileReader from "filereader";
import { generateReadOnlySASUrl } from "../shared/azure-storage-blob-sas-url";

const setImage = async (blobFile: any): Promise<any> => {
  //var buffer = Buffer.from(await blobFile.arrayBuffer());//await blobFile.arrayBuffer();

  return new Promise((resolve, reject) => {
    database.query(
      `INSERT INTO config_repository.resources(blobFile) VALUES ("${blobFile}")`,
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

const readBody = (
  context: Context,
  req: HttpRequest
): multipart.ParsedFile[] => {
  const body = req.rawBody;
  // Retrieve the boundary id
  const boundary = multipart.getBoundary(req.headers["content-type"]);
  if (boundary) {
    const files: multipart.ParsedFile[] = multipart.Parse(
      Buffer.from(body),
      boundary
    );

    if (files && files.length > 0) {
      // Do what you want to do with the file
    }
    return files;
  } else {
    context.res.status(500).send("No file(s) found.");
    return null;
  }
};

const bufferToBase64 = (file: Buffer): Promise<string> =>
  new Promise((resolve, reject) => {
    resolve(file.toString("base64"));
    /*const reader: FileReader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);*/
  });

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  let formData = readBody(context, req);
  if (formData != null) {
    /*
    let file = formData[0];
    console.log(file);
    let base64 = "data:image/png;base64," + (await bufferToBase64(file.data));
    //console.log(base64);
    let registro = await setImage(base64);

    context.res = {
      body: {registro, length: base64.length},
    };*/
    try {
      const fileName = req.query?.filename;
      const containerName = "mannulus";
      // filename is a required property of the parse-multipart package
      /*if (parts[0]?.filename)
        console.log(`Original filename = ${parts[0]?.filename}`);
      if (parts[0]?.type) console.log(`Content type = ${parts[0]?.type}`);
      if (parts[0]?.data?.length)
        console.log(`Size = ${parts[0]?.data?.length}`);*/

      // Passed to Storage
      context.bindings.storage = formData[0]?.data;

      // Get SAS token
      const sasInfo = await generateReadOnlySASUrl(
        process.env.AzureWebJobsStorage,
        containerName,
        fileName
      );

      // Returned to requestor
      context.res.status = 200;
      context.res.body = {
        fileName,
        storageAccountName: sasInfo.storageAccountName,
        containerName,
        url: sasInfo.accountSasTokenUrl,
      };
    } catch (err) {
      context.res.body = { error: `${err.message}` };
      context.res.status = 504;
    }
  }
};
export default httpTrigger;
