import "../css/modal.css";
import { useEffect, useState } from "react";
import { emitter } from "../util/event";
import { useSelector } from "react-redux";
import { RootState } from "../context/store";

// modal component
import { FriendModal } from "../components/modal/friend";
import { StreamModal } from "../components/modal/streamRoom";
import { ProfileModal } from "../components/modal/profile";

export const Modal = () => {
  let user = useSelector((state: RootState) => state.user);
  let [open, setOpen] = useState<boolean>(false);
  let [content, setContent] = useState<string>("");

  useEffect(() => {
    const handler = (type: string) => {
      setOpen(true);
      setContent(type);
    };

    emitter.on("modal", handler);

    return () => {
      emitter.off("modal", handler);
    };
  }, []);

  //   useEffect(() => {
  //     console.log(content);
  //   }, [content]);

  return (
    <div className="modal_box" style={{ display: open ? "flex" : "none" }}>
      <div className="modal_content">
        {/* 모달 헤더부분 */}
        <header className="modal_header">
          <button onClick={() => setOpen(false)}>X</button>
        </header>
        {/* 모달 콘텐츠 부분 */}
        <FriendModal user={user} type={content} />
        <StreamModal user={user} type={content} />
        <ProfileModal user={user} type={content} />
      </div>
    </div>
  );
};
