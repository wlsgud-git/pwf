import "../../css/modal/delete.css";

import { emitter } from "../../util/event";

import { User } from "../../types/user";
import { ModalList } from "../../page/modal";
import { useLocation } from "react-router-dom";
import { user_service } from "../../service/user.service";

interface DeleteProps {
  user: User;
  type: ModalList;
}

export const Delete = ({ user, type }: DeleteProps) => {
  let navigate = useLocation();
  let reset = () => {
    emitter.emit("modal", { type });
  };

  let deleteUser = async () => {
    try {
      await user_service.deleteUser(user.email!);
      reset();
      alert("계정이 삭제되었습니다.");
      //   navigate("/login");
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div
      className="delete_modal"
      style={{ display: type == "delete" ? "flex" : "none" }}
    >
      <header className="modal_header">
        <button onClick={reset}>X</button>
      </header>

      <div className="delete_box">
        <span>{user.email} 계정을 삭제하시겠습니까?</span>
        <button onClick={deleteUser}>삭제</button>
      </div>
    </div>
  );
};
