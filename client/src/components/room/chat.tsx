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
  value: any;
  me: boolean;
}

const ChatLi = ({ value, me }: ChatingInterface) => {
  return (
    <div className="chat_container" style={{ alignSelf: me ? "end" : "start" }}>
      {!me && (
        <span className="chat_user_profile_circle">
          <img src={value.profile_img} />
        </span>
      )}
      <div className="chat_content_box">
        {!me && <span className="chat_user_nickname">{value.nickname}</span>}
        <div
          className="chat_content"
          style={{ backgroundColor: me ? "yellow" : "white" }}
        >
          {value.value}
        </div>
      </div>
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
  const onDataReceived = (payload: Uint8Array) => {
    let info = JSON.parse(new TextDecoder().decode(payload));
    setChatList((c: any) => [...c, info]);
  };

  // 채팅 보내기
  const sendChat = async (e: FormSubmit) => {
    e.preventDefault();

    if (input == "") return;
    let sendInfo = {
      value: input,
      nickname: user.nickname,
      profile_img: user.profile_img,
    };

    let encoded = new TextEncoder().encode(JSON.stringify(sendInfo));

    await room.localParticipant.publishData(encoded, {
      reliable: true,
    });

    setChatList((c: any) => [...c, sendInfo]);
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
      <ul className="chat_lists">
        {chatList.map((val: any) => (
          <ChatLi value={val} me={val.nickname == user.nickname} />
        ))}
      </ul>
      {/* 채팅인풋 */}
      <form action="" className="pwf-chat_form" onSubmit={sendChat}>
        <input
          type="text"
          value={input}
          placeholder="채팅"
          onChange={(e: InputChange) => setInput(e.target.value)}
        />
        <button>
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
};
