import React, { ReactNode, useEffect, useState } from "react";
import {
  ArrowUpRight,
  BatteryLowIcon,
  Clock4Icon,
  Building,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useAuthenticatedRequest } from "../authenticatedRequest";
import { building, buildingList, useBuildings } from "../hooks/useBuildings";
import {
  generateExpItemExcel,
  generateParItemExcel,
} from "../components/utils/generateExcel";
import { set } from "date-fns";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";

interface ExpItem {
  id: number;
  room_id: number;
  item_id: number;
  quantity: number;
  uom: string;
  expiry_date: string;
  createdAt: string;
  updatedAt: string;
  item: { serial_num: string; item_name: string };
  room: { name: string };
}

interface ParItem {
  id: number;
  itemTotal: number;
  item_name: string;
  par_level: number;
  serial_num: string;
}

export const Dashboard = () => {
  const sendRequest = useAuthenticatedRequest();
  const [expCount, setExpCount] = useState(0);
  const [expItems, setExpItems] = useState<ExpItem[]>([]);
  const [parCount, setParCount] = useState(0);
  const [parItems, setParItems] = useState<ParItem[]>([]);
  const [buildings, setBuildings] = useState<buildingList>([]);
  const [currentBuilding, setCurrentBuilding] = useState<building | undefined>(
    undefined
  );

  const { fetchBuildings } = useBuildings();

  const getShortExp = async () => {
    try {
      if (currentBuilding !== undefined) {
        const response = await sendRequest(`/getexpiry/${currentBuilding.id}`, {
          method: "GET",
        });
        setExpCount(response.data.count);
        setExpItems(response.data.items);
      }
    } catch (error) {
      console.error("Error searching backend:", error);
    }
  };

  const getBelowPar = async () => {
    try {
      if (currentBuilding !== undefined) {
        const response = await sendRequest(
          `/getbelowpar/${currentBuilding.id}`,
          {
            method: "GET",
          }
        );
        setParCount(response.data.count[0].count);
        setParItems(response.data.items);
      }
    } catch (error) {
      console.error("Error searching backend:", error);
    }
  };

  const getBuildings = async () => {
    try {
      const newBuildings = await fetchBuildings();
      setBuildings(newBuildings);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBuildings();
  }, []);

  useEffect(() => {
    getShortExp();
    getBelowPar();
  }, [currentBuilding]);

  function calculateDaysTillExpiry(expiryDate: string) {
    const currentDate = new Date();
    const expDate = new Date(expiryDate);
    const timeDiff = expDate.getTime() - currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff >= 0 ? daysDiff : 0; // Ensures negative days are not shown
  }

  const buildingContent = () => {
    if (currentBuilding !== undefined) {
      return (
        <div className="w-full flex flex-row">
          <div className="h-[150px] w-[250px] m-1 flex justify-center items-center">
            <img
              className="m-0 max-w-full max-h-full"
              src={currentBuilding.building_img_url}
              alt="building preview"
            />
          </div>
          <div className="flex items-center m-5">
            <h1 className="prose m-0">Building Name: {currentBuilding.name}</h1>
          </div>
        </div>
      );
    } else {
      return (
        <div className="h-full w-full m-1 flex justify-center items-center">
          <h1>You do not have any active buildings</h1>
        </div>
      );
    }
  };

  const generateNoItemsToDisplayMessage = (field: string) => {
    if (currentBuilding === undefined) {
      return "Please select a building to continue.";
    } else if (field === "par") {
      return "You have no items reaching par.";
    } else if (field === "expiry") {
      return "You have no expiring items.";
    }
  };

  return (
    <>
      {/* <h2 className="px-8 mt-2 mb-0">Dashboard</h2> */}
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium text-primary">
                Short Expiry Items
              </CardTitle>
              <Clock4Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{expCount}</div>
              <p className="text-sm text-muted-foreground">
                Expiry less than 6 months from today
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium text-primary">
                Near Par Items
              </CardTitle>
              <BatteryLowIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{parCount}</div>
              <p className="text-sm text-muted-foreground">
                Below 150% par level
              </p>
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium text-primary">
                Current Building
              </CardTitle>
              <Select
                onValueChange={(value) =>
                  setCurrentBuilding(buildings[Number(value)])
                }
              >
                <SelectTrigger className="max-w-[170px] ml-auto mr-2 border border-gray-500 rounded-md">
                  <SelectValue placeholder="Select Building" />
                </SelectTrigger>
                <SelectContent>
                  {buildings.map((building, index) => (
                    <SelectItem key={index} value={String(index)}>
                      {building.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>{buildingContent()}</CardContent>
          </Card>
        </div>
        {/* <div className="grid gap-4 md:gap-8 lg:grid-cols-2 2xl:grid-cols-3">
          <Card className="2xl:col-span-2"> */}
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-top">
              <div className="grid gap-2 mb-6">
                <CardTitle className="text-primary font-medium">
                  Items to Reorder
                </CardTitle>
                <CardDescription>
                  Items with less than 150% par level
                </CardDescription>
              </div>
              <Button
                size="sm"
                className="ml-auto gap-1"
                onClick={() => {
                  generateParItemExcel(parItems);
                }}
              >
                Download
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </CardHeader>
            {/* {parDisplay} */}
            {parItems.length > 0 ? (
              parItems.map((item, index) => (
                <CardContent key={index} className="grid gap-8 mb-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarImage src="/avatars/03.png" alt="Avatar" />
                      <AvatarFallback>{index + 1}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1 w-full">
                      <p className="text-sm font-medium leading-none m-0">
                        {item.item_name}
                      </p>
                      <p className="text-sm text-muted-foreground m-0">
                        {item.serial_num}
                      </p>
                      <Badge variant={"outline"} className="w-fit">
                        Par: {item.par_level}
                      </Badge>
                    </div>
                    <div className="grid text-center h-full items-center">
                      <Badge variant={"secondary"} className="w-full py-2 px-8">
                        {item.itemTotal} left
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              ))
            ) : (
              <CardContent>
                {generateNoItemsToDisplayMessage("par")}
              </CardContent>
            )}
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-top mb-6">
              <div className="grid gap-2">
                <CardTitle className="text-primary font-medium">
                  Short Expiry
                </CardTitle>
                <CardDescription>Items expiring in 6 months</CardDescription>
              </div>
              <Button
                size="sm"
                className="ml-auto gap-1"
                onClick={() => {
                  generateExpItemExcel(expItems);
                }}
              >
                Download
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </CardHeader>
            {expItems.length > 0 ? (
              expItems.map((item, index) => (
                <CardContent key={item.id} className="grid gap-8 mb-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarImage src="/avatars/03.png" alt="Avatar" />
                      <AvatarFallback>{index + 1}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1 w-full">
                      <p className="text-sm font-medium leading-none m-0">
                        {item.item.item_name}
                      </p>
                      <p className="text-sm text-muted-foreground m-0">
                        {item.item.serial_num}
                      </p>
                      <div className="flex flex-1 gap-1">
                        <Badge variant={"outline"} className="w-fit">
                          Exp: {new Date(item.expiry_date).toLocaleDateString()}
                        </Badge>
                        <Badge variant={"secondary"} className="w-fit">
                          {item.room.name}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 text-center h-full items-center">
                      <Badge variant={"secondary"} className="w-full py-3 px-4">
                        {calculateDaysTillExpiry(item.expiry_date)} days till
                        expiry
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              ))
            ) : (
              <CardContent>
                {generateNoItemsToDisplayMessage("expiry")}
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </>
  );
};
