import React, { useEffect, useState } from "react";
import { cn } from "../lib/utils";
import { BACKEND_URL } from "../constants";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { Calendar } from "../components/ui/calendar";
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
  materialCode: z
    .string()
    .min(3, "Material code must be at least 3 characters long"),
  itemName: z.string().min(1, "Item name cannot be blank"),
  quantity: z.number().min(1, "Quantity cannot be blank"),
  expiryDate: z.date({
    required_error: "A date of birth is required.",
  }),
  roomSelect: z.string({
    required_error: "Please select a room to display.",
  }),
});

interface Room {
  id: number;
  name: string;
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
        <h1 className="text-center">Add Item</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="pb-8 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-8"
          >
            {/* TEXT INPUT BOX */}
            <div className="sm:col-start-3 sm:col-span-4">
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
            </div>
            <div className="sm:col-start-3 sm:col-span-4">
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
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};
