import { useSelector } from "react-redux";
import * as SMO from "../../css/modal/modal.style";
import { AppDispatch, RootState } from "../../redux/store";
import { useDispatch } from "react-redux";
import { Friend } from "./friend";
import { modalState } from "../../redux/reducer/modalReducer";
import { Delete } from "./delete";

interface ModalProps {
  Component: React.ComponentType<any>;
}

export const Modal = () => {
  let dispatch = useDispatch<AppDispatch>();
  let { active, type } = useSelector((state: RootState) => state.modal);

  return (
    <SMO.ModalBackground active={active}>
      <SMO.ModalContent>
        <SMO.ModalContentHeader>
          <SMO.ModalCloseBtn
            onClick={() => dispatch(modalState({ active: false, type: null }))}
          >
            X
          </SMO.ModalCloseBtn>
        </SMO.ModalContentHeader>
        {type == "friend" ? <Friend /> : type == "delete" ? <Delete /> : ""}
      </SMO.ModalContent>
    </SMO.ModalBackground>
  );
};
