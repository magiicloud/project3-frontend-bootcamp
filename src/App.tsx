import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Buildings } from "./pages/Buildings";
import { Room } from "./pages/Room";
import { AllItems } from "./pages/AllItems";
import { ManageItems } from "./pages/ManageItems";
import { AddNewItem } from "./pages/AddNewItem";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/buildings" element={<Buildings />} />
        <Route path="/room" element={<Room />} />
        <Route path="/allitems" element={<AllItems />} />
        <Route path="/manageitems" element={<ManageItems />} />
        <Route path="/addnewitem" element={<AddNewItem />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
