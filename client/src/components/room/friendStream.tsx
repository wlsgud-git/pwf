import { useEffect, useRef } from "react";

// interface
import { PeerConnects } from "../../types/room";

export const FriendStream = ({
  from,
  stream,
}: {
  from: string;
  stream: any;
}) => {
  let videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    videoRef.current!.srcObject = stream.stream;
  }, [stream.stream]);

  return (
    <div className="user_video_box">
      <video ref={videoRef} autoPlay playsInline className="user_video"></video>
      <div className="user_info_box">
        <div>
          <span>
            <i
              className={`fa-solid fa-microphone-lines${
                stream.audio ? "" : "-slash"
              }`}
            ></i>
          </span>
          <span>
            <i
              className={`fa-solid fa-video${stream.video ? "" : "-slash"}`}
            ></i>
          </span>
        </div>
        <span>{from}</span>
      </div>
    </div>
  );
};
