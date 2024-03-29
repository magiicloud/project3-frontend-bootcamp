import React, { useState } from "react";
import { cn } from "../lib/utils";
import { buttonVariants } from "../components/ui/button";
import RectangleSelection from "../components/rectangle-select";
import { ChangeEvent } from "react";

interface newRoom {
  topLeft: number[];
  width: number;
  height: number;
  name: string;
}

interface building {
  height: number;
  width: number;
  image: string | ArrayBuffer | null;
}

type buildings = building;
type rooms = newRoom[];

export const RoomPicture = () => {
  const [origin, setOrigin] = useState([0, 0]);
  const [target, setTarget] = useState([0, 0]);
  const [limit, setLimit] = useState([
    [0, 0],
    [0, 0],
    [0, 0],
  ]);
  const [rooms, setRooms] = useState<rooms>([]);
  const [newBox, setNewBox] = useState({
    topLeft: [-1, -1],
    width: -1,
    height: -1,
  });
  const [newRoomName, setNewRoomName] = useState("");
  const [building, setBuilding] = useState<buildings>({
    height: 0,
    width: 0,
    image: "",
  });

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

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const image = new Image();
    image.onload = () => {
      console.log(image.width, image.height);
      const newBuilding = { ...building };
      const imageWidth = window.innerWidth - 200;
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
      className="absolute z-10 bg-gray-500 border-2 border-black"
      style={Object.assign({
        zIndex: 10,
        left: room.topLeft[0] + "%",
        top: room.topLeft[1] + "%",
        height: room.height + "%",
        width: room.width + "%",
        userSelect: "none",
      })}
    >
      {room.name}
    </div>
  ));

  const boxInProg = () => {
    if (newBox.height > 0) {
      return (
        <div
          className="absolute z-10 bg-gray-500 border-2 border-black"
          style={Object.assign({
            zIndex: 10,
            left: newBox.topLeft[0] + "%",
            top: newBox.topLeft[1] + "%",
            height: newBox.height + "%",
            width: newBox.width + "%",
            userSelect: "none",
          })}
        >
          {newRoomName}
        </div>
      );
    }
  };

  const img = {
    height: building.height,
    width: building.width,
    url: "https://media.licdn.com/dms/image/C5603AQHdnuerzA9i5A/profile-displayphoto-shrink_400_400/0/1635394928434?e=1717027200&v=beta&t=Aw4YRksXsmLtC3B1NQ77Ky2EnWPm2b3Mi03l3yF0cfQ",
  };
  return (
    <>
      <div className="prose">
        <h1>FLOORPLAN</h1>
        <p>To test the image select idea</p>
        <input type="file" onChange={(e) => handleFile(e)}></input>
        <span>{origin + " , " + target + " , " + limit}</span>
        <span>{[newBox.topLeft, newBox.width, newBox.height]}</span>
        <RectangleSelection
          onSelect={(e, coords) => {
            setOrigin(coords.origin);
            setTarget(coords.target);
            setLimit(coords.limit);
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
        <button onClick={handleClick}>ok</button>
      </div>
    </>
  );
};
