// import { Room } from "livekit-client";
import React, { ReactNode, useContext, useMemo, useState } from "react";
import { TrackProps, UserTrackProps } from "../types/stream.types";
import { createContext } from "use-context-selector";

import { Room } from "../types/room";

export let StreamContext = createContext<any>(undefined);
let SetStreamContext = React.createContext<any>(undefined);

export const StreamProvider = ({ children }: { children: ReactNode }) => {
  const [roomInfo, setRoomInfo] = useState<Room | null>(null);
  const [room, setRoom] = useState<any>(null);
  const [participants, setParticipants] = useState<UserTrackProps>({});

  let value = useMemo(
    () => ({
      room,
      participants,
      roomInfo,
    }),
    [room, participants, roomInfo]
  );

  let setvalue = useMemo(
    () => ({
      setRoom,
      setParticipants,
      setRoomInfo,
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

export let useSetStream = () => {
  const context = useContext(SetStreamContext);
  if (context === undefined) throw new Error("value가 없다고");
  return context;
};
