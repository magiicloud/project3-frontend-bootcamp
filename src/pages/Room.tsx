import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { cn } from "../lib/utils";
import { buttonVariants } from "../components/ui/button";

interface CustomProp {
  roomId: number | true;
  setRoomId: React.Dispatch<React.SetStateAction<number | boolean>>;
}

export const Room: React.FC<CustomProp> = (props) => {
  return (
    <>
      <div className="prose">
        <h1 onClick={() => props.setRoomId(false)}>Back</h1>
        <h1>Room {props.roomId}</h1>
      </div>
    </>
  );
};
