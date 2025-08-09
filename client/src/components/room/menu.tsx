// css
import * as STRM from "../../css/room/menu.style";

import React, { useEffect, useState } from "react";

import { emitter } from "../../util/event";

// component
import { Chat } from "./chat";
import { Participants } from "./participants";

interface MenuType {
  state: boolean;
  type: "chat" | "participants";
}

export const Menu = () => {
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
    <>
      <STRM.MenuGlobal />
      <STRM.MenuBox show={menu.state}>
        <STRM.MenuTextBox>
          <span>{menu.type == "chat" ? "채팅" : "참가자"}</span>
          <STRM.MenuCloseBtn
            onClick={() => setMenu((c) => ({ ...c, state: false }))}
          >
            X
          </STRM.MenuCloseBtn>
        </STRM.MenuTextBox>
        {menu.type == "chat" ? <Chat /> : <Participants />}
      </STRM.MenuBox>
    </>
  );
};
