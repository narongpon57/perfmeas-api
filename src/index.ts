import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as morgan from "morgan";
import * as cors from "cors";
import { routes } from "./routes";

createConnection()
  .then(async connection => {
    const app = express();
    app.use(
      bodyParser.urlencoded({
        extended: true
      })
    );
    app.use(bodyParser.json());
    app.use(cors());
    app.use(morgan("dev"));
    app.use("/api", routes);
    app.listen(3000, () => {
      console.log(`Starting server on http://localhost:3000`);
    });
  })
  .catch(error => console.log(error));
