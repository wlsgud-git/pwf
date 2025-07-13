import "../../css/modal/invitation.css";

import { use, useEffect, useState } from "react";

import { emitter } from "../../util/event";

// type
import { User } from "../../types/user";
import { Room } from "../../types/room";
import { useContextSelector } from "use-context-selector";
import { StreamContext } from "../../context/stream.context";
import { createFormData } from "../../util/form";
import { stream_service } from "../../service/stream.service";

interface InvitationProps {
  user: User;
  show: boolean;
  setShow: any;
}

const InvitationLi = ({ user }: { [nickname: string]: User }) => {
  let [select, setSelect] = useState<boolean>(false);

  let handleClick = () => setSelect((c) => !c);

  useEffect(
    () => emitter.emit("invitation select", { user, select }),
    [select]
  );

  useEffect(() => {
    const handle = () => setSelect(false);
    emitter.on(`invite control ${user.nickname}`, handle);
    return () => emitter.off(`invite control ${user.nickname}`, handle);
  }, []);

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
      <input type="radio" checked={select} onClick={handleClick} />
    </li>
  );
};

// 친구 관련 모달
export const Invitation = ({ user, show, setShow }: InvitationProps) => {
  let roomInfo = useContextSelector(StreamContext, (ctx) => ctx.roomInfo);
  function reset() {
    setShow(false);
    emitter.emit("modal", { type: "invitation" });
  }

  let [inUser, setInUser] = useState<{ [nick: string]: true }>({});
  let [invitationList, setInvitationList] = useState<User[]>([]);

  useEffect(() => {
    const handle = ({ user, select }: { user: User; select: boolean }) => {
      select
        ? setInvitationList((c) => [...c, user])
        : setInvitationList((c) =>
            c.filter((val) => val.nickname != user.nickname)
          );
    };

    emitter.on("invitation select", handle);

    return () => {
      emitter.off("invitation select", handle);
    };
  });

  useEffect(() => {
    let newMap: { [nick: string]: true } = {};
    if (roomInfo) {
      roomInfo.participants.map((val: User) => {
        let nick = val.nickname!;
        if (nick !== user.nickname) newMap[nick] = true;
      });
      setInUser(newMap);
    }
  }, [roomInfo]);

  const invite = async () => {
    try {
      let inviteList = invitationList.map((val) => val.id);
      let formdata = createFormData({ id: roomInfo.id, inviteList });
      let { msg } = await stream_service.inviteStreamRoom(formdata);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className="invitation_modal"
      style={{ display: show ? "flex" : "none" }}
    >
      <header className="modal_header">
        <button onClick={reset}>X</button>
      </header>

      <div className="invitation_container">
        {/* 초대할 친구목록 */}
        <ul className="invitation_list">
          {!invitationList.length ? (
            <p className="i_text">친구를 방에 초대하세요</p>
          ) : (
            invitationList.map((val) => (
              <div className="listup_user">
                <span className="listup_user_profile_box">
                  <img src={val.profile_img} />
                  <button
                    onClick={() =>
                      emitter.emit(`invite control ${val.nickname}`)
                    }
                  >
                    x
                  </button>
                </span>

                <span className="listup_nickname">{val.nickname}</span>
              </div>
            ))
          )}
        </ul>
        {/* 내가 초대할 친구목록 */}
        <ul className="invitation_friend_list">
          {user.friends?.map((val) =>
            inUser[val.nickname!] ? "" : <InvitationLi user={val} />
          )}
        </ul>
        <div className="invitation_btn_box">
          <button onClick={invite}>초대하기</button>
        </div>
      </div>
    </div>
  );
};
