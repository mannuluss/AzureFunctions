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
const getImage = (idImage) => __awaiter(void 0, void 0, void 0, function* () {
    //var buffer = Buffer.from(await blobFile.arrayBuffer());//await blobFile.arrayBuffer();
    return new Promise((resolve, reject) => {
        database_1.default.query(`SELECT res.blobFile FROM config_repository.resources res WHERE res.id = ${idImage}`, (err, rows, fields) => {
            if (err) {
                console.error(err);
                return reject(err);
            }
            else {
                return resolve(rows);
            }
        });
    });
});
const httpTrigger = function (context, req) {
    return __awaiter(this, void 0, void 0, function* () {
        context.log("GET IMAGE");
        let image = yield getImage(req.params.id);
        const base64Image = image[0].blobFile; //Buffer.from(image[0].blobFile, 'base64');
        console.log("LENGTH GET DB " + base64Image.length);
        const buffer = new Buffer(base64Image.split(",")[1], "base64");
        context.res = {
            status: 200 /* Defaults to 200 */,
            isRaw: true,
            headers: {
                //"Content-Disposition": "attachment; filename=imagen.png",
                "Content-Type": "text/plain",
                /*Connection: "Keep-Alive",
                "Keep-Alive": "timeout=5",*/
            },
            body: { img: base64Image.split(",")[1] }, //Buffer.from(fileBuffer, "base64"),
        };
    });
};
exports.default = httpTrigger;
//# sourceMappingURL=index.js.map