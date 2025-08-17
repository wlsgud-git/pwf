"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpsServer = void 0;
// librarㅛ
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const https_1 = __importDefault(require("https"));
const helmet_1 = __importDefault(require("helmet"));
// config
const env_config_1 = require("./config/env.config");
const cors_config_1 = require("./config/cors.config");
const app_config_1 = require("./config/app.config");
// other file
const socket_util_1 = require("./util/socket.util");
const sanitize_middleware_1 = require("./middleware/sanitize.middleware");
const app = (0, express_1.default)();
exports.HttpsServer = https_1.default.createServer(app_config_1.httpsOption, app);
// middleware --------------------------
app.use(express_1.default.static(path_1.default.join(__dirname, "../../client/build")));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)(cors_config_1.corsOption));
app.use(sanitize_middleware_1.sanitizeMiddleware);
// Routes ---------------
const UserRoutes = require("./routes/user.routes");
const AuthRoutes = require("./routes/auth.routes");
const FriendRoutes = require("./routes/friend.routes");
const StreamRoomRoutes = require("./routes/streamRoom.routes");
app.use("/", UserRoutes);
app.use("/", StreamRoomRoutes);
app.use("/", AuthRoutes);
app.use("/", FriendRoutes);
app.use((err, req, res, next) => {
    console.log(err);
    let status = err.status || 500;
    res.status(status).json(err);
    if (!err)
        res.status(500).json({ message: "fuck" });
});
app.get("*", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../../client/build/index.html"));
});
(0, socket_util_1.initSocket)();
const PORT = env_config_1.config.https.port || 8443;
exports.HttpsServer.listen(PORT, () => {
    console.log(`pwf start with ${PORT}`);
});
