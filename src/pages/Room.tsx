import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useParams } from "react-router-dom";
import { cn } from "../lib/utils";
import { buttonVariants } from "../components/ui/button";
import { RoomObject } from "./Buildings";
import axios from "axios";
import { WeekNumberLabel } from "react-day-picker";

interface CustomProp {
  room: RoomObject;
  setRoom: React.Dispatch<React.SetStateAction<RoomObject>>;
}

interface roomItems {
  id: number;
  room_id: number;
  item_id: number;
  quantity: number;
  uom: string;
  expiry_date: string;
  createdAt: string;
  updatedAt: string;
  room: { name: string };
}

interface Item {
  id: number;
  serial_num: string;
  item_name: string;
  par_level: number;
  createdAt: string;
  updatedAt: string;
  roomItems: roomItems[];
}

type ItemList = Item[];

export const Room: React.FC<CustomProp> = (props) => {
  const [roomItems, setRoomItems] = useState<ItemList>([]);

  const fetchRoomItems = async () => {
    const fetchedRoomItems = await axios.get(
      process.env.REACT_APP_BACKEND_URL + "/items/" + props.room.id
    );
    const fetchedRoomItemsData: ItemList = await fetchedRoomItems.data;
    setRoomItems(fetchedRoomItemsData);
    console.log(fetchedRoomItemsData);
    return undefined;
  };

  useEffect(() => {
    fetchRoomItems();
  }, []);

  return (
    <>
      <div className="flex items-start mt-5">
        <ArrowLeft
          onClick={() => props.setRoom({})}
          className="inline mt-[5px]"
        />
        <div>
          <h2 className="inline px-3 mt-0 mb-0">{props.room.name}</h2>
          <h3 className="px-3 mt-0">In: {props.room.building}</h3>
        </div>
      </div>
    </>
  );
};
