import React, { useEffect, useState } from "react";
import { AlertTriangle, Menu } from "lucide-react";
import SidebarLayout from "../components/layout/sidebarLayout.jsx";
import { useStore } from "../store/store.jsx";
import { Button } from "../components/ui/button.jsx";

const ErrorPage = ({ errorCode = "404", errorMessage = "Page not found" }) => {
  const { activeModule, changeModule, role, changeRole } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    changeModule("Error");
  }, []);

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

        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 text-center">
            <AlertTriangle className="mx-auto h-24 w-24 text-yellow-500" />
            <h1 className="mt-6 text-4xl font-extrabold text-gray-900">
              Error {errorCode}
            </h1>
            <p className="mt-2 text-lg text-gray-600">{errorMessage}</p>
            <p className="mt-2 text-sm text-gray-500">
              We apologize for the inconvenience. Please try again later or
              contact support if the problem persists.
            </p>
            <div className="mt-6">
              <button
                onClick={() => (window.location.href = "/")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
