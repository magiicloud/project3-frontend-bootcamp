import React, { useEffect, useState } from "react";
import { cn } from "../lib/utils";
import { buttonVariants } from "../components/ui/button";
import { NewBuilding } from "../components/NewBuilding";
import { BuildingsList } from "../components/BuildingsList";
import { Room } from "./Room";

export interface RoomObject {
  id?: number;
  name?: string;
  building?: string;
}

export const Buildings = () => {
  const [room, setRoom] = useState<RoomObject>({});
  return (
    <>
      <div className="prose max-w-none">
        {Object.keys(room).length > 0 ? (
          <Room room={room} setRoom={setRoom} />
        ) : (
          <>
            <h2 className="px-3 mt-5">Buildings</h2>
            <NewBuilding />
            <BuildingsList setRoom={setRoom} />
          </>
        )}
      </div>
    </>
  );
};
