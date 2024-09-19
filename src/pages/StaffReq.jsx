import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@headlessui/react"; // Assuming Button is from Headless UI or similar library
import SidebarLayout from "../components/layout/sidebarLayout";
import { Menu } from "lucide-react";
import { Input } from "../components/ui/input.jsx";
import { useStore } from "../store/store.jsx";
import { X } from "lucide-react";
import { Label } from "../components/ui/label.jsx";

// Dummy data for staff
const initialStaffData = [
  {
    id: 1,
    name: "John Doe",
    position: "Software Engineer",
    department: "IT",
    workSchedule: "Full-time",
    reason: "Expansion of development team to handle new projects",
    status: "Pending",
  },
  {
    id: 2,
    name: "Jane Smith",
    position: "Project Manager",
    department: "Operations",
    workSchedule: "Full-time",
    reason:
      "Need for a project manager to streamline cross-department projects",
    status: "Accepted",
  },
  {
    id: 3,
    name: "Bob Johnson",
    position: "UI/UX Designer",
    department: "Design",
    workSchedule: "Full-time",
    reason: "UI/UX design expertise required for new product launch",
    status: "Pending",
  },
  {
    id: 4,
    name: "Alice Brown",
    position: "Data Analyst",
    department: "Analytics",
    workSchedule: "Part-time",
    reason: "Data analysis support needed to improve decision-making processes",
    status: "Rejected",
  },
  {
    id: 5,
    name: "Charlie Davis",
    position: "HR Specialist",
    department: "Human Resources",
    workSchedule: "Part-time",
    reason: "Support required in recruitment and employee relations",
    status: "Pending",
  },
];

const StaffManagementModule = () => {
  const [staffData, setStaffData] = useState(initialStaffData);
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

  const filteredStaffData = staffData.filter(
    (entry) =>
      entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.workSchedule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
  const handleAcceptRequisition = (staff) => {
    setSelectedStaff(staff);
    setIsAcceptDialogOpen(true);
  };

  const handleDenyRequisition = (staff) => {
    setSelectedStaff(staff);
    setIsDenyDialogOpen(true);
  };

  const confirmAcceptRequisition = () => {
    setStaffData(
      staffData.map((staff) =>
        staff.id === selectedStaff.id ? { ...staff, status: "Accepted" } : staff
      )
    );
    setIsAcceptDialogOpen(false);
  };

  const confirmDenyRequisition = () => {
    setStaffData(
      staffData.map((staff) =>
        staff.id === selectedStaff.id ? { ...staff, status: "Denied" } : staff
      )
    );
    setIsDenyDialogOpen(false);
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
              <div className="min-w-full">
                <div className="min-w-full">
                  <div className="grid grid-cols-7 gap-2 font-bold py-2 bg-gray-100 text-sm md:text-base">
                    <div className="px-2">Supervisor/Manager</div>
                    <div className="px-2">Position</div>
                    <div className="px-2">Department</div>
                    <div className="px-2">Work Schedule</div>
                    <div className="px-2">Reason</div>
                    <div className="px-2">Status</div>
                    <div className="px-2">Actions</div>
                  </div>
                  {filteredStaffData.map((staff) => (
                    <div
                      key={staff.id}
                      className="grid grid-cols-7 gap-2 py-2 border-b text-sm md:text-base items-center"
                    >
                      <div className="px-2 truncate">{staff.name}</div>
                      <div className="px-2 truncate">{staff.position}</div>
                      <div className="px-2 truncate">{staff.department}</div>
                      <div className="px-2 truncate">{staff.workSchedule}</div>
                      <div className="px-2 truncate">{staff.reason}</div>
                      <div className="px-2 truncate">{staff.status}</div>
                      <div className="px-2 flex flex-col sm:flex-row gap-2">
                        {staff.status === "Pending" ? (
                          <>
                            <Button
                              onClick={() => handleAcceptRequisition(staff)}
                              className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600 text-xs sm:text-sm"
                            >
                              Accept
                            </Button>
                            <Button
                              onClick={() => handleDenyRequisition(staff)}
                              className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700 text-xs sm:text-sm"
                            >
                              Deny
                            </Button>
                          </>
                        ) : (
                          "Closed"
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Add Dialog */}
          <Dialog
            open={isAddDialogOpen}
            onClose={() => setIsAddDialogOpen(false)}
          >
            <div
              className="fixed inset-0 bg-black bg-opacity-30"
              aria-hidden="true"
            ></div>
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <X
                  className="absolute top-2 right-5 hover:border-2 hover:border-gray-900"
                  onClick={() => setIsAddDialogOpen(false)}
                />

                <h3 className="text-center text-2xl font-bold mb-4">
                  Add New Requisition
                </h3>

                <div className="space-y-4">
                  {["Supervisor", "position", "department"].map((field) => (
                    <div key={field} className="flex items-center space-x-4">
                      <Label htmlFor={field} className="text w-1/4 font-medium">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </Label>
                      <Input
                        id={field}
                        name={field}
                        value={newStaff[field]}
                        onChange={handleInputChange}
                        type="text"
                        className="border border-gray-300 p-2 w-full"
                      />
                    </div>
                  ))}
                  <Label
                    htmlFor="workschedule"
                    className="inline-block text w-1/4 font-medium"
                  >
                    Work Schedule
                  </Label>
                  <select
                    className="inline-block w-2\4 border border-gray-300 p-2 ml-2 "
                    name="work-schedule"
                    id="work"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                  </select>
                </div>

                <div className="mt-6 flex justify-end space-x-2">
                  <Button
                    onClick={() => setIsAddDialogOpen(false)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddStaff}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </Dialog>

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
                    onClick={confirmAcceptRequisition}
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
                    onClick={confirmDenyRequisition}
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
