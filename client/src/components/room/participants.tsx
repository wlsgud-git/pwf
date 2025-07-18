import React, { useMemo, useState } from "react";
import { useEffect } from "react";
import "../../css/room/participants.css";
import { Room } from "../../types/room";
import { User } from "../../types/user";
import { emitter } from "../../util/event";
// import { setUseStream } from "../../context/stream.context";

import { useContextSelector } from "use-context-selector";
import { StreamContext } from "../../context/stream.context";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { join } from "path";
import { useParams } from "react-router-dom";

interface currentProps {
  join: { [id: number]: User };
  notJoin: { [id: number]: User };
}

const ParticipantLi = ({ user }: { [user: string]: User }) => {
  return (
    <li key={`participant:${user.id}`} className="participant_li">
      <span className="participant_profile_img_box">
        <img src={user.profile_img} />
      </span>
      <span className="participant_nickname">{user.nickname}</span>
    </li>
  );
};

export const Participants = () => {
  let initState = { join: {}, notJoin: {} };
  let { id } = useParams();
  let user = useSelector((state: RootState) => state.user);
  let room = useSelector((state: RootState) => state.room);
  let participants = useContextSelector(
    StreamContext,
    (ctx) => ctx.participants
  );
  let roomInfo = useContextSelector(StreamContext, (ctx) => ctx.roomInfo);

  let [current, setCurrent] = useState<currentProps>(initState);

  useMemo(() => {
    let newMap: currentProps = initState;

    room[parseInt(id!)].participants?.map((val) => {
      if (user.id !== val.id)
        newMap[participants[val.nickname!] ? "join" : "notJoin"][val.id!] = val;
    });

    setCurrent(newMap);
  }, [participants, room]);

  useEffect(() => {
    console.log(current.join, current.notJoin);
  }, [current]);

  return (
    <div className="pwf-participants_container">
      <div className="menu_type">
        <span>참가자</span>
        <button
          onClick={() =>
            emitter.emit("menu", { state: false, type: "participants" })
          }
        >
          X
        </button>
      </div>
      <div className="participants_container">
        <div className="participants_state_box">
          <span>참가중 ( {Object.entries(current.join).length} )</span>
          <ul>
            {Object.entries(current.join).map(([key, value]) => (
              <ParticipantLi user={value} />
            ))}
          </ul>
        </div>
        <div className="participants_state_box">
          <span>참가중X ( {Object.entries(current.notJoin).length} )</span>
          <ul>
            {Object.entries(current.notJoin).map(([key, value]) => (
              <ParticipantLi user={value} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
