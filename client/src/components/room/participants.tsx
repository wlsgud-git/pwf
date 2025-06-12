import { useEffect } from "react";
import "../../css/room/participants.css";
import { Room } from "../../types/room";
import { User } from "../../types/user";

interface ParticipantsProps {
  user: User;
  state?: boolean;
  participants?: Room["participants"];
}

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

export const Participants = ({
  user,
  state,
  participants,
}: ParticipantsProps) => {
  return (
    <div
      className="menu_participants_list"
      style={{ display: state ? "flex" : "none" }}
    >
      {participants?.length
        ? participants?.map((val: any) => {
            return val.nickname !== user.nickname ? (
              <ParticipantLi user={val} />
            ) : (
              ""
            );
          })
        : ""}
    </div>
  );
};
