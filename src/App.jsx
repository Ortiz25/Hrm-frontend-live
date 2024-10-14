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
import RootLayout from "./pages/RootLayout.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import { action as loginAction } from "./pages/Login.jsx";
import { loader as loginLoader } from "./pages/Login.jsx";
import { loader as mainDashLoader } from "./pages/Dashboard.jsx";
import { loader as employLoader } from "./pages/EmployeeDash.jsx";
import { loader as profileLoader } from "./pages/profilePage.jsx";
import { action as profileAction } from "./pages/profilePage.jsx";
import { loader as payrollLoader } from "./pages/Payroll.jsx";
import { loader as attendanceLoader } from "./pages/Attendance.jsx";
import { loader as leaveLoader } from "./pages/LeaveMgt.jsx";
import { action as leaveAction } from "./pages/LeaveMgt.jsx";
import { loader as holidayLoader } from "./pages/HolidayCalender.jsx";
import { loader as discplinaryLoader } from "./pages/Discplinary.jsx";
import { action as actionDiscplinary } from "./pages/Discplinary.jsx";
import { loader as loaderWarning } from "./pages/Warning.jsx";
import { action as warningAction } from "./pages/Warning.jsx";
import { loader as staffLoader } from "./pages/StaffReq.jsx";
import { loader as loaderOnboarding } from "./pages/Onboarding.jsx";
import {
  loader as loaderAdmin,
  action as actionAdmin,
} from "./pages/AdminSet.jsx";
import LeaveDashboard, {
  loader as leaveDashLoader,
} from "./pages/LeaveDash.jsx";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <LoginPage />,
        action: loginAction,
        loader: loginLoader,
      },
      {
        path: "/resetpassword",
        element: <RestPass />,
      },
      {
        path: "/dashboard",
        element: <HRDashboard />,
        loader: mainDashLoader,
      },
      {
        path: "/employeedashboard",
        element: <EmployeeDashboard />,
        loader: employLoader,
      },
      {
        path: "/payroll",
        element: <PayrollModule />,
        loader: payrollLoader,
      },
      {
        path: "/leave",
        element: <LeaveManagementModule />,
        loader: leaveLoader,
        action: leaveAction,
      },
      {
        path: "/disciplinary",
        element: <DisciplinaryModule />,
        loader: discplinaryLoader,
        action: actionDiscplinary,
      },
      {
        path: "/warnings",
        element: <WarningPage />,
        loader: loaderWarning,
        action: warningAction,
      },
      {
        path: "/attendance",
        element: <HRMSAttendanceModule />,
        loader: attendanceLoader,
      },
      {
        path: "/leavedash",
        element: <LeaveDashboard />,
        loader: leaveDashLoader,
      },
      {
        path: "/admin",
        element: <AdminSettingsModule />,
        loader: loaderAdmin,
        action: actionAdmin,
      },
      {
        path: "/staff",
        element: <StaffManagementModule />,
        loader: staffLoader,
      },
      {
        path: "/onboarding",
        element: <Onboarding />,
        loader: loaderOnboarding,
      },
      {
        path: "/calender",
        element: <HolidayCalendar />,
        loader: holidayLoader,
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
        loader: profileLoader,
        action: profileAction,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
