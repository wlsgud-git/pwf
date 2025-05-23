import { useEffect, useRef, useState } from "react";
import "../css/room/streamRoom.css";
import { Form, useNavigate, useParams } from "react-router-dom";
import { socketClient } from "../util/socket";
import { stream_service } from "../service/streamservice";

import { useSelector } from "react-redux";
import { RootState } from "../context/store";

// type
import { Room } from "../types/room";
import { User } from "../types/user";
import { StreamInfomation } from "../types/room";

// component
import { Chat } from "../components/room/menu/chat";
import { Participants } from "../components/room/menu/participants";
import { Menu } from "../components/room/menu/menu";
import { RoomMain } from "../components/room/main/roomMain";

interface UserStream {
  [from: string]: StreamInfomation;
}

export const StreamRoom = () => {
  let user = useSelector((state: RootState) => state.user);
  let { id } = useParams();
  let navigate = useNavigate();

  // let roomId = `room${id}`;

  // ref
  let peerConnects = useRef<{ [nickname: string]: RTCPeerConnection }>({});
  let dataChannelsRef = useRef<{ [nickname: string]: RTCDataChannel }>({});

  // state
  let [room, setRoom] = useState<Room | null>(null); //방 정보
  let [stream, setStream] = useState<MediaStream | null>(null);
  let [connectList, setConnectList] = useState<UserStream>({});
  let [menu, setMenu] = useState<{
    state: boolean;
    type: "participants" | "chat";
  }>({ state: false, type: "participants" }); //메뉴

  // 방 입장/퇴장 관련 --------------------------
  let joinRoomHandler = (who: string) => {
    // setConnectList((c) => [...c, { from: who, stream: new MediaStream() }]);
  };

  // room leave 처리
  let leaveRoomHandler = (who: string) => {
    delete peerConnects.current[who];
    // setConnectList((c) => c.filter((val) => val.from !== who));
  };

  // 비디오/오디오 상태 ----------------------------

  // 상대 화면 on/off
  let trackHandler = (to: string, type: "audio" | "video", state: boolean) => {
    setConnectList((c) => {
      let stInfo = c[to];

      type == "audio" ? (stInfo.audio = state) : (stInfo.video = state);

      return { ...c, [to]: stInfo };
    });
  };

  // p2p연결 관련 --------------------------------
  // connect 연결
  let peerConnect = async (to: string, stream?: MediaStream) => {
    let pc = new RTCPeerConnection();
    const channel = pc.createDataChannel("chat");

    stream?.getTracks().forEach((track) => {
      pc.addTrack(track, stream);
    });

    pc.onicecandidate = (e) => {
      if (e.candidate)
        socketClient.emit("candidate", user.nickname, to, e.candidate);
    };

    pc.ontrack = (e) => {
      let kind = e.track.kind;
      setConnectList((c) => {
        let stream = c[to];

        if (!stream.stream) stream.stream = new MediaStream();

        if (!stream.stream.getTracks().includes(e.track))
          stream.stream.addTrack(e.track);

        kind == "audio"
          ? (stream.audio = e.track.enabled)
          : (stream.video = e.track.enabled);

        return {
          ...c,
          [to]: stream,
        };
      });
    };

    channel.onmessage = (e) => {
      console.log(`send to ${to}`, e);
    };

    channel.onopen = () => {
      console.log(`DataChannel open with ${to}`);
    };

    let offer = await pc.createOffer();
    await pc.setLocalDescription(offer!);
    socketClient.emit("offer", user.nickname, to, offer);

    peerConnects.current[to] = pc;
    dataChannelsRef.current[to] = channel;
  };

  // 연결 시작
  let start = async () => {
    try {
      let stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(stream);

      // 트랙을 더해줌
      if (room)
        room.participants?.map(async (val: any) => {
          if (val.nickname !== user.nickname)
            await peerConnect(val.nickname, stream);
        });
    } catch (err) {
      console.log(err);
    }
  };

  // offer처리
  let offerHandler = async (from: string, offer: RTCSessionDescriptionInit) => {
    try {
      if (!peerConnects.current[from]) peerConnect(from);

      await peerConnects.current[from]?.setRemoteDescription(
        new RTCSessionDescription(offer)
      );

      if (
        peerConnects.current[from]?.signalingState == "have-remote-offer" &&
        user.nickname !== ""
      ) {
        const answer = await peerConnects.current[from]?.createAnswer();
        await peerConnects.current[from]?.setLocalDescription(answer!);
        socketClient.emit("answer", user.nickname, from, answer);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // answer 처리
  let answerHandler = async (
    from: string,
    answer: RTCSessionDescriptionInit
  ) => {
    try {
      if (!peerConnects.current[from]?.currentRemoteDescription)
        await peerConnects.current[from]?.setRemoteDescription(answer!);
    } catch (err) {
      console.log(err);
    }
  };

  // candidate처리
  let candidateHandler = async (from: string, candidate: RTCIceCandidate) => {
    const iceCandidate = new RTCIceCandidate(candidate);
    await peerConnects.current[from]?.addIceCandidate(iceCandidate);
  };

  // useEffect -----------------------------
  // 시작시 방 정보 얻어옴
  useEffect(() => {
    let data = async () => {
      try {
        let room = await stream_service.getStreamRoomData(id!);
        setRoom(room.room);
      } catch (err) {
        console.log(err);
      }
    };
    data();
  }, []);

  // 룸정보가 오면 start시작
  useEffect(() => {
    if (room) {
      room.participants?.map((val: any) => {
        if (val.nickname !== user.nickname) {
          peerConnect(val.nickname);
          setConnectList((c) => ({
            ...c,
            [val.nickname]: { stream: new MediaStream() },
          }));
        }
      });
    }
    start();
  }, [room]);

  // 소켓 연결
  useEffect(() => {
    socketClient.emit("join", `room${id}`);

    socketClient.on("other join", joinRoomHandler);
    socketClient.on("offer", offerHandler); //signaling offer
    socketClient.on("answer", answerHandler); //signaling answer
    socketClient.on("candidate", candidateHandler); //signaling candidate
    socketClient.on("leave room", leaveRoomHandler); // other user leave room
    socketClient.on("toggle track", trackHandler);

    return () => {
      socketClient.on("other join", joinRoomHandler);
      socketClient.off("offer", offerHandler);
      socketClient.off("answer", answerHandler);
      socketClient.off("candidate", candidateHandler);
      socketClient.off("leave room", leaveRoomHandler);
      socketClient.off("toggle track", trackHandler);
    };
  }, []);

  return (
    <div className="page streamRoom_page">
      {/* main */}
      <RoomMain user={user} stream={stream} />

      {/* menu */}
      <Menu />
    </div>
  );
};
