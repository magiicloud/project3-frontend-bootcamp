import React, { useEffect, useState } from "react";
import { cn } from "../lib/utils";
import { BACKEND_URL } from "../constants";
import axios from "axios";
import { toast } from "../components/ui/use-toast";
import { Button } from "../components/ui/button";
import { TrashIcon } from "@radix-ui/react-icons";
import { ShoppingCart } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "../components/ui/sheet";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

import { useAllItems, useRooms } from "../hooks/useFetchFormData";

interface CartItem {
  id: number;
  cart_id: number;
  item_id: number;
  room_id: number;
  quantity: number;
  expiry_date: string;
  createdAt: string;
  updatedAt: string;
  item: {
    id: number;
    serial_num: string;
    item_name: string;
    par_level: number;
    createdAt: string;
    updatedAt: string;
  };
}

export const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  return (
    <>
      <div className="flex justify-end p-8">
        <Sheet>
          <SheetTrigger
            onClick={async () => {
              try {
                const response = await axios.get(
                  `${BACKEND_URL}/getactivecart`
                );
                console.log(response.data.cartLineItems);
                setCartItems(response.data.cartLineItems);
              } catch (error) {
                console.error("Error getting cart:", error);
              }
            }}
          >
            <Button variant="outline" className="rounded-full">
              <ShoppingCart />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Transactions</SheetTitle>
              <SheetDescription>Pending transactions</SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              {cartItems.map((cartItem) => (
                <Card key={cartItem.item.id}>
                  <CardHeader className="pb-0">
                    <CardTitle>{cartItem.item.item_name}</CardTitle>
                    <CardDescription>Qty: {cartItem.quantity}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-end pt-0">
                    <Button variant={"ghost"}>
                      <TrashIcon />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit">Checkout</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};
