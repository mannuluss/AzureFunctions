"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const azureFunctionHandler = require("azure-aws-serverless-express");
const app = express();
const routeReviews = require("./backend-reviews/routes/reviews");
app.use("/api/software3", routeReviews);
module.exports = azureFunctionHandler(app);
//# sourceMappingURL=index.js.map