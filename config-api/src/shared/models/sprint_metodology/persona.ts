import { DataTypes, Model } from "sequelize";
import MysqlSequelizeDb from "../../sequelize.connect";

export const PersonaModal = MysqlSequelizeDb.define(
  //Persona.init(
  "persona",
  {
    // Model attributes are defined here
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    }
  },
  {
    // Other model options go here
    timestamps: false, // Deshabilita createdAt y updatedAt
    //sequelize: MysqlSequelizeDb, // We need to pass the connection instance
    //modelName: "persona", // We need to choose the model name
  }
);
