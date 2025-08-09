// import { Room } from "livekit-client";
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";
import { TrackProps, UserTrackProps } from "../types/stream.types";
import { createContext, useContextSelector } from "use-context-selector";

interface StreamContext {
  room: any;
  participants: UserTrackProps;
}

interface SetStreamContext {
  setRoom: Dispatch<SetStateAction<any>>;
  setParticipants: Dispatch<SetStateAction<UserTrackProps>>;
}

let StreamContext = createContext<StreamContext | null>(null);
let SetStreamContext = createContext<SetStreamContext | null>(null);

export const StreamProvider = ({ children }: { children: ReactNode }) => {
  const [room, setRoom] = useState<any>(null);
  const [participants, setParticipants] = useState<UserTrackProps>({});

  let value = useMemo(
    () => ({
      room,
      participants,
    }),
    [room, participants]
  );

  let setvalue = useMemo(
    () => ({
      setRoom,
      setParticipants,
    }),
    []
  );

  return (
    <StreamContext.Provider value={value}>
      <SetStreamContext.Provider value={setvalue}>
        {children}
      </SetStreamContext.Provider>
    </StreamContext.Provider>
  );
};

export let useStream = () => {
  const ctx = useContextSelector(StreamContext, (ctx) => ctx);
  if (!ctx) throw new Error("value가 없다고");
  return ctx;
};

export let useSetStream = () => {
  const ctx = useContextSelector(SetStreamContext, (ctx) => ctx);
  if (!ctx) throw new Error("value가 없다고");
  return ctx;
};
