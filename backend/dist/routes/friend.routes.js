"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_middleware_1 = require("../middleware/auth.middleware");
const friend_controller_1 = require("../controller/friend.controller");
const global_validate_1 = require("../validation/global.validate");
const friend_validate_1 = require("../validation/friend.validate");
const friend_service_1 = require("../service/friend.service");
// 친구 요청
router.post("/request/friend", auth_middleware_1.IsAuth, auth_middleware_1.csrfProtection, (0, global_validate_1.validate)(friend_validate_1.FriendSchema.requestFriend), friend_service_1.FriendService.requestFriend, friend_controller_1.FriendController.requestFriend);
// 친구 요청 응답
router.post("/request/friend/response", auth_middleware_1.IsAuth, auth_middleware_1.csrfProtection, (0, global_validate_1.validate)(friend_validate_1.FriendSchema.requestFriendHandle), friend_service_1.FriendService.requestFriendHandle, friend_controller_1.FriendController.handleRequestFriend);
// 친구 검색
router.get("/search/friends/", auth_middleware_1.IsAuth, auth_middleware_1.csrfProtection, (0, global_validate_1.validate)(friend_validate_1.FriendSchema.searchFriends, "query"), friend_controller_1.FriendController.searchFriends);
router.delete("/friend/:nickname", auth_middleware_1.IsAuth, friend_controller_1.FriendController.deleteFriend);
module.exports = router;
