import React, { useState } from "react";
import { Menu, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card.jsx";
import { Button } from "../components/ui/button.jsx";
import { Input } from "../components/ui/input.jsx";
import { Label } from "../components/ui/label.jsx";
import { useStore } from "../store/store.jsx";
import SidebarLayout from "../components/layout/sidebarLayout.jsx";
import { Dialog } from "@headlessui/react";
import { NavLink } from "react-router-dom";

// Sample data for leave balances per employee
const initialEmployeeLeaveData = [
  {
    employeeName: "John Doe",
    employeeId: "NR/055",
    leaveBalances: {
      Annual: 10,
      Sick: 5,
      Paternal: 2,
      Maternal: 0,
      Personal: 3,
    },
  },
  {
    employeeName: "Jane Smith",
    employeeId: "NR/012",
    leaveBalances: {
      Annual: 8,
      Sick: 7,
      Paternal: 0,
      Maternal: 2,
      Personal: 5,
    },
  },
];

// Sample data for leave entries
const initialLeaveData = [
  {
    id: 1,
    employeeName: "John Doe",
    leaveType: "Annual",
    startDate: "2024-09-01",
    endDate: "2024-09-05",
    status: "Pending",
  },
  {
    id: 2,
    employeeName: "Jane Smith",
    leaveType: "Sick",
    startDate: "2024-09-10",
    endDate: "2024-09-12",
    status: "Pending",
  },
  {
    id: 3,
    employeeName: "Emily Johnson",
    leaveType: "Personal",
    startDate: "2024-09-15",
    endDate: "2024-09-20",
    status: "Approved",
  },
  {
    id: 4,
    employeeName: "Michael Brown",
    leaveType: "Annual",
    startDate: "2024-09-25",
    endDate: "2024-09-30",
    status: "Rejected",
  },
];

const LeaveManagementModule = () => {
  const { activeModule, changeModule } = useStore();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [leaveData, setLeaveData] = useState(initialLeaveData);
  const [employeeLeaveData, setEmployeeLeaveData] = useState(
    initialEmployeeLeaveData
  );
  const [newLeave, setNewLeave] = useState({
    employeeName: "",
    leaveType: "",
    startDate: "",
    endDate: "",
    status: "Pending",
  });
  const [leaveAdjustment, setLeaveAdjustment] = useState({
    employeeName: "",
    employeeId: "",
    leaveType: "",
    days: 0,
  });
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLeave((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdjustmentChange = (e) => {
    const { name, value } = e.target;
    setLeaveAdjustment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = leaveData.length + 1;
    const newLeaveEntry = {
      id,
      ...newLeave,
    };
    setLeaveData((prev) => [...prev, newLeaveEntry]);
    setNewLeave({
      employeeName: "",
      employeeId: "",
      employeeDepartment: "",
      leaveType: "",
      startDate: "",
      endDate: "",
      days: 0,
      status: "Pending",
    });
  };

  const handleApprove = (id) => {
    setLeaveData((prevData) =>
      prevData.map((entry) =>
        entry.id === id ? { ...entry, status: "Approved" } : entry
      )
    );
    handleCloseModal();
  };

  const handleReject = (id) => {
    setLeaveData((prevData) =>
      prevData.map((entry) =>
        entry.id === id ? { ...entry, status: "Rejected" } : entry
      )
    );
    handleCloseModal();
  };

  const handleOpenModal = (leave) => {
    setSelectedLeave(leave);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLeave(null);
  };

  const handleLeaveAdjustment = () => {
    const { employeeName, leaveType, days } = leaveAdjustment;
    setEmployeeLeaveData((prevData) =>
      prevData.map((employee) =>
        employee.employeeName === employeeName
          ? {
              ...employee,
              leaveBalances: {
                ...employee.leaveBalances,
                [leaveType]:
                  (employee.leaveBalances[leaveType] || 0) + Number(days),
              },
            }
          : employee
      )
    );
    setLeaveAdjustment({
      employeeName: "",
      leaveType: "",
      days: 0,
    });
  };

  const filteredLeaveData = leaveData.filter(
    (entry) =>
      entry.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <NavLink
            to="/calender"
            className=" border p-2  rounded shadow-lg hover:bg-slate-200"
          >
            <Calendar className="inline size-8 mr-2 text-blue-500 mb-2" />
            <span className="font-semibold text-lg ">Holidays</span>
          </NavLink>

          <h1 className="text-2xl font-bold">{activeModule}</h1>
        </div>
        <div className="p-4 space-y-6">
          <Card className="shadow-2xl">
            <CardHeader>
              <CardTitle className="text-xl">Manage Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Search by employee name, leave type, or status"
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">Employee Name</th>
                      <th className="border p-2 text-left">Leave Type</th>
                      <th className="border p-2 text-left">Start Date</th>
                      <th className="border p-2 text-left">End Date</th>
                      <th className="border p-2 text-left">Status</th>
                      <th className="border p-2 text-left w-1/6">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeaveData.map((entry) => (
                      <tr key={entry.id} className="hover:bg-gray-50">
                        <td className="border p-2">{entry.employeeName}</td>
                        <td className="border p-2">{entry.leaveType}</td>
                        <td className="border p-2">{entry.startDate}</td>
                        <td className="border p-2">{entry.endDate}</td>
                        <td className="border p-2">{entry.status}</td>
                        <td className="border p-2">
                          {entry.status === "Pending" && (
                            <div className="flex items-center space-x-2">
                              <Button
                                className="bg-green-500 hover:bg-green-600 text-white px-2 py-2 rounded"
                                onClick={() => handleOpenModal(entry)}
                              >
                                Action
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-2xl">
            <CardHeader>
              <CardTitle className="text-xl">Request Leave</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Employee No/ID</Label>
                    <Input
                      type="text"
                      name="employeeId"
                      value={newLeave.employeeId}
                      onChange={handleInputChange}
                      placeholder="Enter employee No/ID"
                      required
                    />
                  </div>
                  <div>
                    <Label>Employee Name</Label>
                    <Input
                      type="text"
                      name="employeeName"
                      value={newLeave.employeeName}
                      onChange={handleInputChange}
                      placeholder="Enter employee name"
                      required
                    />
                  </div>
                  <div>
                    <Label>Employee Department</Label>
                    <Input
                      type="text"
                      name="employeeDepartment"
                      value={newLeave.employeeDepartment}
                      onChange={handleInputChange}
                      placeholder="Enter employee Department"
                      required
                    />
                  </div>
                  <div>
                    <Label>Leave Type</Label>
                    <select
                      name="leaveType"
                      value={newLeave.leaveType}
                      onChange={handleInputChange}
                      className="border p-2 w-full"
                      required
                    >
                      <option value="">Select leave type</option>
                      <option value="Annual">Annual</option>
                      <option value="Sick">Sick</option>
                      <option value="Paternal">Paternal</option>
                      <option value="Maternal">Maternal</option>
                      <option value="Personal">Personal</option>
                    </select>
                  </div>
                  <div>
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      name="startDate"
                      value={newLeave.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      name="endDate"
                      value={newLeave.endDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label>No. of Days</Label>
                    <Input
                      type="number"
                      name="days"
                      value={newLeave.days}
                      onChange={handleInputChange}
                      placeholder="Enter Number of Days Taken"
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Request Leave
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-2xl">
            <CardHeader>
              <CardTitle className="text-xl">Adjust Leave Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Employee Name</Label>
                    <Input
                      type="text"
                      name="employeeName"
                      value={leaveAdjustment.employeeName}
                      onChange={handleAdjustmentChange}
                      placeholder="Enter employee name"
                    />
                  </div>
                  <div>
                    <Label>Employee ID</Label>
                    <Input
                      type="text"
                      name="employeeName"
                      value={leaveAdjustment.employeeId}
                      onChange={handleAdjustmentChange}
                      placeholder="Enter employee name"
                    />
                  </div>
                  <div>
                    <Label>Leave Type</Label>
                    <select
                      name="leaveType"
                      value={leaveAdjustment.leaveType}
                      onChange={handleAdjustmentChange}
                      className="border p-2 w-full"
                    >
                      <option value="">Select leave type</option>
                      <option value="Annual">Annual</option>
                      <option value="Sick">Sick</option>
                      <option value="Paternal">Paternal</option>
                      <option value="Maternal">Maternal</option>
                      <option value="Personal">Personal</option>
                    </select>
                  </div>
                  <div>
                    <Label>Days</Label>
                    <Input
                      type="number"
                      name="days"
                      value={leaveAdjustment.days}
                      onChange={handleAdjustmentChange}
                      placeholder="Enter days"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleLeaveAdjustment}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                >
                  Adjust Leave
                </Button>
              </div>
              <div className="mt-4">
                <h3 className="font-bold mb-2">Employee Leave Balances</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2 text-left">Employee Name</th>
                        <th className="border p-2 text-left">Employee Id</th>
                        <th className="border p-2 text-left">Annual</th>
                        <th className="border p-2 text-left">Sick</th>
                        <th className="border p-2 text-left">Paternal</th>
                        <th className="border p-2 text-left">Maternal</th>
                        <th className="border p-2 text-left">Personal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employeeLeaveData.map((employee) => (
                        <tr
                          key={employee.employeeName}
                          className="hover:bg-gray-50"
                        >
                          <td className="border p-2">
                            {employee.employeeName}
                          </td>
                          <td className="border p-2">{employee.employeeId}</td>
                          <td className="border p-2">
                            {employee.leaveBalances.Annual}
                          </td>
                          <td className="border p-2">
                            {employee.leaveBalances.Sick}
                          </td>
                          <td className="border p-2">
                            {employee.leaveBalances.Paternal}
                          </td>
                          <td className="border p-2">
                            {employee.leaveBalances.Maternal}
                          </td>
                          <td className="border p-2">
                            {employee.leaveBalances.Personal}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {isModalOpen && selectedLeave && (
          <Dialog open={isModalOpen} onClose={handleCloseModal}>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <Dialog.Title className="text-lg font-bold">
                  Leave Details
                </Dialog.Title>
                <div className="mt-4">
                  <p>
                    <strong>Employee Name:</strong> {selectedLeave.employeeName}
                  </p>
                  <p>
                    <strong>Leave Type:</strong> {selectedLeave.leaveType}
                  </p>
                  <p>
                    <strong>Start Date:</strong> {selectedLeave.startDate}
                  </p>
                  <p>
                    <strong>End Date:</strong> {selectedLeave.endDate}
                  </p>
                  <p>
                    <strong>Status:</strong> {selectedLeave.status}
                  </p>
                </div>
                <div className="mt-6 flex space-x-2">
                  <Button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    onClick={() => handleApprove(selectedLeave.id)}
                  >
                    Approve
                  </Button>
                  <Button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    onClick={() => handleReject(selectedLeave.id)}
                  >
                    Reject
                  </Button>
                  <Button
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                    onClick={handleCloseModal}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default LeaveManagementModule;
