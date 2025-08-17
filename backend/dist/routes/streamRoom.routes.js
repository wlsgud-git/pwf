"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// middleware
// controller
const streamRoom_controller_1 = require("../controller/streamRoom.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const streamroom_validate_1 = require("../validation/streamroom.validate");
const global_validate_1 = require("../validation/global.validate");
// import { loginValidate, signupUserValidate } from "../validation/auth";
const router = express_1.default.Router();
//  authentication  Or  authorization
router.get("/room/:id", auth_middleware_1.IsAuth, streamRoom_controller_1.StreamController.getRoom);
router.post("/room", auth_middleware_1.IsAuth, auth_middleware_1.csrfProtection, (0, global_validate_1.validate)(streamroom_validate_1.StreamSchema.create), streamRoom_controller_1.StreamController.createRoom);
router.post("/room/token", auth_middleware_1.IsAuth, auth_middleware_1.csrfProtection, streamRoom_controller_1.StreamController.roomAccessToken);
router.post("/room/invite", auth_middleware_1.IsAuth, auth_middleware_1.csrfProtection, (0, global_validate_1.validate)(streamroom_validate_1.StreamSchema.invite), streamRoom_controller_1.StreamController.inviteRoom);
module.exports = router;
