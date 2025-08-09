import { Room } from "../../types/room";
import { Link } from "react-router-dom";
import "../../css/streamLi.css";
import { useEffect } from "react";

export const StreamRoomLi = ({ data }: { [data: string]: Room }) => {
  return (
    <li className="stream_room_li">
      <Link to={`room/${data.id}`}>
        <h2 className="stream_room_name">{data.room_name}</h2>
        <span className="stream_room_participant">
          <i className="fa-solid fa-user"></i>
          {data.participants && data.participants.length}
        </span>
      </Link>
    </li>
  );
};
