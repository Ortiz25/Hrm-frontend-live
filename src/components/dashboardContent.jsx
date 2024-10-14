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

const DashboardContent = ({ dashData }) => (
  <div className="p-4">
    <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <DashboardCard
        title="Total Employees"
        value={dashData.totalEmployees}
        icon={Users}
      />
      <DashboardCard
        title="Total Payroll"
        value={`${formatCurrency(dashData.totalPayroll)}`}
        icon={DollarSign}
      />
      <DashboardCard
        title="Leave Requests"
        value={dashData.leaveRequests}
        icon={Calendar}
      />
      <DashboardCard
        title="Open Requisitions"
        value={dashData.openRequisitions}
        icon={UserPlus}
      />
    </div>
    <Card className="mb-8 shadow-2xl">
      <CardHeader>
        <CardTitle>Monthly Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dashData.results} className="p-2">
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
          </BarChart>
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
            <BarChart data={dashData.results}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="disciplinary" name="Cases" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="shadow-2xl">
        <CardHeader>
          <CardTitle>Staff Requisitions</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dashData.results}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="requisitions" name="Requisitions" fill="#ff8042" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <PerformanceOverview />
    </div>
  </div>
);

export default DashboardContent;
