import "../../css/modal/invitation.css";

import { useEffect, useState } from "react";

import { emitter } from "../../util/event";

// type
import { User } from "../../types/user";
import { Room } from "../../types/room";

interface InvitationProps {
  user: User;
  show: boolean;
  setShow: any;
  participants: Room["participants"];
}

const InvitationLi = ({ user }: { [user: string]: User }) => {
  return (
    <li className="invitation_li">
      {/* 유저 정보 */}
      <div>
        <span className="invitation_profile_box">
          <img src={user.profile_img} />
        </span>
        <span className="invitation_nickname">{user.nickname}</span>
      </div>
      {/* 초대버튼 */}
      <button>초대</button>
    </li>
  );
};

// 친구 관련 모달
export const Invitation = ({
  user,
  show,
  setShow,
  participants,
}: InvitationProps) => {
  function reset() {
    setShow(false);
    emitter.emit("modal", { type: "invitation" });
  }

  let [invitationList, setInvitationList] = useState<User[]>([]);

  useEffect(() => {
    let list: User[] = [];
    if (user && user.friends!.length && participants && participants.length)
      for (var i = 0; i < user.friends!.length; i++) {
        let pusher = true;
        let cn = user.friends![i].nickname;
        for (var j = 0; j < participants!.length; j++) {
          let ccn = participants![j].nickname;
          if (cn == ccn) {
            pusher = false;
            break;
          }
        }
        if (pusher) list.push(user.friends![i]);
      }
    setInvitationList(list.map((val) => val));
  }, [participants]);

  return (
    <div
      className="invitation_modal"
      style={{ display: show ? "flex" : "none" }}
    >
      <header className="modal_header">
        <button onClick={reset}>X</button>
      </header>

      <ul className="invitation_list">
        {invitationList.length ? (
          invitationList.map((val) => <InvitationLi user={val} />)
        ) : (
          <p>초대할 친구가 없습니다.</p>
        )}
      </ul>
    </div>
  );
};
