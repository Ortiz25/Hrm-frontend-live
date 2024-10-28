import React, { useEffect, useState } from "react";
import { Menu } from "lucide-react";

import { Button } from "../components/ui/button.jsx";
import SidebarLayout from "../components/layout/sidebarLayout.jsx";
import DashboardContent from "../components/dashboardContent.jsx";
import { useStore } from "../store/store.jsx";
import { redirect, useLoaderData } from "react-router-dom";

const HRDashboard = () => {
  const { activeModule, changeModule, changeRole } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const dashData = useLoaderData();

  useEffect(() => {
    changeModule("Dashboard");
    changeRole(dashData.user.role);
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

        <DashboardContent dashData={dashData.dashData} />
      </div>
    </div>
  );
};

export default HRDashboard;

export async function loader() {
  const token = localStorage.getItem("token");

  if (!token) {
    return redirect("/");
  }
  const url = "http://localhost:5174/api/verifyToken";
  const url2 = "http://localhost:5174/api/dashboardData";
  const data = { token: token };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const response2 = await fetch(url2, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const userData = await response.json();

  if (userData.user.role === "employee") {
    return redirect("/employeedashboard");
  }
  const dashData = await response2.json();

  if (userData.message === "token expired") {
    return redirect("/");
  }
  return { dashData: dashData, user: userData.user };
}
