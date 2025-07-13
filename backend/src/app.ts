// librarㅛ
import express, { Application, NextFunction, Request, Response } from "express";
import path from "path";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import cookieParser from "cookie-parser";
import https from "https";
import helmet from "helmet";
// import "../src/types/express/express";

// config
import { config } from "./config/env.config";
import { corsOption } from "./config/cors.config";
import { httpsOption } from "./config/app.config";

// other file
import { initSocket } from "./util/socket.util";

const app: Application = express();
export const HttpsServer = https.createServer(httpsOption, app);

// middleware --------------------------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(cors(corsOption));
app.use(express.static(path.join(__dirname, "../../client/build")));

// Routes ---------------
const UserRoutes = require("./routes/user.routes");
const AuthRoutes = require("./routes/auth.routes");
const StreamRoomRoutes = require("./routes/streamRoom.routes");

app.use("/", UserRoutes);
app.use("/", StreamRoomRoutes);
app.use("/", AuthRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  next();
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: "fuck" });
});

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../client/build/index.html"));
});

initSocket();

HttpsServer.listen(8443, () => {
  console.log(`pwf start with ${8443}`);
});
