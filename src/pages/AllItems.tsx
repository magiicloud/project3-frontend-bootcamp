import React from "react";
import { useAllItems } from "../hooks/useFetchFormData";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

export const AllItems = () => {
  const { allItems, error: allItemsError } = useAllItems();
  if (allItemsError) return <div>Error loading items.</div>;
  if (!allItems.length) return <div>Loading items...</div>;

  return (
    <>
      <div className="prose grid grid-cols-1 p-6 max-w-full sm:grid-cols-6 sm:p-12">
        <h1 className="text-left p-2 text-gray-600 sm:col-span-6">All Items</h1>
        <div className="sm:col-span-6">
          <Table>
            <TableCaption>A list of all items.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Serial No.</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead>Par Level</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Expiry Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.serial_num}</TableCell>
                  <TableCell>{item.item_name}</TableCell>
                  <TableCell>{item.par_level}</TableCell>
                  <TableCell>
                    {item.roomItems.map((roomItem) => (
                      <p key={roomItem.id}>{roomItem.room.name}</p>
                    ))}
                  </TableCell>
                  <TableCell>
                    {item.roomItems.map((roomItem) => (
                      <div key={roomItem.id}>
                        <p>
                          {roomItem.quantity} {roomItem.uom}
                        </p>
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    {item.roomItems.map((roomItem) => (
                      <div key={roomItem.id}>
                        {roomItem.expiry_date ? (
                          <p>
                            {new Date(
                              roomItem.expiry_date
                            ).toLocaleDateString()}
                          </p>
                        ) : (
                          "N/A"
                        )}
                      </div>
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};
