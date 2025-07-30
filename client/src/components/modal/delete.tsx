import "../../css/modal/delete.css";

import { emitter } from "../../util/event";

import { User } from "../../types/user";
import { useLocation } from "react-router-dom";
import { user_service } from "../../service/user.service";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export const Delete = () => {
  let email = useSelector((state: RootState) => state.user.email);
  let navigate = useLocation();
  let reset = () => {
    // emitter.emit("modal", { type });
  };

  let deleteUser = async () => {
    try {
      await user_service.deleteUser(email!);
      reset();
      alert("계정이 삭제되었습니다.");
      //   navigate("/login");
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="delete_modal">
      <header className="modal_header">
        <button onClick={reset}>X</button>
      </header>

      <div className="delete_box">
        <span>{email} 계정을 삭제하시겠습니까?</span>
        <button onClick={deleteUser}>삭제</button>
      </div>
    </div>
  );
};
