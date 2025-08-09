import { useNavigate } from "react-router-dom";
import { user_service } from "../../service/user.service";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

import * as SDEL from "../../css/modal/delete.style";

export const Delete = () => {
  let email = useSelector((state: RootState) => state.user.email);
  let navigate = useNavigate();

  let deleteUser = async () => {
    try {
      await user_service.deleteUser(email!);
      alert("계정이 삭제되었습니다.");
      navigate("/login");
    } catch (err) {
      alert(err);
    }
  };

  return (
    <>
      <SDEL.DelGlobal />
      <SDEL.DeleteBox>
        <span>{email} 계정을 삭제하시겠습니까?</span>
        <SDEL.DeleteBtn onClick={deleteUser}>삭제</SDEL.DeleteBtn>
      </SDEL.DeleteBox>
    </>
  );
};
