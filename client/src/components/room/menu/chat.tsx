import { useState } from "react";
import { FormSubmit, InputChange } from "../../../types/event";

import "../../../css/room/menu/chat.css";

export const Chat = () => {
  let [input, setInput] = useState<string>("");
  let [conversation, setConversation] = useState<null>(null);

  let sendChat = async (e: FormSubmit) => {
    e.preventDefault();

    if (input == "") return;

    setInput("");
  };

  return (
    <div className="menu_chat_container">
      <ul className="chat_conversations"></ul>
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
