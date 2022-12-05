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
const mysql = require("mysql");
const fs = require("fs");
console.log(process.env.MYSQL_URL);
let crtstring = process.env.MYSQL_CRT_FILE || "";
let sslconfig = (process.env.MYSQL_CRT != undefined ? { ca: fs.readFileSync(crtstring) } : undefined);
const conection = mysql.createConnection({
    host: process.env.MYSQL_URL || 'localhost',
    port: Number(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PWD || 'toor',
    database: process.env.MYSQL_DB || 'trabajo_spa',
    ssl: sslconfig
});
var connec = () => __awaiter(void 0, void 0, void 0, function* () {
    yield new Promise((resolve, reject) => {
        conection.connect(function (err) {
            if (err) {
                console.log(err);
                return reject(err);
            }
            else {
                console.log('Database Conected SUCCESS');
                return resolve(conection);
            }
        });
    });
    return conection;
});
connec();
exports.default = conection;
//# sourceMappingURL=database.js.map