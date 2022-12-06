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
const database_1 = require("../shared/database");
const azure_function_multipart_1 = require("@anzp/azure-function-multipart");
const setImage = (fileMultipart) => __awaiter(void 0, void 0, void 0, function* () {
    //var buffer = Buffer.from(await blobFile.arrayBuffer());//await blobFile.arrayBuffer();
    return new Promise((resolve, reject) => {
        database_1.default.query(`INSERT INTO config_repository.resources(blobFile,filename,type) VALUES ("${`data:${fileMultipart.mimeType};base64,` + fileMultipart.bufferFile.toString("base64")}","${fileMultipart.filename}","${fileMultipart.mimeType}")`, (err, rows, fields) => {
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
const httpTrigger = function (context, req) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(req.body);
        const { fields, files } = yield (0, azure_function_multipart_1.default)(req);
        //let formData = readBody(context, req);
        if (files /*formData*/ != null) {
            //let file = formData[0];
            let file = files[0];
            console.log(file);
            //let base64 = "data:image/png;base64," + (await bufferToBase64(file.data));
            /*const reader = new FileReader();
            reader.onloadend = async () => {
              console.log(reader.result);
              let base64: any = reader.result;
        
              let registro = await setImage(base64);
        
              context.res = {
                body: { registro, length: base64.length },
              };
              // Logs data:<type>;base64,wL2dvYWwgbW9yZ...
            };
            reader.readAsDataURL(file.data);*/
            let registro = yield setImage(file);
            context.res = {
                body: { id: registro.insertId, length: file.bufferFile.length },
                headers: {
                    "Content-Type": "application/json",
                }
            };
        }
    });
};
exports.default = httpTrigger;
//# sourceMappingURL=index.js.map