import "../css/profile.css";

import { PageHeader } from "../components/pageHeader";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { emitter } from "../util/event";
import { useEffect, useRef, useState } from "react";
import { InputChange } from "../types/event";
import { PwFind } from "../components/modal/pwFind";
import { nicknameValidate } from "../validation/auth";
import { AxiosError } from "../error/error";
import { user_service } from "../service/user.service";
import { createFormData } from "../util/form";
import { auth_service } from "../service/auth.service";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetAllstate } from "../redux/actions/root.action";
import { socketClient } from "../util/socket";
import { changeProfileImg } from "../redux/reducer/userReducer";

export const Profile = () => {
  let dispatch = useDispatch<AppDispatch>();
  let navigate = useNavigate();
  let user = useSelector((state: RootState) => state.user);

  // state
  let [show, setShow] = useState<boolean>(false);

  const showingModal = () => {
    emitter.emit("modal", { type: "password", open: true });
    setShow(true);
  };

  // 프로필 이미지 관련 -----------------------
  let [profileSrc, setProfileSrc] = useState<any>("");
  let profileFileRef = useRef<HTMLInputElement | null>(null);
  // 프로필 미리보기
  let profilePreview = async (e: InputChange) => {
    let file = e.target.files;
    let file_value;

    if (file && file.length > 0) file_value = file[0];
    if (!file_value?.type.startsWith("image/")) {
      alert("이미지만 업로드 가능합니다.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileSrc(reader.result);
    };
    reader.readAsDataURL(file_value);
  };

  useEffect(() => {
    setProfileSrc(user.profile_img!);
  }, [user]);

  const updateProfileImg = async () => {
    if (!profileFileRef.current?.files?.[0]) return;
    let formData = createFormData({
      id: user.id,
      profile_img: profileFileRef.current.files[0],
      key: user.img_key,
    });
    try {
      let newData = await user_service.changeProfileImg(formData);
      dispatch(changeProfileImg(newData));
    } catch (err) {
      console.log(err);
    }
  };

  // 닉네임 관련
  let [nickname, setNickname] = useState<{
    value: string;
    error: boolean;
    error_msg: string;
  }>({
    value: "",
    error: false,
    error_msg: "",
  });

  const updateNickname = async () => {
    if (nickname.value == user.nickname)
      throw { msg: "같은 이름으로 변경할 수 없습니다." };
    try {
      await nicknameValidate(nickname.value);
      let formData = createFormData({ id: user.id, nickname: nickname.value });
      let { msg } = await user_service.changeNickname(formData);
      alert(msg);
      await auth_service.logout();
      dispatch(resetAllstate());
      socketClient.disconnect();
      navigate("/login");
    } catch (err) {
      let { msg } = AxiosError(err);
      setNickname((c) => ({ ...c, error: true, error_msg: msg }));
    }
  };

  return (
    <div className="page profile_page">
      {/* header */}
      <PageHeader />

      <PwFind email={user.email!} show={show} setshow={setShow} />

      {/* content */}
      <div className="profile_content_container">
        {/* 이메일 */}
        <div className="profile_infobox">
          <label htmlFor="email" className="profile_label">
            이메일
          </label>
          <div className="profile_content_box">
            <div className="profile_content">
              <span>이메일</span>
              <div className="profile_content_inputbox">
                <input type="text" value={user?.email} />
              </div>
            </div>
            <div className="profile_content_footer">
              <button disabled style={{ cursor: "not-allowed" }}>
                변경하기
              </button>
            </div>
          </div>
        </div>
        {/* 프로필 */}
        <div className="profile_infobox">
          <label htmlFor="email" className="profile_label">
            프로필
          </label>
          <div className="profile_content_box">
            <div className="profile_content">
              <span>프로필</span>
              <div className="profile_content_inputbox">
                <span className="profile_img_box">
                  <img src={profileSrc} />
                </span>
                <input
                  type="file"
                  ref={profileFileRef}
                  accept="image/png, image/jpeg"
                  style={{ display: "none" }}
                  onChange={profilePreview}
                />
                <input
                  type="button"
                  value="사진선택"
                  onClick={() => profileFileRef.current?.click()}
                />
              </div>
            </div>
            <div className="profile_content_footer">
              <button onClick={updateProfileImg}>변경하기</button>
            </div>
          </div>
        </div>
        {/* 닉네임 */}
        <div className="profile_infobox">
          <label htmlFor="email" className="profile_label">
            닉네임
          </label>
          <div className="profile_content_box">
            <div className="profile_content">
              <span>닉네임 (변경 후 로그인페이지로 이동합니다.) </span>
              <div className="profile_content_inputbox profile_content_nick">
                <input
                  type="text"
                  style={{
                    border: `1px solid var(--pwf-${
                      nickname.error ? "red" : "white"
                    })`,
                  }}
                  placeholder={user.nickname}
                  value={nickname.value}
                  onChange={(e: InputChange) =>
                    setNickname((c) => ({ ...c, value: e.target.value }))
                  }
                />
                <p className="profile_nick_error">{nickname.error_msg}</p>
              </div>
            </div>
            <div className="profile_content_footer">
              <button onClick={updateNickname}>변경하기</button>
            </div>
          </div>
        </div>

        <div className="profile_side_box pw_change_alert">
          <div>
            비밀번호는 도난방지, 보안설정을 위하여 3개월~6개월 사이에 주기적으로
            변경하는 것이 안전합니다.
          </div>
          <button onClick={showingModal}>비밀번호 변경</button>
        </div>
        <div className="profile_side_box account_delete_alert">
          <div>회원 탈퇴시 기존 결제 및 정보는 모두 없어지게 됩니다.</div>
          <button>회원 탈퇴</button>
        </div>
      </div>
    </div>
  );
};
