import { Context } from "@azure/functions";

export function Eror404(context: Context) {
  context.res = {
    status: 404,
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      error: "Not Found",
    },
  };
}
