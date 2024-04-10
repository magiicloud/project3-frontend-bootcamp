import React, { useEffect, useState } from "react";
import { cn } from "../lib/utils";
import { buttonVariants } from "../components/ui/button";
import { NewBuilding } from "../components/NewBuilding";
import { BuildingsList } from "../components/BuildingsList";
import { Room } from "./Room";
import axios from "axios";
import { useUser } from "../components/UserContext";

export interface RoomObject {
  id?: number;
  name?: string;
  building?: string;
}

interface room {
  id: number;
  name: string;
  left: number;
  top: number;
  height: number;
  width: number;
  building_id: number;
  createdAt: string;
  updatedAt: string;
}
interface user {
  id: number;
  building_id: number;
  user_id: number;
  admin: boolean;
  createdAt: string;
  updatedAt: string;
}

interface building {
  id: number;
  name: string;
  image_size: string;
  building_img_url: string;
  createdAt: string;
  updatedAt: string;
  rooms: room[];
  users: user[];
}

export type buildingList = building[];

export const Buildings = () => {
  const [room, setRoom] = useState<RoomObject>({});
  const [buildings, setBuildings] = useState<buildingList>([]);

  const { userId } = useUser();

  const fetchBuildings = async () => {
    const fetchedBuildings = await axios.get(
      process.env.REACT_APP_BACKEND_URL + "/buildings/" + userId
    );
    const fetchedBuildingsData = await fetchedBuildings.data;
    return fetchedBuildingsData as buildingList;
  };

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
