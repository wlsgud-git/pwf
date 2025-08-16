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
  Participant,
} from "livekit-client";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { emitter } from "../../util/event";
import { useSetStream, useStream } from "../../context/stream.context";
import { getMyMedia, getStream, getTrack } from "../../util/stream";
import {
  ParticipantTrack,
  TrackProps,
  UserTrackProps,
} from "../../types/stream.types";
import { useContextSelector } from "use-context-selector";
import { Invitation } from "../modal/invitation";
import { useNavigate } from "react-router-dom";

// css
import * as STR from "../../css/room/stream.style";
import * as STLI from "../../css/room/lists.style";
import { useDispatch } from "react-redux";
import { modalState } from "../../redux/reducer/modalReducer";

interface ParticipantProps {
  data: ParticipantTrack;
  share: boolean;
  size: { width: number; height: number };
}

interface PageProps {
  list: ParticipantTrack[];
  width: number;
  share: boolean;
}

const ParticipantPage = ({ list, width, share }: PageProps) => {
  let [size, setSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    let cut = Math.ceil(Math.sqrt(list.length));
    if (cut == 0) return;
    setSize((c) => ({
      ...c,
      width: share ? list.length : cut,
      height: share ? 1 : Math.ceil(list.length / cut),
    }));
  }, [list, share, width]);
  return (
    <STLI.Page width={width}>
      {list.map((val) => (
        <UserVideo data={val} share={share} size={size} />
      ))}
    </STLI.Page>
  );
};

const UserVideo = React.memo(({ data, share, size }: ParticipantProps) => {
  let videoRef = useRef<HTMLVideoElement | null>(null);
  let { participants } = useStream();

  useEffect(() => {
    if (!videoRef.current) return;
    data.audio.track?.attach(videoRef.current);
    data.video.track?.attach(videoRef.current);
  }, [data]);

  return (
    <>
      <STLI.UserVideoLi
        key={`video:${data.nickname!}`}
        active={data.audio.active!}
        share={share}
        width={size.width}
        height={size.height}
      >
        <STLI.UserVideo ref={videoRef} autoPlay></STLI.UserVideo>
        <STLI.UserNoVideoText video_state={data.video.state!}>
          {data.nickname}
        </STLI.UserNoVideoText>
        <STLI.UserInfoBox>
          <span>
            <i
              className={`fa-solid fa-microphone${
                data.audio.state ? "" : "-slash"
              }`}
            ></i>
          </span>
          <span>
            <i
              className={`fa-solid fa-video${data.video.state ? "" : "-slash"}`}
            ></i>
          </span>
          <span>{data.nickname}</span>
        </STLI.UserInfoBox>
      </STLI.UserVideoLi>
      ;
    </>
  );
});

