import React, { useEffect, useState } from "react";
import {
  Users,
  DollarSign,
  Calendar,
  FileText,
  UserPlus,
  Menu,
  X,
  Download,
  Filter,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select } from "../components/ui/select";
import SidebarLayout from "../components/layout/sidebarLayout";
import { useStore } from "../store/store";
import Modal from "../components/ui/modal";
import { generateAndDownloadExcel } from "../util/generateXL";
import { motion } from "framer-motion";

const initialPayrollData = [
  {
    id: 2,
    name: "Alice Smith",
    email: "alice.smith@example.com",
    phone: "123-456-7891",
    bankDetails: "Bank B - 2345678901",
    kraPin: "B234567890C",
    nhif: "NHIF234567",
    nssf: "NSSF890123",
    position: "Senior Developer",
    department: "Engineering",
    hireDate: "2019-06-20",
    company: "TechCorp",
    grossSalary: 85000,
    paye: 17000,
    insurance: 2500,
    nhifDeduction: 1000,
    nssfDeduction: 500,
    bonus: 7000,
    deductions: {
      tax: 17000,
      insurance: 2500,
      other: 600,
    },
    overtime: 8,
    overtimeRate: 550,
    leave: 1,
    joinDate: "2019-06-20",
    paymentMonth: "2024-09",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    phone: "123-456-7892",
    bankDetails: "Bank C - 3456789012",
    kraPin: "C345678901D",
    nhif: "NHIF345678",
    nssf: "NSSF901234",
    position: "Data Analyst",
    department: "Data Science",
    hireDate: "2020-03-10",
    company: "DataCorp",
    grossSalary: 65000,
    paye: 13000,
    insurance: 1800,
    nhifDeduction: 800,
    nssfDeduction: 400,
    bonus: 4000,
    deductions: {
      tax: 13000,
      insurance: 1800,
      other: 400,
    },
    overtime: 5,
    overtimeRate: 450,
    leave: 3,
    joinDate: "2020-03-10",
    paymentMonth: "2024-09",
  },
  {
    id: 4,
    name: "Emily Brown",
    email: "emily.brown@example.com",
    phone: "123-456-7893",
    bankDetails: "Bank D - 4567890123",
    kraPin: "D456789012E",
    nhif: "NHIF456789",
    nssf: "NSSF012345",
    position: "UX Designer",
    department: "Design",
    hireDate: "2021-02-05",
    company: "DesignCorp",
    grossSalary: 70000,
    paye: 14000,
    insurance: 1900,
    nhifDeduction: 900,
    nssfDeduction: 450,
    bonus: 6000,
    deductions: {
      tax: 14000,
      insurance: 1900,
      other: 450,
    },
    overtime: 7,
    overtimeRate: 480,
    leave: 2,
    joinDate: "2021-02-05",
    paymentMonth: "2024-09",
  },
  {
    id: 5,
    name: "Michael Davis",
    email: "michael.davis@example.com",
    phone: "123-456-7894",
    bankDetails: "Bank E - 5678901234",
    kraPin: "E567890123F",
    nhif: "NHIF567890",
    nssf: "NSSF123456",
    position: "Product Manager",
    department: "Product",
    hireDate: "2018-11-15",
    company: "ProductCorp",
    grossSalary: 90000,
    paye: 18000,
    insurance: 2800,
    nhifDeduction: 1200,
    nssfDeduction: 700,
    bonus: 8000,
    deductions: {
      tax: 18000,
      insurance: 2800,
      other: 700,
    },
    overtime: 6,
    overtimeRate: 600,
    leave: 1,
    joinDate: "2018-11-15",
    paymentMonth: "2024-09",
  },
  {
    id: 6,
    name: "Sophia Wilson",
    email: "sophia.wilson@example.com",
    phone: "123-456-7895",
    bankDetails: "Bank F - 6789012345",
    kraPin: "F678901234G",
    nhif: "NHIF678901",
    nssf: "NSSF234567",
    position: "Frontend Developer",
    department: "Engineering",
    hireDate: "2020-08-30",
    company: "TechCorp",
    grossSalary: 80000,
    paye: 16000,
    insurance: 2200,
    nhifDeduction: 1100,
    nssfDeduction: 550,
    bonus: 5500,
    deductions: {
      tax: 16000,
      insurance: 2200,
      other: 550,
    },
    overtime: 9,
    overtimeRate: 520,
    leave: 2,
    joinDate: "2020-08-30",
    paymentMonth: "2024-09",
  },
  {
    id: 7,
    name: "David Martinez",
    email: "david.martinez@example.com",
    phone: "123-456-7896",
    bankDetails: "Bank G - 7890123456",
    kraPin: "G789012345H",
    nhif: "NHIF789012",
    nssf: "NSSF345678",
    position: "Quality Assurance",
    department: "Quality Assurance",
    hireDate: "2019-04-12",
    company: "QualityCorp",
    grossSalary: 60000,
    paye: 12000,
    insurance: 1600,
    nhifDeduction: 800,
    nssfDeduction: 350,
    bonus: 3000,
    deductions: {
      tax: 12000,
      insurance: 1600,
      other: 350,
    },
    overtime: 4,
    overtimeRate: 400,
    leave: 3,
    joinDate: "2019-04-12",
    paymentMonth: "2024-09",
  },
  // Add more entries as needed
];

