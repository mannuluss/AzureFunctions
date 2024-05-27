import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { PersonaModal } from "../shared/models/sprint_metodology/persona";
import { Op } from "sequelize";
import { VotosModel } from "../shared/models/sprint_metodology/votos";
import { SprintModel } from "../shared/models/sprint_metodology/sprints";
import { TarjetaModel } from "../shared/models/sprint_metodology/tarjetas";

const getConfig = async (idUsuario) => {
  let personas = await PersonaModal.findAll({
    where: {
      id: {
        [Op.ne]: idUsuario,
      },
    },
  });

  let votos = await VotosModel.findAll({
    where: {
      id_persona: idUsuario,
    },
  });

  let sprint = await SprintModel.findOne({
    where: {
      activo: 1,
    },
  });

  let tarjetas = await TarjetaModel.findAll();

  return {
    personas,
    tarjetas,
    votos: votos,
    sprint,
  };
};

export async function getConfigSprintVotation(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  //PARAMETROS DE ENTRADA
  let idUsuario: number = Number(request.headers.get("idUsuario"));
  context.log(idUsuario);

  return { jsonBody: await getConfig(idUsuario) };
}

app.http("getConfigSprintVotation", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: getConfigSprintVotation,
});
