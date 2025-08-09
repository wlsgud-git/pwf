import { useState, useEffect } from "react";
import { FormSubmit, InputChange } from "../../types/event";
import { user_service } from "../../service/user.service";
import { AxiosError } from "../../error/error";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";

import { friendAction } from "../../redux/actions/friendAction";

import * as SFR from "../../css/modal/friend.style";
import { User } from "../../types/user";

// 친구요청 보낸 친구들 리스트
export const RequestFriendLi = ({ sender }: { sender: User }) => {
  let dispatch = useDispatch<AppDispatch>();

  const handleRequestFriend = async (response: boolean) => {
    try {
      dispatch(
        friendAction.requestFriendHandle({
          sender: sender.nickname as string,
          response,
        })
      );
    } catch (err: any) {
      let { msg } = AxiosError(err);
      console.log(msg);
      // alert(msg);
    }
  };

  return (
    <>
      <SFR.FriendLi>
        <SFR.FriendLiUserBox>
          <SFR.FriendLiProfileBox>
            <SFR.FriendLiProfileImg src={sender.profile_img} />
          </SFR.FriendLiProfileBox>
          <SFR.FriendLiNickname>{sender.nickname}</SFR.FriendLiNickname>
        </SFR.FriendLiUserBox>
        {/* button */}
        <SFR.FriendBtnBox>
          <SFR.FriendLiBtn
            title="수락"
            onClick={() => handleRequestFriend(true)}
          >
            <i className="fa-solid fa-check"></i>
          </SFR.FriendLiBtn>
          <SFR.FriendLiBtn
            title="거절"
            onClick={() => handleRequestFriend(false)}
          >
            <i className="fa-solid fa-xmark"></i>
          </SFR.FriendLiBtn>
        </SFR.FriendBtnBox>
      </SFR.FriendLi>
    </>
  );
};

// 친구 관련 모달
export const Friend = () => {
  let dispatch = useDispatch<AppDispatch>();
  let user = useSelector((state: RootState) => state.user);
  let request_friends = useSelector(
    (state: RootState) => state.friend.request_friends
  );

  let [error, setError] = useState<{ state: boolean; msg: string }>({
    state: false,
    msg: "",
  });
  let [nickname, setNickname] = useState<string>("");

  // 친구요청
  const requestFriend = async (e: FormSubmit) => {
    e.preventDefault();

    try {
      await user_service.requestFriend({
        receiver: nickname,
      });
      alert(`${nickname}에게 친구요청이 전송되었습니다`);
      setNickname("");
    } catch (err) {
      let { msg } = AxiosError(err);
      setError((c) => ({ ...c, state: true, msg }));
    }
  };

  useEffect(() => {
    setError((c) => ({ ...c, state: false }));
  }, [nickname]);

  return (
    <>
      <SFR.FriendGlobal />
      <SFR.FriendContent>
        {/* 친추요청 검색 */}
        <SFR.FriendSearchBox>
          <SFR.FriendSearchForm onSubmit={requestFriend}>
            <SFR.FriendSearchInput
              error={error.state}
              type="text"
              value={nickname}
              onChange={(e: InputChange) => setNickname(e.target.value)}
              placeholder="친구요청 닉네임"
              spellCheck="false"
              onFocus={() => setError((c) => ({ ...c, state: false }))}
            />
          </SFR.FriendSearchForm>
          <SFR.FriendSearchError error={error.state}>
            {error.msg}
          </SFR.FriendSearchError>
        </SFR.FriendSearchBox>

        {/* 친추 리스트 */}
        <SFR.FriendRequestBox>
          <SFR.FriendRequestLabel>친구요청</SFR.FriendRequestLabel>
          <SFR.FriendRequstList>
            {Object.entries(request_friends).length ? (
              Object.entries(request_friends).map(([key, value]) => (
                <RequestFriendLi sender={value} />
              ))
            ) : (
              <SFR.FriendRequstEmpty>친구요청이 없습니다</SFR.FriendRequstEmpty>
            )}
          </SFR.FriendRequstList>
        </SFR.FriendRequestBox>
      </SFR.FriendContent>
    </>
  );
};
