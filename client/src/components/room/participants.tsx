import React from "react";
import { useEffect } from "react";
import "../../css/room/participants.css";
import { Room } from "../../types/room";
import { User } from "../../types/user";
// import { setUseStream } from "../../context/stream.context";

const ParticipantLi = ({ user }: any) => {
  return (
    <li className="participant_li">
      <span className="participant_img_box">
        <img src={user.profile_img} />
      </span>
      <span className="participant_nickname">{user.nickname}</span>
    </li>
  );
};

export const Participants = () => {
  // console.log("participants rerender");
  // let { p };

  return (
    <div
      className="pwf-participants_container"
      style={{ display: "none" }}
    ></div>
  );
};
