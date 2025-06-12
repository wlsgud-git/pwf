import { useEffect, useState } from "react";
import { FormSubmit, InputChange } from "../../types/event";
import { emitter } from "../../util/event";

import "../../css/room/chat.css";
import { User } from "../../types/user";

interface ChatProps {
  user: User;
  connects: object;
  state: boolean;
}

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

export const Chat = ({ user, connects, state }: ChatProps) => {
  let [input, setInput] = useState<string>("");
  let [conversation, setConversation] = useState<ChatingInterface[]>([]);

  let sendChat = async (e: FormSubmit) => {
    e.preventDefault();
    let connect_list = Object.entries(connects);

    if (input == "" || !connect_list.length) return;

    // 내 인풋 전송하기
    connect_list.forEach(([from, info]) => {
      info.channel.send(JSON.stringify({ user, content: input }));
    });

    setConversation((c) => [...c, { user, content: input }]);
    setInput("");
  };

  // 상대방 채팅 인지
  useEffect(() => {
    const handler = ({ user, content }: ChatingInterface) => {
      setConversation((c) => [...c, { user, content }]);
    };

    emitter.on("menu chat", handler);

    return () => {
      emitter.off("menu chat", handler);
    };
  }, []);

  return (
    <div
      className="menu_chat_container"
      style={{ display: state ? "flex" : "none" }}
    >
      <ul className="chat_conversations">
        {conversation.length
          ? conversation.map((val: ChatingInterface) => (
              <ChatLi
                user={val.user}
                content={val.content}
                me={val.user.nickname == user.nickname}
              />
            ))
          : ""}
      </ul>
      {/* 채팅입력부분 */}
      <div className="chat_form_container">
        <form className="chat_form" onSubmit={sendChat}>
          <input
            type="text"
            className="chat_input"
            spellCheck="false"
            placeholder="채팅을 입력하세요."
            value={input}
            onChange={(e: InputChange) => setInput(e.target.value)}
          />
          <button className="chat_btn">
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  );
};
