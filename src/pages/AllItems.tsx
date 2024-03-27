import React, { useEffect, useState } from "react";
import { BACKEND_URL } from "../constants";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

interface Item {
  id: number;
  serial_num: string;
  item_name: string;
  par_level: number;
}

export const AllItems = () => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const getItems = async () => {
      try {
        const allItemsData = await axios.get(`${BACKEND_URL}/allitems/`);
        setItems(allItemsData.data);
      } catch (error) {
        console.error(error);
      }
    };
    getItems();
  }, []);
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.serial_num}</TableCell>
                  <TableCell>{item.item_name}</TableCell>
                  <TableCell>{item.par_level}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};
