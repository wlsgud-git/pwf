import * as STP from "../../css/room/participants.style";

import React, { useEffect, useMemo, useState } from "react";
import { User } from "../../types/user";

import { useStream } from "../../context/stream.context";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useParams } from "react-router-dom";
import { keyboard } from "@testing-library/user-event/dist/keyboard";
import { user_service } from "../../service/user.service";

interface currentProps {
  join: { [nickname: string]: User };
  notJoin: { [nickname: string]: User };
}

interface ParticipantLiProps {
  info: User;
  friend: boolean;
}

const ParticipantLi = ({ info, friend }: ParticipantLiProps) => {
  const submitReqFriend = async () => {
    try {
      await user_service.requestFriend({
        receiver: info.nickname!,
      });
      alert(`${info.nickname!}에게 친구요청이 전송되었습니다`);
    } catch (err) {
      alert("다시 시도해주세요.");
    }
  };
  return (
    <STP.ParticipantLi key={`participant:${info.id}`}>
      {/* 참가자 정보  */}
      <STP.ParticipantInfoBox>
        <STP.ParticipantImgCircle>
          <STP.ParticipantImg src={info.profile_img} />
        </STP.ParticipantImgCircle>

        <STP.ParticipantNick>{info.nickname}</STP.ParticipantNick>
      </STP.ParticipantInfoBox>
      {/* 친추가 안 된 참가자면 친추 아이콘 활성화 */}
      <STP.ParticipantReqFriendBtn friend={friend} onClick={submitReqFriend}>
        <i className="fa-solid fa-user-plus"></i>
      </STP.ParticipantReqFriendBtn>
    </STP.ParticipantLi>
  );
};

export const Participants = () => {
  let { room, participants } = useStream();
  let initState = { join: {}, notJoin: {} };
  let { id } = useParams();
  let user = useSelector((state: RootState) => state.user);
  let myRoom = useSelector((state: RootState) => state.room);
  let friends = useSelector((state: RootState) => state.friend.friends);

  let [current, setCurrent] = useState<currentProps>(initState);

  useMemo(() => {
    let newMap: currentProps = initState;

    let participantsList = myRoom[parseInt(id!)].participants as User[];

    participantsList.map((val) => {
      if (user.nickname !== val.nickname)
        newMap[participants[val.nickname!] ? "join" : "notJoin"][
          val.nickname!
        ] = val;
    });

    setCurrent(newMap);
  }, [participants, myRoom]);

  return (
    <STP.ParticipantsContent>
      {/* 참가중인 참가자 */}
      <STP.ParticipantStateBox>
        <STP.ParticipantsState>
          참가중 ( {Object.entries(current.join).length} )
        </STP.ParticipantsState>
        <STP.ParticipantsStateList>
          {Object.entries(current.join).map(([key, value]) => (
            <ParticipantLi info={value} friend={friends.hasOwnProperty(key)} />
          ))}
        </STP.ParticipantsStateList>
      </STP.ParticipantStateBox>
      {/* 참가중이 아닌 참가자 */}
      <STP.ParticipantStateBox>
        <STP.ParticipantsState>
          참가중X ( {Object.entries(current.notJoin).length} )
        </STP.ParticipantsState>
        <STP.ParticipantsStateList>
          {Object.entries(current.notJoin).map(([key, value]) => (
            <ParticipantLi info={value} friend={friends.hasOwnProperty(key)} />
          ))}
        </STP.ParticipantsStateList>
      </STP.ParticipantStateBox>
    </STP.ParticipantsContent>
  );
};
