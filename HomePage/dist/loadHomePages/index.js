"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const multipart = require("parse-multipart");
const database_1 = require("../shared/database");
const azure_storage_blob_sas_url_1 = require("../shared/azure-storage-blob-sas-url");
const setImage = (blobFile) => __awaiter(void 0, void 0, void 0, function* () {
    //var buffer = Buffer.from(await blobFile.arrayBuffer());//await blobFile.arrayBuffer();
    return new Promise((resolve, reject) => {
        database_1.default.query(`INSERT INTO config_repository.resources(blobFile) VALUES ("${blobFile}")`, (err, rows, fields) => {
            if (err) {
                console.error(err);
                return reject(err);
            }
            else {
                console.debug("SUCCESS SET PAGES");
                return resolve(rows);
            }
        });
    });
});
const readBody = (context, req) => {
    const body = req.rawBody;
    // Retrieve the boundary id
    const boundary = multipart.getBoundary(req.headers["content-type"]);
    if (boundary) {
        const files = multipart.Parse(Buffer.from(body), boundary);
        if (files && files.length > 0) {
            // Do what you want to do with the file
        }
        return files;
    }
    else {
        context.res.status(500).send("No file(s) found.");
        return null;
    }
};
const bufferToBase64 = (file) => new Promise((resolve, reject) => {
    resolve(file.toString("base64"));
    /*const reader: FileReader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);*/
});
const httpTrigger = function (context, req) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
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
                const fileName = (_a = req.query) === null || _a === void 0 ? void 0 : _a.filename;
                const containerName = "mannulus";
                // filename is a required property of the parse-multipart package
                /*if (parts[0]?.filename)
                  console.log(`Original filename = ${parts[0]?.filename}`);
                if (parts[0]?.type) console.log(`Content type = ${parts[0]?.type}`);
                if (parts[0]?.data?.length)
                  console.log(`Size = ${parts[0]?.data?.length}`);*/
                // Passed to Storage
                context.bindings.storage = (_b = formData[0]) === null || _b === void 0 ? void 0 : _b.data;
                // Get SAS token
                const sasInfo = yield (0, azure_storage_blob_sas_url_1.generateReadOnlySASUrl)(process.env.AzureWebJobsStorage, containerName, fileName);
                // Returned to requestor
                context.res.body = {
                    fileName,
                    storageAccountName: sasInfo.storageAccountName,
                    containerName,
                    url: sasInfo.accountSasTokenUrl,
                };
            }
            catch (err) {
                context.res.body = { error: `${err.message}` };
                context.res.status = 504;
            }
        }
    });
};
exports.default = httpTrigger;
//# sourceMappingURL=index.js.map