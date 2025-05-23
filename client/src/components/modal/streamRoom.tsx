import { ChangeEvent, useEffect, useRef, useState } from "react";
import "../../css/modal/streamRoom.css";
import { emitter } from "../../util/event";

// types
import { User, UserComponent } from "../../types/user";
import { FormSubmit, InputChange } from "../../types/event";
import { stream_service } from "../../service/streamservice";
import { createFormData } from "../../util/form";

interface CompoentProps {
  user: User;
  type: string;
}

// 초대할 친구정보
export const LiFriend = ({ user }: { [user: string]: User }) => {
  let [select, Setselect] = useState<boolean>(false);

  const selectControl = () => Setselect((c) => !c);

  // 강제 select 제거
  useEffect(() => {
    const handler = () => {
      Setselect(false);
    };

    emitter.on(`${user.nickname} select off`, handler);

    return () => {
      emitter.off(`${user.nickname} select off`, handler);
    };
  }, []);

  useEffect(() => {
    emitter.emit("invite select", { select, user });
  }, [select]);

  return (
    <li className="invite_friend_li">
      <input
        id={user.nickname}
        type="radio"
        checked={select}
        value={user.nickname}
        onClick={selectControl}
      />
      <span className="invite_friend_img">
        <img src={user.profile_img} />
      </span>
      <span className="invite_friend_nickname">{user.nickname}</span>
    </li>
  );
};

// 방 만들기 모달
export const StreamRoom = ({ user, type }: CompoentProps) => {
  let formRef = useRef<HTMLFormElement>(null);
  let [inviteUsers, setInviteUsers] = useState<User[]>([]);

  // infomation
  let [roomname, setRoomname] = useState<string>("");

  // 모달 리셋
  function resetModal() {
    setRoomname("");
    inviteUsers.map((val) => {
      emitter.emit(`${val.nickname} select off`);
    });
    emitter.emit("modal", { type });
  }

  // invite
  useEffect(() => {
    const handler = (data: any) => {
      let { select, user } = data;

      if (select) setInviteUsers((c) => [...c, user]);
      else
        setInviteUsers((c) =>
          c.filter((data: User) => data.nickname !== user.nickname)
        );
    };

    emitter.on("invite select", handler);

    return () => {
      emitter.off("invite select", handler);
    };
  }, []);

  // 방 생성
  const createStreamRoom = async (e: FormSubmit) => {
    e.preventDefault();

    if (!roomname.length || roomname.length >= 21) {
      alert("방 이름은 1~20자 이내여야 합니다.");
      return;
    }

    if (!inviteUsers.length) {
      alert("최소 1명이상의 친구를 초대해야 합니다.");
      return;
    }

    try {
      let participants = inviteUsers.map((val) => val.id);
      participants.push(user.id);
      let formdata = createFormData({ room_name: roomname, participants });
      let { msg, room } = await stream_service.createStreamRoom(formdata);
      resetModal();
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div
      className="stream_modal"
      style={{ display: type == "stream" ? "flex" : "none" }}
    >
      <header className="modal_header">
        <button onClick={resetModal}>X</button>
      </header>
      {/* 모달 내용 */}
      <div className="stream_create_box">
        <form onSubmit={createStreamRoom} ref={formRef}>
          {/* 방 이름 */}
          <div className="stream_roomname_box">
            <label htmlFor="stream_roomname">방이름</label>
            <input
              type="text"
              value={roomname}
              className="pwf_roomname_input"
              placeholder="방이름"
              onChange={(e: InputChange) => setRoomname(e.target.value)}
            />
          </div>
          {/* 참여자 목록 */}
          <div className="participants_box">
            <label htmlFor="participants">참여자 {inviteUsers.length}</label>
            <ul className="participants_list">
              {inviteUsers.length ? (
                inviteUsers.map((val) => <li>{val.nickname}</li>)
              ) : (
                <p style={{ color: "gray" }}>초대된 친구가 없습니다</p>
              )}
            </ul>
          </div>
          {/* 초대할 친구목록 */}
          <div className="friends_invite_box">
            <label htmlFor="friends_list">친구목록</label>
            <ul className="friends_list">
              {user.friends && user.friends.length ? (
                user.friends.map((val) => <LiFriend user={val} />)
              ) : (
                <p>초대할 친구가 없습니다.</p>
              )}
            </ul>
          </div>
          {/* 모달 풋터 */}
          <footer className="stream_modal_footer">
            <button>방 만들기</button>
          </footer>
        </form>
      </div>
    </div>
  );
};
