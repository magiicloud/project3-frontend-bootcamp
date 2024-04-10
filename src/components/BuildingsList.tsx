import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
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
import { buildingList } from "../hooks/useBuildings";
import axios from "axios";

interface BuildingListProps {
  setRoom: React.Dispatch<React.SetStateAction<RoomObject>>;
  refresh?: boolean;
  buildings: buildingList;
}

export const BuildingsList: React.FC<BuildingListProps> = (props) => {
  const [buildingLineItem, setBuildingLineItem] = useState(<div></div>);

  useEffect(() => {
    const buildingLineItems: unknown = props.buildings.map(
      (building, index) => {
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
                <div className="flex items-center m-5">
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
              <DialogHeader>
                Welcome to: {building.name}{" "}
                {building.users[0].admin && "(Admin)"}
              </DialogHeader>
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
      }
    );
    setBuildingLineItem(buildingLineItems as SetStateAction<React.JSX.Element>);
  }, [props]);
  return <div>{buildingLineItem}</div>;
};
