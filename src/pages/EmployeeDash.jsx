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
import { Link, redirect, useLoaderData } from "react-router-dom";
import { generatePayslipPDF } from "../util/generatePdf.jsx";
import LeaveStatusCard from "../components/leaveStatus.jsx";
import DisciplinarySummaryCard from "../components/displinarySum.jsx";
import { formatDate, formatMonth } from "../util/helpers.jsx";

import DownloadP9Modal from "../components/downloadp9.jsx";

const dataP = [
  { name: "Jan", rating: 4.2 },
  { name: "Feb", rating: 4.3 },
  { name: "Mar", rating: 4.5 },
  { name: "Apr", rating: 4.4 },
  { name: "May", rating: 4.6 },
  { name: "Jun", rating: 4.7 },
  { name: "Jul", rating: 4.5 },
];

const EmployeeDashboard = () => {
  const { activeModule, changeModule, changeRole, currentYear} = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { data, user } = useLoaderData();
  const[yearToFilter, updateYear] = useState(currentYear)
  const year = new Date().getFullYear();
  const years = Array.from({ length: 2 }, (_, i) => year - i);
  const seevedData = data.filter(item => item.year === +yearToFilter)
  
  const getCurrentMonth = () => new Date().toISOString().slice(0, 7);
  console.log(data)
  useEffect(() => {
    changeRole(user.user.role);
    changeModule("Employee Dashboard");
  }, [data]);

  const handleGenerateP9 = async()=>{
    generateP9PDF()
  }

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
          <select
        value={ yearToFilter}
       onChange={(e) =>{ updateYear(e.target.value)}}
        className="w-28 px-6 py-2 bg-white border border-gray-300 rounded-lg shadow-sm 
                   text-gray-700 appearance-none cursor-pointer
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   font-medium text-base tracking-wide"
                   
      >
        <option value="">Select Year</option>
        {years.map(year => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
          <h1 className="text-sm md:text-xl font-bold">{activeModule}</h1>
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
                    <span className="text-base md:text-xl font-semibold mr-2">Name:</span>
                    <span className="italic text-sm md:text-lg">
                      {data[0].employee_name}
                    </span>
                    <br />
                    <span className="text-base md:text-xl font-semibold mr-2">
                      Position:
                    </span>
                    <span className="italic text-sm md:text-lg">{data[0].position}</span>
                    <br />
                    <span className="text-base md:text-xl font-semibold mr-2">
                      Employee ID:
                    </span>
                    <span className="italic text-sm md:text-lg">
                      {data[0].employee_number}
                    </span>
                  </div>
                  <div>
                    <span className="text-base md:text-xl font-semibold mr-2">
                      Department:{" "}
                    </span>
                    <span className="italic text-sm md:text-lg">{data[0].department}</span>
                    <br />
                    <span className="text-base md:text-xl font-semibold mr-2">
                      Join Date:{" "}
                    </span>
                    <span className="italic text-sm md:text-lg">
                      {formatDate(data[0].hire_date)}
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
                  <h1 className="text-lg md:text-2xl font-bold text-gray-900 mb-6">
                    Performance Rating Over Time
                  </h1>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart
                      data={dataP}
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
                  <div className="text-center p-4 bg-blue-100 hover:bg-blue-200 rounded-lg overflow-hidden break-words">
                    <h4 className="font-semibold">Annual Leave</h4>
                    <p className="text-lg md:text-2xl font-bold">
                      {seevedData[0]?.annual_leave_balance || 0} days
                    </p>
                  </div>
                  <div className="text-center p-4 bg-green-100 hover:bg-green-200 rounded-lg overflow-hidden break-words">
                    <h4 className="font-semibold">Sick Leave</h4>
                    <p className="text-lg md:text-2xl font-bold">
                      {seevedData[0]?.sick_leave_balance || 0} days
                    </p>
                  </div>
                  <div className="text-center p-4 bg-yellow-100 hover:bg-yellow-200 rounded-lg overflow-hidden break-words">
                    <h4 className="font-semibold text-sm whitespace-normal">Compassionate Leave</h4>
                    <p className="text-lg md:text-2xl  font-bold">
                      {" "}
                      {seevedData[0]?.compassionate_leave_entitlement || 0} days
                    </p>
                  </div>
                  {+data[0].paternity_leave_entitlement !== 0 && (
                    <div className="text-center p-4 bg-teal-100 hover:bg-teal-200 rounded-lg overflow-hidden break-words">
                      <h4 className="font-semibold whitespace-normal">Paternity Leave</h4>
                      <p className="text-lg md:text-2xl  font-bold">
                        {seevedData[0]?.paternity_leave_entitlement || 0} days
                      </p>
                    </div>
                  )}
                  {+data[0].maternity_leave_entitlement !== 0 && (
                    <div className="text-center p-4 bg-lime-100 hover:bg-lime-200 rounded-lg">
                      <h4 className="font-semibold">Maternity Leave</h4>
                      <p className="text-lg md:text-2xl  font-bold">
                        {seevedData[0]?.maternity_leave_entitlement || 0} days
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <LeaveStatusCard employeeId={seevedData[0]?.employee_id} />
            <DisciplinarySummaryCard employeeId={seevedData[0]?.employee_id} />

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
                        <th className="border p-2 text-left">
                          Gross Salary (KES)
                        </th>
                        <th className="border p-2 text-left">PAYE (KES)</th>
                        <th className="border p-2 text-left">
                          Deductions (KES)
                        </th>
                        <th className="border p-2 text-left">
                          Housing leavy (KES)
                        </th>
                        <th className="border p-2 text-left">
                          Taxable Income (KES)
                        </th>
                        <th className="border p-2 text-left">Net Pay (KES)</th>
                        <th className="border p-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.filter(item => item.year === +yearToFilter).map((entry, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border p-2">
                            {entry?.month}
                          </td>
                          <td className="border p-2">
                            {(entry?.gross_pay ?? 0).toLocaleString()}
                          </td>
                          <td className="border p-2">
                            {(entry?.paye ?? 0).toLocaleString() || 0}
                          </td>
                          <td className="border p-2">
                            {+entry.paye +
                              +entry.nssf_tier_i +
                              +entry.nssf_tier_ii +
                              +entry.nhif +
                              +entry.housing_levy +
                              +entry.other_deductions || 0}
                          </td>
                          <td className="border p-2">
                            {(entry?.housing_levy ?? 0).toLocaleString() || 0}
                          </td>
                          <td className="border p-2">
                            {(entry?.taxable_income ?? 0).toLocaleString() || 0}
                          </td>
                          <td className="border p-2">
                            {(entry?.net_pay ?? 0).toLocaleString() || 0}
                          </td>
                          <td className="border p-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => generatePayslipPDF(entry)}
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
            <div className="flex justify-center space-x-2 p-2 md:space-x-4 overflow-x-auto">
              <Button onClick={() => setSidebarOpen(!sidebarOpen)} >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span className="text-sm md:text-base">View Full Dashboard</span>
              </Button>
              <Button>
                <CalendarDays className="mr-2 h-4 w-4" />

                <Link to="/leave" className="text-sm md:text-base"> Request Leave</Link>
              </Button>
              <Button>
                 <DownloadP9Modal data={data}/>
              </Button>
              <Button>
                <User className="mr-2 h-4 w-4" />

                <Link to="/profile" className="text-sm md:text-base">Update Profile</Link>
              </Button>
              <Button>
                <Calendar className="mr-2 h-4 w-4" />

                <Link to="/calender" className="text-sm md:text-base">Holidays Calendar</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;

export async function loader() {
  const token = localStorage.getItem("token");

  if (!token) {
    return redirect("/");
  }

  const url = "https://hrmbackend.teqova.biz/api/verifyToken";
  const url2 = "https://hrmbackend.teqova.biz/api/employeedash";
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

  const dashData = await response2.json();
   console.log(dashData)
  if (userData.message === "token expired") {
    return redirect("/");
  }
  return { data: dashData.results, user: userData };
}
