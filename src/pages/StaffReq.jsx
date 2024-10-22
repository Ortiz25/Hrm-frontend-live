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

const StaffManagementModule = () => {
  const staffReq = useLoaderData();
  const [staffData, setStaffData] = useState(staffReq.staffReq);
  const { activeModule, changeModule } = useStore();
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
      const url2 = "https://hrmbackend.livecrib.pro/api/staffreq";

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
      const url = "https://hrmbackend.livecrib.pro/api/handlerequest";

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
        <div className="p-4 bg-white shadow-md flex justify-between items-center">
          <Button variant="ghost" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu />
          </Button>
          <h1 className="text-xl font-bold">{activeModule}</h1>
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
            <div className="overflow-x-auto w-full">
              <table className="min-w-full">
                <thead>
                  <tr className="grid grid-cols-7 gap-2 font-bold py-2 bg-gray-100 text-sm md:text-base">
                    <th className="px-2">Supervisor/Manager</th>
                    <th className="px-2">Position</th>
                    <th className="px-2">Department</th>
                    <th className="px-2">Request Date</th>
                    <th className="px-2">Reason</th>
                    <th className="px-2">Status</th>
                    <th className="px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {searchTerm
                    ? filteredStaffData.map((staff) => (
                        <tr
                          key={staff.id}
                          className="grid grid-cols-7 gap-2 py-2 border-b text-sm md:text-base items-center"
                        >
                          <td className="px-2 truncate">{staff.name}</td>
                          <td className="px-2 truncate">{staff.position}</td>
                          <td className="px-2 truncate">{staff.department}</td>
                          <td className="px-2 truncate">
                            {formatDate(staff.requested_date)}
                          </td>
                          <td className="px-2 truncate">
                            {staff.justification}
                          </td>
                          <td className="px-2 truncate">{staff.status}</td>
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
                    : staffData.map((staff) => (
                        <tr
                          key={staff.id}
                          className="grid grid-cols-7 gap-2 py-2 border-b text-sm md:text-base items-center"
                        >
                          <td className="px-2 truncate">{staff.name}</td>
                          <td className="px-2 truncate">{staff.position}</td>
                          <td className="px-2 truncate">{staff.department}</td>
                          <td className="px-2 truncate">
                            {formatDate(staff.requested_date)}
                          </td>
                          <td className="px-2 truncate">
                            {staff.justification}
                          </td>
                          <td className="px-2 truncate">{staff.status}</td>
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
  const url = "https://hrmbackend.livecrib.pro/api/verifyToken";
  const url2 = "https://hrmbackend.livecrib.pro/api/staffreq";

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
