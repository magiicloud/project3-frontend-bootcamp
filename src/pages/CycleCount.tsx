import React, { useEffect } from "react";
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
import { useAllItems, useRooms } from "../hooks/useFetchFormData";

const formSchema = z.object({
  serialNum: z.string().min(1, "Serial number cannot be blank"),
  itemName: z.string().min(1, "Item name cannot be blank"),
  quantity: z.coerce.number().min(1, "Quantity cannot be blank"),
  expiryDate: z.date({
    required_error: "An expiry date is required.",
  }),
  roomSelect: z.coerce.number().min(1, "Please select a room to display."),
});

export const CycleCount = () => {
  // Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serialNum: "",
      itemName: "",
      quantity: 0,
      roomSelect: 0,
    },
  });

  const { rooms, error: roomsError, isLoading: roomsLoading } = useRooms();
  const {
    allItems,
    error: allItemsError,
    isLoading: allItemsLoading,
  } = useAllItems();

  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    console.log(formData);

    try {
      const response = await axios.put(`${BACKEND_URL}/updateitem`, formData);
      console.log(response.data);
      form.formState.isSubmitSuccessful && form.reset();
      toast({
        title: "You submitted the following values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(formData, null, 2)}
            </code>
          </pre>
        ),
      });
    } catch (error) {
      console.error("Error searching backend:", error);
    }
  };

  const searchWithSerialNum = async (serialNum: string, selectRoom: number) => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/findserial/${serialNum}/${selectRoom}`
      );
      console.log(response.data);
      form.setValue("itemName", response.data.serial_num);
      form.setValue("quantity", response.data.roomItems[0].quantity);
      form.setValue(
        "expiryDate",
        new Date(response.data.roomItems[0].expiry_date)
      );
    } catch (error) {
      console.error("Error searching backend:", error);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="pb-8 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-8"
        >
          <h4 className="text-left sm:col-start-3 sm:col-span-4">
            Conduct a cycle count..
          </h4>

          {/* SELECT ROOMS */}
          <div className="sm:col-start-3 sm:col-span-4">
            {!roomsLoading && (
              <FormField
                control={form.control}
                name="roomSelect"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Room</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a room to display" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* Select Room Component */}
                        {roomsLoading && (
                          <SelectItem value="loading" disabled>
                            Loading rooms...
                          </SelectItem>
                        )}
                        {!roomsLoading && roomsError && (
                          <SelectItem value="error" disabled>
                            Error loading rooms.
                          </SelectItem>
                        )}
                        {!roomsLoading &&
                          !roomsError &&
                          rooms.map((room) => (
                            <SelectItem
                              key={room.id}
                              value={room.id.toString()}
                            >
                              {room.name}
                            </SelectItem>
                          ))}
                        {!roomsLoading && !roomsError && !rooms.length && (
                          <SelectItem value="no-rooms" disabled>
                            No rooms available.
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>

                    <FormDescription>
                      Select the room that the item belong to.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* TEXT INPUT BOX */}
          <div className="sm:col-start-3 sm:col-span-4">
            <FormField
              control={form.control}
              name="serialNum"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Serial Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Type or scan here"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        searchWithSerialNum(
                          e.target.value,
                          form.getValues("roomSelect")
                        );
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Type or scan the serial number.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="sm:col-start-3 sm:col-span-4">
            {!allItemsLoading && (
              <FormField
                control={form.control}
                name="itemName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Item</FormLabel>
                    <Select
                      onValueChange={(selectedItem) => {
                        field.onChange(selectedItem);
                        form.setValue("serialNum", selectedItem);
                        searchWithSerialNum(
                          selectedItem,
                          form.getValues("roomSelect")
                        );
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an item to display" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* Select Item Options */}
                        {allItemsLoading && (
                          <SelectItem value="loading" disabled>
                            Loading items...
                          </SelectItem>
                        )}
                        {!allItemsLoading && allItemsError && (
                          <SelectItem value="error" disabled>
                            Error loading items.
                          </SelectItem>
                        )}
                        {!allItemsLoading &&
                          !allItemsError &&
                          allItems.map((item) => (
                            <SelectItem key={item.id} value={item.serial_num}>
                              {item.item_name}
                            </SelectItem>
                          ))}
                        {!allItemsLoading &&
                          !allItemsError &&
                          !allItems.length && (
                            <SelectItem value="no-items" disabled>
                              No items available.
                            </SelectItem>
                          )}
                      </SelectContent>
                    </Select>

                    <FormDescription>
                      Select the item that you want to transact.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="sm:col-start-3 sm:col-span-2">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input placeholder="Type here" {...field} type="number" />
                  </FormControl>
                  <FormDescription>
                    Quantity of item in location.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* DATE PICKER */}
          <div className="sm:col-span-2">
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiry Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
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
                          date <= new Date() || date < new Date("1900-01-01")
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
    </>
  );
};
