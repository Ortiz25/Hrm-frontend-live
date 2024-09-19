import React, { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { useStore } from "../store/store.jsx";
import { Button } from "../components/ui/button.jsx";
import SidebarLayout from "../components/layout/sidebarLayout";

const AdminSettingsModule = () => {
  const [leaveTypes, setLeaveTypes] = useState(["Annual", "Sick", "Personal"]);
  const { activeModule, changeModule, discplinaryAction } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [disciplinaryActionTypes, setDisciplinaryActionTypes] = useState([
    "Verbal Warning",
    "Written Warning",
    "Performance Improvement Plan",
    "Suspension",
    "Final Warning",
  ]);
  const [newLeaveType, setNewLeaveType] = useState("");
  const [newActionType, setNewActionType] = useState("");
  const [settings, setSettings] = useState({
    autoApproveLeaves: false,
    maxConsecutiveLeaves: 14,
    notifyManagerOnLeaveRequest: true,
    enforceProgressiveDiscipline: true,
    theme: "light",
    activeTab: "leave",
  });
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
  ]);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "User" });

  useEffect(() => {
    changeModule("Admin Settings");
  }, []);

  const handleAddLeaveType = () => {
    if (newLeaveType && !leaveTypes.includes(newLeaveType)) {
      setLeaveTypes([...leaveTypes, newLeaveType]);
      setNewLeaveType("");
    }
  };

  const handleAddActionType = () => {
    if (newActionType && !disciplinaryActionTypes.includes(newActionType)) {
      setDisciplinaryActionTypes([...disciplinaryActionTypes, newActionType]);
      setNewActionType("");
    }
  };

  const handleRemoveLeaveType = (type) => {
    setLeaveTypes(leaveTypes.filter((t) => t !== type));
  };

  const handleRemoveActionType = (type) => {
    setDisciplinaryActionTypes(
      disciplinaryActionTypes.filter((t) => t !== type)
    );
  };

  const handleSettingChange = (setting) => {
    setSettings((prev) => ({ ...prev, [setting]: !prev[setting] }));
  };

  const handleMaxLeavesChange = (e) => {
    setSettings((prev) => ({
      ...prev,
      maxConsecutiveLeaves: parseInt(e.target.value) || 0,
    }));
  };

  const handleThemeChange = () => {
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === "light" ? "dark" : "light",
    }));
  };

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      setUsers([...users, { ...newUser, id: users.length + 1 }]);
      setNewUser({ name: "", email: "", role: "User" });
    }
  };

  const handleResetPassword = (userId) => {
    console.log(`Password reset for user ${userId}`);
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
        <div
          className={`p-4 h-full ${
            settings.theme === "dark"
              ? "bg-gray-900 text-gray-100"
              : "bg-gray-100 text-gray-900"
          }`}
        >
          <div className="bg-white rounded-lg shadow-2xl">
            <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Admin Settings</h2>
              <button
                className="text-gray-500 hover:text-gray-700 transition-colors"
                onClick={handleThemeChange}
              ></button>
            </div>
            <div className="p-4">
              <div className="flex border-b border-gray-200 mb-4">
                {["leave", "disciplinary", "general", "users"].map((tab) => (
                  <button
                    key={tab}
                    className={`py-2 px-4 mx-4 font-medium ${
                      settings.activeTab === tab
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600 hover:text-blue-600"
                    } transition-colors`}
                    onClick={() => setSettings({ ...settings, activeTab: tab })}
                  >
                    {tab.charAt(0).toUpperCase() +
                      tab.slice(1).replace("-", " ")}{" "}
                    Settings
                  </button>
                ))}
              </div>
              <div>
                {settings.activeTab === "leave" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold mb-2">Leave Types</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      {leaveTypes.map((type) => (
                        <li
                          key={type}
                          className="flex justify-between items-center"
                        >
                          {type}
                          <button
                            className="text-red-500 hover:text-red-700 text-sm transition-colors"
                            onClick={() => handleRemoveLeaveType(type)}
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newLeaveType}
                        onChange={(e) => setNewLeaveType(e.target.value)}
                        placeholder="New leave type"
                        className="border border-gray-300 p-2 rounded-md flex-1"
                      />
                      <button
                        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                        onClick={handleAddLeaveType}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}
                {settings.activeTab === "disciplinary" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold mb-2">
                      Disciplinary Action Types
                    </h3>
                    <ul className="list-disc pl-5 space-y-2">
                      {discplinaryAction.map((type) => (
                        <li
                          key={type}
                          className="flex justify-between items-center"
                        >
                          {type}
                          <button
                            className="text-red-500 hover:text-red-700 text-sm transition-colors"
                            onClick={() => handleRemoveActionType(type)}
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newActionType}
                        name="leave"
                        onChange={(e) => setNewActionType(e.target.value)}
                        placeholder="New action type"
                        className="border border-gray-300 p-2 rounded-md flex-1"
                      />
                      <button
                        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                        onClick={handleAddActionType}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}
                {settings.activeTab === "general" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="auto-approve"
                        className="flex items-center space-x-2"
                      >
                        <span>Auto-approve leave requests</span>
                        <input
                          id="auto-approve"
                          type="checkbox"
                          checked={settings.autoApproveLeaves}
                          onChange={() =>
                            handleSettingChange("autoApproveLeaves")
                          }
                          className="form-checkbox h-5 w-5 text-blue-600"
                        />
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="max-leaves" className="flex-1">
                        Maximum consecutive leave days
                      </label>
                      <input
                        id="max-leaves"
                        type="number"
                        value={settings.maxConsecutiveLeaves}
                        onChange={handleMaxLeavesChange}
                        className="border border-gray-300 p-2 rounded-md w-20"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="notify-manager"
                        className="flex items-center space-x-2"
                      >
                        <span>Notify manager on leave request</span>
                        <input
                          id="notify-manager"
                          type="checkbox"
                          checked={settings.notifyManagerOnLeaveRequest}
                          onChange={() =>
                            handleSettingChange("notifyManagerOnLeaveRequest")
                          }
                          className="form-checkbox h-5 w-5 text-blue-600"
                        />
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="progressive-discipline"
                        className="flex items-center space-x-2"
                      >
                        <span>Enforce progressive discipline</span>
                        <input
                          id="progressive-discipline"
                          type="checkbox"
                          checked={settings.enforceProgressiveDiscipline}
                          onChange={() =>
                            handleSettingChange("enforceProgressiveDiscipline")
                          }
                          className="form-checkbox h-5 w-5 text-blue-600"
                        />
                      </label>
                    </div>
                  </div>
                )}
                {settings.activeTab === "users" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold mb-2">
                      User Management
                    </h3>
                    <ul className="list-decimal pl-5 space-y-2">
                      {users.map((user) => (
                        <li
                          key={user.id}
                          className="flex justify-between items-center"
                        >
                          {user.name} ({user.email}) - {user.role}
                          <button
                            className="bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700 text-sm transition-colors"
                            onClick={() => handleResetPassword(user.id)}
                          >
                            Reset Password
                          </button>
                        </li>
                      ))}
                    </ul>
                    <h3 className="text-lg font-semibold mb-2 border-t pt-4">
                      Add New Admin/User:
                    </h3>
                    <div className="space-y-2 space-x-5">
                      <input
                        type="text"
                        name="name"
                        value={newUser.name}
                        required
                        onChange={(e) =>
                          setNewUser({ ...newUser, name: e.target.value })
                        }
                        placeholder="Name"
                        className="border border-gray-300 p-2 rounded-md flex-1"
                      />
                      <input
                        type="email"
                        name="email"
                        value={newUser.email}
                        required
                        onChange={(e) =>
                          setNewUser({ ...newUser, email: e.target.value })
                        }
                        placeholder="Email"
                        className="border border-gray-300 p-2 rounded-md flex-1"
                      />
                      <input
                        type="password"
                        name="password"
                        required
                        value={newUser.email}
                        onChange={(e) =>
                          setNewUser({ ...newUser, email: e.target.value })
                        }
                        placeholder="New password"
                        className="border border-gray-300 p-2 rounded-md flex-1"
                      />
                      <input
                        type="password"
                        name="cpassword"
                        value={newUser.email}
                        required
                        onChange={(e) =>
                          setNewUser({ ...newUser, email: e.target.value })
                        }
                        placeholder="Confirm password"
                        className="border focus:border-blue-300 border-gray-300 p-2 rounded-md flex-1"
                      />
                      <select
                        value={newUser.role}
                        name="options"
                        onChange={(e) =>
                          setNewUser({ ...newUser, role: e.target.value })
                        }
                        className="border border-gray-300 p-2 rounded-md flex-1"
                      >
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                        <option value="SuperAdmin">Super Admin</option>
                      </select>
                      <button
                        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                        onClick={handleAddUser}
                      >
                        Add User
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsModule;
