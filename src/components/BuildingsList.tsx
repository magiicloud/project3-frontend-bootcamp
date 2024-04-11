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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { RoomObject } from "../pages/Buildings";
import { buildingList } from "../hooks/useBuildings";
import { HTMLAttributes } from "react";
import { Button } from "./ui/button";
import { AddBuildingUser } from "./AddBuildingUser";

interface BuildingListProps extends HTMLAttributes<HTMLDivElement> {
  setRoom: React.Dispatch<React.SetStateAction<RoomObject>>;
  refresh?: boolean;
  buildings: buildingList;
}

export const BuildingsList: React.FC<BuildingListProps> = (props) => {
  const [buildingLineItem, setBuildingLineItem] = useState(<div></div>);
  const [newUserEmail, setNewUserEmail] = useState("");

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
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="mt-2 mb-0">{building.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    className="m-0 max-w-full max-h-full"
                    src={building.building_img_url}
                    alt="building preview"
                  />
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent
              style={{
                overflowY: "auto",
                overflowX: "hidden",
                maxHeight: "100%",
              }}
            >
              <DialogHeader>
                <DialogTitle>Welcome to: {building.name}</DialogTitle>
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
              <AddBuildingUser
                buildingId={building.id}
                admin={building.users[0].admin}
              />
            </DialogContent>
          </Dialog>
        );
      }
    );
    setBuildingLineItem(buildingLineItems as SetStateAction<React.JSX.Element>);
  }, [props]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-8 lg:grid-cols-4">
        {buildingLineItem}
      </div>
    </div>
  );
};
