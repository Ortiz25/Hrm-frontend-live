import React, { useState } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  Menu,
} from "lucide-react";
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
import { useEffect } from "react";
import SidebarLayout from "../components/layout/sidebarLayout";
import { useStore } from "../store/store.jsx";

// Dummy data
const dummyAttendanceData = [
  {
    id: 1,
    name: "John Doe",
    department: "IT",
    date: "2024-09-23",
    checkIn: "09:00",
    checkOut: "17:00",
    status: "Present",
  },
  {
    id: 2,
    name: "Jane Smith",
    department: "HR",
    date: "2024-09-23",
    checkIn: "08:55",
    checkOut: "17:05",
    status: "Present",
  },
  {
    id: 3,
    name: "Mike Johnson",
    department: "Finance",
    date: "2024-09-23",
    checkIn: "09:10",
    checkOut: "16:55",
    status: "Present",
  },
  {
    id: 4,
    name: "Emily Brown",
    department: "Marketing",
    date: "2024-09-23",
    checkIn: "",
    checkOut: "",
    status: "Absent",
  },
  {
    id: 5,
    name: "David Lee",
    department: "Sales",
    date: "2024-09-23",
    checkIn: "09:05",
    checkOut: "17:10",
    status: "Present",
  },
];

const HRMSAttendanceModule = () => {
  const [viewMode, setViewMode] = useState("daily");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [currentDate, setCurrentDate] = useState(new Date(2024, 8, 23)); // September 23, 2024
  const { activeModule, changeModule } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    changeModule("Attendance");
  }, []);

  const filteredData =
    selectedDepartment === "all"
      ? dummyAttendanceData
      : dummyAttendanceData.filter(
          (item) => item.department.toLowerCase() === selectedDepartment
        );
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
            <div className="flex items-center space-x-2">
              <Select value={viewMode} onValueChange={setViewMode}>
                <SelectTrigger className="w-[180px] bg-white border-2 border-gray-300 shadow-sm">
                  <SelectValue placeholder="Select view" />
                </SelectTrigger>
                <SelectContent className="bg-gray-200">
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
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
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => changeDate(-1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-semibold">{formatDate(currentDate)}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => changeDate(1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Card className="mb-4 shadow-lg">
            <CardHeader>
              <CardTitle>Attendance Overview</CardTitle>
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
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.checkIn}</TableCell>
                      <TableCell>{item.checkOut}</TableCell>
                      <TableCell>{item.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" className="shadow-lg bg-gray-100">
              <Calendar className="mr-2 h-4 w-4" />
              Generate Monthly Report
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
        </div>
      </div>
    </div>
  );
};

export default HRMSAttendanceModule;
