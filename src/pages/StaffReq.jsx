import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@headlessui/react"; // Assuming Button is from Headless UI or similar library
import {
  Dialog as DDialog,
  DialogContent as DDialogContent,
  DialogHeader as DDialogHeader,
  DialogTitle as DDialogTitle,
  DialogFooter as DDialogFooter,
} from "../components/ui/dialog";
import SidebarLayout from "../components/layout/sidebarLayout";
import { Menu } from "lucide-react";
import { Input } from "../components/ui/input.jsx";
import { useStore } from "../store/store.jsx";
import { X } from "lucide-react";
import { Label } from "../components/ui/label.jsx";
import { redirect, useLoaderData } from "react-router-dom";
import { formatDate } from "../util/helpers.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import navlogo from "../assets/navlogo.png";

const StaffManagementModule = () => {
  const { activeModule, changeModule, currentYear } = useStore();
  const [yearToFilter, updateYear] = useState(currentYear);
  const staffReq = useLoaderData();
  const [staffData, setStaffData] = useState(staffReq.staffReq);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [newStaff, setNewStaff] = useState({
    name: "",
    position: "",
    department: "",
    workSchedule: "",
  });
  const [editingStaff, setEditingStaff] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // New state variables for accept/deny modals
  const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useState(false);
  const [isDenyDialogOpen, setIsDenyDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const year = new Date().getFullYear();
  const years = Array.from({ length: 2 }, (_, i) => year - i);

  useEffect(() => {
    changeModule("Staff Requisition");
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingStaff) {
      setEditingStaff({ ...editingStaff, [name]: value });
    } else {
      setNewStaff({ ...newStaff, [name]: value });
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddStaff = () => {
    const id = staffData.length + 1;
    const newStaffMember = { id, ...newStaff };
    setStaffData([...staffData, newStaffMember]);
    setNewStaff({
      name: "",
      position: "",
      department: "",
      workSchedule: "",
    });
    setIsAddDialogOpen(false);
  };

  const handleEditStaff = (staff) => {
    setEditingStaff(staff);
    setIsEditDialogOpen(true);
  };

  const handleUpdateStaff = () => {
    setStaffData(
      staffData.map((staff) =>
        staff.id === editingStaff.id ? editingStaff : staff
      )
    );
    setEditingStaff(null);
    setIsEditDialogOpen(false);
  };

  const handleDeleteStaff = (id) => {
    setStaffData(staffData.filter((staff) => staff.id !== id));
  };

  // New functions for accept/deny actions
  const handleRequisition = (staff, status) => {
    console.log(staff, status);
    if (status === "accept") {
      setIsAcceptDialogOpen(!isAcceptDialogOpen);
      setSelectedStaff(staff);
    }
    if (status === "reject") {
      setIsDenyDialogOpen(!isDenyDialogOpen);
      setSelectedStaff(staff);
    }
  };
  async function getRequistions() {
    try {
      const url2 = "https://hrmbackend.teqova.biz/api/staffreq";

      const response2 = await fetch(url2);

      const { staffReq } = await response2.json();
      console.log(staffReq);
      setStaffData(staffReq);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleRequest(status, id) {
    try {
      const url = "https://hrmbackend.teqova.biz/api/handlerequest";

      const data = { status: status, id: id };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const userData = await response.json();
      console.log(userData.message);
    } catch (error) {
      console.log(error);
    }
  }

  const confirmRequisition = (status) => {
    console.log(status, selectedStaff);
    if (status === "accept") {
      handleRequest((status = "approved"), selectedStaff.id);
      setIsAcceptDialogOpen(false);
      setSelectedStaff(null);
      getRequistions();
    }
    if (status === "reject") {
      handleRequest((status = "rejected"), selectedStaff.id);
      setIsDenyDialogOpen(false);
      setSelectedStaff(null);
      getRequistions();
    }
  };
  const filteredStaffData = staffData?.filter(
    (entry) =>
      entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      // entry.workSchedule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.justification.toLowerCase().includes(searchTerm.toLowerCase())
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
        <div
          className="p-4 bg-white shadow-md flex justify-between items-center"
          style={{ backgroundImage: `url(${navlogo})` }}
        >
          <Button variant="ghost" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="text-white" />
          </Button>

          <h1 className="text-sm md:text-xl font-bold text-white">{activeModule}</h1>
        </div>
        <div className="p-4 ">
            <select
              value={yearToFilter}
              onChange={(e) => {
                updateYear(e.target.value);
              }}
              className="w-28 px-6 py-2 bg-white border border-gray-300 rounded-lg shadow-sm 
                   text-gray-700 appearance-none cursor-pointer
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   font-medium text-base tracking-wide"
            >
              <option value="">Select Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        <div className="p-4 space-y-6 shadow-2xl m-4">
          
          <div className="bg-white shadow rounded-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-2xl font-semibold">Staff Requisition</h2>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Request New Staff
              </Button>
            </div>
            <div className="m-4">
              <Input
                type="text"
                className="px-8"
                placeholder="Search by Name, Position, Department, Work Schedule, or Reason"
                value={searchTerm}
                onChange={handleSearchInputChange}
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Supervisor/Manager</th>
                    <th className="border p-2 text-left">Position</th>
                    <th className="border p-2 text-left">Department</th>
                    <th className="border p-2 text-left">Request Date</th>
                    <th className="border p-2 text-left">Reason</th>
                    <th className="border p-2 text-left">Status</th>
                    <th className="border p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {searchTerm
                    ? filteredStaffData
                        .filter((entry) => entry.year === +yearToFilter)
                        .map((staff) => (
                          <tr key={staff.id} className="hover:bg-gray-50">
                            <td className="border p-2">{staff.name}</td>
                            <td className="border p-2">{staff.position}</td>
                            <td className="border p-2">{staff.department}</td>
                            <td className="border p-2">
                              {formatDate(staff.requested_date)}
                            </td>
                            <td className="border p-2">
                              {staff.justification}
                            </td>
                            <td className="border p-2">{staff.status}</td>
                            <td className="px-2">
                              <div className="flex flex-col sm:flex-row gap-2">
                                {staff.status === "pending" ? (
                                  <>
                                    <Button
                                      onClick={() =>
                                        handleRequisition(staff, "accept")
                                      }
                                      className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600 text-xs sm:text-sm"
                                    >
                                      Accept
                                    </Button>
                                    <Button
                                      onClick={() =>
                                        handleRequisition(staff, "reject")
                                      }
                                      className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700 text-xs sm:text-sm"
                                    >
                                      Deny
                                    </Button>
                                  </>
                                ) : (
                                  "Closed"
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                    : staffData
                        .filter((entry) => entry.year === +yearToFilter)
                        .map((staff) => (
                          <tr key={staff.id} className="hover:bg-gray-50">
                            <td className="border p-2">{staff.name}</td>
                            <td className="border p-2">{staff.position}</td>
                            <td className="border p-2">{staff.department}</td>
                            <td className="border p-2">
                              {formatDate(staff.requested_date)}
                            </td>
                            <td className="border p-2">
                              {staff.justification}
                            </td>
                            <td className="border p-2">{staff.status}</td>
                            <td className="px-2">
                              <div className="flex flex-col sm:flex-row gap-2">
                                {staff.status === "pending" ? (
                                  <>
                                    <Button
                                      onClick={() =>
                                        handleRequisition(staff, "accept")
                                      }
                                      className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600 text-xs sm:text-sm"
                                    >
                                      Accept
                                    </Button>
                                    <Button
                                      onClick={() =>
                                        handleRequisition(staff, "reject")
                                      }
                                      className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700 text-xs sm:text-sm"
                                    >
                                      Deny
                                    </Button>
                                  </>
                                ) : (
                                  "Closed"
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Dialog */}
          <DDialog
            open={isAddDialogOpen}
            onClose={() => setIsAddDialogOpen(false)}
          >
            <DDialogContent className="sm:max-w-[425px] bg-white">
              <DDialogHeader>
                <DDialogTitle className="text-center text-2xl font-bold">
                  Add New Requisition
                </DDialogTitle>

                <X
                  className="h-4 w-4 absolute right-4 top-4 hover:pointer"
                  onClick={() => setIsAddDialogOpen(false)}
                />
              </DDialogHeader>
              <div className="grid gap-4 py-4">
                {["Supervisor", "position", "department", "Reason"].map(
                  (field) => (
                    <div
                      key={field}
                      className="grid grid-cols-4 items-center gap-4"
                    >
                      <Label htmlFor={field} className="text-right">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </Label>
                      <Input
                        id={field}
                        name={field}
                        value={newStaff[field]}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                  )
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="workSchedule" className="text-right">
                    Work Schedule
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      handleInputChange({
                        target: { name: "workSchedule", value },
                      })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DDialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddStaff}>Add</Button>
              </DDialogFooter>
            </DDialogContent>
          </DDialog>

          {/* Edit Dialog */}
          <Dialog
            open={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
          >
            {/* ... Similar structure for the edit modal */}
          </Dialog>

          {/* Accept Dialog */}
          <Dialog
            open={isAcceptDialogOpen}
            onClose={() => setIsAcceptDialogOpen(false)}
          >
            <div
              className="fixed inset-0 bg-black bg-opacity-30"
              aria-hidden="true"
            ></div>
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h3 className="text-2xl font-bold mb-4">Accept Requisition</h3>
                <p className="text-green-500">
                  Are you sure you want to accept the requisition for{" "}
                  {selectedStaff?.name}?
                </p>
                <div className="mt-6 flex justify-end space-x-2">
                  <Button
                    onClick={() => setIsAcceptDialogOpen(false)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => confirmRequisition("accept")}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    Accept
                  </Button>
                </div>
              </div>
            </div>
          </Dialog>

          {/* Deny Dialog */}
          <Dialog
            open={isDenyDialogOpen}
            onClose={() => setIsDenyDialogOpen(false)}
          >
            <div
              className="fixed inset-0 bg-black bg-opacity-30"
              aria-hidden="true"
            ></div>
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h3 className="text-2xl font-bold mb-4">Deny Requisition</h3>
                <p className="text-red-500">
                  Are you sure you want to deny the requisition for{" "}
                  {selectedStaff?.name}?
                </p>
                <div className="mt-6 flex justify-end space-x-2">
                  <Button
                    onClick={() => setIsDenyDialogOpen(false)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => confirmRequisition("reject")}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                  >
                    Deny
                  </Button>
                </div>
              </div>
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default StaffManagementModule;

export async function loader() {
  const token = localStorage.getItem("token");
  console.log(token);
  if (!token) {
    return redirect("/");
  }
  const url = "https://hrmbackend.teqova.biz/api/verifyToken";
  const url2 = "https://hrmbackend.teqova.biz/api/staffreq";

  const data = { token: token };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const response2 = await fetch(url2);

  const userData = await response.json();

  const { staffReq } = await response2.json();
  console.log(staffReq, userData);
  if (userData.message === "token expired") {
    return redirect("/");
  }
  return { staffReq: staffReq, role: userData };
}
