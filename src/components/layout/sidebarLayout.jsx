import React, { useEffect, useState } from "react";
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
  Flower
} from "lucide-react";
import { Outlet, NavLink, useNavigate, redirect } from "react-router-dom";
import "./tooltip.css";
import { useStore } from "../../store/store";

const SidebarLayout = ({ activeModule, setActiveModule }) => {
  const user = localStorage.getItem("name");
  const { role, changeRole, changeUser } = useStore();
  const [hoveredModule, setHoveredModule] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const url = "https://hrmbackend.teqova.biz/api/profile";
        const token = localStorage.getItem("token");
        const data = { token: token };

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        changeUser(result.result[0]);
      } catch (error) {
        console.log("Error", error);
      }
    }
    fetchData();
  }, []);

  // Define the modules with access rules
  const modules = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      route: "dashboard",
      roles: ["admin", "super_admin"],
    },
    {
      name: "Employee Dashboard",
      icon: Logs,
      route: "employeedashboard",
      roles: ["employee", "admin", "super_admin"],
    },
    {
      name: "Payroll",
      icon: DollarSign,
      route: "payroll",
      roles: ["admin", "super_admin"],
    },
    {
      name: "Attendance",
      icon: UserCheck,
      route: "attendance",
      roles: ["admin", "employee", "super_admin"],
    },
    {
      name: "Leave Management",
      icon: Calendar,
      route: "leave",
      roles: ["admin", "employee", "super_admin"],
    },
  
    {
      name: "Disciplinary Management",
      icon: Scale,
      route: "disciplinary",
      roles: ["admin", "super_admin"],
    },
    {
      name: "Staff Requisition",
      icon: UserPlus,
      route: "staff",
      roles: ["admin", "super_admin"],
    },
    {
      name: "ON/OFF Boarding",
      icon: ArrowRightLeft,
      route: "onboarding",
      roles: ["admin", "super_admin"],
    },
    {
      name: "Performance",
      icon: TrendingUp,
      route: "performance",
      roles: ["admin", "super_admin"],
    },
    {
      name: "Recognitions",
      icon: Flower,
      route: "recognition",
      roles: ["admin", "employee", "super_admin"],
    },
    {
      name: "HR Documents",
      icon: FileText,
      route: "hrdocs",
      roles: ["admin", "super_admin"],
    },
    {
      name: "Admin Settings",
      icon: Settings,
      route: "admin",
      roles: ["super_admin"],
    },
  ];

  const getAccessibleModules = (role) => {
    return modules.filter((module) => module.roles.includes(role));
  };

  const userRole = role;
  const accessibleModules = getAccessibleModules(userRole);

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    redirect("/");
  }

  return (
    <div className="flex">
      <div className="bg-gray-800 text-white w-20 md:w-80 min-h-screen p-4 relative">
        <div className="flex items-center justify-center md:justify-start mb-10">
          <Shield className="mr-0 md:mr-2 size-10" />
          <h1 className="hidden md:block text-2xl font-bold">SecureHR</h1>
        </div>

        <nav className="relative">
          {accessibleModules.map((module) => (
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
              <UserCircle className="mr-0 md:mr-2 text-white " size={24} />
              <span className="hidden md:block text-white ">
                {user ? user : "User"}
              </span>
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
                  <NavLink onClick={handleLogout}>
                    <LogOut className="inline-block mr-2" size={16} />
                    Logout
                  </NavLink>
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
