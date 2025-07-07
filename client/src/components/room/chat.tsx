import React, { useEffect, useState } from "react";
import { FormSubmit, InputChange } from "../../types/event";

import "../../css/room/chat.css";
import { User } from "../../types/user";
import { emitter } from "../../util/event";
import { useContextSelector } from "use-context-selector";
import { StreamContext } from "../../context/stream.context";
import { LocalParticipant, RemoteParticipant } from "livekit-client";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface ChatingInterface {
  user: User;
  content: string;
  me?: boolean;
}

const ChatLi = ({ user, content, me }: ChatingInterface) => {
  return (
    <div className="chat_container">
      <li
        className="chat_li"
        style={{
          float: me ? "right" : "left",
        }}
      >
        <div className="chat_user" style={{ display: me ? "none" : "flex" }}>
          <span className="chat_user_profile">
            <img src={user.profile_img} />
          </span>
          <span className="chat_user_nickname">{user.nickname}</span>
        </div>
        <span className="chat_content">{content}</span>
      </li>
    </div>
  );
};

export const Chat = () => {
  // console.log("chat rerender");
  let user = useSelector((state: RootState) => state.user);
  let room = useContextSelector(StreamContext, (ctx) => ctx.room);

  let [chatList, setChatList] = useState<any>([]);
  let [input, setInput] = useState<string>("");

  // 채팅 받기
  const onDataReceived = (
    payload: Uint8Array,
    participant: RemoteParticipant | LocalParticipant
  ) => {
    const text = new TextDecoder().decode(payload);
    const sender = participant.identity;
    setChatList((c: any) => [...c, { sender, text }]);
  };

  // 채팅 보내기
  const sendChat = async (e: FormSubmit) => {
    e.preventDefault();

    if (input == "") return;

    const encoded = new TextEncoder().encode(input);
    await room.localParticipant.publishData(encoded, { reliable: true });

    setChatList((c: any) => [...c, { sender: user.nickname, text: input }]);
    setInput("");
  };

  useEffect(() => {
    if (!room) return;

    room.on("dataReceived", onDataReceived);

    return () => {
      room.off("dataReceived", onDataReceived);
    };
  }, [room]);

  return (
    <div className="pwf-chat_container">
      {/* 윗부분 */}
      <div className="menu_type">
        <span>채팅</span>
        <button
          onClick={() => emitter.emit("menu", { state: false, type: "chat" })}
        >
          X
        </button>
      </div>
      {/* 채팅 리스트 */}
      <ul className="chat_lists"></ul>
      {/* 채팅인풋 */}
      <form action="" className="pwf-chat_form" onSubmit={sendChat}>
        <input
          type="text"
          value={input}
          onChange={(e: InputChange) => setInput(e.target.value)}
        />
        <button>
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
};
