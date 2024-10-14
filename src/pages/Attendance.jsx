import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  Menu,
} from "lucide-react";
import { formatTime } from "../util/helpers";

import Calendar from "../components/ui/calender";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import SidebarLayout from "../components/layout/sidebarLayout";
import { useStore } from "../store/store";

import { redirect, useLoaderData } from "react-router-dom";

const formatDate = (date, format = "long") => {
  if (format === "long") {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } else if (format === "yyyy-MM-dd") {
    return date.toISOString().split("T")[0];
  }
};

const HRMSAttendanceModule = () => {
  const { attendanceData, role } = useLoaderData();
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [currentDate, setCurrentDate] = useState(new Date());
  const { activeModule, changeModule, changeRole } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [attendance, setAttendance] = useState(attendanceData.attendanceData);
  console.log(attendance);
  useEffect(() => {
    changeModule("Attendance");
    changeRole(role);
  }, []);

  const filteredData = attendance.filter(
    (item) =>
      (selectedDepartment === "all" ||
        item.department.toLowerCase() === selectedDepartment) &&
      item.formatted_date === formatDate(currentDate, "yyyy-MM-dd")
  );
  const handleDateChange = (event) => {
    setCurrentDate(new Date(event.target.value));
  };

  const changeDate = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

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
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4 text-center">Attendance</h1>

          <div className="flex justify-between items-center mb-4">
            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger className="w-[180px] bg-white border-2 border-gray-300 shadow-sm">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent className="bg-gray-200">
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="it">IT</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => changeDate(-1)}
                className="mt-7 border hover:bg-gray-200"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex flex-col items-center space-y-2">
                <label htmlFor="date-picker" className="text-sm font-medium">
                  Choose a Date:
                </label>
                <input
                  id="date-picker"
                  type="date"
                  value={format(currentDate, "yyyy-MM-dd")}
                  onChange={handleDateChange}
                  className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => changeDate(1)}
                className="mt-7 border hover:bg-gray-200"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Card className="mb-4 shadow-lg">
            <CardHeader>
              <CardTitle>
                Attendance Overview for{" "}
                <span className="text-rose-700">
                  {format(currentDate, "MMMM d, yyyy")}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold text-lg">
                      Name
                    </TableHead>
                    <TableHead className="font-semibold text-lg">
                      Department
                    </TableHead>
                    <TableHead className="font-semibold text-lg">
                      Date
                    </TableHead>
                    <TableHead className="font-semibold text-lg">
                      Check In
                    </TableHead>
                    <TableHead className="font-semibold text-lg">
                      Check Out
                    </TableHead>
                    <TableHead className="font-semibold text-lg">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.department}</TableCell>
                      <TableCell>{item.formatted_date}</TableCell>
                      <TableCell>{formatTime(item.check_in)}</TableCell>
                      <TableCell>{formatTime(item.check_out)}</TableCell>
                      <TableCell>{item.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          {role !== "employee" && (
            <div className="flex justify-between">
              <Button variant="outline" className="shadow-lg bg-gray-100">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Generate Current Report
              </Button>
              <div className="space-x-2">
                <Button variant="outline" className="shadow-lg bg-gray-100">
                  <Upload className="mr-2 h-4 w-4" />
                  Import Biometric Data
                </Button>
                <Button variant="outline" className="shadow-lg bg-gray-100">
                  <Download className="mr-2 h-4 w-4" />
                  Export to Payroll
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HRMSAttendanceModule;

export async function loader() {
  const token = localStorage.getItem("token");

  if (!token) {
    return redirect("/");
  }
  const url = "https://hrmbackend.livecrib.pro/api/verifyToken";
  const url2 = "https://hrmbackend.livecrib.pro/api/attendance";
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
  // if (userData.role === "employee") {
  //   return redirect("/employeedashboard");
  // }
  const attendanceData = await response2.json();

  if (userData.message === "token expired") {
    return redirect("/");
  }
  return { attendanceData: attendanceData, role: userData.role };
}
