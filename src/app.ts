/* eslint-disable @typescript-eslint/ban-types */
import "reflect-metadata";
import Express from "express";
import { createConnection, useContainer as useOrmContainer } from "typeorm";
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
import { CurrenUserChecker } from "./decorators/current-user-checker";
import cookieParser from "cookie-parser";
import { ResourceService } from "./services/resource.service";

process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled rejection occuured", p, "reason:", reason);
});

const initDatabase = async () => {
  const entities = Object.values(Entities);
  const migrations = Object.values(Migrations);
  console.log("Connecting to database");
  useOrmContainer(Container);
  await createConnection({
    url: Config.db.uri,
    entities,
    logging: process.env.NODE_ENV === "production" ? ["error", "warn"] : "all",
    maxQueryExecutionTime: 1000,
    migrations,
    synchronize: process.env.NODE_ENV === "production" ? false : true,
    type: "mongodb",
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
      origin: ["localhost:8080", "localhost:5173"],
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
    currentUserChecker: CurrenUserChecker
  };
  return routerConfigs;
};

const start = async () => {
  await initDatabase();

  const app = Express();
  app.get("/api/resource", (req, res) => {
    const resourceService = Container.get(ResourceService);
    // get id from request query params
    const id = req.query.id as string;
    console.log('id', id);
    return resourceService.get(id, res);
  })

  app.use(cookieParser());
  useExpressServer(app, getRouterConfigs());
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
