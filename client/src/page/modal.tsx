import "../css/modal/modal.css";
import { useEffect, useState } from "react";
import { emitter } from "../util/event";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

// modal component
import { Friend } from "../components/modal/friend";
import { StreamRoom } from "../components/modal/streamRoom";
import { PwFind } from "../components/modal/pwFind";
import { Delete } from "../components/modal/delete";

export type ModalList =
  | "friend"
  | "invitation"
  | "stream"
  | "password"
  | "delete"
  | "authcode";

export const Modal = () => {
  let user = useSelector((state: RootState) => state.user);
  let [open, setOpen] = useState<boolean>(false);
  let [content, setContent] = useState<ModalList>("authcode");

  // modal control
  useEffect(() => {
    const handler = ({
      type,
      open = false,
    }: {
      type: ModalList;
      open?: boolean;
    }) => {
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
        <Friend type={content} />
        <StreamRoom user={user} type={content} />
        <Delete user={user} type={content} />
      </div>
    </div>
  );
};
