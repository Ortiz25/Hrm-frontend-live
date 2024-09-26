import React, { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/Login.jsx";
import PayrollModule from "./pages/Payroll.jsx";
import HRDashboard from "./pages/Dashboard.jsx";
import RestPass from "./pages/resetPass.jsx";
import LeaveManagementModule from "./pages/LeaveMgt.jsx";
import DisciplinaryModule from "./pages/Discplinary.jsx";
import AdminSettingsModule from "./pages/AdminSet.jsx";
import StaffManagementModule from "./pages/StaffReq.jsx";
import Onboarding from "./pages/Onboarding.jsx";
import HRDocumentModule from "./pages/Hrdocuments.jsx";
import ProfilePage from "./pages/profilePage.jsx";
import EmployeeDashboard from "./pages/EmployeeDash.jsx";
import Perfomance from "./pages/Performance.jsx";
import HolidayCalendar from "./pages/HolidayCalender.jsx";
import HRMSAttendanceModule from "./pages/Attendance.jsx";
import WarningPage from "./pages/Warning.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/resetpassword",
    element: <RestPass />,
  },
  {
    path: "/dashboard",
    element: <HRDashboard />,
  },
  {
    path: "/employeedashboard",
    element: <EmployeeDashboard />,
  },
  {
    path: "/payroll",
    element: <PayrollModule />,
  },
  {
    path: "/leave",
    element: <LeaveManagementModule />,
  },
  {
    path: "/disciplinary",
    element: <DisciplinaryModule />,
  },
  {
    path: "/warnings",
    element: <WarningPage />,
  },
  {
    path: "/attendance",
    element: <HRMSAttendanceModule />,
  },
  {
    path: "/admin",
    element: <AdminSettingsModule />,
  },
  {
    path: "/staff",
    element: <StaffManagementModule />,
  },
  {
    path: "/onboarding",
    element: <Onboarding />,
  },
  {
    path: "/calender",
    element: <HolidayCalendar />,
  },
  {
    path: "/performance",
    element: <Perfomance />,
  },
  {
    path: "/hrdocs",
    element: <HRDocumentModule />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
