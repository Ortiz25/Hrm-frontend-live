import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  DollarSign,
  Calendar,
  FileText,
  UserPlus,
  Menu,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card.jsx";
import PerformanceOverview from "./ui/perOverview.jsx";
import { formatCurrency } from "../util/helpers.jsx";
import ReportSummary from "./reportsSummary.jsx";

const DashboardCard = ({ title, value, icon: Icon }) => (
  <Card className="shadow-2xl">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 2 }, (_, i) => currentYear - i);

const DashboardContent = ({ dashData, yearToFilter,updateYear }) => (
 
  <div className="p-4">
     <div className="p-2 mb-2 bg-white  flex justify-between items-center">
           <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
           <select
        value={ yearToFilter}
        onChange={(e) =>{ updateYear(e.target.value)}}
        className="w-32 px-8 py-2 bg-white border border-gray-300 rounded-lg shadow-sm 
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
        </div>

    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <DashboardCard
        title="Total Employees"
        value={dashData.totalEmployees}
        icon={Users}
      />
      <DashboardCard
        title="Total Payroll"
        value={`${formatCurrency(dashData.totalPayroll.filter(item => item.year === +yearToFilter).map(item => item.total_gross_pay
))}`}
        icon={DollarSign}
      />
      <DashboardCard
        title="Leave Requests"
        value={dashData.leaveRequests.filter(item => item.year === +yearToFilter).length === 0 ?0: dashData.leaveRequests.filter(item => item.year === +yearToFilter).map(item => item.pending_leaves)}
        icon={Calendar}
      />
      <DashboardCard
        title="Open Requisitions"
        value={dashData.openRequisitions.filter(item => item.year === +yearToFilter).length === 0 ? 0:dashData.openRequisitions.filter(item => item.year === +yearToFilter).map(item => item.requisitions_count
        )}
        icon={UserPlus}
      />
    </div>
    <Card className="mb-8 shadow-2xl">
      <CardHeader>
        <CardTitle>Monthly Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
        {dashData.results.filter(item => item.year === yearToFilter).length === 0 ? <div className="h-64 w-full flex items-center justify-center border border-gray-200 rounded-lg bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 text-lg font-medium mb-2">No data available</p>
          <p className="text-gray-400 text-sm">adjust your filters or Year</p>
        </div>
      </div>:
          <BarChart data={dashData.results.filter(item => item.year === yearToFilter)} className="p-2">
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="payroll"
              name="Payroll (KES)"
              fill="#8884d8"
            />
            <Bar
              yAxisId="right"
              dataKey="leaves"
              name="Leaves"
              fill="#82ca9d"
            />
          </BarChart>}
        </ResponsiveContainer>
      </CardContent>
    </Card>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
      <Card className="shadow-2xl">
        <CardHeader>
          <CardTitle>Disciplinary Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
          {dashData.results.filter(item => item.year === yearToFilter).length === 0 ? <div className="h-64 w-full flex items-center justify-center border border-gray-200 rounded-lg bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 text-lg font-medium mb-2">No data available</p>
          <p className="text-gray-400 text-sm">adjust your filters or Year</p>
        </div>
      </div>:
            <BarChart data={dashData.results.filter(item => item.year === yearToFilter)}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="disciplinary" name="Cases" fill="#ffc658" />
            </BarChart>}
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="shadow-2xl">
        <CardHeader>
          <CardTitle>Staff Requisitions</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
          {dashData.results.filter(item => item.year === yearToFilter).length === 0 ? <div className="h-64 w-full flex items-center justify-center border border-gray-200 rounded-lg bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 text-lg font-medium mb-2">No data available</p>
          <p className="text-gray-400 text-sm">adjust your filters or Year</p>
        </div>
      </div>:
            <BarChart data={dashData.results.filter(item => item.year === yearToFilter)}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="requisitions" name="Requisitions" fill="#ff8042" />
            </BarChart>}
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <ReportSummary/>
      <PerformanceOverview />
    </div>
  </div>
);

export default DashboardContent;
