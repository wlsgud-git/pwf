import express, { Router } from "express";

// middleware

// controller
import { createRoom } from "../controller/streamRoom";
import { streamRoomValidate } from "../validation/streamroom";

// import { loginValidate, signupUserValidate } from "../validation/auth";

const router: Router = express.Router();

//  authentication  Or  authorization
router.post("/room", streamRoomValidate, createRoom);

module.exports = router;
