import React from "react";
import { Item, RoomItems } from "../pages/Room";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface ItemCardsProps {
  item: Item;
}

export const ItemCard: React.FC<ItemCardsProps> = (props) => {
  console.log(props.item);
  return (
    <Card className="w-[45%] m-2">
      <CardHeader>
        <CardTitle className="m-0">{props.item.item_name}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <div className="mb-1">
          <span className="font-semibold">Serial No.: </span>
          {props.item.serial_num}
        </div>
        <div className="mb-1">
          <span className="font-semibold">Par level: </span>
          {props.item.par_level}
        </div>
        <div className="mb-1">
          <span className="font-semibold">UOM: </span>
          {props.item.roomItems[0].uom}
        </div>
        <div className="mb-1">
          <span className="font-semibold">Expiry date: </span>
          {props.item.roomItems[0].expiry_date.split("T")[0]}
        </div>
      </CardContent>
    </Card>
  );
};
