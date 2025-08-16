// css
import * as SHEAD from "../../css/views/header.style";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { socketClient } from "../../util/socket";
import { useDispatch } from "react-redux";
import { auth_service } from "../../service/auth.service";
import { resetAllstate } from "../../redux/actions/root.action";

export const PageHeader = () => {
  let navigate = useNavigate();
  let user = useSelector((state: RootState) => state.user);
  let request_friends = useSelector(
    (state: RootState) => state.friend.request_friends
  );
  let dispatch = useDispatch<AppDispatch>();
  let [userOption, setUserOption] = useState<boolean>(false);

  const logout = async () => {
    try {
      await auth_service.logout();
      dispatch(resetAllstate());
    } catch (err) {
      throw err;
    }
  };

  return (
    <>
      <SHEAD.HeaderGlobal />
      <SHEAD.Header>
        <SHEAD.HeaderLogo>
          <Link to="/" className="home_anchor">
            PWF {user.nickname}
          </Link>
        </SHEAD.HeaderLogo>

        {/* 유저 프로필 */}
        <SHEAD.HeaderUserBox>
          <SHEAD.HeaderUserBoxBtn
            onFocus={() => setUserOption(true)}
            onBlur={() => setUserOption(false)}
          >
            <SHEAD.HeaderUserImg src={user.profile_img} />
          </SHEAD.HeaderUserBoxBtn>

          <SHEAD.HeaderUserControlBox show={userOption}>
            <SHEAD.HeaderUserControlBtn
              onMouseDown={() => navigate(`/profile/${user.email}`)}
            >
              <i className="fa-solid fa-user"></i>
              <span>프로필</span>
            </SHEAD.HeaderUserControlBtn>
            <SHEAD.HeaderUserControlBtn onMouseDown={logout}>
              <i className="fa-solid fa-right-from-bracket"></i>
              <span>로그아웃</span>
            </SHEAD.HeaderUserControlBtn>
          </SHEAD.HeaderUserControlBox>
        </SHEAD.HeaderUserBox>
      </SHEAD.Header>
    </>
  );
};
