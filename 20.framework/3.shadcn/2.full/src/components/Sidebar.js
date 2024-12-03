import React from "react";
import { Button } from "./ui/button";

const Sidebar = ({ onMenuSelect }) => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col">
      <h2 className="text-lg font-bold p-4">Menu</h2>
      <Button variant="default" onClick={() => onMenuSelect("dashboard")}>Dashboard</Button>
      <Button variant="default" onClick={() => onMenuSelect("table")}>Table</Button>
      <Button variant="default" onClick={() => onMenuSelect("chart")}>Chart</Button>
    </div>
  );
};

export default Sidebar;
