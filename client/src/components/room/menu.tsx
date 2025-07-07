// css
import React, { useEffect, useState } from "react";
import "../../css/room/menu.css";

import { emitter } from "../../util/event";

// component
import { Chat } from "./chat";
import { Participants } from "./participants";

interface MenuType {
  state: boolean;
  type: "chat" | "participants";
}

export const Menu = () => {
  // console.log("menu rerender");
  let [menu, setMenu] = useState<MenuType>({ state: false, type: "chat" });

  useEffect(() => {
    const handler = ({ state, type }: MenuType) => {
      setMenu((c) => ({ ...c, state, type }));
    };

    emitter.on("menu", handler);

    return () => {
      emitter.off("menu", handler);
    };
  });

  return (
    <div
      className="pwf-stream_room_menu"
      style={{ display: menu.state ? "flex" : "none" }}
    >
      <Chat />
      {/* 참가자들 */}
      <Participants />
    </div>
  );
};
