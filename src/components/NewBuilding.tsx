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
import axios from "axios";

interface newRoom {
  top: number;
  left: number;
  width: number;
  height: number;
  name: string;
  building_id?: number;
}

interface building {
  height: number;
  width: number;
  image: string | ArrayBuffer | null;
}

type buildings = building;
type rooms = newRoom[];

export const NewBuilding = () => {
  const [rooms, setRooms] = useState<rooms>([]);
  const [newBox, setNewBox] = useState({
    top: -1,
    left: -1,
    width: -1,
    height: -1,
  });
  const [newRoomName, setNewRoomName] = useState("");
  const [building, setBuilding] = useState<buildings>({
    height: 0,
    width: 0,
    image: "",
  });
  const [buildingImg, setBuildingImg] = useState<any>(undefined);
  const [buildingName, setBuildingName] = useState<string>("");
  const [mainDialog, setMainDialog] = useState<boolean>(false);
  const [successDialog, setSuccessDialog] = useState<boolean>(false);

  const handleClick = () => {
    const newRooms = [...rooms];
    const newRoom: newRoom = { ...newBox, name: "" };
    newRoom.name = newRoomName;
    newRooms.push(newRoom);
    setRooms(newRooms);
    setNewBox({
      top: -1,
      left: -1,
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
    window.location.reload();
  };

  const parentWidth = (elem: HTMLElement | null) => {
    return elem?.parentElement?.clientWidth;
  };

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setBuildingImg(file);
    const image = new Image();
    image.onload = () => {
      const newBuilding = { ...building };
      const parentEleWidth = parentWidth(
        document.getElementById("building-highlight")
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
        setBuilding(newBuilding);
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

  const boxInProg = () => {
    if (newBox.height > 0) {
      return (
        <div
          className="absolute"
          style={Object.assign({
            zIndex: 10,
            left: newBox.left + "%",
            top: newBox.top + "%",
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
    const data = {
      building: {
        name: buildingName,
        image_size: "200px",
        building_img_url: imageUrl,
      },
      rooms: [] as rooms,
    };
    rooms.map((room) => {
      const newRoom = { ...room };
      newRoom["building_id"] = 0;
      data.rooms.push(newRoom);
    });
    axios
      .post("http://localhost:3000/buildings", data)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    setSuccessDialog(true);
  };

  const uploadImage: MouseEventHandler<HTMLButtonElement> = () => {
    const floorplanImgRef = sRef(storage, `/buildings/${buildingName}`);
    uploadBytes(floorplanImgRef, buildingImg).then(() => {
      const url = getDownloadURL(floorplanImgRef);
      url.then((value) => {
        createNewFloorplan(value);
      });
    });
  };

  return (
    <>
      <Dialog open={mainDialog} onOpenChange={setMainDialog}>
        <DialogTrigger>Add new building</DialogTrigger>
        <DialogContent
          style={{
            overflowY: "auto",
            overflowX: "hidden",
            maxHeight: "100%",
          }}
        >
          <DialogHeader>
            <DialogTitle>New Building</DialogTitle>
            <DialogDescription>
              Highlight areas of the image and input the name to preview the new
              room. Click "Add" to add the room.
            </DialogDescription>
            <label className="inline">Building Image:</label>
            <input
              className="inline"
              type="file"
              onChange={(e) => handleFile(e)}
            ></input>
            <label className="inline">Building Name:</label>
            <input
              type="text"
              onChange={(e) => handleChange(e, setBuildingName)}
            ></input>
            <RectangleSelection
              id="building-highlight"
              onSelect={(e, coords) => {
                setNewBox({
                  left: coords.topLeft[0],
                  top: coords.topLeft[1],
                  width: coords.width,
                  height: coords.height,
                });
              }}
              style={{ backgroundColor: "grey", borderColor: "black" }}
            >
              <div
                className="relative bg-cover bg-no-repeatrelative bg-cover bg-no-repeat"
                style={{
                  height: building.height,
                  width: building.width,
                  backgroundColor: "black",
                  backgroundImage: `url(${building.image})`,
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
            <button onClick={uploadImage}>Create new building</button>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog open={successDialog} onOpenChange={setSuccessDialog}>
        <DialogContent className="w-[50%]">
          <DialogTitle>Success!</DialogTitle>
          <DialogDescription>
            The new building has been recorded, close this dialog and head to
            the main page to view the new building!
          </DialogDescription>
          <Button onClick={handleSuccess}>Close</Button>
        </DialogContent>
      </Dialog>
    </>
  );
};
