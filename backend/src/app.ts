// config
import { config } from "./config/env.config";
import { corsOption } from "./config/cors.config";
import { httpsOption } from "./config/app.config";

// librarㅛ
import express, { Application, NextFunction, Request, Response } from "express";
import path from "path";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import https from "https";
import helmet from "helmet";

// other file
import { initSocket } from "./util/socket.util";
import { sanitizeMiddleware } from "./middleware/sanitize.middleware";

const app: Application = express();
export const HttpsServer = https.createServer(httpsOption, app);

// middleware --------------------------
app.use(express.static(path.join(__dirname, "../../client/build")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(helmet());
app.use(cors(corsOption));

app.use(sanitizeMiddleware);

// Routes ---------------
const UserRoutes = require("./routes/user.routes");
const AuthRoutes = require("./routes/auth.routes");
const FriendRoutes = require("./routes/friend.routes");
const StreamRoomRoutes = require("./routes/streamRoom.routes");

app.use("/", UserRoutes);
app.use("/", StreamRoomRoutes);
app.use("/", AuthRoutes);
app.use("/", FriendRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  let status = err.status || 500;

  res.status(status).json(err);

  if (!err) res.status(500).json({ message: "fuck" });
});

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../client/build/index.html"));
});

initSocket();

const PORT = process.env.PORT || 3000;
HttpsServer.listen(PORT, () => {
  console.log(`pwf start with ${PORT}`);
});
