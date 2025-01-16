import React, { useEffect, useState } from "react";
import { Menu, Calendar, Loader, TextSelect } from "lucide-react";
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
import {
  Form,
  NavLink,
  redirect,
  useLoaderData,
  useNavigation,
} from "react-router-dom";
import { formatDate } from "../util/helpers.jsx";
import { handleLeaveRequest } from "../util/helpers.jsx";

const LeaveManagementModule = () => {
  const { activeModule, changeModule, changeRole, role, currentYear } = useStore();
  const leaves = useLoaderData();
  const navigation = useNavigation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermAdjust, setSearchTermAdjust] = useState("");
  const [leaveData, setLeaveData] = useState(leaves.leaveData.leaves);
  const [isUpdated, setIsUpdated] = useState(false);
  const [employeeLeaveData, setEmployeeLeaveData] = useState(
    leaves.leaveBalance.filter((entry)=> entry.year === +currentYear)
  );

  const [leaveAdjustment, setLeaveAdjustment] = useState({
    employeeName: "",
    employeeId: "",
    leaveType: "",
    days: 0,
  });
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMgt, setViewMgt] = useState(false);

  const slicedBalance = employeeLeaveData.slice(0, 5);
  const isSubmitting = navigation.state === "submitting";
  const isLoading = navigation.state === "loading";
  
  const seevedData = leaveData.filter((entry) => {
    return entry.status === "pending" && entry.year === +currentYear;
  });
  const slicedData = seevedData.slice(0, 5);

  useEffect(() => {
    changeRole(leaves.user.role);
    changeModule("Leave Management");
    if (role === "super_admin" || role === "admin") {
      setViewMgt(true);
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const url2 = "http://hrmdemo.teqova.biz/api/leave";
        const response = await fetch(url2);
        const leavedata = await response.json();
        setLeaveData(leavedata.leaves);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [isUpdated]);

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAdjustInputChange = (e) => {
    console.log(e.target.value);
    setSearchTermAdjust(e.target.value);
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

  const filteredLeaveData = seevedData.filter(
    (entry) =>
      entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.leave_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLeaveBalance = employeeLeaveData.filter(
    (entry) =>
      entry.name.toLowerCase().includes(searchTermAdjust.toLowerCase()) ||
      entry.employee_number
        .toLowerCase()
        .includes(searchTermAdjust.toLowerCase())
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
            to="/leavedash"
            className=" border p-2  rounded shadow-lg hover:bg-slate-200 m-2"
          >
            <TextSelect className="inline size-8 mr-2 text-green-500 mb-2" />
            <span className="font-semibold text-sm  md:text-lg ">Leave Dash</span>
          </NavLink>
          <NavLink
            to="/calender"
            className=" border p-2  rounded shadow-lg hover:bg-slate-200 m-2"
          >
            <Calendar className="inline size-8 mr-2 text-blue-500 mb-2" />
            <span className="font-semibold text-sm md:text-lg ">Holidays</span>
          </NavLink>

          <h1 className="text-base md:text-2xl font-bold ml-2">{activeModule}</h1>
        </div>
        <div className="p-4 space-y-6">
          {viewMgt && (
            <Card className="shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl">Manage Requests</CardTitle>
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
                      {(searchTerm ? filteredLeaveData : slicedData).map(
                        (entry) => (
                          <tr key={entry.id} className="hover:bg-gray-50">
                            <td className="border p-2">{entry.name}</td>
                            <td className="border p-2">{entry.leave_type}</td>
                            <td className="border p-2">
                              {formatDate(entry.start_date)}
                            </td>
                            <td className="border p-2">
                              {formatDate(entry.end_date)}
                            </td>
                            <td className="border p-2">{entry.status}</td>
                            <td className="border p-2">
                              {entry.status === "pending" &&
                                entry.name !== leaves.user.name && (
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
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl">Request Leave</CardTitle>
            </CardHeader>
            <CardContent>
              <Form method="post" action="/leave" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Employee No/ID</Label>
                    <Input
                      type="text"
                      name="employeeId"
                      value={leaves.user.employee.employee_number}
                    />
                  </div>
                  <div>
                    <Label>Employee Name</Label>
                    <Input
                      type="text"
                      name="employeeName"
                      value={leaves.user?.name}
                    />
                  </div>
                  <div>
                    <Label>Employee Department</Label>
                    <Input
                      type="text"
                      name="employeeDepartment"
                      value={leaves.user.employee.department}
                    />
                  </div>
                  <div>
                    <Label>Leave Type</Label>
                    <select
                      name="leaveType"
                      className="border p-2 w-full"
                      required
                    >
                      <option value="">Select leave type</option>
                      <option value="Annual">Annual</option>
                      <option value="Sick">Sick</option>
                      <option value="Compassionate">Compassionate</option>
                    </select>
                  </div>
                  <div>
                    <Label>Start Date</Label>
                    <Input type="date" name="startDate" required />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input type="date" name="endDate" required />
                  </div>
                  <div>
                    <Label>No. of Days</Label>
                    <Input
                      type="number"
                      name="days"
                      placeholder="Enter Number of Days Taken"
                      required
                    />
                  </div>
                  <div>
                    <Label>Covering Employee No/ID:</Label>
                    <Input
                      type="text"
                      name="coveringEmployeeNumber"
                      placeholder="Enter covering Employee No/ID"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {isSubmitting || isLoading ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <></>
                  )}
                  {isSubmitting ? "Requesting..." : "Request Leave"}
                </button>
              </Form>
            </CardContent>
          </Card>

          {viewMgt && (
            <Card className="shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  Adjust Leave Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form method="post" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Employee Name</Label>
                      <Input
                        type="text"
                        name="employeeName"
                        placeholder="Enter employee name"
                      />
                    </div>
                    <div>
                      <Label>Employee ID</Label>
                      <Input
                        type="text"
                        name="employeeNumber"
                        placeholder="Enter employee number"
                      />
                    </div>
                    <div>
                      <Label>Leave Type</Label>
                      <select name="leaveType" className="border p-2 w-full">
                        <option value="">Select leave type</option>
                        <option value="Annual">Annual</option>
                        <option value="Sick">Sick</option>
                        {/* <option value="Paternity">Paternal</option>
                        <option value="Maternity">Maternal</option> */}
                        <option value="Compassionate">Compassionate</option>
                      </select>
                    </div>
                    <div>
                      <Label>Days</Label>
                      <Input
                        type="number"
                        name="days"
                        placeholder="Enter days"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    onClick={handleLeaveAdjustment}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                  >
                    Adjust Leave
                  </Button>
                </Form>
                <div className="mt-4">
                  <h3 className="font-bold mb-2 text-xl">
                    Employee Leave Balances
                  </h3>
                  <div className="mb-4">
                    <Input
                      type="text"
                      placeholder="Search leave balances"
                      value={searchTermAdjust}
                      onChange={handleAdjustInputChange}
                    />
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border p-2 text-left">
                            Employee Name
                          </th>
                          <th className="border p-2 text-left">Employee Id</th>
                          <th className="border p-2 text-left">Annual</th>
                          <th className="border p-2 text-left">Sick</th>
                          <th className="border p-2 text-left">Paternal</th>
                          <th className="border p-2 text-left">Maternal</th>
                          <th className="border p-2 text-left">Personal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {searchTermAdjust
                          ? filteredLeaveBalance.map((employee) => (
                              <tr
                                key={employee.name}
                                className="hover:bg-gray-50"
                              >
                                <td className="border p-2">{employee?.name}</td>
                                <td className="border p-2">
                                  {employee?.employee_number}
                                </td>
                                <td className="border p-2">
                                  {employee?.annual_leave_balance}
                                </td>
                                <td className="border p-2">
                                  {employee?.sick_leave_balance}
                                </td>
                                <td className="border p-2">
                                  {employee?.paternity_leave_entitlement}
                                </td>
                                <td className="border p-2">
                                  {employee?.maternity_leave_entitlement}
                                </td>
                                <td className="border p-2">
                                  {employee?.compassionate_leave_entitlement}
                                </td>
                              </tr>
                            ))
                          : slicedBalance.map((employee) => (
                              <tr
                                key={employee.name}
                                className="hover:bg-gray-50"
                              >
                                <td className="border p-2">{employee?.name}</td>
                                <td className="border p-2">
                                  {employee?.employee_number}
                                </td>
                                <td className="border p-2">
                                  {employee?.annual_leave_balance}
                                </td>
                                <td className="border p-2">
                                  {employee?.sick_leave_balance}
                                </td>
                                <td className="border p-2">
                                  {employee?.paternity_leave_entitlement}
                                </td>
                                <td className="border p-2">
                                  {employee?.maternity_leave_entitlement}
                                </td>
                                <td className="border p-2">
                                  {employee?.compassionate_leave_entitlement}
                                </td>
                              </tr>
                            ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {isModalOpen && selectedLeave && (
          <Dialog open={isModalOpen} onClose={handleCloseModal}>
            <Form className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <Dialog.Title className="text-lg font-bold">
                  Leave Details
                </Dialog.Title>
                <div className="mt-4">
                  <p>
                    <strong>Employee Name:</strong> {selectedLeave.name}
                  </p>
                  <p>
                    <strong>Leave Type:</strong> {selectedLeave.leave_type}
                  </p>
                  <p>
                    <strong>Start Date:</strong>{" "}
                    {formatDate(selectedLeave.start_date)}
                  </p>
                  <p>
                    <strong>End Date:</strong>{" "}
                    {formatDate(selectedLeave.end_date)}
                  </p>
                  <p>
                    <strong>Status:</strong> {selectedLeave.status}
                  </p>
                </div>
                <div className="mt-6 flex space-x-2">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    onClick={() =>
                      handleLeaveRequest(
                        selectedLeave.id,
                        "approved",
                        isModalOpen,
                        setIsModalOpen,
                        isUpdated,
                        setIsUpdated
                      )
                    }
                  >
                    {isSubmitting || isLoading ? (
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <></>
                    )}
                    {isSubmitting ? "Approving..." : "Approve"}
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    onClick={() =>
                      handleLeaveRequest(
                        selectedLeave.id,
                        "rejected",
                        isModalOpen,
                        setIsModalOpen,
                        isUpdated,
                        setIsUpdated
                      )
                    }
                  >
                    {isSubmitting || isLoading ? (
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <></>
                    )}
                    {isSubmitting ? " Rejecting..." : " Reject"}
                  </button>
                  <Button
                    className="bg-gray-500 hover:bg-gray-800 text-white px-4 py-2 rounded"
                    variant="ghost"
                    onClick={handleCloseModal}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </Form>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default LeaveManagementModule;

export async function action({ request, params }) {
  const data = await request.formData();

  const leaveData = {
    employeeId: data.get("employeeId"),
    employeeName: data.get("employeeName"),
    employeeNumber: data.get("employeeNumber"),
    employeeDepartment: data.get("employeeDepartment"),
    leaveType: data.get("leaveType"),
    startDate: data.get("startDate"),
    endDate: data.get("endDate"),
    days: data.get("days"),
    coveringEmployeeNumber: data.get("coveringEmployeeNumber"),
    
  };

  if (!leaveData.startDate) {
    console.log("Adjusting");
    console.log(leaveData);
    let url = "http://hrmdemo.teqova.biz/api/adjustleave";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(leaveData),
    });
    const resData = await response.json();
    if (resData.message === "update successfull") {
      return redirect("/employeedashboard");
    }
    return null;
  }

  let url = "http://hrmdemo.teqova.biz/api/requestLeave";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(leaveData),
  });
  const resData = await response.json();

  if (resData.message === "Leave inserted successfully") {
    return redirect("/employeedashboard");
  }

  return null; //redirect("/dashboard");
}

export async function loader() {
  const token = localStorage.getItem("token");

  if (!token) {
    return redirect("/");
  }
  const url = "http://hrmdemo.teqova.biz/api/verifyToken";
  const url2 = "http://hrmdemo.teqova.biz/api/leave";
  const url3 = "http://hrmdemo.teqova.biz/api/leavebalances";

  const data = { token: token };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const response2 = await fetch(url2);
  const response3 = await fetch(url3);

  const userData = await response.json();
  const { leaveBalance } = await response3.json();
  const leaveData = await response2.json();

  if (userData.message === "token expired") {
    return redirect("/");
  }
  console.log(leaveData)
  return {
    leaveData: leaveData,
    user: userData.user,
    leaveBalance: leaveBalance,
  };
}
