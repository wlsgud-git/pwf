import { useSelector } from "react-redux";
import * as SMO from "../../css/modal/modal.style";
import { AppDispatch, RootState } from "../../redux/store";
import { useDispatch } from "react-redux";
import { Friend } from "./friend";
import { modalState } from "../../redux/reducer/modalReducer";
import { Delete } from "./delete";
import { StreamRoom } from "./streamRoom";
import { useEffect } from "react";

export const Modal = () => {
  let dispatch = useDispatch<AppDispatch>();
  let { active, type } = useSelector((state: RootState) => state.modal);

  useEffect(() => {
    console.log(active, type);
  }, [active, type]);

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
        {type == "friend" ? (
          <Friend />
        ) : type == "stream" ? (
          <StreamRoom />
        ) : type == "delete" ? (
          <Delete />
        ) : (
          ""
        )}
      </SMO.ModalContent>
    </SMO.ModalBackground>
  );
};
