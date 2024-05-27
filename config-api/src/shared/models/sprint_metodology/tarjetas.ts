import { DataTypes, Model } from "sequelize";
import MysqlSequelizeDb from "../../sequelize.connect";

export const TarjetaModel = MysqlSequelizeDb.define(
  //Persona.init(
  "tarjetas",
  {
    // Model attributes are defined here
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pathFile: {
      type: DataTypes.STRING,
      field: 'path_file'
    },
    fecha: {
      type: DataTypes.DATE,
    },
  },
  {
    // Other model options go here
    timestamps: false, // Deshabilita createdAt y updatedAt
    //sequelize: MysqlSequelizeDb, // We need to pass the connection instance
    //modelName: "persona", // We need to choose the model name
  }
);
