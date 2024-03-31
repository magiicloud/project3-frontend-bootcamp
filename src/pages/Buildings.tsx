import React, { useEffect } from "react";
import { cn } from "../lib/utils";
import { buttonVariants } from "../components/ui/button";
import { NewBuilding } from "../components/NewBuilding";
import { BuildingsList } from "../components/BuildingsList";

export const Buildings = () => {
  return (
    <>
      <div className="prose max-w-none">
        <h1>BUILDINGS</h1>
        <NewBuilding />
        <BuildingsList />
      </div>
    </>
  );
};
