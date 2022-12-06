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
    let query = "";
    if (idImage) {
        query = `SELECT * FROM config_repository.resources res WHERE res.id = ${idImage}`;
    }
    else {
        query = `SELECT * FROM config_repository.resources res`;
    }
    return new Promise((resolve, reject) => {
        database_1.default.query(query, (err, rows) => {
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
        context.log("GET IMAGE " + req.params.id);
        if (req.params.id != "all") {
            let image = yield getImage(req.params.id);
            context.res = {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
                body: image[0],
            };
        }
        else {
            let images = yield getImage();
            //Obtener todas las imagenes
            context.res = {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
                body: images,
            };
        }
    });
};
exports.default = httpTrigger;
//# sourceMappingURL=index.js.map