import {
  LocalAudioTrack,
  LocalVideoTrack,
  RemoteAudioTrack,
  RemoteVideoTrack,
} from "livekit-client";

export interface TrackProps {
  active?: boolean;
  state: boolean;
  track?:
    | RemoteAudioTrack
    | RemoteVideoTrack
    | LocalAudioTrack
    | LocalVideoTrack;
  id?: string;
}

export interface UserTrackProps {
  [nickname: string]: { audio: TrackProps; video: TrackProps };
}

export type LocalTrackProps = LocalAudioTrack | LocalVideoTrack;
export type RemoteTrackProps = RemoteAudioTrack | RemoteVideoTrack;
