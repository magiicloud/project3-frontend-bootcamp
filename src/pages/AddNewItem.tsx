import React from "react";
import { cn } from "../lib/utils";
import { useAuthenticatedRequest } from "../authenticatedRequest";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { Calendar } from "../components/ui/calendar";
import { Separator } from "../components/ui/separator";
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
import { useRooms } from "../hooks/useFetchFormData";

const formSchema = z.object({
  serialNum: z.string().min(1, "Serial number cannot be blank"),
  itemName: z.string().min(1, "Item name cannot be blank"),
  quantity: z.coerce.number().min(1, "Quantity cannot be blank"),
  uom: z.string().min(1, "UOM cannot be blank"),
  par: z.coerce.number().min(1, "Par level cannot be blank"),
  expiryDate: z.date({
    required_error: "An expiry date is required.",
  }),
  roomSelect: z.coerce.number().min(1, "Please select a room to display."),
});

export const AddNewItem = () => {
  // Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serialNum: "",
      itemName: "",
      quantity: 0,
      uom: "",
      par: 0,
      roomSelect: 0,
    },
  });

  const sendRequest = useAuthenticatedRequest();

  const searchWithSerialNum = async (serialNum: string, selectRoom: number) => {
    try {
      const response = await sendRequest(
        `/findserial/${serialNum}/${selectRoom}`,
        { method: "GET" }
      );
      form.setValue("itemName", response.data.item_name);
      form.setValue("uom", response.data.roomItems[0].uom);
      form.setValue(
        "expiryDate",
        new Date(response.data.roomItems[0].expiry_date)
      );
    } catch (error) {
      console.error("Error searching backend:", error);
    }
  };

  const { rooms, error: roomsError, isLoading: roomsLoading } = useRooms();

  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    try {
      const response = await sendRequest(`/addnewitem/`, {
        method: "POST",
        data: formData,
      });
      response.data.success === true && form.reset();
      toast({
        title: "Item added",
      });
    } catch (error) {
      console.error("Error searching backend:", error);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="pb-8 px-12 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-7"
        >
          <h3 className="text-left text-primary font-bold text-xl mt-5 sm:col-start-1 sm:col-span-4">
            Step 1
          </h3>

          {/* SELECT ROOMS */}
          <div className="sm:col-start-1 sm:col-span-3">
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

          <div className="sm:col-start-5 sm:col-span-3">
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
                  <FormDescription>Type the serial number.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="sm:col-start-1 sm:col-span-3">
            <FormField
              control={form.control}
              name="itemName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Type in the item name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Type the item name to be added.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-8 sm:col-start-1 sm:col-span-7">
            <Separator />
          </div>

          <h3 className="text-primary text-left font-bold text-xl sm:col-start-1 sm:col-span-4">
            Step 2
          </h3>

          <div className="sm:col-start-1 sm:col-span-2">
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

          <div className="sm:col-span-3">
            <FormField
              control={form.control}
              name="uom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UOM</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. TAB, BOT, TUBE..." {...field} />
                  </FormControl>
                  <FormDescription>State the unit of measure.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="sm:col-span-2">
            <FormField
              control={form.control}
              name="par"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Par Level</FormLabel>
                  <FormControl>
                    <Input placeholder="Type here" {...field} type="number" />
                  </FormControl>
                  <FormDescription>Overall par level.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* DATE PICKER */}
          <div className="sm:col-start-1 sm:col-span-2">
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
          <div className="sm:col-span-5"></div>
          <div className="mt-6 sm:col-start-1 sm:col-span-2">
            <Button type="submit" size={"lg"}>
              Add Item
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
