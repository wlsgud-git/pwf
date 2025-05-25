// library
import express, { Application, NextFunction, Request, Response } from "express";
import path from "path";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import https from "https";

// other file
import { config } from "../config";
import { initSocket } from "./util/socket";

// types
import { corsProps } from "../types/http";

// option ---------------------------
const corsOption: corsProps = {
  credentials: true,
  optionsSuccessStatus: 200,
  origin: config.http.host,
};

const httpsOption = {
  key: fs.readFileSync("./cert/key.pem"),
  cert: fs.readFileSync("./cert/cert.pem"),
};

const app: Application = express();
export const HttpServer = createServer(app);
export const HttpsServer = https.createServer(httpsOption, app);

// middleware --------------------------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOption));
app.use(express.static(path.join(__dirname, "../../client/build")));

const UserApi = require("./api/user");
const StreamRoomApi = require("./api/streamRoom");

app.use("/", UserApi);
app.use("/", StreamRoomApi);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: "fuck" });
});

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../client/build/index.html"));
});

initSocket();

// HttpServer.listen(config.http.port, () => {
//   console.log(`pwf start with ${config.http.port}`);
// });

HttpsServer.listen(config.http.https_port, () => {
  console.log(`pwf start with ${config.http.https_port}`);
});
