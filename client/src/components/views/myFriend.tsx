import { useSelector } from "react-redux";
import * as SMF from "../../css/views/myfriends.style";
import { AppDispatch, RootState } from "../../redux/store";

import { User, UserComponent } from "../../types/user";
import { useDispatch } from "react-redux";
import { modalState } from "../../redux/reducer/modalReducer";
import { useEffect, useMemo, useState, useRef } from "react";
import { FormSubmit, InputChange } from "../../types/event";
import { user_service } from "../../service/user.service";
import { AxiosError } from "../../error/error";

// 내 친구
export const MyFriendLi = ({ user }: UserComponent) => {
  let menuRef = useRef<HTMLDivElement | null>(null);
  let [menu, setMenu] = useState<boolean>(false);
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  const handleMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (menuRef.current && e.button == 2) setMenu(true);
  };

  useEffect(() => {
    if (menu && menuRef.current) menuRef.current.focus();
  }, [menu]);

  const deleteFriend = async () => {
    try {
      await user_service.deleteFriend(user.nickname!);
    } catch (err: any) {
      let { msg } = AxiosError(err);
      alert(msg);
    }
  };

  return (
    <SMF.MyFriendLi key={user.id} onMouseDown={handleMenu}>
      <SMF.MyFriendLiProfileBox>
        <SMF.MyFriendLiImgCircle>
          <SMF.MyFriendLiImg src={user.profile_img} />
        </SMF.MyFriendLiImgCircle>
        <SMF.MyFriendOnlineCircle></SMF.MyFriendOnlineCircle>
      </SMF.MyFriendLiProfileBox>
      <SMF.MyFriendLiNickname>{user.nickname}</SMF.MyFriendLiNickname>

      <SMF.MyFriendSupBox
        ref={menuRef}
        tabIndex={0}
        onBlur={() => setMenu(false)}
        menu={menu}
      >
        <button onMouseDown={deleteFriend}>친구 삭제</button>
      </SMF.MyFriendSupBox>
    </SMF.MyFriendLi>
  );
};

// 내 친구들리스트
export const MyFriends = () => {
  let dispatch = useDispatch<AppDispatch>();
  let request_friends = useSelector(
    (state: RootState) => state.friend.request_friends
  );
  let friends = useSelector((state: RootState) => state.friend.friends);

  let [searchState, setSearchState] = useState<boolean>(false);
  let [searchNick, setSearchNick] = useState<string>("");
  let [searchLoading, setSearchLoading] = useState<boolean>(false);
  let [searchResult, setSearchResult] = useState<User[]>([]);

  useMemo(() => {
    const searching = async () => {
      try {
        setSearchLoading(true);
        const { data } = await user_service.searchFriendsByNick(searchNick);
        setSearchResult(data);
        setSearchLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    if (searchNick !== "") searching();
  }, [searchNick]);

  return (
    <>
      <SMF.MyFriendsGlobal />
      <SMF.MyFriendsContainer>
        {/* 지원 */}
        <SMF.MyFriendSupportBox>
          {/* 친구요청 */}
          <SMF.MyFriendBtn
            title="친구추가"
            onClick={() =>
              dispatch(modalState({ active: true, type: "friend" }))
            }
          >
            <i className="fa-solid fa-user-plus"></i>
            <SMF.RequestCount count={Object.entries(request_friends).length}>
              {Object.entries(request_friends).length}
            </SMF.RequestCount>
          </SMF.MyFriendBtn>
          {/* 친구 검색 */}
          <SMF.MyFriendSearchBtn onClick={() => setSearchState((c) => !c)}>
            {!searchState ? (
              <i className="fa-solid fa-magnifying-glass"></i>
            ) : (
              <i className="fa-solid fa-x"></i>
            )}
          </SMF.MyFriendSearchBtn>
        </SMF.MyFriendSupportBox>
        {/* 친구검색 부분 */}
        <SMF.MyFriendSearchBox show={searchState}>
          <SMF.MyFriendSearchInput
            placeholder="친구 닉네임"
            value={searchNick}
            onChange={(e: InputChange) => setSearchNick(e.target.value)}
          />
          <SMF.FriendSearchBtn>
            <i className="fa-solid fa-magnifying-glass"></i>
          </SMF.FriendSearchBtn>
        </SMF.MyFriendSearchBox>

        {/* 친구들 리스트 */}
        <SMF.MyFriendsList>
          {searchState && searchNick !== "" ? (
            searchLoading ? (
              <p>검색중...</p>
            ) : searchResult.length ? (
              searchResult.map((val) => <MyFriendLi user={val} />)
            ) : (
              <p>조건에 맞는 친구가 없습니다</p>
            )
          ) : !Object.entries(friends).length ? (
            <p>친구를 추가해 보세요</p>
          ) : (
            Object.entries(friends).map(([key, value]) => (
              <MyFriendLi user={value} />
            ))
          )}
        </SMF.MyFriendsList>
      </SMF.MyFriendsContainer>
    </>
  );
};
