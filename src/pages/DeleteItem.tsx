import React, { useEffect, useState } from "react";
import { cn } from "../lib/utils";
import { BACKEND_URL } from "../constants";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormState } from "react-hook-form";
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
  type: z.enum(["deleteroomitem", "deleteall", "move"], {
    required_error: "You need to select a transaction type.",
  }),
  serialNum: z.string().min(1, "Serial number cannot be blank"),
  itemName: z.string().optional(),
  quantity: z.coerce.number().optional(),
  expiryDate: z
    .date({
      required_error: "An expiry date is required.",
    })
    .optional(),
  roomSelect: z.coerce.number().nonnegative("Please select a room to display."),
});

export const DeleteItem = () => {
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

    if (form.getValues("type") === "deleteroomitem") {
      try {
        const response = await axios.delete(`${BACKEND_URL}/deleteroomitem`, {
          data: formData,
        });
        console.log(response.data);
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
        form.formState.isSubmitSuccessful && form.reset();
      } catch (error) {
        console.error("Error searching backend:", error);
      }
    }

    if (form.getValues("type") === "deleteall") {
      try {
        const response = await axios.delete(`${BACKEND_URL}/deleteitem`, {
          data: formData,
        });
        console.log(response.data);
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
        form.formState.isSubmitSuccessful && form.reset();
      } catch (error) {
        console.error("Error searching backend:", error);
      }
    }
  };

  const searchWithSerialNum = async (serialNum: string, selectRoom: number) => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/findserial/${serialNum}/${selectRoom}`
      );
      console.log(response.data);
      form.setValue("itemName", response.data.item_name);
      form.setValue("quantity", response.data.roomItems[0].quantity);
      form.setValue(
        "expiryDate",
        new Date(response.data.roomItems[0].expiry_date)
      );
    } catch (error) {
      console.error("Error searching backend:", error);
    }
  };

  const selectedType = form.watch("type");

  useEffect(() => {
    if (selectedType) {
      form.resetField("itemName");
      form.resetField("serialNum");
      form.resetField("quantity");
      form.resetField("expiryDate");
    }
  }, [selectedType]);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="pb-8 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-8"
        >
          <h4 className="text-left sm:col-start-3 sm:col-span-4">
            Delete an item in a room..
          </h4>

          {/* Transaction Type Selection */}
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
                          <RadioGroupItem value="deleteroomitem" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Delete an item in a SINGLE room
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="deleteall" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Delete item in ALL rooms
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
            <FormField
              control={form.control}
              name="itemName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Type in the item name"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormDescription>
                    Type the item name to be added.
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
                    <Input placeholder="Type here" {...field} disabled />
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
                          disabled
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
