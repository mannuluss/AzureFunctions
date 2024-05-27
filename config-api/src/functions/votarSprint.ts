import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { VotosModel } from "../shared/models/sprint_metodology/votos";
import MysqlSequelizeDb from "../shared/sequelize.connect";

const votar = async (
  idUsuario: number,
  /*id_persona_vota: number,
  idTarjeta: number,*/
  listVotos: { idTarjeta: number; idPersonaVota: number }[],
  sprint,
  context
) => {
    let votosDB = await VotosModel.findAll({
      where: {
        id_persona: idUsuario,
      },
    });

  //listVotos.forEach(async (voto) => {
  for (let voto of listVotos) {
    let votoDB = /*await VotosModel.findOne({
      where: {
        id_persona: idUsuario,
        idPersonaVota: voto.idPersonaVota,
      },
    });*/
    votosDB.find(
      (v) => v.dataValues.idPersonaVota == voto.idPersonaVota
    );
    if (votoDB) {
      context.log(votoDB.dataValues);
      /*
      votoDB.set("idTarjeta", voto.idTarjeta);
      votoDB.set("sprint", sprint);*/

      await votoDB.update({
        idTarjeta: voto.idTarjeta,
        sprint: sprint,        
      });
    } else {
      //Si no existe un voto, se crea uno nuevo
      votoDB = await VotosModel.create({
        id_persona: idUsuario,
        idPersonaVota: voto.idPersonaVota,
        idTarjeta: voto.idTarjeta,
        sprint: sprint,
      });
      //return currentVoto.save();
    }
  } //);

  /*let currentVoto = await VotosModel.findOne({
    where: { id_persona: idUsuario, id_persona_seleccionada: id_persona_vota },
  });

  //Si ya existe un voto, se actualiza
  if (currentVoto) {
    currentVoto.set("idTarjeta", idTarjeta);
    currentVoto.set("sprint", sprint);
    currentVoto.save();
    return currentVoto;
  } else {
    //Si no existe un voto, se crea uno nuevo
    currentVoto = await VotosModel.create({
      id_persona: idUsuario,
      id_persona_seleccionada: id_persona_vota,
      idTarjeta: idTarjeta,
      sprint: sprint,
    });
    return currentVoto.save();
  }*/
  return true;
};

export async function votarSprint(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  //PARAMETROS DE ENTRADA
  let idUsuario: number;
  let personaSelec: number;
  let idTarjeta: number;
  let sprint: string;

  let listVotos = (await request.json()) as any;
  try {
    idUsuario = Number(request.headers.get("idUsuario"));
    /*personaSelec = Number(request.query.get("idpersona"));
    idTarjeta = Number(request.query.get("idTarjeta"));
    sprint = request.query.get("sprint");
    if (!idUsuario || !personaSelec || !idTarjeta) {
      return {
        status: 400,
        body: "Faltan parametros",
      };
    }*/
  } catch (error) {
    return {
      status: 401,
      body: "Unauthorized",
    };
  }

  //VALIDACIONES
  /*if (idUsuario == personaSelec) {
    return {
      status: 400,
      body: "No puedes votarte a ti mismo",
    };
  }*/
  let body = await votar(idUsuario, listVotos, sprint, context);

  return {
    jsonBody: body,
  };
}

app.http("votarSprint", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: votarSprint,
});
