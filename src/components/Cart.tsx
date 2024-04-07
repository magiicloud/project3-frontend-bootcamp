import React, { useEffect, useState } from "react";
import { BACKEND_URL } from "../constants";
import axios, { AxiosError } from "axios";
import { useAuthenticatedRequest } from "../authenticatedRequest";
import { toast } from "../components/ui/use-toast";
import { Button } from "../components/ui/button";
import { TrashIcon } from "@radix-ui/react-icons";
import { ShoppingCart } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "../components/ui/sheet";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

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

interface Rooms {
  id: number;
  name: string;
}

interface CartLineItemId {
  cartLineItemId: number;
}

interface CheckoutSuccess {
  onSuccessfulCheckout?: () => void;
}

const popupToast = (errTitle: string, descriptionJson: string) => {
  return toast({
    title: errTitle,
    description: (
      <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        <code className="text-white">
          {JSON.stringify(descriptionJson, null, 2)}
        </code>
      </pre>
    ),
  });
};

export const Cart: React.FC<CheckoutSuccess> = ({ onSuccessfulCheckout }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [rooms, setRooms] = useState<Rooms[]>([]);
  const sendRequest = useAuthenticatedRequest();

  const openCart = async () => {
    try {
      // const activecart = await axios.get(`${BACKEND_URL}/getactivecart`);
      const activecart = await sendRequest(`/getactivecart/`, {
        method: "GET",
      });
      // const roomlist = await axios.get(`${BACKEND_URL}/allrooms`);
      const roomlist = await sendRequest(`/allrooms/`, {
        method: "GET",
      });
      console.log(activecart.data.cartLineItems);
      setCartItems(activecart.data.cartLineItems);
      console.log(roomlist.data);
      setRooms(roomlist.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Check if the error is an Axios error
        const serverError = error.response;

        if (serverError) {
          // Access detailed error information
          console.error(
            "Error getting cart:",
            serverError.status,
            serverError.data
          );
          popupToast(
            `Error getting cart: Status ${serverError.status}`,
            `${serverError.data.message}`
          );
        } else {
          // Error does not have a response (network error, timeout, etc)
          console.error("Error getting cart:", error.message);
          popupToast("Error getting cart", `${error.message}`);
        }
      } else {
        // Error is not from Axios
        console.error("Non-Axios error:", error);
        popupToast("Error getting cart", `${error}`);
      }
    }
  };

  const checkout = async () => {
    try {
      // const submit = await axios.put(`${BACKEND_URL}/checkoutcyclecount`);
      const submit = await sendRequest(`/checkoutcyclecount/`, {
        method: "PUT",
      });
      toast({
        title: "Checkout success",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              <p>Items updated succesfully!</p>
            </code>
          </pre>
        ),
      });
      setCartItems([]);
      setRooms([]);
      onSuccessfulCheckout?.();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Check if the error is an Axios error
        const serverError = error.response;

        if (serverError) {
          // Access detailed error information
          console.error(
            "Error checking out:",
            serverError.status,
            serverError.data
          );
          popupToast(
            `Error checking out: Status ${serverError.status}`,
            `${serverError.data.message}`
          );
        } else {
          // Error does not have a response (network error, timeout, etc)
          console.error("Error checking out:", error.message);
          popupToast("Error checking out", `${error.message}`);
        }
      } else {
        // Error is not from Axios
        console.error("Non-Axios error:", error);
        popupToast("Error checking out", `${error}`);
      }
    }
  };

  const deleteItem = async (cartLineItemId: CartLineItemId) => {
    try {
      const submit = await sendRequest(`/deleteitemincart/`, {
        method: "DELETE",
        data: cartLineItemId,
      });
      toast({
        title: "Item deleted",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              <p>Item deleted succesfully!</p>
            </code>
          </pre>
        ),
      });
      openCart();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Check if the error is an Axios error
        const serverError = error.response;

        if (serverError) {
          // Access detailed error information
          console.error(
            "Error deleting item:",
            serverError.status,
            serverError.data
          );
          popupToast(
            `Error deleting item: Status ${serverError.status}`,
            `${serverError.data.message}`
          );
        } else {
          // Error does not have a response (network error, timeout, etc)
          console.error("Error deleting item:", error.message);
          popupToast("Error deleting item", `${error.message}`);
        }
      } else {
        // Error is not from Axios
        console.error("Non-Axios error:", error);
        popupToast("Error deleting item", `${error}`);
      }
    }
  };
  console.log(cartItems);

  const CheckoutCart = () => {
    return (
      <Table>
        <TableCaption>Check through each item before you checkout</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Room</TableHead>
            <TableHead>Quantity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cartItems.map((cartItem, index) => {
            const room = rooms.find((room) => room.id === cartItem.room_id);
            return (
              <TableRow key={index}>
                <TableCell>{cartItem.item.item_name}</TableCell>
                <TableCell>{room ? room.name : "Room not found"}</TableCell>
                <TableCell>{cartItem.quantity}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant={"ghost"}
                    onClick={() => {
                      deleteItem({ cartLineItemId: cartItem.id });
                    }}
                  >
                    <TrashIcon />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  };

  return (
    <>
      <div className="flex justify-end p-8">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant={"outline"}
              onClick={openCart}
              className="rounded-full"
            >
              <ShoppingCart />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px] lg:w-[720px]">
            <SheetHeader>
              <SheetTitle>Transactions</SheetTitle>
            </SheetHeader>
            <div className="py-8">
              <CheckoutCart />
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit" onClick={checkout}>
                  Checkout
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};
