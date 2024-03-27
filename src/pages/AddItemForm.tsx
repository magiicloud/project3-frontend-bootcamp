import React, { useEffect, useState } from "react";
import { cn } from "../lib/utils";
import { BACKEND_URL } from "../constants";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { Calendar } from "../components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { z } from "zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { toast } from "../components/ui/use-toast";
import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const formSchema = z.object({
  type: z.enum(["add", "count", "move"], {
    required_error: "You need to select a transaction type.",
  }),
  materialCode: z.string().min(1, "Material code cannot be blank"),
  itemName: z.string().min(1, "Item name cannot be blank"),
  quantity: z.number().min(1, "Quantity cannot be blank"),
  expiryDate: z.date({
    required_error: "An expiry date is required.",
  }),
  roomSelect: z.string().min(1, "Please select a room to display."),
});

interface Room {
  id: number;
  name: string;
}

interface Item {
  id: number;
  item_name: string;
  serial_num: string;
}

const RoomOptions = () => {
  const [roomOptions, setRoomOptions] = useState<Room[]>([]);

  useEffect(() => {
    const getRooms = async () => {
      try {
        const allRooms = await axios.get(`${BACKEND_URL}/rooms/`);
        setRoomOptions(allRooms.data);
      } catch (error) {
        console.error(error);
      }
    };
    getRooms();
  }, []);

  return (
    <>
      {roomOptions.map((option) => (
        <SelectItem key={option.id} value={option.id.toString()}>
          {option.name}
        </SelectItem>
      ))}
    </>
  );
};

const ItemOptions = () => {
  const [itemOptions, setItemOptions] = useState<Item[]>([]);

  useEffect(() => {
    const getItems = async () => {
      try {
        const allItems = await axios.get(`${BACKEND_URL}/allitems/`);
        setItemOptions(allItems.data);
        console.log(allItems.data);
      } catch (error) {
        console.error(error);
      }
    };
    getItems();
  }, []);

  return (
    <>
      {itemOptions.map((option) => (
        <SelectItem key={option.id} value={option.serial_num}>
          {option.item_name}
        </SelectItem>
      ))}
    </>
  );
};

export const AddItemForm = () => {
  // Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      materialCode: "",
      itemName: "",
      quantity: 0,
      roomSelect: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <>
      <div className="prose flex flex-col p-6 max-w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="pb-8 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-8"
          >
            <h1 className="sm:col-start-3 sm:col-span-4">Manage Items</h1>
            <div className="mb-3 sm:col-start-3 sm:col-span-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Choose transaction type...</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-3"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="add" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Add new item
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="count" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Cycle count
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="move" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Item movement
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* TEXT INPUT BOX */}
            {/* <div className="sm:col-start-3 sm:col-span-4">
              <FormField
                control={form.control}
                name="materialCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Material Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Type or scan here" {...field} />
                    </FormControl>
                    <FormDescription>
                      Type or scan the material code.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div> */}
            {/* <div className="sm:col-start-3 sm:col-span-4">
              <FormField
                control={form.control}
                name="itemName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Type here" {...field} />
                    </FormControl>
                    <FormDescription>Type the item name.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div> */}
            <div className="sm:col-start-3 sm:col-span-4">
              <FormField
                control={form.control}
                name="itemName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Item</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an item to display" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* Select Item Component */}
                        <ItemOptions />
                      </SelectContent>
                    </Select>

                    <FormDescription>
                      Select the item that you want to transact.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="sm:col-start-3 sm:col-span-2">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input placeholder="Type here" {...field} />
                    </FormControl>
                    <FormDescription>
                      Quantity of item in location.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* SELECT ROOMS */}
            <div className="sm:col-span-2">
              <FormField
                control={form.control}
                name="roomSelect"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Room</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a room to display" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* Select Room Component */}
                        <RoomOptions />
                      </SelectContent>
                    </Select>

                    <FormDescription>
                      Select the room that the item belong to.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* DATE PICKER */}
            <div className="mt-2 sm:col-start-3 sm:col-span-4">
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Expiry Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Pick the earliest expiry date of the lot.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-6 sm:col-start-4 sm:col-span-2">
              <Button type="submit" size={"full"}>
                Add to cart
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};
