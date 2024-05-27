import { DataTypes } from "sequelize";
import MysqlSequelizeDb from "../../sequelize.connect";

//export class Persona extends Model {}
export const SprintModel = MysqlSequelizeDb.define(
  //Persona.init(
  "SPRINTS",
  {
    anio: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    numero: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    // Other model options go here
    timestamps: false, // Deshabilita createdAt y updatedAt
    //sequelize: MysqlSequelizeDb, // We need to pass the connection instance
  }
);
