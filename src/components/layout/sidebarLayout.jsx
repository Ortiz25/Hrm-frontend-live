import React, { useState } from "react";
import {
  Scale,
  DollarSign,
  Calendar,
  FileText,
  UserPlus,
  Shield,
  LogOut,
  LayoutDashboard,
  Settings,
  ArrowRightLeft,
  UserCircle,
  Logs,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import "./tooltip.css";

const SidebarLayout = ({ activeModule, setActiveModule }) => {
  const navigate = useNavigate();
  const [hoveredModule, setHoveredModule] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Define the modules with access rules
  const modules = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      route: "dashboard",
      roles: ["admin"],
    },
    {
      name: "Employee Dashboard",
      icon: Logs,
      route: "employeedashboard",
      roles: ["employee"],
    },
    { name: "Payroll", icon: DollarSign, route: "payroll", roles: ["admin"] },
    {
      name: "Attendance",
      icon: UserCheck,
      route: "attendance",
      roles: ["admin", "employee"],
    },
    {
      name: "Leave Management",
      icon: Calendar,
      route: "leave",
      roles: ["admin", "employee"],
    },
    {
      name: "Disciplinary Management",
      icon: Scale,
      route: "disciplinary",
      roles: ["admin"],
    },
    {
      name: "Staff Requisition",
      icon: UserPlus,
      route: "staff",
      roles: ["admin"],
    },
    {
      name: "ON/OFF Boarding",
      icon: ArrowRightLeft,
      route: "onboarding",
      roles: ["admin"],
    },
    {
      name: "Performance",
      icon: TrendingUp,
      route: "performance",
      roles: ["admin", "employee"],
    },
    { name: "HR Documents", icon: FileText, route: "hrdocs", roles: ["admin"] },
    {
      name: "Admin Settings",
      icon: Settings,
      route: "admin",
      roles: ["admin"],
    },
  ];

  // Function to get accessible modules based on user role
  const getAccessibleModules = (role) => {
    return modules.filter((module) => module.roles.includes(role));
  };

  // Example usage
  const userRole = "admin"; // You can get this from your authentication context or state
  const accessibleModules = getAccessibleModules(userRole);

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <div className="flex">
      <div className="bg-gray-800 text-white w-20 md:w-80 min-h-screen p-4 relative">
        <div className="flex items-center justify-center md:justify-start mb-10">
          <Shield className="mr-0 md:mr-2 size-10" />
          <h1 className="hidden md:block text-2xl font-bold">SecureHR</h1>
        </div>

        <nav className="relative">
          {modules.map((module) => (
            <div
              key={module.name}
              className="relative flex flex-col items-center md:flex-row"
              onMouseEnter={() => setHoveredModule(module.name)}
              onMouseLeave={() => setHoveredModule(null)}
            >
              <NavLink
                to={`/${module.route}`}
                className={`flex items-center justify-center md:justify-start w-full p-2 mt-4 rounded-md ${
                  activeModule === module.name
                    ? "bg-blue-600"
                    : "hover:bg-gray-700"
                }`}
                onClick={() => setActiveModule(module.name)}
              >
                <module.icon className="w-full md:w-auto" size={24} />
                <span className="hidden md:inline-block ml-2">
                  {module.name}
                </span>
              </NavLink>

              {hoveredModule === module.name && (
                <div className="absolute left-16 top-1/2 transform -translate-y-1/2 md:hidden bg-gray-900 text-white p-2 rounded-lg shadow-lg z-20">
                  {module.name}
                  <div className="absolute -left-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-6 border-r-gray-900"></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="absolute bottom-9 left-4 w-3/5">
          <div className="relative">
            <button
              className="flex items-center hover:text-blue-500 justify-center md:justify-start text-gray-400 hover:text-white"
              onClick={toggleUserMenu}
            >
              <UserCircle className="mr-0 md:mr-2 " size={24} />
              <span className="hidden md:block  ">User</span>
            </button>
            {showUserMenu && (
              <div className="absolute bottom-full left-0 mb-2 bg-gray-700 rounded-md shadow-lg p-4">
                <NavLink
                  to="/profile"
                  className="block px-4 py-2 text-sm text-white hover:bg-gray-600"
                  onClick={() => setShowUserMenu(false)}
                >
                  Profile
                </NavLink>

                <button
                  className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600"
                  onClick={() => {
                    // Add logout logic here
                    setShowUserMenu(false);
                  }}
                >
                  <LogOut className="inline-block mr-2" size={16} />
                  <NavLink to="/">Logout</NavLink>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
};

export default SidebarLayout;
