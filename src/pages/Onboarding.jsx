import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card.jsx";
import { Button } from "../components/ui/button.jsx";
import { Input } from "../components/ui/input.jsx";
import { Label } from "../components/ui/label.jsx";
import SidebarLayout from "../components/layout/sidebarLayout.jsx";
import { useStore } from "../store/store.jsx";
import { Menu } from "lucide-react";
import { ProgressBar } from "../components/ui/progressBar.jsx";
import { Step1, Step2, Step3, Step4 } from "../components/ui/progressBar.jsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog.jsx";
import { redirect, useLoaderData } from "react-router-dom";

const Onboarding = () => {
  const employeesData = useLoaderData();
  const [employees, setEmployees] = useState(employeesData.employees);
  const [searchTerm, setSearchTerm] = useState("");
  const [employeeToRemove, setEmployeeToRemove] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [employeeIdToRemove, setEmployeeIdToRemove] = useState("");
  const { activeModule, changeModule } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [step, setStep] = useState(1);
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    idNumber: "",
    gender: "",
    dob: "",
    employeeNumber: "",
    bankName: "",
    bankAccount: "",
    kraPin: "",
    nhifNo: "",
    nssfNo: "",
    department: "",
    position: "",
    hireDate: "",
    basicSalary: "",
    houseAllowance: "",
    transportAllowance: "",
    otherAllowances: "",
    personalRelief: "",
    insuranceRelief: "",
    helbDeduction: "",
    bonus: "",
    saccoDeduction: "",
    email: "",
    phoneNumber: "",
    location: "",
  });
  const fetchEmployees = async () => {
    try {
      const response = await fetch("http://localhost:5174/api/getemployees");
      const data = await response.json();
      if (response.ok) {
        setEmployees(data);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleAddEmployee = async () => {
    try {
      // Start adding employee - disable the button
      setIsAddingEmployee(true);

      const url = "http://localhost:5174/api/adduser";
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const addUser = await response.json();

      if (addUser.message === "user added Successfully") {
        console.log("Employee added successfully");

        // Reset the form fields
        setFormData({
          firstName: "",
          lastName: "",
          idNumber: "",
          gender: "",
          dob: "",
          employeeNumber: "",
          bankName: "",
          bankAccount: "",
          kraPin: "",
          nhifNo: "",
          nssfNo: "",
          department: "",
          position: "",
          hireDate: "",
          basicSalary: "",
          houseAllowance: "",
          transportAllowance: "",
          otherAllowances: "",
          personalRelief: "",
          insuranceRelief: "",
          helbDeduction: "",
          bonus: "",
          saccoDeduction: "",
          email: "",
          phoneNumber: "",
          location: "",
        });
        setStep(1);
        alert("Employee Registration Successful");
      } else {
        alert("Employee Registration Failed");
        setStep(1);
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      alert("An error occurred. Please try again.");
    } finally {
      // End adding employee - enable the button
      setIsAddingEmployee(false);
      fetchEmployees();
      console.log("isAddingEmployee reset to false");
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredEmployees = employees.filter(
    (entry) =>
      entry.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.employee_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.id.toString().includes(searchTerm)
  );

  const handleEmployeeIdChange = (e) => {
    const id = parseInt(e.target.value);
    setEmployeeIdToRemove(e.target.value);
    const employee = employees.find((emp) => emp.id === id);
    setEmployeeToRemove(employee || null);
  };

  const handleRemoveEmployee = async (e) => {
    e.preventDefault();
    console.log(employeeToRemove);
    try {
      console.log("Removing employee with ID:", employeeToRemove);

      const url = "http://localhost:5174/api/deleteemployee";
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employeeId: employeeToRemove.id }), // Send employee ID as body
      });

      const result = await response.json();

      if (response.ok && result.message === "User deleted successfully") {
        alert("Employee removed successfully");
        // Add any state updates or UI refresh logic here, e.g., refreshing the employee list
        fetchEmployees();
      } else {
        alert("Failed to remove employee");
      }
    } catch (error) {
      console.error("Error removing employee:", error);
      alert("An error occurred while removing the employee");
    }
  };

  const confirmRemoveEmployee = () => {
    setEmployeeIdToRemove("");
    setEmployeeToRemove(null);
    setShowConfirmDialog(false);
    alert("Offboarding Complete!");
  };
  const steps = [
    {
      component: (
        <Step1
          nextStep={() => setStep(step + 1)}
          formData={formData}
          setFormData={setFormData}
        />
      ),
    },
    {
      component: (
        <Step2
          nextStep={() => setStep(step + 1)}
          prevStep={() => setStep(step - 1)}
          formData={formData}
          setFormData={setFormData}
        />
      ),
    },
    {
      component: (
        <Step3
          nextStep={() => setStep(step + 1)}
          prevStep={() => setStep(step - 1)}
          formData={formData}
          setFormData={setFormData}
        />
      ),
    },
    {
      component: (
        <Step4
          prevStep={() => setStep(step - 1)}
          handleAddEmployee={handleAddEmployee}
          isAddingEmployee={isAddingEmployee}
        />
      ),
    },
  ];

  const progress = Math.floor((step / steps.length) * 100);

  return (
    <div className="flex h-screen">
      {sidebarOpen && (
        <SidebarLayout
          activeModule={activeModule}
          setActiveModule={changeModule}
        />
      )}
      <div className="flex-1 overflow-auto ">
        <div className="p-4 bg-white shadow-md flex justify-between items-center">
          <Button variant="ghost" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu />
          </Button>
          <h1 className="text-xl font-bold">{activeModule}</h1>
        </div>
        <div className="p-6 space-y-8">
          {/* Employees List */}
          <Card className="shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl">Current Employees</CardTitle>
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
                      <th className="border p-2 text-left">ID</th>
                      <th className="border p-2 text-left">Employee No</th>
                      <th className="border p-2 text-left">Username</th>
                      <th className="border p-2 text-left">Phone Number</th>
                      <th className="border p-2 text-left">position</th>
                      <th className="border p-2 text-left">Department</th>
                      <th className="border p-2 text-left">Company</th>
                      <th className="border p-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((employee) => (
                      <tr key={employee.id} className="hover:bg-gray-50">
                        <td className="border p-2">{employee.id}</td>
                        <td className="border p-2">
                          {employee.employee_number}
                        </td>
                        <td className="border p-2">
                          {employee.first_name + " " + employee.last_name}
                        </td>
                        <td className="border p-2">{employee.phone_number}</td>
                        <td className="border p-2">{employee.position}</td>
                        <td className="border p-2">{employee.department}</td>
                        <td className="border p-2">{employee.company}</td>
                        <td className="border p-2">{employee.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-2xl p-4">
            <h2 className="text-2xl font-bold mb-4">Employee Onboarding</h2>
            <ProgressBar progress={progress} />
            <div className="mt-8">{steps[step - 1].component}</div>
          </Card>

          {/* Offboarding Section */}
          <Card className="shadow-2xl m-4">
            <CardHeader>
              <CardTitle className="text-2xl">Offboard Employee</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRemoveEmployee} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="employeeId">
                    Enter Employee ID to Remove:
                  </Label>
                  <Input
                    id="employeeId"
                    name="employeeId"
                    //value={employeeIdToRemove}
                    onChange={handleEmployeeIdChange}
                    required
                  />
                </div>
                {employeeToRemove && (
                  <div className="mt-4 p-6 bg-gray-100 rounded-md">
                    <h3 className="font-bold text-xl border-b-4 pb-4">
                      Employee Details:
                    </h3>
                    <div className="m-2">
                      <span className="text-lg font-semibold mr-2">
                        Employee ID:
                      </span>

                      <span className="text-lg font-bold italic text-red-500">
                        {employeeToRemove.id}
                      </span>
                    </div>
                    <div className="m-2">
                      <span className="text-lg font-semibold mr-2">Name:</span>

                      <span className="text-lg font-normal italic">
                        {employeeToRemove.first_name +
                          " " +
                          employeeToRemove.last_name}
                      </span>
                    </div>
                    <div className="m-2">
                      <span className="text-lg font-semibold mr-2">
                        Phone Number:{" "}
                      </span>
                      <span className="text-lg font-normal italic">
                        {employeeToRemove.phone_number}
                      </span>
                    </div>
                    <div className="m-2">
                      <span className="text-lg font-semibold mr-2">
                        Company:{" "}
                      </span>
                      <span className="text-lg font-normal italic">
                        {employeeToRemove.company}
                      </span>
                    </div>
                    <div className="m-2">
                      <span className="text-lg font-semibold mr-2">
                        Position:
                      </span>
                      <span className="text-lg font-normal italic">
                        {employeeToRemove.position}
                      </span>
                    </div>
                  </div>
                )}
                <Button
                  type="submit"
                  className="mt-4"
                  disabled={!employeeToRemove}
                >
                  Remove Employee
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Confirmation Dialog */}
          <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  Confirm Employee Removal:{" "}
                </DialogTitle>
                <DialogDescription>
                  <span className="text-lg text-red-500">
                    Are you sure you want to remove the following employee?
                  </span>
                  <br />
                  <span className="text-lg font-semibold mr-2">Name:</span>{" "}
                  <span className="font-medium italic text-lg">
                    {" "}
                    {employeeToRemove?.username}
                  </span>
                  <br />
                  <span className="text-lg font-semibold mr-2">
                    Email:
                  </span>{" "}
                  <span className="font-medium italic text-lg">
                    {employeeToRemove?.email}
                  </span>
                  <br />
                  <span className="text-lg font-semibold mr-2">
                    Department:
                  </span>{" "}
                  <span className="font-medium italic text-lg">
                    {employeeToRemove?.department}
                  </span>
                  <br />
                  <span className="text-lg font-semibold mr-2">
                    Position:
                  </span>{" "}
                  <span className="font-medium italic text-lg">
                    {employeeToRemove?.position}
                  </span>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="default"
                  onClick={() => setShowConfirmDialog(false)}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmRemoveEmployee}>
                  Confirm Removal
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

export async function loader() {
  const token = localStorage.getItem("token");

  if (!token) {
    return redirect("/");
  }
  const url = "http://localhost:5174/api/verifyToken";
  const url2 = "http://localhost:5174/api/getemployees";

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
  const employees = await response2.json();
  if (userData.message === "token expired") {
    return redirect("/");
  }
  return { employees: employees, role: userData };
}
