import { Sequelize } from "sequelize";

const MysqlSequelizeDb = new Sequelize(
  "SPRINT_METODOLOGY", //cambiar por variable global
  process.env.MYSQL_USER || "root",
  process.env.MYSQL_PWD || "toor",
  {
    dialect: "mysql",
    host: process.env.MYSQL_URL || "localhost",
    port: Number(process.env.MYSQL_PORT) || 3306,
  }
);

const connnect = async () => {
  try {
    await MysqlSequelizeDb.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

connnect();

export default MysqlSequelizeDb;
