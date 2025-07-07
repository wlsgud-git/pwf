import {
  LocalAudioTrack,
  LocalVideoTrack,
  RemoteAudioTrack,
  RemoteVideoTrack,
} from "livekit-client";

export interface TrackProps {
  video_state?: boolean;
  audio_state?: boolean;
  video_track?: RemoteVideoTrack;
  audio_track?: RemoteAudioTrack;
  stream?: MediaStream;
}

export interface UserTrackProps {
  [nickname: string]: TrackProps;
}

export type LocalTrackProps = LocalAudioTrack | LocalVideoTrack;
export type RemoteTrackProps = RemoteAudioTrack | RemoteVideoTrack;
