import React, { useEffect, useState } from "react";
import { Menu } from "lucide-react";

import { Button } from "../components/ui/button.jsx";
import SidebarLayout from "../components/layout/sidebarLayout.jsx";
import DashboardContent from "../components/dashboardContent.jsx";
import { useStore } from "../store/store.jsx";

const HRDashboard = () => {
  const { activeModule, changeModule } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    changeModule("Dashboard");
  }, []);

  return (
    <div className="flex h-screen">
      {sidebarOpen && (
        <SidebarLayout
          activeModule={activeModule}
          setActiveModule={changeModule}
        />
      )}
      <div className="flex-1 overflow-auto">
        <div className="p-4 bg-white shadow-md flex justify-between items-center">
          <Button variant="ghost" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu />
          </Button>
          <h1 className="text-xl font-bold">{activeModule}</h1>
        </div>

        <DashboardContent />
      </div>
    </div>
  );
};

export default HRDashboard;
