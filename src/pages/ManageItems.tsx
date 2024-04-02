import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { AddNewItem } from "./AddNewItem";
import { CycleCount } from "./CycleCount";

export const ManageItems = () => {
  return (
    <>
      <div className="prose flex flex-col p-6 max-w-full">
        <Tabs
          defaultValue="count"
          className="space-y-4 flex flex-col justify-center"
        >
          <TabsList className="bg-transparent pb-8 grid grid-cols-1 gap-y-8 gap-x-1 sm:grid-cols-8">
            <TabsTrigger
              value="count"
              className="bg-gray-100 rounded-3xl px-5 py-2 transition-colors hover:text-primary text-muted-foreground sm:col-start-3 sm:col-span-1"
            >
              Cycle Count
            </TabsTrigger>
            <TabsTrigger
              value="add"
              className="bg-gray-100 rounded-3xl px-5 py-2 transition-colors hover:text-primary text-muted-foreground sm:col-span-1"
            >
              Add New Item
            </TabsTrigger>
            <TabsTrigger
              value="move"
              className="bg-gray-100 rounded-3xl px-5 py-2 transition-colors hover:text-primary text-muted-foreground sm:col-span-1"
            >
              Daily Movement
            </TabsTrigger>
          </TabsList>
          <TabsContent value="count">
            <CycleCount />
          </TabsContent>
          <TabsContent value="add">
            <AddNewItem />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};
