import React from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useAllItems } from "../../hooks/useFetchFormData";

export const AllItems = () => {
  const { allItems, error: allItemsError } = useAllItems();
  if (allItemsError) return <div>Error loading items.</div>;
  if (!allItems.length) return <div>Loading items...</div>;

  // Flatten the allItems array to have a separate entry for each roomItem
  const data = allItems.flatMap((item) =>
    item.roomItems.map((roomItem) => ({
      serial_num: item.serial_num,
      item_name: item.item_name,
      par_level: item.par_level,
      room: roomItem.room.name,
      quantity: roomItem.quantity,
      uom: roomItem.uom,
      expiry_date: new Date(roomItem.expiry_date).toLocaleDateString(),
      id: roomItem.id.toString(),
    }))
  );

  return (
    <>
      <h2 className="px-3 mt-5">All Items</h2>
      <div className="grid grid-cols-1 mx-0 px-3 py-0">
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
};
