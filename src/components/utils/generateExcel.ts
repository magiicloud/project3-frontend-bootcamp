import ExcelJS from "exceljs";

interface ExpItem {
  id: number;
  room_id: number;
  item_id: number;
  quantity: number;
  uom: string;
  expiry_date: string;
  createdAt: string;
  updatedAt: string;
  item: { serial_num: string; item_name: string };
  room: { name: string };
}

interface ParItem {
  id: number;
  itemTotal: number;
  item_name: string;
  par_level: number;
  serial_num: string;
}

export interface AllItemsTable {
  id: number;
  serial_num: string;
  item_name: string;
  par_level: number;
  room: string;
  quantity: number;
  uom: string;
  expiry_date: string;
}

export const generateExpItemExcel = async (expItems: ExpItem[]) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("ExpItems");

  worksheet.columns = [
    { header: "Serial No.", key: "serial_num", width: 20 },
    { header: "Item Name", key: "item_name", width: 30 },
    { header: "Room", key: "room_name", width: 20 },
    { header: "Quantity", key: "quantity", width: 10 },
    { header: "UOM", key: "uom", width: 10 },
    { header: "Exp Date", key: "expiry_date", width: 15 },
  ];

  expItems.forEach((item) => {
    worksheet.addRow({
      serial_num: item.item.serial_num,
      item_name: item.item.item_name,
      room_name: item.room.name,
      quantity: Number(item.quantity),
      uom: item.uom,
      expiry_date: new Date(item.expiry_date).toLocaleDateString(),
    });
  });

  // Use a Blob to generate a file in-memory and trigger a download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);

  // Create a temporary anchor to trigger download
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "ExpItems.xlsx"; // Name of the file to be downloaded
  document.body.appendChild(anchor); // Required for Firefox
  anchor.click();

  // Clean up
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

export const generateParItemExcel = async (expItems: ParItem[]) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("ParItems");

  worksheet.columns = [
    { header: "Serial No.", key: "serial_num", width: 20 },
    { header: "Item Name", key: "item_name", width: 30 },
    { header: "Par Level", key: "par", width: 10 },
    { header: "Quantity", key: "quantity", width: 10 },
  ];

  expItems.forEach((item) => {
    worksheet.addRow({
      serial_num: item.serial_num,
      item_name: item.item_name,
      par: Number(item.par_level),
      quantity: Number(item.itemTotal),
    });
  });

  // Use a Blob to generate a file in-memory and trigger a download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);

  // Create a temporary anchor to trigger download
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "ParItems.xlsx"; // Name of the file to be downloaded
  document.body.appendChild(anchor); // Required for Firefox
  anchor.click();

  // Clean up
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

export const generateAllItemsTableExcel = async (allItems: any[]) => {
  console.log(allItems);
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("AllItems");

  worksheet.columns = [
    { header: "Serial No.", key: "serial_num", width: 20 },
    { header: "Item Name", key: "item_name", width: 30 },
    { header: "Par Level", key: "par_level", width: 15 },
    { header: "Room", key: "room", width: 15 },
    { header: "Quantity", key: "quantity", width: 10 },
    { header: "UOM", key: "uom", width: 10 },
    { header: "Exp Date", key: "expiry_date", width: 15 },
  ];

  allItems.forEach((item) => {
    worksheet.addRow({
      serial_num: item.serial_num,
      item_name: item.item_name,
      par_level: item.par_level,
      room: item.room,
      quantity: Number(item.quantity),
      uom: item.uom,
      expiry_date: item.expiry_date,
    });
  });

  // Use a Blob to generate a file in-memory and trigger a download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);

  // Create a temporary anchor to trigger download
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "AllItems.xlsx"; // Name of the file to be downloaded
  document.body.appendChild(anchor); // Required for Firefox
  anchor.click();

  // Clean up
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};
