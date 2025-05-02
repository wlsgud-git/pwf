import { ChangeEvent, useEffect, useState } from "react";
import "../../css/stream.css";
import { emitter } from "../../util/event";

// types
import { User, UserComponent } from "../../types/user";
import { FormSubmit } from "../../types/event";

interface CompoentProps {
  user: User;
  type: string;
}

export const LiFriend = ({ user }: UserComponent) => {
  let [select, Setselect] = useState<boolean>(false);

  const selectControl = () => Setselect((c) => !c);

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

export const StreamModal = ({ user, type }: CompoentProps) => {
  // let [open, setOpen] = useState<boolean>(false);
  let [inviteUsers, setInviteUsers] = useState<User[]>([]);

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

  const submitStreamRoomInfo = async (e: FormSubmit) => {
    e.preventDefault();
  };

  return (
    <div
      className="stream_modal"
      style={{ display: type == "stream" ? "flex" : "none" }}
    >
      {/* 모달 내용 */}
      <div className="stream_create_box">
        <form onSubmit={submitStreamRoomInfo}>
          {/* 방 이름 */}
          <div className="stream_roomname_box">
            <label htmlFor="stream_roomname">방이름</label>
            <input type="text" className="pwf_roomname_input" />
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
        </form>
      </div>
      {/* 모달 풋터 */}
      <footer className="stream_modal_footer">
        <button>방 만들기</button>
      </footer>
    </div>
  );
};
