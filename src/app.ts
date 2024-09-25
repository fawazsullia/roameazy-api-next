/* eslint-disable @typescript-eslint/ban-types */
import "reflect-metadata";
import Express from "express";
import { createConnection, useContainer as ormContainer } from "typeorm";
import {
  createExpressServer,
  RoutingControllersOptions,
  useContainer,
  useExpressServer,
} from "routing-controllers";
import gracefulShutdown from "http-graceful-shutdown";
import { Container } from "typedi";
import Helmet from "helmet";

import { Entities, Migrations } from "./orm";
import * as controllers from "./controllers";
import * as middlewares from "./middlewares";
import { Config } from "./config/base.config";
import * as bodyParser from "body-parser";

process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled rejection occuured", p, "reason:", reason);
});

const initDatabase = async () => {
  const entities = Object.values(Entities);
  const migrations = Object.values(Migrations);

  await createConnection({
    database: "path to db",
    entities,
    logging: process.env.NODE_ENV === "production" ? ["error", "warn"] : "all",
    maxQueryExecutionTime: 1000,
    migrations,
    synchronize: process.env.NODE_ENV === "production" ? false : true,
    type: "postgres",
  }).then(() => {
    return true;
  });
};

const getRouterConfigs = (): RoutingControllersOptions => {
  const controllersMap = Object.values(controllers);
  const middlewaresMap = Object.values(middlewares);
  const routerConfigs: RoutingControllersOptions = {
    controllers: controllersMap,
    cors: {
      allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
      origin: ["*"],
    },
    defaults: {
      nullResultCode: 404,
      undefinedResultCode: 404,
      paramOptions: {
        required: true,
    },
    },
    middlewares: middlewaresMap,
    routePrefix: "/api",
  };
  return routerConfigs;
};

const start = async () => {
  //await initDatabase();

  const app = createExpressServer(getRouterConfigs());
  app.use(bodyParser.json());
  app.use(Helmet());
  useContainer(Container);
  Container.set("Config", Config);

  const server = app.listen(Config.PORT, () => {
    console.log(`App started on PORT ${Config.PORT}`);
  });

  gracefulShutdown(server);
};

start();
