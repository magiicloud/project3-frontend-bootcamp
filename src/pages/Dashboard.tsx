import React, { useEffect, useState } from "react";
import {
  ArrowUpRight,
  BatteryLowIcon,
  Clock4Icon,
  Building,
} from "lucide-react";
import { Link } from "react-router-dom";
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
import { BuildingsList } from "../components/BuildingsList";

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

  const getShortExp = async () => {
    try {
      const response = await sendRequest(`/getexpiry/`, { method: "GET" });
      setExpCount(response.data.count);
      setExpItems(response.data.items);
    } catch (error) {
      console.error("Error searching backend:", error);
    }
  };

  const getBelowPar = async () => {
    try {
      const response = await sendRequest(`/getbelowpar/`, {
        method: "GET",
      });
      console.log(response.data.count[0].count);
      setParCount(response.data.count[0].count);
      setParItems(response.data.items);
    } catch (error) {
      console.error("Error searching backend:", error);
    }
  };

  useEffect(() => {
    getShortExp();
    getBelowPar();
  }, []);

  function calculateDaysTillExpiry(expiryDate: string) {
    const currentDate = new Date();
    const expDate = new Date(expiryDate);
    const timeDiff = expDate.getTime() - currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff >= 0 ? daysDiff : 0; // Ensures negative days are not shown
  }

  return (
    <>
      <h2 className="px-8 mt-2 mb-0">Dashboard</h2>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium">
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
              <CardTitle className="text-md font-medium">
                Near Par Items
              </CardTitle>
              <BatteryLowIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{parCount}</div>
              <p className="text-sm text-muted-foreground">
                Below 50% par level
              </p>
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium">
                Current Building
              </CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <BuildingsList />
            </CardContent>
          </Card>
        </div>
        {/* <div className="grid gap-4 md:gap-8 lg:grid-cols-2 2xl:grid-cols-3">
          <Card className="2xl:col-span-2"> */}
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Items to Reorder</CardTitle>
                <CardDescription>
                  Items with less than 50% par level
                </CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link to="../allitems">
                  Download
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            {parItems &&
              parItems.map((item, index) => (
                <CardContent className="grid gap-8 mb-10">
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
              ))}
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Short Expiry</CardTitle>
                <CardDescription>Items expiring in 6 months</CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link to="../allitems">
                  Download
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            {expItems.map((item, index) => (
              <CardContent className="grid gap-8 mb-10">
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
                    {/* <p className="text-sm font-medium m-0">
                      Exp: {new Date(item.expiry_date).toLocaleDateString()}
                    </p> */}
                    <Badge variant={"outline"} className="w-fit">
                      Exp: {new Date(item.expiry_date).toLocaleDateString()}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 text-center h-full items-center">
                    <Badge variant={"secondary"} className="w-full py-3 px-4">
                      {calculateDaysTillExpiry(item.expiry_date)} days till
                      expiry
                    </Badge>
                  </div>
                  {/* <div className="ml-auto font-medium">
                    {new Date(item.expiry_date).toLocaleDateString()}
                  </div> */}
                </div>
              </CardContent>
            ))}
          </Card>
        </div>
      </div>
    </>
  );
};