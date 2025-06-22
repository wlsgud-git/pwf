import "../css/profile.css";

import { PageHeader } from "../components/pageHeader";
import { useSelector } from "react-redux";
import { RootState } from "../context/store";
import { emitter } from "../util/event";
import { useEffect, useRef, useState } from "react";
import { InputChange } from "../types/event";
import { PwFind } from "../components/modal/pwFind";

export const Profile = () => {
  let user = useSelector((state: RootState) => state.user);

  // ref
  let profileFileRef = useRef<HTMLInputElement | null>(null);

  // state
  let [profileSrc, setProfileSrc] = useState<any>("");
  let [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    setProfileSrc(user.profile_img!);
  }, [user]);

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

  const showingModal = () => {
    emitter.emit("modal", { type: "password", open: true });
    setShow(true);
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
              <button>변경하기</button>
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
              <span>닉네임</span>
              <div className="profile_content_inputbox">
                <input type="text" placeholder={user.nickname} />
              </div>
            </div>
            <div className="profile_content_footer">
              <button>변경하기</button>
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
