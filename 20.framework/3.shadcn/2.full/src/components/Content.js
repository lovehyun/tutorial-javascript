import React from "react";
import Table from "./Table";
import Chart from "./Chart";

const Content = ({ activeMenu }) => {
  return (
    <div className="flex-1 p-6 bg-gray-100">
      {activeMenu === "dashboard" && <h1 className="text-2xl font-bold">Welcome to the Dashboard!</h1>}
      {activeMenu === "table" && <Table />}
      {activeMenu === "chart" && <Chart />}
    </div>
  );
};

export default Content;
