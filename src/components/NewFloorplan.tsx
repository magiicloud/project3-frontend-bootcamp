import React, { useState, MouseEventHandler } from "react";
import { cn } from "../lib/utils";
import { buttonVariants } from "./ui/button";
import RectangleSelection from "./rectangle-select";
import { ChangeEvent } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";

import { storage } from "../firebase";
import { ref as sRef, uploadBytes, getDownloadURL } from "firebase/storage";

interface newRoom {
  topLeft: number[];
  width: number;
  height: number;
  name: string;
}

interface floorplan {
  height: number;
  width: number;
  image: string | ArrayBuffer | null;
}

type floorplans = floorplan;
type rooms = newRoom[];

export const NewFloorplan = () => {
  const [rooms, setRooms] = useState<rooms>([]);
  const [newBox, setNewBox] = useState({
    topLeft: [-1, -1],
    width: -1,
    height: -1,
  });
  const [newRoomName, setNewRoomName] = useState("");
  const [floorplan, setFloorplan] = useState<floorplans>({
    height: 0,
    width: 0,
    image: "",
  });
  const [floorplanImg, setFloorplanImg] = useState<any>(undefined);
  const [floorplanName, setFloorplanName] = useState<string>("");
  const [mainDialog, setMainDialog] = useState<boolean>(false);
  const [successDialog, setSuccessDialog] = useState<boolean>(false);

  const handleClick = () => {
    const newRooms = [...rooms];
    const newRoom: newRoom = { ...newBox, name: "" };
    newRoom.name = newRoomName;
    newRooms.push(newRoom);
    setRooms(newRooms);
    setNewBox({
      topLeft: [-1, -1],
      width: -1,
      height: -1,
    });
    setNewRoomName("");
  };

  const handleChange = (e: any, setter: any) => {
    setter(e.target.value);
  };

  const handleSuccess = () => {
    setMainDialog(false);
    setSuccessDialog(false);
  };

  const parentWidth = (elem: HTMLElement | null) => {
    return elem?.parentElement?.clientWidth;
  };

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFloorplanImg(file);
    const image = new Image();
    image.onload = () => {
      const newBuilding = { ...floorplan };
      const parentEleWidth = parentWidth(
        document.getElementById("floorplan-highlight")
      );
      let imageWidth = 0;
      if (parentEleWidth) imageWidth = parentEleWidth - 10;
      // const imageWidth = window.innerWidth - 200;
      newBuilding.height = (image.height * imageWidth) / image.width;
      newBuilding.width = imageWidth;

      const reader = new FileReader();
      if (file) reader.readAsDataURL(file);
      reader.onloadend = () => {
        newBuilding.image = reader.result;
        setFloorplan(newBuilding);
      };
    };
    if (file) image.src = URL.createObjectURL(file);
  };

  const roomDivs = rooms.map((room, index) => (
    <div
      key={index}
      className="absolute"
      style={Object.assign({
        zIndex: 10,
        left: room.topLeft[0] + "%",
        top: room.topLeft[1] + "%",
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

  const boxInProg = () => {
    if (newBox.height > 0) {
      return (
        <div
          className="absolute"
          style={Object.assign({
            zIndex: 10,
            left: newBox.topLeft[0] + "%",
            top: newBox.topLeft[1] + "%",
            height: newBox.height + "%",
            width: newBox.width + "%",
            userSelect: "none",
          })}
        >
          <div className="z-10 absolute flex justify-center items-center border-2 border-black rounded w-full h-full">
            <div
              className="whitespace-normal text-center"
              style={{ maxWidth: "100%" }}
            >
              {newRoomName}
            </div>
          </div>
          <div className="z-9 bg-gray-500 opacity-70 w-full h-full"></div>
        </div>
      );
    }
  };

  const createNewFloorplan = (imageUrl: string) => {
    console.log(imageUrl);
    setSuccessDialog(true);
  };

  const uploadImage: MouseEventHandler<HTMLButtonElement> = () => {
    const floorplanImgRef = sRef(storage, `/floorplans/${floorplanName}`);
    uploadBytes(floorplanImgRef, floorplanImg).then(() => {
      const url = getDownloadURL(floorplanImgRef);
      url.then((value) => {
        createNewFloorplan(value);
      });
    });
  };

  return (
    <>
      <Dialog open={mainDialog} onOpenChange={setMainDialog}>
        <DialogTrigger>Add new floorplan</DialogTrigger>
        <DialogContent
          style={{
            overflowY: "auto",
            overflowX: "hidden",
            maxHeight: "100%",
          }}
        >
          <DialogHeader>
            <DialogTitle>New Floorplan</DialogTitle>
            <DialogDescription>
              Highlight areas of the image and input the name to preview the new
              room. Click "Add" to add the room.
            </DialogDescription>
            <label className="inline">Floorplan Image:</label>
            <input
              className="inline"
              type="file"
              onChange={(e) => handleFile(e)}
            ></input>
            <label className="inline">Floorplan Name:</label>
            <input
              type="text"
              onChange={(e) => handleChange(e, setFloorplanName)}
            ></input>
            <RectangleSelection
              id="floorplan-highlight"
              onSelect={(e, coords) => {
                setNewBox({
                  topLeft: coords.topLeft,
                  width: coords.width,
                  height: coords.height,
                });
              }}
              style={{ backgroundColor: "grey", borderColor: "black" }}
            >
              <div
                className="relative bg-cover bg-no-repeatrelative bg-cover bg-no-repeat"
                style={{
                  height: floorplan.height,
                  width: floorplan.width,
                  backgroundColor: "black",
                  backgroundImage: `url(${floorplan.image})`,
                }}
              >
                {roomDivs}
                {boxInProg()}
              </div>
            </RectangleSelection>
            <label>Room Name: </label>
            <input
              value={newRoomName}
              onChange={(e) => handleChange(e, setNewRoomName)}
            ></input>
            <button onClick={handleClick}>Add room</button>
            <button onClick={uploadImage}>Create new floorplan</button>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog open={successDialog} onOpenChange={setSuccessDialog}>
        <DialogContent className="w-[50%]">
          <DialogTitle>Success!</DialogTitle>
          <DialogDescription>
            The new floorplan has been recorded, close this dialog and head to
            the main page to view the new floorplan!
          </DialogDescription>
          <Button onClick={handleSuccess}>Close</Button>
        </DialogContent>
      </Dialog>
    </>
  );
};