import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";
import { buttonVariants } from "../components/ui/button";
import { RoomObject } from "./Buildings";
import { ItemCard } from "../components/ItemCard";
import axios from "axios";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "../components/ui/sheet";
import { AddNewItem } from "./AddNewItem";

interface RoomProps {
  room: RoomObject;
  setRoom: React.Dispatch<React.SetStateAction<RoomObject>>;
}

export interface RoomItems {
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

export interface Item {
  id: number;
  serial_num: string;
  item_name: string;
  par_level: number;
  createdAt: string;
  updatedAt: string;
  roomItems: RoomItems[];
}

type ItemList = Item[];

export const Room: React.FC<RoomProps> = (props) => {
  const [roomItems, setRoomItems] = useState<ItemList>([]);

  const fetchRoomItems = async () => {
    console.log(props.room.id);
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

  const roomCards = roomItems.map((item) => <ItemCard item={item}></ItemCard>);

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
        {/* <Link className="ml-auto mr-[100px]" to="/landing/manageitems">
          <Button>Add Item</Button>
        </Link> */}
        <div className="ml-auto mr-[100px]">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant={"default"} className="rounded-full">
                Add Item
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px] lg:w-[720px] xl:w-[1080px] overflow-scroll">
              <SheetHeader>
                <SheetTitle className="text-primary ml-11">
                  Add New Item
                </SheetTitle>
              </SheetHeader>
              <div className="py-8">
                <AddNewItem />
              </div>
              <SheetFooter></SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <h3>Items:</h3>
      {roomItems.length > 0 ? (
        <div className="flex flex-wrap">{roomCards}</div>
      ) : (
        <div className="flex justify-center items-center h-full w-full">
          <h1>This room has no items yet.</h1>
        </div>
      )}
    </>
  );
};
