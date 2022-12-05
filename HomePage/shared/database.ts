import * as mysql from 'mysql';
import * as fs from 'fs';

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
var connec = async () => {
    await new Promise((resolve, reject) => {
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
};
connec();
export default conection;