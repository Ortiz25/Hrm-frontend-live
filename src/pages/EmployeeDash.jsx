import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button.jsx";
import {
  DownloadIcon,
  LayoutDashboard,
  CalendarDays,
  FileText,
  User,
  Calendar,
  Clock,
  Target,
  Award,
  Menu,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import SidebarLayout from "../components/layout/sidebarLayout.jsx";
import { useState, useEffect } from "react";
import { useStore } from "../store/store.jsx";
import { Link } from "react-router-dom";
import { generatePayslipPDF } from "../util/generatePdf.jsx";
import LeaveStatusCard from "../components/leaveStatus.jsx";
import DisciplinarySummaryCard from "../components/displinarySum.jsx";

const employeeData = {
  name: "Alice Smith",
  position: "Senior Developer",
  employeeId: "EMP001",
  department: "Engineering",
  joinDate: "2020-03-15",
  payroll: [
    {
      month: "September 2024",
      salary: 85000,
      bonus: 7000,
      deductions: 20100,
      overtime: 8,
      leave: 1,
      netPay: 76300,
    },
    {
      month: "August 2024",
      salary: 85000,
      bonus: 5000,
      deductions: 19800,
      overtime: 6,
      leave: 2,
      netPay: 74700,
    },
    {
      month: "July 2024",
      salary: 85000,
      bonus: 6000,
      deductions: 20000,
      overtime: 7,
      leave: 0,
      netPay: 75500,
    },
  ],
  leaveBalance: {
    annual: 15,
    sick: 10,
    personal: 5,
  },
};

const data = [
  { name: "Jan", rating: 4.2 },
  { name: "Feb", rating: 4.3 },
  { name: "Mar", rating: 4.5 },
  { name: "Apr", rating: 4.4 },
  { name: "May", rating: 4.6 },
  { name: "Jun", rating: 4.7 },
  { name: "Jul", rating: 4.5 },
];

const EmployeeDashboard = () => {
  const { activeModule, changeModule } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    changeModule("Employee Dashboard");
  }, [changeModule]);

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
        <div className="bg-gray-100 min-h-screen p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Employee Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xl font-semibold mr-2">Name:</span>
                    <span className="italic text-lg">{employeeData.name}</span>
                    <br />
                    <span className="text-xl font-semibold mr-2">
                      Position:
                    </span>
                    <span className="italic text-lg">
                      {employeeData.position}
                    </span>
                    <br />
                    <span className="text-xl font-semibold mr-2">
                      Employee ID:
                    </span>
                    <span className="italic text-lg">
                      {employeeData.employeeId}
                    </span>
                  </div>
                  <div>
                    <span className="text-xl font-semibold mr-2">
                      Department:{" "}
                    </span>
                    <span className="italic text-lg">
                      {employeeData.department}
                    </span>
                    <br />
                    <span className="text-xl font-semibold mr-2">
                      Join Date:{" "}
                    </span>
                    <span className="italic text-lg">
                      {employeeData.joinDate}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Perfomance Index</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-6 bg-gray-100 min-h-max">
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">
                    Performance Rating Over Time
                  </h1>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart
                      data={data}
                      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="rating"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Leave Balances</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-100 hover:bg-blue-200 rounded-lg">
                    <h4 className="font-semibold">Annual Leave</h4>
                    <p className="text-2xl font-bold">
                      {employeeData.leaveBalance.annual} days
                    </p>
                  </div>
                  <div className="text-center p-4 bg-green-100 hover:bg-green-200 rounded-lg">
                    <h4 className="font-semibold">Sick Leave</h4>
                    <p className="text-2xl font-bold">
                      {employeeData.leaveBalance.sick} days
                    </p>
                  </div>
                  <div className="text-center p-4 bg-yellow-100 hover:bg-yellow-200 rounded-lg">
                    <h4 className="font-semibold">Personal Leave</h4>
                    <p className="text-2xl font-bold">10 days</p>
                  </div>
                  <div className="text-center p-4 bg-teal-100 hover:bg-teal-200 rounded-lg">
                    <h4 className="font-semibold">Paternity Leave</h4>
                    <p className="text-2xl font-bold">
                      {employeeData.leaveBalance.personal} days
                    </p>
                  </div>
                  <div className="text-center p-4 bg-lime-100 hover:bg-lime-200 rounded-lg">
                    <h4 className="font-semibold">Maternity Leave</h4>
                    <p className="text-2xl font-bold">
                      {employeeData.leaveBalance.personal} days
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <LeaveStatusCard />
            <DisciplinarySummaryCard />

            <Card>
              <CardHeader>
                <CardTitle>Payroll Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2 text-left">Month</th>
                        <th className="border p-2 text-left">Salary (KES)</th>
                        <th className="border p-2 text-left">Bonus (KES)</th>
                        <th className="border p-2 text-left">
                          Deductions (KES)
                        </th>
                        <th className="border p-2 text-left">Overtime (hrs)</th>
                        <th className="border p-2 text-left">Leave (days)</th>
                        <th className="border p-2 text-left">Net Pay (KES)</th>
                        <th className="border p-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employeeData.payroll.map((entry, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border p-2">{entry.month}</td>
                          <td className="border p-2">
                            {entry.salary.toLocaleString()}
                          </td>
                          <td className="border p-2">
                            {entry.bonus.toLocaleString()}
                          </td>
                          <td className="border p-2">
                            {entry.deductions.toLocaleString()}
                          </td>
                          <td className="border p-2">{entry.overtime}</td>
                          <td className="border p-2">{entry.leave}</td>
                          <td className="border p-2">
                            {entry.netPay.toLocaleString()}
                          </td>
                          <td className="border p-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                generatePayslipPDF(entry, employeeData)
                              }
                            >
                              <DownloadIcon className="mr-2 h-4 w-4" />
                              Payslip
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* <div className="mt-4 flex justify-end">
                    <Button>
                      <DownloadIcon className="mr-2 h-4 w-4" />
                      Export to Excel
                    </Button>
                  </div> */}
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-center space-x-4">
              <Button onClick={() => setSidebarOpen(!sidebarOpen)}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                View Full Dashboard
              </Button>
              <Button>
                <CalendarDays className="mr-2 h-4 w-4" />

                <Link to="/leave"> Request Leave</Link>
              </Button>
              <Button>
                <FileText className="mr-2 h-4 w-4" />

                <Link to="/hrdocs"> View Documents</Link>
              </Button>
              <Button>
                <User className="mr-2 h-4 w-4" />

                <Link to="/profile">Update Profile</Link>
              </Button>
              <Button>
                <Calendar className="mr-2 h-4 w-4" />

                <Link to="/calender">Holidays Calendar</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
