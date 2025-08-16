import { ChangeEvent, useEffect, useRef, useState } from "react";
import { emitter } from "../../util/event";

// types
import { User } from "../../types/user";
import { FormSubmit, InputChange } from "../../types/event";
import { createFormData } from "../../util/form";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { stream_service } from "../../service/stream.service";

import * as SSTR from "../../css/modal/stream.style";
import { AxiosError } from "../../error/error";
import { modalState } from "../../redux/reducer/modalReducer";

// 초대할 친구정보
export const LiInviter = ({ user }: { [user: string]: User }) => {
  return (
    <SSTR.InviteLi>
      <SSTR.InviteLiImgBox>
        <SSTR.InviteImgCircle>
          <SSTR.InviteUserImg src={user.profile_img} />
        </SSTR.InviteImgCircle>

        <SSTR.InviteOutBtn
          type="button"
          onClick={() => emitter.emit(`${user.nickname} select off`)}
        >
          x
        </SSTR.InviteOutBtn>
      </SSTR.InviteLiImgBox>
      <SSTR.InviteUserNick>{user.nickname}</SSTR.InviteUserNick>
    </SSTR.InviteLi>
  );
};

export const LiFriend = ({ user }: { [user: string]: User }) => {
  let [select, Setselect] = useState<boolean>(false);

  const selectControl = () => Setselect((c) => !c);

  // 강제 select 제거
  useEffect(() => {
    const handler = () => {
      Setselect(false);
    };

    emitter.on(`${user.nickname} select off`, handler);

    return () => {
      emitter.off(`${user.nickname} select off`, handler);
    };
  }, []);

  useEffect(() => {
    emitter.emit("invite select", { select, user });
  }, [select]);

  return (
    <SSTR.FriendLi>
      <input
        id={user.nickname}
        type="radio"
        checked={select}
        value={user.nickname}
        onClick={selectControl}
      />
      <SSTR.FriendImgCircle>
        <SSTR.FriendImg src={user.profile_img} />
      </SSTR.FriendImgCircle>

      <SSTR.FriendNickname>{user.nickname}</SSTR.FriendNickname>
    </SSTR.FriendLi>
  );
};

// 방 만들기 모달
export const StreamRoom = () => {
  let dispatch = useDispatch<AppDispatch>();

  let id = useSelector((state: RootState) => state.user.id);
  let friends = useSelector((state: RootState) => state.friend.friends);
  let formRef = useRef<HTMLFormElement>(null);
  let [inviteUsers, setInviteUsers] = useState<User[]>([]);

  // infomation
  let [roomname, setRoomname] = useState<string>("");

  // invite
  useEffect(() => {
    const handler = (data: any) => {
      let { select, user } = data;

      if (select) setInviteUsers((c) => [...c, user]);
      else
        setInviteUsers((c) =>
          c.filter((data: User) => data.nickname !== user.nickname)
        );
    };

    emitter.on("invite select", handler);

    return () => {
      emitter.off("invite select", handler);
    };
  }, []);

  // 방 생성
  const createStreamRoom = async (e: FormSubmit) => {
    e.preventDefault();

    if (!roomname.length || roomname.length >= 21) {
      alert("방 이름은 1~20자 이내여야 합니다.");
      return;
    }

    if (!inviteUsers.length) {
      alert("최소 1명이상의 친구를 초대해야 합니다.");
      return;
    }

    try {
      let participants = inviteUsers.map((val) => val.id);
      participants.push(id);
      await stream_service.createStreamRoom({
        room_name: roomname,
        participants: participants as number[],
      });
      dispatch(modalState({ active: false, type: null }));
    } catch (err: any) {
      let { msg } = AxiosError(err);
      alert(msg);
    }
  };

  return (
    <SSTR.StreamContent>
      <SSTR.StreamForm onSubmit={createStreamRoom} ref={formRef}>
        {/* 방 이름 */}
        <SSTR.StreamContentDiv>
          <SSTR.StreamContentLabel>참여자</SSTR.StreamContentLabel>
          <SSTR.StreamRoomNameInput
            type="text"
            value={roomname}
            className="pwf_roomname_input"
            placeholder="방이름"
            spellCheck="false"
            onChange={(e: InputChange) => setRoomname(e.target.value)}
          />
        </SSTR.StreamContentDiv>
        {/* 참여자 목록 */}
        <SSTR.StreamContentDiv>
          <SSTR.StreamContentLabel>
            참여자 {inviteUsers.length}
          </SSTR.StreamContentLabel>
          <SSTR.StreamRoomInviteList length={inviteUsers.length}>
            {inviteUsers.length ? (
              inviteUsers.map((val) => <LiInviter user={val} />)
            ) : (
              <SSTR.StreamRoomNoInvite>
                초대한 친구가 없습니다
              </SSTR.StreamRoomNoInvite>
            )}
          </SSTR.StreamRoomInviteList>
        </SSTR.StreamContentDiv>
        {/* 초대할 친구목록 */}
        <SSTR.StreamContentDiv>
          <SSTR.StreamContentLabel>친구목록</SSTR.StreamContentLabel>
          <SSTR.InviteFriendList length={Object.entries(friends).length}>
            {Object.entries(friends).length ? (
              Object.entries(friends).map(([key, val]) => (
                <LiFriend user={val} />
              ))
            ) : (
              <SSTR.InviteFriendNo>초대할 친구가 없습니다.</SSTR.InviteFriendNo>
            )}
          </SSTR.InviteFriendList>
        </SSTR.StreamContentDiv>
        {/* 모달 풋터 */}
        <footer className="stream_modal_footer">
          <SSTR.CreateStreamRoomBtn>방 만들기</SSTR.CreateStreamRoomBtn>
        </footer>
      </SSTR.StreamForm>
    </SSTR.StreamContent>
  );
};
