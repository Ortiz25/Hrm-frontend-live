import React, { useState } from "react";
import { Table, Menu } from "lucide-react";
import SidebarLayout from "../components/layout/sidebarLayout";
import { Button } from "@headlessui/react";
import { useEffect } from "react";
import { useStore } from "../store/store.jsx";
import { redirect, useLoaderData } from "react-router-dom";
import { isLeaveActive } from "../util/helpers.jsx";

const employees = [
  {
    id: 1,
    name: "John Doe",
    department: "IT",
    onLeave: true,
    startDate: "2024-10-15",
    endDate: "2024-10-22",
    coveringEmployee: "Jane Smith",
  },
  {
    id: 2,
    name: "Jane Smith",
    department: "HR",
    onLeave: false,
    startDate: null,
    endDate: null,
    coveringEmployee: null,
  },
  {
    id: 3,
    name: "Bob Johnson",
    department: "Marketing",
    onLeave: true,
    startDate: "2024-10-18",
    endDate: "2024-10-25",
    coveringEmployee: "Alice Brown",
  },
  {
    id: 4,
    name: "Alice Brown",
    department: "Marketing",
    onLeave: false,
    startDate: null,
    endDate: null,
    coveringEmployee: null,
  },
];

const LeaveDashboard = () => {
  const { leaveData, role } = useLoaderData();
  const [filterOnLeave, setFilterOnLeave] = useState(false);
  const { activeModule, changeModule, changeRole } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    changeModule("LeaveDashboard");
    changeRole(role);
  }, [role]);

  const filteredEmployees = filterOnLeave
    ? employees.filter((emp) => emp.onLeave)
    : employees;

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

        <div className="container mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Employee Leave Status
          </h1>
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600"
                checked={filterOnLeave}
                onChange={(e) => setFilterOnLeave(e.target.checked)}
              />
              <span className="ml-2 text-gray-700">
                Show only employees on leave
              </span>
            </label>
          </div>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Leave Period
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Covering Employee
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <div className="flex items-center">
                        <div className="ml-3">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {employee.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {employee.department}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <span
                        className={`relative inline-block px-3 py-1 font-semibold ${
                          employee.onLeave
                            ? "text-orange-900"
                            : "text-green-900"
                        } leading-tight`}
                      >
                        <span
                          aria-hidden
                          className={`absolute inset-0 ${
                            employee.onLeave ? "bg-orange-200" : "bg-green-200"
                          } opacity-50 rounded-full`}
                        ></span>
                        <span className="relative">
                          {employee.onLeave ? "On Leave" : "Working"}
                        </span>
                      </span>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {employee.onLeave
                          ? `${employee.startDate} to ${employee.endDate}`
                          : "-"}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {employee.coveringEmployee || "-"}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveDashboard;

export async function loader() {
  const token = localStorage.getItem("token");

  if (!token) {
    return redirect("/");
  }
  const url = "https://hrmlive.livecrib.pro/api/verifyToken";
  const url2 = "https://hrmlive.livecrib.pro/api/leave";

  const data = { token: token };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const response2 = await fetch(url2);
  const leaveData = await response2.json();

  const userData = await response.json();

  if (userData.message === "token expired") {
    return redirect("/");
  }
  return { leaveData: leaveData, role: userData.user.role };
}
