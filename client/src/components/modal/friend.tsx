import "../../css/modal/friend.css";
import { useState, useEffect, ChangeEvent } from "react";
import { emitter } from "../../util/event";
import { FormSubmit, InputChange } from "../../types/event";
import { user_service } from "../../service/user.service";
import { createFormData } from "../../util/form";
import { AxiosError } from "../../error/error";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { User, UserComponent } from "../../types/user";
import { userAction } from "../../redux/actions/userAction";
import { socketClient } from "../../util/socket";
import {
  friendReqeustHandle,
  friendRequest,
} from "../../redux/reducer/friendReducer";
import { friendAction } from "../../redux/actions/friendAction";
import { keyboard } from "@testing-library/user-event/dist/keyboard";

interface ComponentProps {
  type: string;
}

interface RequestFriendProps {
  receiver: User;
  sender: User;
  response?: boolean;
}

// 친구요청 보낸 친구들 리스트
export const RequestFriendLi = ({ receiver, sender }: RequestFriendProps) => {
  let dispatch = useDispatch<AppDispatch>();

  const handleRequestFriend = async (response: boolean) => {
    try {
      let formdata = createFormData({
        receiver,
        sender,
        response,
      });
      dispatch(friendAction.requestFriendHandle(formdata));
    } catch (err) {
      alert(err);
    }
  };

  return (
    <li className="pwf_req_friend_li">
      <div className="pwf_req_friend_info">
        <span className="pwf_req_friend_img">
          <img src={sender.profile_img} />
        </span>
        <span>{sender.nickname} </span>
      </div>
      <div className="pwf_req_friend_btn_box">
        <button
          className="friend_req_accept"
          onClick={() => handleRequestFriend(true)}
        >
          수락
        </button>
        <button
          className="friend_req_refuse"
          onClick={() => handleRequestFriend(false)}
        >
          거절
        </button>
      </div>
    </li>
  );
};

// 친구 관련 모달
export const Friend = ({ type }: ComponentProps) => {
  let dispatch = useDispatch<AppDispatch>();
  let user = useSelector((state: RootState) => state.user);
  let { request_friends } = useSelector((state: RootState) => state.friend);

  let [error, setError] = useState<{ state: boolean; msg: string }>({
    state: false,
    msg: "",
  });
  let [nickname, setNickname] = useState<string>("");

  function resetModal() {
    setNickname("");
    setError((c) => ({ ...c, state: false }));
    emitter.emit("modal", { type });
  }

  // 친구요청
  const requestFriend = async (e: FormSubmit) => {
    e.preventDefault();

    try {
      let formdata = createFormData({
        res_nickname: nickname,
        req_user: JSON.stringify(user),
      });
      let res = await user_service.requestFriend(formdata);
      alert(`${nickname}에게 친구요청이 전송되었습니다`);
      setNickname("");
    } catch (err) {
      let { msg } = AxiosError(err);
      // msg = !msg ? "친구이거나 중복된 친구요청입니다." : msg;
      setError((c) => ({ ...c, state: true, msg }));
    }
  };

  useEffect(() => {
    socketClient.on("friend_request", (data) => dispatch(friendRequest(data)));
    socketClient.on("friend_request_handle", (data) =>
      dispatch(friendReqeustHandle(data))
    );

    return () => {
      socketClient.off("friend_request", (data) =>
        dispatch(friendRequest(data))
      );
      socketClient.off("friend_request_handle", (data) =>
        dispatch(friendReqeustHandle(data))
      );
    };
  }, []);

  return (
    <div
      className="pwf_friend_modal"
      style={{ display: type == "friend" ? "flex" : "none" }}
    >
      <header className="modal_header">
        <button onClick={resetModal}>X</button>
      </header>
      <div className="friend_content">
        {/* 친추요청 검색 */}
        <div className="friend_search_box">
          <form className="friend_search_form" onSubmit={requestFriend}>
            <input
              type="text"
              style={{
                border: `1px solid var(--pwf-${error.state ? "red" : "gray"})`,
              }}
              value={nickname}
              onChange={(e: InputChange) => {
                setNickname(e.target.value);
                setError((c) => ({ ...c, state: false }));
              }}
              placeholder="친구요청 닉네임"
              spellCheck={false}
              className="friend_search_input"
            />
          </form>
          <span
            className="friend_search_error"
            style={{ display: error.state ? "flex" : "none" }}
          >
            {error.msg}
          </span>
        </div>
        {/* 친추 리스트 */}
        <div className="friend_request_box">
          <label>친구요청</label>
          <ul className="request_friends">
            {Object.entries(request_friends).length ? (
              Object.entries(request_friends).map(([key, value]) => (
                <RequestFriendLi receiver={user} sender={value} />
              ))
            ) : (
              <p>친구요청이 없습니다.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
