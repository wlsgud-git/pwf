import { useEffect, useState } from "react";

import { emitter } from "../../../util/event";

// css
import "../../../css/room/menu/menu.css";

// component
import { Chat } from "./chat";
import { Participants } from "./participants";

export const Menu = () => {
  let [menu, setMenu] = useState<{
    state: boolean;
    content: "participants" | "chat";
  }>({ state: false, content: "participants" });

  useEffect(() => {
    const handler = (state: boolean) => setMenu((c) => ({ ...c, state }));
    emitter.on("room menu", handler);

    return () => {
      emitter.off("room menu", handler);
    };
  }, []);

  return (
    <div
      className="menu_container"
      style={{ display: menu.state ? "flex" : "none" }}
    >
      <button
        className="menu_close_btn"
        onClick={() => setMenu((c) => ({ ...c, state: false }))}
      ></button>
      <div className="pwf-streamRoom_menu">
        <div className="pwf-streamRoom_menu_btn_container">
          <div className="pwf-streamRoom_menu_btn_box">
            <button
              onClick={() =>
                setMenu((c) => ({ ...c, content: "participants" }))
              }
            >
              참가자
            </button>
            <button onClick={() => setMenu((c) => ({ ...c, content: "chat" }))}>
              채팅
            </button>
          </div>
        </div>
        <ul className="pwf-streamRoom_menu_content">
          {/* 참가자 채팅창 */}
          {menu.content == "chat" ? <Chat /> : <Participants />}
        </ul>
      </div>
    </div>
  );
};
