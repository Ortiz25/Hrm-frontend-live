import React, { useState, useEffect } from "react";
import { Menu, X, Calendar, TriangleAlert, Loader } from "lucide-react";
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
import EmployeeSuggestions from "../components/layout/suggestions.jsx";
import { formatDate } from "../util/helpers.jsx";

const DisciplinaryModule = () => {
  const { activeModule, changeModule,currentYear } = useStore();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const isLoading = navigation.state === "loading";
  const loaderData = useLoaderData();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [disciplinaryData, setDisciplinaryData] = useState(loaderData.cases.filter(entry => entry.year === +currentYear));
  const [selectedAction, setSelectedAction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAction, setNewAction] = useState({
    employeeName: "",
    employeeId: "",
    actionType: "",
    date: "",
    reason: "",
    status: "Open",
  });
  const [employeeSuggestions, setEmployeeSuggestions] = useState([]);
  console.log(disciplinaryData)
  const slicedCases = disciplinaryData.slice(0, 5);
  // New function to fetch employee data
  const fetchEmployeeData = async (searchTerm) => {
    try {
      const response = await fetch(
        `http://hrmdemo.teqova.biz/api/employees?search=${searchTerm}`
      );
      const data = await response.json();

      setEmployeeSuggestions(data);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  useEffect(() => {
    if (newAction.employeeName.length > 2) {
      fetchEmployeeData(newAction.employeeName);
    } else {
      setEmployeeSuggestions([]);
    }
  }, [newAction.employeeName]);

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleOpenModal = (action) => {
    setSelectedAction(action);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAction(null);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    console.log(id, newStatus);

    try {
      const url = "http://hrmdemo.teqova.biz/api/updatecase";
      const data = { status: newStatus, id: id };
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const userData = await response.json();
      console.log(userData);
      if (userData.message === "updated successfully") {
        setIsModalOpen(false);
        setDisciplinaryData((prevData) =>
          prevData.map((item) =>
            item.id === id ? { ...item, status: newStatus } : item
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleNewActionChange = (e) => {
    const { name, value } = e.target;
    setNewAction((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmployeeSelect = (employee) => {
    setNewAction((prev) => ({
      ...prev,
      employeeName: employee.first_name + " " + employee.last_name,
      employeeId: employee.employee_number,
    }));
    setEmployeeSuggestions([]);
  };

  const filteredData = disciplinaryData.filter(
    (entry) =>
      entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.action_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
            to="/warnings"
            className=" border p-2  rounded shadow-lg hover:bg-slate-200 mr-4"
          >
            <TriangleAlert className="inline size-4 md:size-8 mr-2 text-red-500 mb-2" />
            <span className="font-semibold text-sm md:text-lg ">Warnings</span>
          </NavLink>

          <h1 className=" text-base md:text-2xl font-bold">{activeModule}</h1>
        </div>
        <div className="p-4 space-y-6">
          <Card className="shadow-2xl">
            <CardHeader>
              <CardTitle>Disciplinary Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Search by employee name, action type, reason, or status"
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">Employee Name</th>
                      <th className="border p-2 text-left">Action Type</th>
                      <th className="border p-2 text-left">Date</th>
                      <th className="border p-2 text-left">Reason</th>
                      <th className="border p-2 text-left">Status</th>
                      <th className="border p-2 text-left w-1/6">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(searchTerm ? filteredData : slicedCases).map((entry) => (
                      <tr key={entry.id} className="hover:bg-gray-50">
                        <td className="border p-2">{entry.name}</td>
                        <td className="border p-2">{entry.action_type}</td>
                        <td className="border p-2">
                          {formatDate(entry.action_date)}
                        </td>
                        <td className="border p-2">{entry.description}</td>
                        <td className="border p-2">{entry.status}</td>
                        <td className="border p-2">
                          {entry.status === "open" && (
                            <Button
                              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded"
                              onClick={() => handleOpenModal(entry)}
                            >
                              Actions
                            </Button>
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
              <CardTitle>Record Disciplinary Case</CardTitle>
            </CardHeader>
            <CardContent>
              <Form method="post" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 relative">
                    <Label htmlFor="employeeName">Employee Name</Label>
                    <Input
                      id="employeeName"
                      name="employeeName"
                      value={newAction.employeeName}
                      onChange={handleNewActionChange}
                      required
                    />
                    {employeeSuggestions.length > 0 && (
                      <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-40 overflow-y-auto">
                        {employeeSuggestions.map((employee) => (
                          <li
                            key={employee.id}
                            className="p-2 hover:bg-gray-100 bg-gray-300 cursor-pointer"
                            onClick={() => handleEmployeeSelect(employee)}
                          >
                            {employee.first_name + " " + employee.last_name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employeeId">Employee Id/No</Label>
                    <Input
                      id="employeeId"
                      name="employeeId"
                      value={newAction.employeeId}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="actionType">Action Type</Label>
                    <select
                      id="actionType"
                      name="actionType"
                      className="border-4 rounded-md p-2 w-full"
                      required
                    >
                      <option value="">Select Action Type</option>
                      <option value="Warning">Warning</option>
                      <option value="Suspension">Suspension</option>
                      <option value="Termination">Termination</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" name="date" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason</Label>
                    <Input id="reason" name="reason" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Input id="status" name="status" required />
                  </div>
                </div>
                <Button type="submit">
                  {isSubmitting || isLoading ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <></>
                  )}
                  {isSubmitting ? "Opening Case..." : "Open Disciplinary Case"}
                </Button>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal for disciplinary action */}
      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="max-w-sm bg-white p-6 rounded">
            <Dialog.Title className="text-lg font-bold mb-4">
              Disciplinary Action Details
            </Dialog.Title>

            {selectedAction && (
              <div>
                <p>
                  <strong>Employee Name:</strong> {selectedAction.name}
                </p>
                <p>
                  <strong>Action Type:</strong> {selectedAction.action_type}
                </p>
                <p>
                  <strong>Date:</strong> {selectedAction.action_date}
                </p>
                <p>
                  <strong>Reason:</strong> {selectedAction.description}
                </p>
                <p>
                  <strong>Status:</strong> {selectedAction.status}
                </p>
                <div className="mt-4 flex justify-end space-x-2">
                  {selectedAction.status === "open" && (
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 "
                      onClick={() =>
                        handleUpdateStatus(selectedAction.id, "closed")
                      }
                    >
                      Close Case
                    </button>
                  )}
                  <Button variant="ghost" onClick={handleCloseModal}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default DisciplinaryModule;

export async function action({ request, params }) {
  const data = await request.formData();

  const caseData = {
    employeeId: data.get("employeeId"),
    employeeName: data.get("employeeName"),
    actionType: data.get("actionType"),
    date: data.get("date"),
    status: data.get("status"),
    reason: data.get("reason"),
  };
  console.log(caseData);

  let url = "http://hrmdemo.teqova.biz/api/recordcase";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(caseData),
  });
  const resData = await response.json();

  if (resData.message === "updated succesfully") {
    return redirect("/dashboard");
  }
  return null;
}

export async function loader() {
  const token = localStorage.getItem("token");

  if (!token) {
    return redirect("/");
  }
  const url = "http://hrmdemo.teqova.biz/api/verifyToken";
  const url2 = "http://hrmdemo.teqova.biz/api/discplinary";

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

  const { cases } = await response2.json();

  if (userData.message === "token expired") {
    return redirect("/");
  }
  return { cases: cases, role: userData };
}
