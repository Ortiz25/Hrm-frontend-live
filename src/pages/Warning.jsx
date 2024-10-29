import React, { useEffect, useState } from "react";
import { Menu } from "lucide-react";

import { Button } from "../components/ui/button.jsx";
import SidebarLayout from "../components/layout/sidebarLayout.jsx";
import WarningModule from "../components/warning.jsx";
import { useStore } from "../store/store.jsx";
import { redirect, useActionData, useLoaderData } from "react-router-dom";

const WarningPage = () => {
  const { activeModule, changeModule } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const data = useLoaderData();
  const actionData = useActionData();
  useEffect(() => {
    changeModule("Warnings");
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

        <WarningModule warningsData={data.warnings} actionData={actionData} />
      </div>
    </div>
  );
};

export default WarningPage;

export async function action({ request, params }) {
  try {
    const data = await request.formData();
    console.log(data)
    let url = "https://hrmbackend.livecrib.pro/warningsupload";
    const response = await fetch(url, {
      method: "PUT",
      body: data,
    });

    if (response.ok) {
      const data = await response.json();

      return { message: "Warning issued successfully:" };
    } else {
      const errorData = await response.json();
      console.error("Error issuing warning:", errorData.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
  return null;
}

export async function loader() {
  const token = localStorage.getItem("token");

  if (!token) {
    return redirect("/");
  }
  const url = "https://hrmbackend.livecrib.pro/api/verifyToken";
  const url2 = "https://hrmbackend.livecrib.pro/api/warnings";

  const data = { token: token };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const response2 = await fetch(url2);

  const userData = await response.json();

  const { warnings } = await response2.json();
  // console.log(warnings);
  if (userData.message === "token expired") {
    return redirect("/");
  }
  return { warnings: warnings, role: userData };
}
