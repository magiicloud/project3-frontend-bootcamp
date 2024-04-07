import React, { useEffect, useState } from "react";
import { cn } from "../lib/utils";
import { SetStateAction } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { RoomObject } from "../pages/Buildings";
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

interface building {
  id: number;
  name: string;
  image_size: string;
  building_img_url: string;
  createdAt: string;
  updatedAt: string;
  rooms: room[];
}

interface BuildingListProps {
  setRoom: React.Dispatch<React.SetStateAction<RoomObject>>;
  refresh: boolean;
}

type buildingList = building[];

export const BuildingsList: React.FC<BuildingListProps> = (props) => {
  const [buildings, setBuildings] = useState<buildingList>([]);
  const [buildingLineItem, setBuildingLineItem] = useState(<div></div>);

  const fetchBuildings = async () => {
    const fetchedBuildings = await axios.get(
      process.env.REACT_APP_BACKEND_URL + "/buildings"
    );
    const fetchedBuildingsData = await fetchedBuildings.data;
    setBuildings(fetchedBuildingsData as buildingList);
    return undefined;
  };

  useEffect(() => {
    fetchBuildings();
  }, [props.refresh]);

  useEffect(() => {
    const buildingLineItems: unknown = buildings.map((building, index) => {
      const roomDivs = building.rooms.map((room, index) => (
        <div
          key={index}
          className="absolute"
          onClick={() =>
            props.setRoom({
              id: room.id,
              name: room.name,
              building: building.name,
            })
          }
          style={Object.assign({
            zIndex: 10,
            left: room.left + "%",
            top: room.top + "%",
            height: room.height + "%",
            width: room.width + "%",
            userSelect: "none",
          })}
        >
          <div className="z-10 absolute flex justify-center items-center border-2 border-black rounded w-full h-full">
            <div className="w-inherit text-center">{room.name}</div>
          </div>
          <div className="z-9 bg-gray-500 opacity-50 w-full h-full"></div>
        </div>
      ));
      return (
        <Dialog key={index}>
          <DialogTrigger className="w-full">
            <div className="border-t border-b border-gray-500 w-full flex flex-row">
              <div className="h-[150px] w-[250px] m-1 flex justify-center items-center">
                <img
                  className="m-0 max-w-full max-h-full"
                  src={building.building_img_url}
                  alt="building preview"
                />
              </div>
              <div className="flex items-center ml-5">
                <h1 key={index} className="prose m-0">
                  Building Name: {building.name}
                </h1>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent
            style={{
              overflowY: "auto",
              overflowX: "hidden",
              maxHeight: "100%",
            }}
          >
            <DialogHeader>Welcome to: {building.name}</DialogHeader>
            <DialogDescription>
              Click on any room to go there and look at the stock there.
            </DialogDescription>
            <div className="relative">
              <img
                src={building.building_img_url}
                alt="building map"
                className="relative w-full"
              />

              {roomDivs}
            </div>
          </DialogContent>
        </Dialog>
      );
    });
    setBuildingLineItem(buildingLineItems as SetStateAction<React.JSX.Element>);
  }, [buildings, props]);
  return <div>{buildingLineItem}</div>;
};
