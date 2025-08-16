import { useEffect, useMemo, useState } from "react";

import { emitter } from "../../util/event";

// type
import { User } from "../../types/user";
import { createFormData } from "../../util/form";
import { stream_service } from "../../service/stream.service";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useLocation, useParams } from "react-router-dom";

import * as SIV from "../../css/modal/invitation.style";

const InvitationLi = ({ user }: { [nickname: string]: User }) => {
  let [select, setSelect] = useState<boolean>(false);

  let handleClick = () => setSelect((c) => !c);

  useEffect(
    () => emitter.emit("invitation select", { user, select }),
    [select]
  );

  useEffect(() => {
    const handle = () => setSelect(false);
    emitter.on(`invite control ${user.nickname}`, handle);
    return () => emitter.off(`invite control ${user.nickname}`, handle);
  }, []);

  return (
    <SIV.InvitationLi>
      {/* 유저 정보 */}
      <div>
        <SIV.InvitationProfileCricle>
          <SIV.InvitationProfileImg src={user.profile_img} />
        </SIV.InvitationProfileCricle>
        <SIV.InviationUserNick>{user.nickname}</SIV.InviationUserNick>
      </div>
      {/* 초대버튼 */}
      <input type="radio" checked={select} onClick={handleClick} />
    </SIV.InvitationLi>
  );
};

// 친구 관련 모달
export const Invitation = () => {
  let [id, setId] = useState<number>(0);
  let location = useLocation();
  let friends = useSelector((state: RootState) => state.friend.friends);
  let nickname = useSelector((state: RootState) => state.user.nickname);
  let room = useSelector((state: RootState) => state.room);

  let [inUser, setInUser] = useState<{ [nick: string]: User }>({});
  let [invitationList, setInvitationList] = useState<User[]>([]);

  useEffect(() => {
    setId(parseInt(location.pathname.split("/")[2]));
  }, []);

  useEffect(() => {
    const handle = ({ user, select }: { user: User; select: boolean }) => {
      select
        ? setInvitationList((c) => [...c, user])
        : setInvitationList((c) =>
            c.filter((val) => val.nickname != user.nickname)
          );
    };

    emitter.on("invitation select", handle);

    return () => {
      emitter.off("invitation select", handle);
    };
  }, []);

  useMemo(() => {
    if (id) {
      let newMap: { [nick: string]: User } = {};

      let participantsList = room[id].participants as User[];
      participantsList.map((val) => {
        if (val.nickname !== nickname) newMap[val.nickname!] = val;
      });
      setInUser(newMap);
    }
  }, [id]);

  // 친구초대
  const invite = async () => {
    try {
      let inviteList = invitationList.map((val) => val.id) as number[];
      let { msg } = await stream_service.inviteStreamRoom({
        id,
        inviteList,
      });
      alert(msg);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <SIV.InvitationGlobal />
      <SIV.InvitationContainer>
        {/* 초대할 친구목록 */}
        <SIV.InviteList>
          {!invitationList.length ? (
            <SIV.NoInviteText>친구를 방에 초대하세요</SIV.NoInviteText>
          ) : (
            invitationList.map((val) => (
              <SIV.InviteLi key={val.id}>
                <SIV.InviteUserImgBox>
                  <SIV.InviteUserImg src={val.profile_img} />
                  <SIV.InviteUserDelBtn
                    onClick={() =>
                      emitter.emit(`invite control ${val.nickname}`)
                    }
                  >
                    x
                  </SIV.InviteUserDelBtn>
                </SIV.InviteUserImgBox>

                <SIV.InviteUserNick>{val.nickname}</SIV.InviteUserNick>
              </SIV.InviteLi>
            ))
          )}
        </SIV.InviteList>
        {/* 내가 초대할 친구목록 */}
        <SIV.InvitationList>
          {Object.entries(friends).map(([key, value]) =>
            !inUser[value.nickname!] ? <InvitationLi user={value} /> : ""
          )}
        </SIV.InvitationList>
        <SIV.InvitationBtnBox>
          <SIV.InvitationBtn onClick={invite}>초대하기</SIV.InvitationBtn>
        </SIV.InvitationBtnBox>
      </SIV.InvitationContainer>
    </>
  );
};