const PayrollModule = () => {
  const [payrollData, setPayrollData] = useState(initialPayrollData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCriteria, setFilterCriteria] = useState("all");
  const { activeModule, changeModule } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [newEntry, setNewEntry] = useState({
    name: "",
    position: "",
    salary: "",
    bonus: "",
    deductions: { tax: "", insurance: "", other: "" },
    overtime: "",
    overtimeRate: "",
    leave: "",
    joinDate: "",
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [employees] = useState(initialPayrollData);

  const calculateNetSalary = (employee) => {
    return (
      employee.grossSalary -
      employee.paye -
      employee.insurance -
      employee.nhifDeduction -
      employee.nssfDeduction
    );
  };

  useEffect(() => {
    changeModule("Payroll");
  }, []);
  console.log(currentEntry);

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterCriteria(e.target.value);
  };

  const filteredPayrollData = payrollData.filter((entry) => {
    const matchesSearch =
      entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.position.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterCriteria === "all") return matchesSearch;
    if (filterCriteria === "highEarners")
      return matchesSearch && entry.salary > 80000;
    if (filterCriteria === "recentJoins") {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      return matchesSearch && new Date(entry.joinDate) > sixMonthsAgo;
    }
    return matchesSearch;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEntry((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeductionChange = (e) => {
    const { name, value } = e.target;
    setNewEntry((prev) => ({
      ...prev,
      deductions: { ...prev.deductions, [name]: value },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = payrollData.length + 1;
    const newPayrollEntry = {
      id,
      ...newEntry,
      salary: Number(newEntry.salary),
      bonus: Number(newEntry.bonus),
      deductions: {
        tax: Number(newEntry.deductions.tax),
        insurance: Number(newEntry.deductions.insurance),
        other: Number(newEntry.deductions.other),
      },
      overtime: Number(newEntry.overtime),
      overtimeRate: Number(newEntry.overtimeRate),
      leave: Number(newEntry.leave),
    };
    setPayrollData((prev) => [...prev, newPayrollEntry]);
    setNewEntry({
      name: "",
      position: "",
      salary: "",
      bonus: "",
      deductions: { tax: "", insurance: "", other: "" },
      overtime: "",
      overtimeRate: "",
      leave: "",
      joinDate: "",
    });
    setShowAddForm(false);
  };

  const handleEditClick = (entry) => {
    setCurrentEntry(entry);
    setEditModalOpen(true);
  };

  const handleUpdate = () => {
    setPayrollData((prev) =>
      prev.map((item) => (item.id === currentEntry.id ? currentEntry : item))
    );
    setEditModalOpen(false);
  };

  const calculateNetPay = (entry) => {
    const grossPay =
      entry.salary + entry.bonus + entry.overtime * entry.overtimeRate;
    const totalDeductions = Object.values(entry.deductions).reduce(
      (a, b) => a + b,
      0
    );
    return grossPay - totalDeductions;
  };

  const generatePayslip = (employee) => {
    const netSalary = calculateNetSalary(employee);
    return `
      Payslip for ${employee.name}
      ------------------------------
      Gross Salary: $${employee.grossSalary}
      PAYE: $${employee.paye}
      Insurance: $${employee.insurance}
      NHIF: $${employee.nhifDeduction}
      NSSF: $${employee.nssfDeduction}
      ------------------------------
      Net Salary: $${netSalary}
    `;
  };

  const handlePrintPayslip = (employee) => {
    //const payslip = generatePayslip(employee);
    // In a real application, you'd send this to a printer or generate a PDF

    alert("Salary payments initiated for one employees!");
  };

  const handleMakePayments = () => {
    // In a real application, this would trigger the payment process
    alert("Salary payments initiated for all employees!");
  };

  return (
    <>
      <div className="flex h-screen">
        {sidebarOpen && (
          <SidebarLayout
            activeModule={activeModule}
            setActiveModule={changeModule}
          />
        )}
        <div className="flex-1 overflow-auto">
          <div className="p-4 bg-white shadow-md flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2"
            >
              <Menu />
            </Button>
            <h1 className="text-xl font-bold">{activeModule}</h1>
          </div>
          <div className="p-8 space-y-6">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Payroll Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input
                    type="text"
                    placeholder="Search by employee name or position"
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                  />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2 text-left">Name</th>
                        <th className="border p-2 text-left">Position</th>
                        <th className="border p-2 text-left">
                          Gross Salary (KES)
                        </th>
                        <th className="border p-2 text-left">Bonus (KES)</th>
                        <th className="border p-2 text-left">
                          Deductions (KES)
                        </th>
                        <th className="border p-2 text-left">Overtime</th>
                        <th className="border p-2 text-left">Leave</th>
                        <th className="border p-2 text-left">Net Pay (KES)</th>
                        <th className="border p-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPayrollData.map((entry) => (
                        <tr key={entry.id} className="hover:bg-gray-50">
                          <td className="border p-2">{entry.name}</td>
                          <td className="border p-2">{entry.position}</td>
                          <td className="border p-2">
                            {entry.grossSalary.toLocaleString()}
                          </td>
                          <td className="border p-2">
                            {entry.bonus.toLocaleString()}
                          </td>
                          <td className="border p-2">
                            {Object.values(entry.deductions)
                              .reduce((a, b) => a + b, 0)
                              .toLocaleString()}
                          </td>
                          <td className="border p-2">{entry.overtime} hrs</td>
                          <td className="border p-2">{entry.leave} days</td>
                          <td className="border p-2">
                            {calculateNetSalary(entry)}
                          </td>
                          <td className="border p-2">
                            <Button
                              variant="outline"
                              className="text-blue-500 border-blue-500 hover:bg-blue-100"
                              onClick={() => handleEditClick(entry)}
                            >
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Button
                  onClick={() =>
                    generateAndDownloadExcel(
                      searchTerm === "" ? payrollData : filteredPayrollData
                    )
                  }
                  className="bg-blue-500 text-white mt-4"
                >
                  <Download className="mr-2" />
                  Download Excel
                </Button>
              </CardContent>
            </Card>
            <Card className="shadow-2xl mb-4">
              <CardHeader>
                <CardTitle>Payroll Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button onClick={handleMakePayments}>
                    Make All Salary Payments
                  </Button>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border p-2 text-left">Name</th>
                          <th className="border p-2 text-left">
                            Gross Salary (KES)
                          </th>
                          <th className="border p-2 text-left">PAYE (KES)</th>
                          <th className="border p-2 text-left">
                            Insurance (KES)
                          </th>
                          <th className="border p-2 text-left">NHIF (KES)</th>
                          <th className="border p-2 text-left">NSSF (kes)</th>
                          <th className="border p-2 text-left">
                            Net Salary (kes)
                          </th>
                          <th className="border p-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees.map((employee) => (
                          <tr key={employee.id} className="hover:bg-gray-50">
                            <td className="border p-2">{employee.name}</td>
                            <td className="border p-2">
                              {employee.grossSalary.toLocaleString()}
                            </td>
                            <td className="border p-2">
                              {employee.paye.toLocaleString()}
                            </td>
                            <td className="border p-2">
                              {employee.insurance.toLocaleString()}
                            </td>
                            <td className="border p-2">
                              {employee.nhifDeduction.toLocaleString()}
                            </td>
                            <td className="border p-2">
                              {employee.nssfDeduction.toLocaleString()}
                            </td>
                            <td className="border p-2">
                              {calculateNetSalary(employee).toLocaleString()}
                            </td>
                            <td className="border p-2">
                              <Button
                                onClick={() => handlePrintPayslip(employee)}
                                size="sm"
                              >
                                Make Payment
                              </Button>
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
        </div>
      </div>

      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)}>
        {currentEntry && (
          <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Edit Payroll Entry</h2>
                  <Button
                    onClick={() => setEditModalOpen(false)}
                    variant="ghost"
                    className="p-1"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="editName">Name</Label>
                  <Input
                    id="editName"
                    name="name"
                    disabled
                    value={currentEntry.name}
                    onChange={(e) =>
                      setCurrentEntry((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editPosition">Position</Label>
                  <Input
                    id="editPosition"
                    disabled
                    name="position"
                    value={currentEntry.position}
                    onChange={(e) =>
                      setCurrentEntry((prev) => ({
                        ...prev,
                        position: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editSalary">Salary (KES)</Label>
                  <Input
                    id="editSalary"
                    name="salary"
                    type="number"
                    value={currentEntry.salary}
                    onChange={(e) =>
                      setCurrentEntry((prev) => ({
                        ...prev,
                        salary: Number(e.target.value),
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editBonus">Bonus (KES)</Label>
                  <Input
                    id="editBonus"
                    name="bonus"
                    type="number"
                    value={currentEntry.bonus}
                    onChange={(e) =>
                      setCurrentEntry((prev) => ({
                        ...prev,
                        bonus: Number(e.target.value),
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editTaxDeduction">Tax Deduction (KES)</Label>
                  <Input
                    id="editTaxDeduction"
                    name="tax"
                    type="number"
                    value={currentEntry.deductions.tax}
                    onChange={(e) =>
                      setCurrentEntry((prev) => ({
                        ...prev,
                        deductions: {
                          ...prev.deductions,
                          tax: Number(e.target.value),
                        },
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editInsuranceDeduction">
                    Insurance Deduction (KES)
                  </Label>
                  <Input
                    id="editInsuranceDeduction"
                    name="insurance"
                    type="number"
                    value={currentEntry.deductions.insurance}
                    onChange={(e) =>
                      setCurrentEntry((prev) => ({
                        ...prev,
                        deductions: {
                          ...prev.deductions,
                          insurance: Number(e.target.value),
                        },
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editOtherDeduction">
                    Other Deductions (KES)
                  </Label>
                  <Input
                    id="editOtherDeduction"
                    name="other"
                    type="number"
                    value={currentEntry.deductions.other}
                    onChange={(e) =>
                      setCurrentEntry((prev) => ({
                        ...prev,
                        deductions: {
                          ...prev.deductions,
                          other: Number(e.target.value),
                        },
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editOvertime">Overtime Hours</Label>
                  <Input
                    id="editOvertime"
                    name="overtime"
                    type="number"
                    value={currentEntry.overtime}
                    onChange={(e) =>
                      setCurrentEntry((prev) => ({
                        ...prev,
                        overtime: Number(e.target.value),
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editOvertimeRate">
                    Overtime Rate (KES/hour)
                  </Label>
                  <Input
                    id="editOvertimeRate"
                    name="overtimeRate"
                    type="number"
                    value={currentEntry.overtimeRate}
                    onChange={(e) =>
                      setCurrentEntry((prev) => ({
                        ...prev,
                        overtimeRate: Number(e.target.value),
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editLeave">Leave Days</Label>
                  <Input
                    id="editLeave"
                    name="leave"
                    type="number"
                    value={currentEntry.leave}
                    onChange={(e) =>
                      setCurrentEntry((prev) => ({
                        ...prev,
                        leave: Number(e.target.value),
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editJoinDate">Join Date</Label>
                  <Input
                    id="editJoinDate"
                    name="joinDate"
                    disabled
                    type="date"
                    value={currentEntry.joinDate}
                    onChange={(e) =>
                      setCurrentEntry((prev) => ({
                        ...prev,
                        joinDate: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="sticky bottom-0 bg-white z-10 px-6 py-4 border-t">
                <Button
                  onClick={handleUpdate}
                  className="w-full bg-green-500 text-white"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default PayrollModule;
