import { useEffect, useState } from "react";
import { useUser } from "../components/UserContext";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthenticatedRequest } from "../authenticatedRequest";

export const useRooms = () => {
  interface Room {
    id: number;
    name: string;
  }

  const [rooms, setRooms] = useState<Room[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useUser();
  const sendRequest = useAuthenticatedRequest();

  useEffect(() => {
    setIsLoading(true);

    const fetchRooms = async () => {
      try {
        const roomsData = await sendRequest(`/allrooms/${userId}`, {
          method: "GET",
        });
        setRooms(roomsData.data);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setError((err as Error).message);
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return { rooms, error, isLoading };
};

export const useAllItems = () => {
  interface Item {
    id: number;
    serial_num: string;
    item_name: string;
    par_level: number;
    roomItems: {
      id: number;
      room_id: number;
      item_id: number;
      quantity: number;
      uom: string;
      expiry_date: Date;
      room: {
        name: string;
      };
    }[];
  }
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useUser();
  const sendRequest = useAuthenticatedRequest();

  useEffect(() => {
    const fetchAllItems = async () => {
      setIsLoading(true);
      try {
        const allItemsData = await sendRequest(`/allitems/${userId}`, {
          method: "GET",
        });
        setAllItems(allItemsData.data);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setError((err as Error).message);
        setIsLoading(false);
      }
    };

    fetchAllItems();
  }, []);
  return { allItems, error, isLoading };
};
