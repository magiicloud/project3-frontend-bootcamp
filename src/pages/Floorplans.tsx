import React, { useEffect } from "react";
import { cn } from "../lib/utils";
import { buttonVariants } from "../components/ui/button";
import { NewFloorplan } from "../components/NewFloorplan";

export const Floorplans = () => {
  return (
    <>
      <div className="prose">
        <h1>Floorplans</h1>
        <NewFloorplan />
      </div>
    </>
  );
};
