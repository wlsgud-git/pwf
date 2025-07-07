import "../../css/room/stream.css";

import React, { useEffect, useRef, useState } from "react";
import {
  RemoteParticipant,
  createLocalScreenTracks,
  LocalAudioTrack,
  LocalVideoTrack,
  RemoteAudioTrack,
  RemoteVideoTrack,
  Track,
  TrackPublication,
  createLocalAudioTrack,
  createLocalVideoTrack,
  attachToElement,
} from "livekit-client";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { emitter } from "../../util/event";
import { StreamContext, useSetStream } from "../../context/stream.context";
import {
  getMyMedia,
  getShareMedia,
  getStream,
  getTrack,
} from "../../util/stream";
import { TrackProps, UserTrackProps } from "../../types/stream.types";
import { useContextSelector } from "use-context-selector";

interface ParticipantProps {
  nickname: string;
  trackInfo: TrackProps;
}

const ParticipantVideo = React.memo(
  ({ nickname, trackInfo }: ParticipantProps) => {
    let videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
      if (!videoRef.current) return;
      trackInfo.audio_track?.attach(videoRef.current);
      trackInfo.video_track?.attach(videoRef.current);
    }, [trackInfo.audio_track, trackInfo.video_track]);
    return (
      <div className="participant_track_box">
        <video ref={videoRef} autoPlay></video>
        <div className="participant_infomation">
          <span>
            <i
              className={`fa-solid fa-microphone${
                trackInfo.audio_state ? "" : "-slash"
              }`}
            ></i>
          </span>
          <span>
            <i
              className={`fa-solid fa-video${
                trackInfo.video_state ? "" : "-slash"
              }`}
            ></i>
          </span>
          <span>{nickname}</span>
        </div>
      </div>
    );
  }
);

