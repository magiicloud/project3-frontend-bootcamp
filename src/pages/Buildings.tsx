import React, { useEffect } from "react";
import { cn } from "../lib/utils";
import { buttonVariants } from "../components/ui/button";
import { NewBuilding } from "../components/NewBuilding";

export const Buildings = () => {
  return (
    <>
      <div className="prose">
        <h1>BUILDINGS</h1>
        <NewBuilding />
      </div>
    </>
  );
};