export const Stream = () => {
  let navigate = useNavigate();

  let nickname = useSelector((state: RootState) => state.user.nickname);
  let { room, participants } = useStream();
  let { setParticipants } = useSetStream();

  // 참가자 참가
  let joinParticipant = (who: string) =>
    setParticipants((c) => ({
      ...c,
      [who]: { audio: {}, video: {} },
    }));

  let start = async () => {
    try {
      const tracks = await getStream(audio.state!, video.state!);

      setLocalTrack(getTrack(tracks!, "video") as Track, "video");
      setLocalTrack(getTrack(tracks!, "audio") as Track, "audio");

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
    } catch (err) {
      alert(err);
    }
  };

  // 다른 참가자 트랙관련 ------------------------------
  let setParticipantTrack = (who: string, track: Track) => {
    setParticipants((c: UserTrackProps) => ({
      ...c,
      [who]: {
        ...c[who],
        [track.kind == "audio" ? "audio" : "video"]: {
          ...c[who][track.kind == "audio" ? "audio" : "video"],
          state: true,
          active: false,
          track:
            track.kind == "audio"
              ? who == nickname
                ? (track as RemoteAudioTrack)
                : (track as LocalAudioTrack)
              : who == nickname
              ? (track as RemoteVideoTrack)
              : (track as LocalVideoTrack),
        },
      },
    }));
  };

  // 유저 트랙상태 변경
  let changeTrackState = (
    who: string,
    track: TrackPublication | LocalAudioTrack | LocalVideoTrack,
    state: boolean
  ) => {
    console.log(who, state);
    setParticipants((c: UserTrackProps) => ({
      ...c,
      [who]: {
        ...c[who],
        [track.kind == "audio" ? "audio" : "video"]: {
          ...c[who][track.kind == "audio" ? "audio" : "video"],
          state,
        },
      },
    }));
  };

  // 내 비디오 / 오디오 트랙세팅
  const setLocalTrack = async (track: Track, type: "audio" | "video") => {
    let source =
      type == "audio" ? Track.Source.Microphone : Track.Source.Camera;
    try {
      let id = track.mediaStreamTrack.getSettings().deviceId;
      await room.localParticipant.publishTrack(track, { source });

      let set_track =
        type == "audio"
          ? (track as LocalAudioTrack)
          : (track as LocalVideoTrack);

      type == "video"
        ? setVideo((c) => ({ ...c, track: set_track, id }))
        : setAudio((c) => ({ ...c, track: set_track, id }));

      setParticipantTrack(nickname!, track);
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
      }

      let newTrack =
        type == "audio"
          ? await createLocalAudioTrack({ deviceId })
          : await createLocalVideoTrack({ deviceId });

      setLocalTrack(newTrack, type);
    } catch (err) {
      console.log(err);
    }
  };

  // 트랙 상태 변경
  const toggleTrack = (type: "audio" | "video") => {
    let track: LocalAudioTrack | LocalVideoTrack;
    if (type == "audio") {
      track = participants[nickname!].audio.track as LocalAudioTrack;
      audio.state ? track.mute() : track.unmute();
      setAudio((c) => ({ ...c, state: !c.state }));
      changeTrackState(nickname!, track, !audio.state);
    } else {
      track = participants[nickname!].video.track as LocalVideoTrack;
      video.state ? track.mute() : track.unmute();
      setVideo((c) => ({ ...c, state: !c.state }));
      changeTrackState(nickname!, track, !video.state);
    }
  };

  // 트랙구독
  let subscribeTrack = async (
    track: Track,
    pub: TrackPublication,
    participant: RemoteParticipant
  ) => {
    if (pub.isSubscribed && pub.track)
      setParticipantTrack(participant.identity, track);
    if (pub.source == "screen_share" && shareVideoRef.current)
      shareState(pub.track as Track, true, participant.identity);
  };

  // 트랙구독 종료
  let unSubscribeTrack = async (
    track: Track,
    pub: TrackPublication,
    participant: RemoteParticipant
  ) => {
    if (pub.source == "screen_share" && shareVideoRef.current)
      shareState(pub.track as Track, false, participant.identity);
  };

  // 룸이 연결되었으면 내트랙과 이벤트 설정
  useEffect(() => {
    if (!room) return;

    start();

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
    // 기준 참가자 관련
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
        changeTrackState(identity, track, true)
      );
    });

    // 구독시작
    room.on("trackSubscribed", subscribeTrack);
    // 구독종료
    room.on("trackUnsubscribed", unSubscribeTrack);
    // 볼륨 활성화
    room.on("activeSpeakersChanged", handleSpeak);
    // 다른 참가자 방 나감
    room.on("participantDisconnected", userDisconnect);

    return () => {
      room.off("activeSpeakersChanged", handleSpeak);
      room.off("activeSpeakersChanged", handleSpeak);
      room.off("participantDisconnected", userDisconnect);
      room.off("trackSubscribed", subscribeTrack);
      room.off("trackUnsubscribed", unSubscribeTrack);
    };
  }, [room]);

  const userDisconnect = (p: Participant) => {
    setParticipants((c: any) => {
      const newDict = { ...c };
      delete newDict[p.identity];
      return newDict;
    });
  };

  // 트랙 --------------------------------------

  let [audio, setAudio] = useState<TrackProps>({
    state: true,
    active: false,
  });
  let [video, setVideo] = useState<TrackProps>({ state: true });

  let devicesRef = useRef<HTMLDivElement | null>(null);
  let [devices, setDevices] = useState<{
    show: boolean;
    video: { id: string; label: string }[];
    audio: { id: string; label: string }[];
  }>({
    show: false,
    video: [],
    audio: [],
  });

  useEffect(() => {
    if (devicesRef.current && devices.show) devicesRef.current.focus();
  }, [devices]);

  // 내 트랙관련 -------------------------------

  // 오디오 활성화 조절
  const handleSpeak = () => {
    const currentActive = new Set(
      room.activeSpeakers.map((p: any) => {
        return p.identity;
      })
    );
    setParticipants((prev: UserTrackProps) => {
      let newMap: UserTrackProps = {};
      for (const [key, value] of Object.entries(prev)) {
        let speaking: boolean = currentActive.has(key);
        newMap[key] =
          speaking === value.audio.active
            ? value
            : { ...value, audio: { ...value.audio, active: speaking } };
      }
      return newMap;
    });
  };

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
        shareState(track, true, nickname!);
      }

      track.mediaStreamTrack.onended = () => {
        room.localParticipant.unpublishTrack(track);
        shareState(track, false, "");
      };
    } catch (err) {
      console.log(err);
    }
  };

  // 방 나감
  let roomLeave = async () => {
    if (!room) return;
    try {
      await room.disconnect();
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  // 참가자 화면 조절
  let listsRef = useRef<HTMLUListElement | null>(null);
  const [page, setPage] = useState<{
    arr: ParticipantTrack[][];
    current: number;
  }>({
    arr: [],
    current: 0,
  });
  const [listSize, setListSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  // 현재 리스트박스 사이즈
  useEffect(() => {
    if (!listsRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;

      setListSize((c) => ({
        ...c,
        width,
        height,
      }));
    });

    observer.observe(listsRef.current);
    return () => observer.disconnect();
  }, []);
  // 페이지 조절
  useEffect(() => {
    let ss = Math.floor(listSize.width / (share.state ? 200 : 270));
    let cut = ss * (share.state ? 1 : ss);

    let newPages: ParticipantTrack[][] = [];

    if (cut == 0) return;

    let participant_list: ParticipantTrack[] = Object.entries(participants).map(
      ([key, value]) => {
        return { nickname: key, audio: value.audio, video: value.video };
      }
    );

    for (var i = 0; i < participant_list.length; i += cut) {
      newPages.push(participant_list.slice(i, i + cut));
    }
    setPage((prev) => ({ ...prev, arr: newPages }));
  }, [listSize.width, share.state, participants]);

  function updatePage(type: "l" | "r") {
    if (type == "l" && page.current == 0) return;
    else if (type == "r" && page.current == page.arr.length - 1) return;

    setPage((c) => ({
      ...c,
      current: type == "l" ? c.current - 1 : c.current + 1,
    }));
  }

  let dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    console.log(devices);
  }, [devices]);

  return (
    <STR.StreamBox>
      {/* 스트림 박스 */}
      <STR.StreamSectionBox>
        {/* 참가자 화면 */}
        <STLI.ParticipantsListsBox ref={listsRef} share={share.state}>
          <STLI.PageUpdateBtnLeft page={page} onClick={() => updatePage("l")}>
            <i className="fa-solid fa-chevron-left"></i>
          </STLI.PageUpdateBtnLeft>
          <STLI.PageUpdateBtnRight page={page} onClick={() => updatePage("r")}>
            <i className="fa-solid fa-chevron-right"></i>
          </STLI.PageUpdateBtnRight>
          <STLI.PageContainer
            width={page.arr.length * listSize.width}
            x={listSize.width * page.current}
          >
            {page.arr.map((val) => (
              <ParticipantPage
                list={val}
                width={listSize.width}
                share={share.state}
              />
            ))}
          </STLI.PageContainer>
        </STLI.ParticipantsListsBox>
        {/* 공유화면 */}
        <STR.ShareContainer share={share.state}>
          <STR.shareVideoBox>
            <STR.shareVideo ref={shareVideoRef} autoPlay />
            <STR.shareUserNick>{share.nickname}</STR.shareUserNick>
          </STR.shareVideoBox>
        </STR.ShareContainer>
      </STR.StreamSectionBox>
      {/* 풋터 */}
      <STR.Footer>
        <STR.MediaBox
          tabIndex={0}
          show={devices.show}
          ref={devicesRef}
          onBlur={() => setDevices((c) => ({ ...c, show: false }))}
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
              {video.id == val.id && <i className="fa-solid fa-check"></i>}
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
              {audio.id == val.id && <i className="fa-solid fa-check"></i>}
              {val.label}
            </li>
          ))}
        </STR.MediaBox>
        {/* 오디오 */}
        <button onClick={() => toggleTrack("audio")}>
          <i
            className={`fa-solid fa-microphone${audio.state ? "" : "-slash"}`}
          ></i>
          <span>오디오</span>
        </button>
        {/* 비디오 */}
        <button onClick={() => toggleTrack("video")}>
          <i className={`fa-solid fa-video${video.state ? "" : "-slash"}`}></i>
          <span>비디오</span>
        </button>
        {/* 방에 친구초대 */}
        <button
          onClick={() => dispatch(modalState({ active: true, type: "invite" }))}
        >
          <i className="fa-solid fa-user-plus"></i>
          <span>초대</span>
        </button>
        {/* 화면공유 */}
        <button onClick={ScreenShareControl}>
          <i className="fa-brands fa-creative-commons-share"></i>
          <span>화면공유</span>
        </button>
        {/* 내 미디어 변경 */}
        <button onClick={() => setDevices((c) => ({ ...c, show: true }))}>
          <i className="fa-solid fa-desktop"></i>
          <span>내미디어</span>
        </button>
        {/* 채팅 */}
        <button
          title="채팅"
          onClick={() => emitter.emit("menu", { state: true, type: "chat" })}
        >
          <i className="fa-solid fa-comments"></i>
          <span>채팅</span>
        </button>
        {/* 참가자 */}
        <button
          title="참가자"
          onClick={() =>
            emitter.emit("menu", { state: true, type: "participants" })
          }
        >
          <i className="fa-solid fa-user"></i>
          <span>참가자</span>
        </button>

        {/* 방 나가기 */}
        <button title="방 나가기" onClick={roomLeave}>
          <i className="fa-solid fa-right-from-bracket"></i>
        </button>
      </STR.Footer>
    </STR.StreamBox>
  );
};
