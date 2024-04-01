import React, { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../constants";

export const useRooms = () => {
  interface Room {
    id: number;
    name: string;
  }

  const [rooms, setRooms] = useState<Room[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchRooms = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/allrooms/`);
        setRooms(response.data);
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

  useEffect(() => {
    const fetchAllItems = async () => {
      setIsLoading(true);
      try {
        const allItemsData = await axios.get(`${BACKEND_URL}/allitems/`);
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
