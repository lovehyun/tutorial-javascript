import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Content from "./components/Content";

const App = () => {
  const [activeMenu, setActiveMenu] = useState("dashboard");

  return (
    <div className="flex">
      <Sidebar onMenuSelect={setActiveMenu} />
      <Content activeMenu={activeMenu} />
    </div>
  );
};

export default App;
