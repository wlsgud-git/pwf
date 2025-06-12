import { useEffect, useRef, useState } from "react";
import "../css/room/streamRoom.css";
import { Form, useNavigate, useParams } from "react-router-dom";
import { socketClient } from "../util/socket";
import { stream_service } from "../service/streamservice";
import { emitter } from "../util/event";
import { useSelector } from "react-redux";
import { RootState } from "../context/store";

// type
import { Room } from "../types/room";
import { User } from "../types/user";
import { PeerConnects } from "../types/room";

// component
import { Menu } from "../components/room/menu";
import { RoomMain } from "../components/room/roomMain";

export const StreamRoom = () => {
  let user = useSelector((state: RootState) => state.user);
  let { id } = useParams();
  let navigate = useNavigate();

  // ref
  let peerConnects = useRef<{
    [nickname: string]: { pc: RTCPeerConnection; channel: RTCDataChannel };
  }>({});

  // state
  let [room, setRoom] = useState<Room | null>(null); //방 정보
  let [stream, setStream] = useState<MediaStream | null>(null);
  let [connects, setConnects] = useState<PeerConnects>({});
  let [invitationModal, setInvitationModal] = useState<boolean>(false);

  // 방 입장/퇴장 관련 --------------------------
  let joinRoomHandler = (who: string) => {
    // setConnectList((c) => [...c, { from: who, stream: new MediaStream() }]);
  };

  // room leave 처리
  let leaveRoomHandler = (who: string) => {
    peerConnects.current[who].pc.close();
    delete peerConnects.current[who];
    setConnects((c) => {
      const copy = { ...c };
      delete copy[who];
      return copy;
    });
  };

  // 비디오/오디오 상태 ----------------------------

  // 상대 화면 on/off
  let trackHandler = (to: string, type: "audio" | "video", state: boolean) => {
    setConnects((c) => {
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

    // signaling event
    pc.onicecandidate = (e) => {
      if (e.candidate)
        socketClient.emit("candidate", user.nickname, to, e.candidate);
    };

    pc.ontrack = (e) => {
      let kind = e.track.kind;
      // peerConnects.current[to] = { pc, channel };
      setConnects((c) => {
        let stream = new MediaStream();
        let audio = true;
        let video = true;

        // 만약에 event track이 stream에 존재하지 않으면 추가해줌
        if (!stream.getTracks().includes(e.track)) stream.addTrack(e.track);
        // 미디어 kind타입에 활성화 상태 알려줌
        kind == "audio" ? (audio = e.track.enabled) : (video = e.track.enabled);

        return {
          ...c,
          [to]: { pc, channel, stream, video, audio },
        };
      });
    };

    // channel event
    channel.onmessage = (e) => {
      emitter.emit("menu chat", JSON.parse(e.data));
    };

    // offer 부분
    let offer = await pc.createOffer();
    await pc.setLocalDescription(offer!);
    socketClient.emit("offer", user.nickname, to, offer);

    peerConnects.current[to] = { pc, channel };
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
          if (val.nickname !== user.nickname) {
            await peerConnect(val.nickname, stream);
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  // offer처리
  let offerHandler = async (from: string, offer: RTCSessionDescriptionInit) => {
    console.log(`offer from ${from}`);
    if (!peerConnects.current[from]) await peerConnect(from);
    try {
      await peerConnects.current[from].pc?.setRemoteDescription(
        new RTCSessionDescription(offer)
      );

      if (
        peerConnects.current[from]?.pc.signalingState == "have-remote-offer" &&
        user.nickname !== ""
      ) {
        const answer = await peerConnects.current[from]?.pc.createAnswer();
        await peerConnects.current[from]?.pc.setLocalDescription(answer!);
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
      if (!peerConnects.current[from]?.pc.currentRemoteDescription)
        await peerConnects.current[from]?.pc.setRemoteDescription(answer!);
    } catch (err) {
      console.log(err);
    }
  };

  // candidate처리
  let candidateHandler = async (from: string, candidate: RTCIceCandidate) => {
    // console.log(`candidate from ${from}`);
    if (!peerConnects.current[from]) await peerConnect(from);
    try {
      if (peerConnects.current[from].pc?.remoteDescription) {
        const iceCandidate = new RTCIceCandidate(candidate);
        await peerConnects.current[from]?.pc.addIceCandidate(iceCandidate);
      }
    } catch (err) {
      console.log(err);
    }
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
    if (room && user.id) {
      let participants = (room.participants as User[]).map((val) => val);
      if (!participants.find((val) => val.id === user.id)) {
        alert("참가자가 아닙니다.");
        navigate("/");
        return;
      }
      participants.map((val: any) => {
        if (val.nickname !== user.nickname) {
          peerConnect(val.nickname);
        }
      });
      start();
    }
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
      <RoomMain
        user={user}
        stream={stream}
        connects={connects}
        participants={room?.participants}
      />

      {/* menu */}
      <Menu user={user} connects={connects} participants={room?.participants} />
    </div>
  );
};
