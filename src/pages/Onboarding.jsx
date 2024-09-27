import React, { useState } from "react";
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

const dummyEmployees = [
  {
    id: 21,
    username: "johndoe",
    email: "johndoe@example.com",
    phone: "123-456-7890",
    department: "IT",
    position: "Senior Developer",
    company: "TechCorp",
    role: "admin",
    status: "active",
  },
  {
    id: 22,
    username: "janedoe",
    email: "janedoe@example.com",
    phone: "987-654-3210",
    department: "HR",
    position: "HR Manager",
    company: "TechCorp",
    role: "employee",
    status: "active",
  },
  {
    id: 23,
    username: "alice",
    email: "alice@example.com",
    phone: "555-123-4567",
    department: "Marketing",
    position: "Marketing Specialist",
    company: "HealthPlus",
    role: "employee",
    status: "active",
  },
  {
    id: 25,
    username: "brian",
    email: "brian@example.com",
    phone: "222-333-4444",
    department: "Finance",
    position: "Financial Analyst",
    company: "HealthPlus",
    role: "admin",
    status: "active",
  },
  {
    id: 33,
    username: "Tom",
    email: "tom@example.com",
    phone: "777-888-9999",
    department: "IT",
    position: "Junior Developer",
    company: "TechCorp",
    role: "employee",
    status: "active",
  },
  {
    id: 34,
    username: "Lisa",
    email: "lisa@example.com",
    phone: "333-222-1111",
    department: "IT",
    position: "System Administrator",
    company: "TechCorp",
    role: "employee",
    status: "active",
  },
  {
    id: 24,
    username: "Duke",
    email: "duke@example.com",
    phone: "444-555-6666",
    department: "Operations",
    position: "Operations Manager",
    company: "HealthPlus",
    role: "employee",
    status: "active",
  },
];

const Onboarding = () => {
  const [employees, setEmployees] = useState(dummyEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [newEmployee, setNewEmployee] = useState({
    username: "",
    email: "",
    company: "",
    role: "employee",
  });
  const [employeeToRemove, setEmployeeToRemove] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [employeeIdToRemove, setEmployeeIdToRemove] = useState("");
  const { activeModule, changeModule, discplinaryAction } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    idNumber: "",
    dob: "",
    employeeNumber: "",
    department: "",
    position: "",
    hire_date: "",
    salary: "",
    bonus: "",
    deductions: { tax: "", insurance: "", other: "" },
    company: "",
    policiesAgreed: false,
    email: "",
    phoneNumber: "",
    status: "",
  });

  const handleAddEmployee = (e) => {
    e.preventDefault();
    const newId = employees.length ? employees[employees.length - 1].id + 1 : 1;
    setEmployees([...employees, { ...newEmployee, id: newId }]);
    setNewEmployee({ username: "", email: "", company: "", role: "employee" });
  };
  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredEmployees = employees.filter(
    (entry) =>
      entry.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const handleRemoveEmployee = (e) => {
    e.preventDefault();
    if (employeeToRemove) {
      setShowConfirmDialog(true);
    }
  };

  const confirmRemoveEmployee = () => {
    setEmployees(
      employees.filter((employee) => employee.id !== employeeToRemove.id)
    );
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
        <Step4 prevStep={() => setStep(step - 1)} formData={formData} />
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
                      <th className="border p-2 text-left">Username</th>
                      <th className="border p-2 text-left">Email</th>
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
                        <td className="border p-2">{employee.username}</td>
                        <td className="border p-2">{employee.email}</td>
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
                    value={employeeIdToRemove}
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
                        {employeeToRemove.username}
                      </span>
                    </div>
                    <div className="m-2">
                      <span className="text-lg font-semibold mr-2">
                        Email:{" "}
                      </span>
                      <span className="text-lg font-normal italic">
                        {employeeToRemove.email}
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
                      <span className="text-lg font-semibold mr-2">Role:</span>
                      <span className="text-lg font-normal italic">
                        {employeeToRemove.role}
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
