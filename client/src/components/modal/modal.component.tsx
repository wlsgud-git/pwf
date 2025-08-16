import { useSelector } from "react-redux";
import * as SMO from "../../css/modal/modal.style";
import { AppDispatch, RootState } from "../../redux/store";
import { useDispatch } from "react-redux";
import { Friend } from "./friend";
import { modalState } from "../../redux/reducer/modalReducer";
import { Delete } from "./delete";
import { StreamRoom } from "./streamRoom";
import { useEffect, useState } from "react";
import { Authcode } from "./authcode";
import { PwFind } from "./pwFind";
import { emitter } from "../../util/event";
import { Invitation } from "./invitation";

export const Modal = () => {
  let dispatch = useDispatch<AppDispatch>();
  let { active, type } = useSelector((state: RootState) => state.modal!);
  let email = useSelector((state: RootState) => state.modal.email);

  return (
    <SMO.ModalBackground active={active!}>
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
        ) : type == "password" ? (
          <PwFind email={email!} />
        ) : type == "authcode" ? (
          <Authcode email={email!} />
        ) : type == "invite" ? (
          <Invitation />
        ) : (
          ""
        )}
      </SMO.ModalContent>
    </SMO.ModalBackground>
  );
};
