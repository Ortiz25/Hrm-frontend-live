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
  UserCheck,
  UsersRound,
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

import { motion, AnimatePresence } from "framer-motion";
import { redirect, useLoaderData } from "react-router-dom";

const PayrollModule = () => {
  const payrollInfo = useLoaderData();
  const [payrollData, setPayrollData] = useState(payrollInfo.payrollData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCriteria, setFilterCriteria] = useState("all");
  const { activeModule, changeModule, role } = useStore();
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
  const [employees] = useState(payrollInfo.payrollData);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentType, setPaymentType] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const slicedData = payrollData.slice(0, 5);

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
      entry.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    console.log(entry);
    setCurrentEntry(entry);
    setEditModalOpen(true);
  };

  const handleSelectClick = (entry) => {
    setCurrentEntry(entry);
  };

  const handleUpdate = () => {
    setPayrollData((prev) =>
      prev.map((item) => (item.id === currentEntry.id ? currentEntry : item))
    );
    setEditModalOpen(false);
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

  const handleMakePayments = () => {
    setPaymentModalOpen(true);
  };

  const handlePaymentTypeSelect = (type) => {
    setPaymentType(type);
    setSelectedEmployee(null);
  };

  const handleEmployeeSelect = (event) => {
    const employeeId = parseInt(event.target.value);
    const employee = employees.find((emp) => emp.id === employeeId);
    setSelectedEmployee(employee);
  };
  const handleProcessPayment = () => {
    if (paymentType === "mass") {
      // Process mass payment logic here
      alert("Mass salary payment processed for all employees!");
    } else if (paymentType === "individual" && selectedEmployee) {
      // Process individual payment logic here
      alert(`Salary payment processed for ${selectedEmployee.name}!`);
    }
    setPaymentModalOpen(false);
    setPaymentType("");
    setSelectedEmployee(null);
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
                        <th className="border p-2 text-left">PAYE (KES)</th>
                        <th className="border p-2 text-left">
                          Income Tax (KES)
                        </th>
                        <th className="border p-2 text-left">NHIF (KES)</th>
                        <th className="border p-2 text-left">NSSF (KES)</th>
                        <th className="border p-2 text-left">Net Pay (KES)</th>
                        <th className="border p-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(searchTerm ? filteredPayrollData : slicedData).map(
                        (entry) => (
                          <tr key={entry.id} className="hover:bg-gray-50">
                            <td className="border p-2">
                              {entry.first_name + " " + entry.last_name}
                            </td>
                            <td className="border p-2">{entry.position}</td>
                            <td className="border p-2">
                              {entry.gross_pay.toLocaleString()}
                            </td>
                            <td className="border p-2">
                              {entry.paye.toLocaleString()}
                            </td>
                            <td className="border p-2">{entry.income_tax}</td>
                            <td className="border p-2">
                              {entry.nhif_contribution}
                            </td>
                            <td className="border p-2">
                              {entry.nssf_contribution}
                            </td>
                            <td className="border p-2">{entry.net_pay}</td>
                            <td className="border p-2">
                              <Button
                                variant="outline"
                                className="text-red-500 border-blue-500 hover:bg-blue-100"
                                onClick={() => handleEditClick(entry)}
                              >
                                Edit
                              </Button>
                            </td>
                          </tr>
                        )
                      )}
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
            {role === "super_admin" && (
              <Card className="shadow-2xl mb-4">
                <CardHeader>
                  <CardTitle>Payroll Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button onClick={handleMakePayments}>
                      Make Salary Payments
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      <Modal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
      >
        <motion.div
          className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4 "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto scrollbar-hide"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  Process Salary Payment
                </h2>
                <Button
                  onClick={() => setPaymentModalOpen(false)}
                  variant="ghost"
                  className="p-1"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </div>
            <div className="px-6 py-4 space-y-4 ">
              <div className="space-y-2">
                <Label>Select Payment Type</Label>
                <div className="flex space-x-4">
                  <motion.button
                    className={`flex-1 p-4 rounded-lg border-2 ${
                      paymentType === "mass"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
                    } flex flex-col items-center justify-center transition-all duration-200`}
                    onClick={() => handlePaymentTypeSelect("mass")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <UsersRound
                      size={32}
                      className={
                        paymentType === "mass"
                          ? "text-blue-500"
                          : "text-gray-500"
                      }
                    />
                    <span
                      className={`mt-2 font-medium ${
                        paymentType === "mass"
                          ? "text-blue-500"
                          : "text-gray-500"
                      }`}
                    >
                      Mass Payment
                    </span>
                  </motion.button>
                  <motion.button
                    className={`flex-1 p-4 rounded-lg border-2 ${
                      paymentType === "individual"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200"
                    } flex flex-col items-center justify-center transition-all duration-200`}
                    onClick={() => handlePaymentTypeSelect("individual")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <UserCheck
                      size={32}
                      className={
                        paymentType === "individual"
                          ? "text-green-500"
                          : "text-gray-500"
                      }
                    />
                    <span
                      className={`mt-2 font-medium ${
                        paymentType === "individual"
                          ? "text-green-500"
                          : "text-gray-500"
                      }`}
                    >
                      Individual Payment
                    </span>
                  </motion.button>
                </div>
              </div>
              {paymentType === "individual" && (
                <>
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <Label htmlFor="employeeSelect">Search Employee</Label>
                    <div className="mb-4">
                      <Input
                        type="text"
                        placeholder="Search by employee name or position"
                        value={searchTerm}
                        onChange={handleSearchInputChange}
                      />
                    </div>
                  </motion.div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border p-2 text-left">Name</th>
                          <th className="border p-2 text-left">Position</th>

                          <th className="border p-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPayrollData.map((entry) => (
                          <tr key={entry.id} className="hover:bg-gray-50">
                            <td className="border p-2">
                              {entry.first_name + " " + entry.last_name}
                            </td>
                            <td className="border p-2">{entry.position}</td>

                            <td className="border p-2">
                              <Button
                                variant="outline"
                                className="text-blue-500 border-blue-500 hover:bg-blue-100"
                                onClick={() => handleSelectClick(entry)}
                              >
                                Select
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
            <div className="sticky bottom-0 bg-white z-10 px-6 py-4 border-t">
              <Button
                onClick={handleProcessPayment}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
                disabled={
                  !paymentType ||
                  (paymentType === "individual" && !selectedEmployee)
                }
              >
                Process Payment
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </Modal>
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
        >
          {/* Modal Header */}
          <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Edit Payroll Entry</h2>
              <Button
                onClick={() => setEditModalOpen(false)}
                variant="ghost"
                className="p-1"
                aria-label="Close Edit Modal"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="px-6 py-4 space-y-4 overflow-y-auto max-h-[60vh] scrollbar-hide">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="editName">Name</Label>
              <Input
                id="editName"
                name="name"
                disabled
                value={currentEntry?.first_name + " " + currentEntry?.last_name}
                onChange={(e) =>
                  setCurrentEntry((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            {/* Position Field */}
            <div className="space-y-2">
              <Label htmlFor="editPosition">Position</Label>
              <Input
                id="editPosition"
                disabled
                name="position"
                value={currentEntry?.position}
                onChange={(e) =>
                  setCurrentEntry((prev) => ({
                    ...prev,
                    position: e.target.value,
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            {/* Salary Field */}
            <div className="space-y-2">
              <Label htmlFor="editSalary">Gross Salary (KES)</Label>
              <Input
                id="editSalary"
                name="salary"
                type="number"
                value={currentEntry?.gross_pay}
                onChange={(e) =>
                  setCurrentEntry((prev) => ({
                    ...prev,
                    salary: Number(e.target.value),
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            {/* Bonus Field */}
            <div className="space-y-2">
              <Label htmlFor="editBonus">Helb Deduction (KES)</Label>
              <Input
                id="editBonus"
                name="bonus"
                type="number"
                value={currentEntry?.helb_deduction}
                onChange={(e) =>
                  setCurrentEntry((prev) => ({
                    ...prev,
                    bonus: Number(e.target.value),
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            {/* Tax Deduction Field */}
            <div className="space-y-2">
              <Label htmlFor="editTaxDeduction">
                Pension Fund Contribution (KES)
              </Label>
              <Input
                id="editTaxDeduction"
                name="tax"
                type="number"
                value={currentEntry?.pension_fund_contribution}
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
            {/* Insurance Deduction Field */}
            <div className="space-y-2">
              <Label htmlFor="editInsuranceDeduction">
                Personal Tax Relief (KES)
              </Label>
              <Input
                id="editInsuranceDeduction"
                name="insurance"
                type="number"
                value={currentEntry?.personal_tax_relief}
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
            {/* Other Deductions Field */}
            <div className="space-y-2">
              <Label htmlFor="editOtherDeduction">House Allowance (KES)</Label>
              <Input
                id="editOtherDeduction"
                name="other"
                type="number"
                value={currentEntry?.house_allowance}
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
          </div>

          {/* Modal Footer */}
          <div className="sticky bottom-0 bg-white z-10 px-6 py-4 border-t">
            <Button
              onClick={handleUpdate}
              className="w-full bg-green-500 text-white"
            >
              Save Changes
            </Button>
          </div>
        </motion.div>
      </Modal>
    </>
  );
};

export default PayrollModule;

export async function loader() {
  const token = localStorage.getItem("token");

  if (!token) {
    return redirect("/");
  }
  const url = "http://localhost:5174/api/verifyToken";
  const url2 = "http://localhost:5174/api/payroll";
  const data = { token: token };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const response2 = await fetch(url2, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const userData = await response.json();
  if (userData.role === "employee") {
    return redirect("/employeedashboard");
  }
  const { payroll } = await response2.json();
  console.log(payroll);

  if (userData.message === "token expired") {
    return redirect("/");
  }
  return { payrollData: payroll, role: userData.role };
}
