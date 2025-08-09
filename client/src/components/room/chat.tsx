import React, { useEffect, useMemo, useState } from "react";
import { FormSubmit, InputChange } from "../../types/event";

import * as STC from "../../css/room/chat.style";

import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useStream } from "../../context/stream.context";

interface ChatingInterface {
  value: any;
  me: boolean;
}

const ChatLi = ({ value, me }: ChatingInterface) => {
  return (
    <STC.ChatLi me={me}>
      {!me && (
        <STC.ChatUserImgCircle>
          <STC.ChatUserImg src={value.profile_img} />
        </STC.ChatUserImgCircle>
      )}
      <STC.ChatContentBox>
        {!me && <STC.ChatUserNick>{value.nickname}</STC.ChatUserNick>}
        <STC.ChatContent me={me}>{value.value}</STC.ChatContent>
      </STC.ChatContentBox>
    </STC.ChatLi>
  );
};

export const Chat = React.memo(() => {
  let { room } = useStream();
  let user = useSelector((state: RootState) => state.user);

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
    <>
      <STC.ChatGlobal />
      <STC.ChatContainer>
        {/* 채팅 리스트 */}
        <STC.ChatLists>
          {chatList.map((val: any) => (
            <ChatLi value={val} me={val.nickname == user.nickname} />
          ))}
        </STC.ChatLists>
        {/* 채팅인풋 */}
        <STC.ChatForm onSubmit={sendChat}>
          <STC.ChatInput
            type="text"
            value={input}
            placeholder="채팅"
            onChange={(e: InputChange) => setInput(e.target.value)}
          />
          <STC.ChatBtn>
            <i className="fa-solid fa-paper-plane"></i>
          </STC.ChatBtn>
        </STC.ChatForm>
      </STC.ChatContainer>
    </>
  );
});
