import { User } from "./user";

export interface Room {
  id?: number | undefined;
  room_name?: string | undefined;
  participants?: User[] | number[];
  create_at?: Date;
}

export interface PeerConnects {
  [nickname: string]: {
    pc: RTCPeerConnection;
    channel: RTCDataChannel;
    stream: MediaStream;
    video?: boolean;
    audio?: boolean;
  };
}
