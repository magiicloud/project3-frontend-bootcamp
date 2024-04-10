import React, { useEffect, useState } from "react";
import { cn } from "../lib/utils";
import { buttonVariants } from "../components/ui/button";
import { NewBuilding } from "../components/NewBuilding";
import { BuildingsList } from "../components/BuildingsList";
import { Room } from "./Room";
import axios from "axios";
import { useUser } from "../components/UserContext";
import { buildingList, useBuildings } from "../hooks/useBuildings";

export interface RoomObject {
  id?: number;
  name?: string;
  building?: string;
}

export const Buildings = () => {
  const [room, setRoom] = useState<RoomObject>({});
  const [buildings, setBuildings] = useState<buildingList>([]);

  const { fetchBuildings } = useBuildings();

  const getNewBuildings = async () => {
    try {
      const newBuildings = await fetchBuildings();
      setBuildings(newBuildings);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getNewBuildings();
  }, []);
  return (
    <>
      <div className="prose max-w-none">
        {Object.keys(room).length > 0 ? (
          <Room room={room} setRoom={setRoom} />
        ) : (
          <>
            <h2 className="px-3 mt-5">Buildings</h2>
            <NewBuilding getNewBuildings={getNewBuildings} />
            <BuildingsList buildings={buildings} setRoom={setRoom} />
          </>
        )}
      </div>
    </>
  );
};
