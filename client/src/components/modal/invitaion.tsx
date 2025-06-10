import "../../css/modal/invitation.css";

import { useState } from "react";

import { emitter } from "../../util/event";

// type
import { User } from "../../types/user";
import { ModalList } from "../../page/modal";
import { Room } from "../../types/room";

interface InvitationProps {
  user: User;
  type: ModalList;
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
export const Invitation = ({ user, type }: InvitationProps) => {
  return (
    <div
      className="invitation_modal"
      style={{ display: type == "invitation" ? "flex" : "none" }}
    >
      <header className="modal_header">
        <button onClick={() => emitter.emit("modal", { type })}>X</button>
      </header>

      <ul className="invitation_list">
        {user.friends?.length
          ? user.friends.map((val) => <InvitationLi user={val} />)
          : ""}
      </ul>
    </div>
  );
};
