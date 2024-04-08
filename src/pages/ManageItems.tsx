import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { AddNewItem } from "./AddNewItem";
import { CycleCount } from "./CycleCount";
import { DeleteItem } from "./DeleteItem";

export const ManageItems = () => {
  return (
    <>
      <Tabs
        defaultValue="count"
        className="m-5 px-3 space-y-8 flex flex-col justify-center"
      >
        <TabsList className="bg-transparent pb-8 grid grid-cols-3 gap-y-1 gap-x-1 sm:grid-cols-8 sm:gap-y-8">
          <TabsTrigger
            value="count"
            className="data-[state=active]:bg-muted data-[state=active]:font-medium font-normal rounded-3xl px-5 py-2 transition-colors hover:text-primary hover:font-medium text-muted-foreground sm:col-start-1 sm:col-span-1"
          >
            Cycle Count
          </TabsTrigger>
          <TabsTrigger
            value="add"
            className="data-[state=active]:bg-muted data-[state=active]:font-medium font-normal rounded-3xl px-5 py-2 transition-colors hover:text-primary hover:font-medium text-muted-foreground sm:col-span-1"
          >
            Add New Item
          </TabsTrigger>
          <TabsTrigger
            value="delete"
            className="data-[state=active]:bg-muted data-[state=active]:font-medium font-normal rounded-3xl px-5 py-2 transition-colors hover:text-primary hover:font-medium text-muted-foreground sm:col-span-1"
          >
            Delete Item
          </TabsTrigger>
        </TabsList>
        <div className="mx-1 w-full rounded-lg border border-dashed shadow-sm">
          <TabsContent value="count">
            <CycleCount />
          </TabsContent>
          <TabsContent value="add">
            <AddNewItem />
          </TabsContent>
          <TabsContent value="delete">
            <DeleteItem />
          </TabsContent>
        </div>
      </Tabs>
    </>
  );
};
