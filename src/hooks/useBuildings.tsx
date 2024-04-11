import { useState, useEffect } from "react";
import { useUser } from "../components/UserContext";
import axios from "axios";

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

export const useBuildings = () => {
  const { userId } = useUser();

  const fetchBuildings = async () => {
    const fetchedBuildings = await axios.get(
      process.env.REACT_APP_BACKEND_URL + "/buildings/" + userId
    );
    const fetchedBuildingsData = await fetchedBuildings.data;
    return fetchedBuildingsData as buildingList;
  };

  return { fetchBuildings };
};