export const Stream = () => {
  let user = useSelector((state: RootState) => state.user);
  let room = useContextSelector(StreamContext, (ctx) => ctx.room);
  let participants = useContextSelector(
    StreamContext,
    (ctx) => ctx.participants
  );
  let { setParticipants } = useSetStream();

  // 참가자 참가
  let joinParticipant = (who: string) =>
    setParticipants((c: UserTrackProps) => ({ ...c, [who]: {} }));

  // 룸이 연결되었으면 내트랙과 이벤트 설정
  useEffect(() => {
    if (!room) return;

    let start = async () => {
      await setMyTracks();
      let devices = await getMyMedia();

      await devices?.map((val) => {
        if (val.kind == "videoinput")
          setDevices((c) => ({
            ...c,
            video: [...c["video"], { id: val.deviceId, label: val.label }],
          }));
        else if (val.kind == "audioinput")
          setDevices((c) => ({
            ...c,
            audio: [...c["audio"], { id: val.deviceId, label: val.label }],
          }));
      });

      // 새 참가자 관련
      room.on("participantConnected", (participant: RemoteParticipant) => {
        let identity = participant.identity;
        joinParticipant(identity);
        participant.on("trackMuted", (track) =>
          changeTrackState(identity, track, false)
        );
        participant.on("trackUnmuted", (track) =>
          changeTrackState(identity, track, true)
        );
      });
      //   // 기준 참가자 관련
      room.remoteParticipants.forEach((participant: RemoteParticipant) => {
        let identity = participant.identity;
        joinParticipant(identity);

        participant.trackPublications.forEach((pub: TrackPublication) => {
          if (pub.isSubscribed && pub.track)
            setParticipantTrack(identity, pub.track);
          if (pub.source == "screen_share" && shareVideoRef.current) {
            shareState(pub.track as Track, true, identity);
          }
        });
        participant.on("trackMuted", (track) =>
          changeTrackState(identity, track, false)
        );
        participant.on("trackUnmuted", (track) =>
          changeTrackState(identity, track, false)
        );
      });

      // 구독시작
      room.on(
        "trackSubscribed",
        (
          track: Track,
          pub: TrackPublication,
          participant: RemoteParticipant
        ) => {
          console.log("소스:", pub.source);
          if (pub.isSubscribed && pub.track)
            setParticipantTrack(participant.identity, track);
          if (pub.source == "screen_share" && shareVideoRef.current)
            shareState(pub.track as Track, true, participant.identity);
        }
      );

      // 구독종료
      room.on(
        "trackUnsubscribed",
        (
          track: Track,
          pub: TrackPublication,
          participant: RemoteParticipant
        ) => {
          if (pub.source == "screen_share" && shareVideoRef.current)
            shareState(pub.track as Track, false, participant.identity);
        }
      );
    };
    start();
  }, [room]);

  // 트랙 --------------------------------------
  let localRef = useRef<HTMLVideoElement | null>(null);
  let videoTrack = useRef<LocalVideoTrack | null>(null);
  let audioTrack = useRef<LocalAudioTrack | null>(null);

  let [audio, setAudio] = useState<boolean>(true);
  let [video, setVideo] = useState<boolean>(true);

  let trackboxRef = useRef<HTMLDivElement | null>(null);
  let [track, setTrack] = useState<{ video: any; audio: any }>({
    video: "",
    audio: "",
  });

  let [devices, setDevices] = useState<{
    show: boolean;
    video: { id: string; label: string }[];
    audio: { id: string; label: string }[];
  }>({
    show: false,
    video: [],
    audio: [],
  });

  // 내 트랙 설정
  const setMyTracks = async () => {
    try {
      const tracks = await getStream(audio, video);
      videoTrack.current = getTrack(tracks!, "video") as LocalVideoTrack;
      audioTrack.current = getTrack(tracks!, "audio") as LocalAudioTrack;
      if (videoTrack.current && localRef.current) {
        await room.localParticipant.publishTrack(videoTrack.current);
        videoTrack.current.attach(localRef.current);
        setTrack((c) => ({
          ...c,
          video: videoTrack.current?.mediaStreamTrack.getSettings().deviceId,
        }));
      }
      if (audioTrack.current && localRef.current) {
        await room.localParticipant.publishTrack(audioTrack.current);
        audioTrack.current.attach(localRef.current);
        setTrack((c) => ({
          ...c,
          audio: audioTrack.current?.mediaStreamTrack.getSettings().deviceId,
        }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 내 트랙변경
  const switchTrack = async (type: "audio" | "video", deviceId: string) => {
    if (!room) return;
    try {
      const localParticipant = room.localParticipant;
      let source =
        type == "audio" ? Track.Source.Microphone : Track.Source.Camera;
      const track = localParticipant.getTrackPublication(source).track;

      if (track) {
        localParticipant.unpublishTrack(track);
        track?.stop();
        // videoTrack.current;
      }

      // 오디오 변경
      if (type == "audio") {
        let newTrack = await createLocalAudioTrack({ deviceId });
        await localParticipant.publishTrack(newTrack, { source });
        setTrack((c) => ({ ...c, audio: deviceId }));
        audioTrack.current = newTrack;
        audioTrack.current?.attach(localRef.current!);
      }
      // 비디오 변경
      else {
        let newTrack = await createLocalVideoTrack({ deviceId });
        await localParticipant.publishTrack(newTrack, { source });
        setTrack((c) => ({ ...c, video: deviceId }));
        videoTrack.current = newTrack;
        videoTrack.current?.attach(localRef.current!);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 트랙 상태 변경
  const toggleTrack = (type: "audio" | "video") => {
    if (!localRef.current) return;
    if (type == "video") {
      if (!videoTrack.current) return;

      video ? videoTrack.current.mute() : videoTrack.current.unmute();
      setVideo((c) => !c);
    } else {
      if (!audioTrack.current) return;

      audio ? audioTrack.current.mute() : audioTrack.current.unmute();
      setAudio((c) => !c);
    }
  };

  // 다른 참가자 트랙관련 ------
  let setParticipantTrack = (who: string, track: Track) => {
    track.kind == "video"
      ? setParticipants((c: UserTrackProps) => ({
          ...c,
          [who]: {
            ...c[who],
            video_state: true,
            video_track: track as RemoteVideoTrack,
          },
        }))
      : setParticipants((c: UserTrackProps) => ({
          ...c,
          [who]: {
            ...c[who],
            audio_state: true,
            audio_track: track as RemoteAudioTrack,
          },
        }));
  };

  // 유저 트랙상태 변경
  let changeTrackState = (
    who: string,
    track: TrackPublication,
    state: boolean
  ) => {
    setParticipants((c: UserTrackProps) => ({
      ...c,
      [who]: {
        ...c[who],
        video_state: track.kind == "video" ? state : c[who].video_state,
        audio_state: track.kind == "audio" ? state : c[who].audio_state,
      },
    }));
  };

  useEffect(() => {
    if (devices.show) trackboxRef.current?.focus();
  }, [devices]);

  // 화면 공유 ------------------------------
  const [share, setShare] = useState<{ nickname: string; state: boolean }>({
    nickname: "",
    state: false,
  });

  let shareVideoRef = useRef<HTMLVideoElement | null>(null);

  const shareState = (track: Track, state: boolean, nickname?: string) => {
    shareVideoRef.current && state
      ? track.attach(shareVideoRef.current)
      : track.stop();
    setShare((c: any) => ({ ...c, nickname, state }));
  };

  const ScreenShareControl = async () => {
    if (!room) return;
    if (share.state) {
      alert("다른 참가자가 화면 공유 중입니다.");
      return;
    }

    try {
      let [track] = await createLocalScreenTracks();

      if (shareVideoRef.current) {
        await room.localParticipant.publishTrack(track!);
        shareState(track, true, user.nickname!);
      }

      track.mediaStreamTrack.onended = () => {
        room.localParticipant.unpublishTrack(track);
        shareState(track, false, "");
      };
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="pwf-stream_container">
      {/* 참가자들 화면 부분들 */}
      <div className="pwf-stream_screen_section">
        {/* 참가자 화면 리스트 */}
        <ul
          className="participant_stream_container"
          style={{ flexDirection: share.state ? "row" : "column" }}
        >
          {/* 내 비디오 */}
          <div className="participant_track_box">
            <video ref={localRef} autoPlay></video>
            <div className="participant_infomation">
              <span>
                <i
                  className={`fa-solid fa-microphone${audio ? "" : "-slash"}`}
                ></i>
              </span>
              <span>
                <i className={`fa-solid fa-video${video ? "" : "-slash"}`}></i>
              </span>
              <span>{user.nickname}</span>
            </div>
          </div>

          {Object.entries(participants as UserTrackProps).map(
            ([nickname, value]) => (
              <ParticipantVideo nickname={nickname} trackInfo={value} />
            )
          )}
        </ul>
        {/* 공유 화면 */}
        <div
          className="share_stream_container"
          style={{ display: share.state ? "flex" : "none" }}
        >
          <div className="share_screen_box">
            <video ref={shareVideoRef} autoPlay></video>
            <span className="share_user">{share.nickname}</span>
          </div>
        </div>
      </div>
      {/* 풋터 */}
      <footer className="pwf-stream_footer">
        {/* 오디오 */}
        <button title="오디오" onClick={() => toggleTrack("audio")}>
          <i className={`fa-solid fa-microphone${audio ? "" : "-slash"}`}></i>
          <span>오디오</span>
        </button>
        {/* 비디오 */}
        <button title="비디오" onClick={() => toggleTrack("video")}>
          <i className={`fa-solid fa-video${video ? "" : "-slash"}`}></i>
          <span>비디오</span>
        </button>
        {/* 방에 친구초대 */}
        <button title="초대">
          <i className="fa-solid fa-user-plus"></i>
          <span>초대</span>
        </button>
        {/* 화면공유 */}
        <button title="화면공유" onClick={ScreenShareControl}>
          <i className="fa-brands fa-creative-commons-share"></i>
          <span>화면공유</span>
        </button>
        {/* 내 미디어 변경 */}
        <div className="my_media_container">
          <div
            tabIndex={0}
            style={{ display: devices.show ? "flex" : "none" }}
            ref={trackboxRef}
            onBlur={() => setDevices((c) => ({ ...c, show: false }))}
            className="my_media_box"
          >
            {/* 내 비디오 */}
            <label>
              <i className="fa-solid fa-video"></i>
              비디오
            </label>
            {devices.video.map((val) => (
              <li
                key={val.id}
                id={val.id}
                title={val.label}
                onMouseDown={() => switchTrack("video", val.id)}
              >
                {track.video == val.id && <i className="fa-solid fa-check"></i>}
                {val.label}
              </li>
            ))}
            {/* 내 오디오 */}
            <label>
              <i className="fa-solid fa-microphone"></i>
              오디오
            </label>
            {devices.audio.map((val) => (
              <li
                key={val.id}
                id={val.id}
                title={val.label}
                onMouseDown={() => switchTrack("audio", val.id)}
              >
                {track.audio == val.id && <i className="fa-solid fa-check"></i>}
                {val.label}
              </li>
            ))}
          </div>
          <button
            title="내 미디어"
            onClick={() => setDevices((c) => ({ ...c, show: true }))}
          >
            <i className="fa-solid fa-desktop"></i>
            <span>내미디어</span>
          </button>
        </div>
        {/* 채팅 */}
        <button
          title="채팅"
          onClick={() => emitter.emit("menu", { state: true, type: "chat" })}
        >
          <i className="fa-solid fa-comments"></i>
          <span>채팅</span>
        </button>
        {/* 참가자 */}
        <button title="참가자">
          <i className="fa-solid fa-user"></i>
          <span>참가자</span>
        </button>

        {/* 방 나가기 */}
        <button className="room_exit" title="방 나가기">
          <i className="fa-solid fa-right-from-bracket"></i>
        </button>
      </footer>
    </div>
  );
};
