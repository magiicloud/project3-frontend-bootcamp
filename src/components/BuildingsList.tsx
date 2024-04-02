import React, { EffectCallback, useEffect, useState } from "react";
import { cn } from "../lib/utils";
import { buttonVariants } from "./ui/button";
import { SetStateAction } from "react";
import { BACKEND_URL } from "../constants";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

interface room {
  id: number;
  name: number;
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

type buildingList = building[];

export const BuildingsList = () => {
  const [buildings, setBuildings] = useState<buildingList>([]);
  const [buildingLineItem, setBuildingLineItem] = useState(<div></div>);

  const fetchBuildings = async () => {
    const fetchedBuildings = await fetch("http://localhost:3000/buildings", {
      method: "get",
    });
    const fetchedBuildingsJson = await fetchedBuildings.json();
    setBuildings(fetchedBuildingsJson as buildingList);
    return undefined;
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  useEffect(() => {
    const buildingLineItems: unknown = buildings.map((building, index) => {
      const roomDivs = building.rooms.map((room, index) => (
        <div
          key={index}
          className="absolute"
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
            <div className="h-[150px] border-t border-b border-gray-500 w-full flex flex-row">
              <img
                className="m-1 h-inherit"
                src={building.building_img_url}
                alt="building preview"
              />
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
  }, [buildings]);
  return <div>{buildingLineItem}</div>;
};
