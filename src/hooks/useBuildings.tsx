import { useUser } from "../components/UserContext";
import { useAuthenticatedRequest } from "../authenticatedRequest";

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

export interface building {
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
  const sendRequest = useAuthenticatedRequest();
  const { userId } = useUser();

  const fetchBuildings = async () => {
    const fetchedBuildings = await sendRequest(`/buildings/${userId}`, {
      method: "GET",
    });
    const fetchedBuildingsData = await fetchedBuildings.data;
    return fetchedBuildingsData as buildingList;
  };

  return { fetchBuildings };
};
