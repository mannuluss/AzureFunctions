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
const getAllHome = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        database_1.default.query("SELECT * FROM config_repository.pages", (err, rows, fields) => {
            if (err) {
                console.error(err);
                return reject(err);
            }
            else {
                console.debug("RESPONSE GET PAGES");
                return resolve(rows);
            }
        });
    });
});
const httpTrigger = function (context, req) {
    return __awaiter(this, void 0, void 0, function* () {
        context.log("HTTP trigger function processed a request.");
        let AllPages = yield getAllHome();
        let bodyResponse = [];
        for (const page of AllPages) {
            if (page.root == null) {
                page.children = AllPages.filter((value) => value.root == page.id);
                if (page.enable) {
                    bodyResponse.push(page);
                }
            }
        }
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: bodyResponse,
        };
        /*const name = (req.query.name || (req.body && req.body.name));
          const responseMessage = name
              ? "Hello, " + name + ". This HTTP triggered function executed successfully."
              : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";
          */
    });
};
exports.default = httpTrigger;
//# sourceMappingURL=index.js.map