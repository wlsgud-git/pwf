import {
  Track,
  Room,
  RemoteParticipant,
  RemoteTrackPublication,
  createLocalTracks,
  LocalVideoTrack,
  LocalTrack,
  LocalAudioTrack,
  createLocalScreenTracks,
} from "livekit-client";

// 방 연결
export let connectRoom = async (token: string) => {
  try {
    const room = await new Room();
    await room.connect("http://localhost:7880", token);
    return room;
  } catch (err) {
    throw err;
  }
};

// 유저 스트림 가져오기
export let getStream = async (audio: boolean, video: boolean) => {
  try {
    const tracks = await createLocalTracks({ audio, video });
    return tracks;
  } catch (err) {
    console.log(err);
  }
};

// 트랙 스트림 가져오기
export let getMediaStream = (tracks: LocalTrack<Track.Kind>[]) =>
  new MediaStream(tracks.map((track) => track.mediaStreamTrack));

// 비디오 / 오디오 트랙 가져오기
export let getTrack = (
  tracks: LocalTrack<Track.Kind>[],
  type: "video" | "audio"
) => tracks.find((t) => t.kind == type);

// 내 관련 미디어 가져오기
export let getMyMedia = async () => {
  try {
    let devices = await navigator.mediaDevices.enumerateDevices();
    return devices;
  } catch (err) {
    console.log(err);
  }
};

// 화면 공유 미디어 가져오기
export let getShareMedia = async () => {
  try {
    let devices = await createLocalScreenTracks();
    return devices;
  } catch (err) {
    console.log(err);
  }
};
