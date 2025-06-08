import "../css/modal/modal.css";
import { useEffect, useState } from "react";
import { emitter } from "../util/event";
import { useSelector } from "react-redux";
import { RootState } from "../context/store";

// modal component
import { Friend } from "../components/modal/friend";
import { StreamRoom } from "../components/modal/streamRoom";
import { Profile } from "../components/modal/profile";
import { Invitation } from "../components/modal/invitaion";

export type ModalList =
  | "friend"
  | "profile"
  | "invitation"
  | "stream"
  | "password";

export const Modal = () => {
  let user = useSelector((state: RootState) => state.user);
  let [open, setOpen] = useState<boolean>(false);
  let [content, setContent] = useState<ModalList>("friend");

  // modal control
  useEffect(() => {
    const handler = ({
      type,
      open = false,
    }: {
      type: ModalList;
      open?: boolean;
    }) => {
      console.log("modal hi");
      setOpen(open);
      setContent(type);
    };

    emitter.on("modal", handler);

    return () => {
      emitter.off("modal", handler);
    };
  }, []);

  return (
    <div className="modal_box" style={{ display: open ? "flex" : "none" }}>
      <div className="modal_content">
        {/* 모달 콘텐츠 부분 */}
        <Friend user={user} type={content} />
        <StreamRoom user={user} type={content} />
        <Profile user={user} type={content} />
        <Invitation user={user} type={content} />
      </div>
    </div>
  );
};
