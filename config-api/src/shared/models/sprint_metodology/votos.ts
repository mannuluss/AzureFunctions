import { Sequelize, DataTypes } from "sequelize";
import MysqlSequelizeDb from "../../sequelize.connect";

export const VotosModel = MysqlSequelizeDb.define(
  "votos",
  {
    // Model attributes are defined here
    id_persona: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idPersonaVota: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_persona_seleccionada",
      // allowNull defaults to true
    },
    idTarjeta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_tarjeta",
      // allowNull defaults to true
    },
    sprint: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    // Other model options go here
    timestamps: false, // Deshabilita createdAt y updatedAt
    //tableName: "votos", // Asegúrate de que el nombre de la tabla coincida con el nombre en la base de datos
  }
);

// `sequelize.define` also returns the model
//console.log(Votos === MysqlSequelizeDb.models.votos); // true
