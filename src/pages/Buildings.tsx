import React, { useEffect, useState } from "react";
import { cn } from "../lib/utils";
import { buttonVariants } from "../components/ui/button";
import { NewBuilding } from "../components/NewBuilding";
import { BuildingsList } from "../components/BuildingsList";
import { Room } from "./Room";

export const Buildings = () => {
  const [room, setRoom] = useState<boolean | number>(false);
  return (
    <>
      <div className="prose max-w-none">
        {room ? (
          <Room roomId={room} setRoomId={setRoom} />
        ) : (
          <>
            <h1 className="px-3 mt-5">Buildings</h1>
            <NewBuilding />
            <BuildingsList setRoom={setRoom} />
          </>
        )}
      </div>
    </>
  );
};
