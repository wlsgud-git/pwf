import { ChangeEvent, useEffect, useState } from "react";
import "../css/stream.css";
import { emitter } from "../util/event";

// types
import { User } from "../types/user";
import { FormSubmit } from "../types/event";

// component;
import { useSelector } from "react-redux";
import { RootState } from "../context/store";

export const LiFriend = ({ nickname, profile_img }: User) => {
  let [select, Setselect] = useState<boolean>(false);

  const selectControl = () => Setselect((c) => !c);

  useEffect(() => {
    emitter.emit("invite select", { select, nickname });
  }, [select]);

  return (
    <li className="invite_friend_li">
      <input
        id={nickname}
        type="radio"
        checked={select}
        value={nickname}
        onClick={selectControl}
      />
      <span className="invite_friend_img">
        <img src={profile_img} />
      </span>
      <span className="invite_friend_nickname">{nickname}</span>
    </li>
  );
};

export const StreamModal = () => {
  let user = useSelector((state: RootState) => state.user);
  let [open, setOpen] = useState<boolean>(false);
  let [inviteUsers, setInviteUsers] = useState<string[]>([]);

  // invite
  useEffect(() => {
    const handler = (data: any) => {
      let { select, nickname } = data;

      if (select) setInviteUsers((c) => [...c, nickname]);
      else setInviteUsers((c) => c.filter((user) => user !== nickname));
    };

    emitter.on("invite select", handler);

    return () => {
      emitter.off("invite select", handler);
    };
  }, []);

  // open
  useEffect(() => {
    const handler = (open: boolean) => {
      setOpen(open);
    };
    emitter.on("stream modal", handler);

    return () => {
      emitter.off("stream modal", handler);
    };
  }, []);

  const submitStreamRoomInfo = async (e: FormSubmit) => {
    e.preventDefault();
  };

  return (
    <div className="modal_box" style={{ display: open ? "flex" : "none" }}>
      <div className="stream_modal">
        {/* 모달 헤더 */}
        <header className="modal_header">
          <button onClick={() => setOpen(false)}>X</button>
        </header>
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
                  inviteUsers.map((val) => <li>{val}</li>)
                ) : (
                  <p style={{ color: "gray" }}>초대된 친구가 없습니다</p>
                )}
              </ul>
            </div>
            {/* 초대할 친구목록 */}
            <div className="friends_invite_box">
              <label htmlFor="friends_list">친구목록</label>
              <ul className="friends_list">
                {user.friends && user.friends.length
                  ? user.friends.map((val) => (
                      <LiFriend
                        nickname={val.nickname}
                        profile_img={val.profile_img}
                      />
                    ))
                  : ""}
              </ul>
            </div>
          </form>
        </div>
        {/* 모달 풋터 */}
        <footer className="modal_footer">
          <button>방 만들기</button>
        </footer>
      </div>
    </div>
  );
};
