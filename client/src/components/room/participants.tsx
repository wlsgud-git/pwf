import React, { useState } from "react";
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

// const ParticipantLi = ({ user }: any) => {
//   return (
//     <li className="participant_li">
//       <span className="participant_img_box">
//         <img src={user.profile_img} />
//       </span>
//       <span className="participant_nickname">{user.nickname}</span>
//     </li>
//   );
// };

export const Participants = () => {
  let user = useSelector((state: RootState) => state.user);
  let participants = useContextSelector(
    StreamContext,
    (ctx) => ctx.participants
  );
  let roomInfo = useContextSelector(StreamContext, (ctx) => ctx.roomInfo);

  let [current, setCurrent] = useState<{ join: User[]; notJoin: User[] }>({
    join: [],
    notJoin: [],
  });
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
      <div className="participants_container"></div>
    </div>
  );
};
