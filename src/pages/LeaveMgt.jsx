import React, { useState } from "react";
import { Menu } from "lucide-react";
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
  const [newLeave, setNewLeave] = useState({
    employeeName: "",
    leaveType: "",
    startDate: "",
    endDate: "",
    status: "Pending",
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
      leaveType: "",
      startDate: "",
      endDate: "",
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
          <h1 className="text-xl font-bold">{activeModule}</h1>
        </div>
        <div className="p-4 space-y-6">
          <Card className="shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl">Leave Management</CardTitle>
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
              <CardTitle className="text-2xl">Request Leave</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employeeName">Employee Name</Label>
                    <Input
                      id="employeeName"
                      name="employeeName"
                      value={newLeave.employeeName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employeeId">Employee ID</Label>
                    <Input
                      id="employeeId"
                      name="employeeId"
                      value={newLeave.employeeId}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="leaveType">Leave Type</Label>
                    <select
                      id="leaveType"
                      name="leaveType"
                      className="border-4 rounded-md p-2 w-full"
                      value={newLeave.leaveType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Leave Type</option>
                      <option value="Annual">Annual</option>
                      <option value="Sick">Sick</option>
                      <option value="Personal">Personal</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={newLeave.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={newLeave.endDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <Button type="submit">Submit Leave Request</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal for leave action */}
      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="max-w-sm bg-white p-6 rounded">
            <Dialog.Title className="text-xl border-b-2 border-slate-600 font-bold mb-4">
              Leave Details
            </Dialog.Title>
            {selectedLeave && (
              <div>
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
                <div className="mt-4 flex justify-end space-x-2">
                  <Button
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => handleApprove(selectedLeave.id)}
                  >
                    Approve
                  </Button>
                  <Button
                    className="bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => handleReject(selectedLeave.id)}
                  >
                    Reject
                  </Button>
                  <button
                    className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default LeaveManagementModule;
