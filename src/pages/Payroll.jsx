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
  Loader,
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
import SidebarLayout from "../components/layout/sidebarLayout";
import { useStore } from "../store/store";
import Modal from "../components/ui/modal";
import {
  generateAndDownloadExcel,
  generateAndDownloadExcelInfo,
} from "../util/generateXL";

import { motion, AnimatePresence } from "framer-motion";
import { redirect, useLoaderData } from "react-router-dom";
import { formatMonth } from "../util/helpers";
import { Alert, AlertDescription } from "../components/ui/alert";

const PayrollModule = () => {
  const payrollInfo = useLoaderData();
  const [message, setMessage] = useState('');
  const [payrollData, setPayrollData] = useState(payrollInfo.payrollInfo);
  const [payrollHistory, setPayrollHistory] = useState(payrollInfo.payrollData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCriteria, setFilterCriteria] = useState("all");
  const { activeModule, changeModule, role, changeRole } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isUpdatingPayroll, setIsUpdatingPayroll] = useState(false);
  const [isProcessingPayroll, setIsProcessingPayroll] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentType, setPaymentType] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const slicedHistory = payrollHistory.slice(0, 5);
  const slicedData = payrollData.slice(0, 5);

  useEffect(() => {
    changeModule("Payroll");
    changeRole(payrollInfo.role)
  }, []);

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };
    console.log(searchTerm)
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

  const filteredPayrollHistory = payrollHistory.filter((entry) => {
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

  const handleEditClick = (entry) => {
    setCurrentEntry(entry);
    setEditModalOpen(true);
  };

  const handleSelectClick = (entry) => {

    setCurrentEntry(entry);
  };

  
  const handleSelectEmployee = (entry) => {

    setSelectedEmployee(entry)
  };

  async function fetchData() {
    try {
      const url = "https://hrmbackend.teqova.biz/api/payroll";
      const response = await fetch(url);
      const data = await response.json();
      setPayrollData(data);
    } catch (error) {
      console.log(error);
    }
  }

  const handleUpdate = async (e) => {
    try {
      setIsUpdatingPayroll(true);
      const url = "https://hrmbackend.teqova.biz/api/updatepayroll";
      const data = currentEntry;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const addData = await response.json();
      if (addData.message === "Payroll updated successfully") {
        fetchData();
        setIsUpdatingPayroll(false);
        setEditModalOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleMakePayments = () => {
    setPaymentModalOpen(true);
  };

  const handlePaymentTypeSelect = (type) => {
    console.log(type)
    setPaymentType(type);
    setSelectedEmployee(null);
  };

  const handleProcessPayment = async () => {
    console.log(selectedEmployee)
    if (paymentType === "mass") {
      setIsProcessingPayroll(true)
      // Process mass payment logic here
      try {
        const response = await fetch('https://hrmbackend.teqova.biz/api/processbulkpayroll');
        const data = await response.json();
        if(data.message.includes("already processed") ){
          setMessage(data.message);
          setIsProcessingPayroll(false)
          return
        }
        setMessage(data.message);
        alert("Mass salary payment processed for all employees!");
      } catch (error) {
        setMessage(error.response?.data?.message || 'Error processing payroll');
      }
     
    } else if (paymentType === "individual" && selectedEmployee) {
      // Process individual payment logic here
      alert(`Salary payment processed for ${selectedEmployee.name}!`);
    }
    setPaymentModalOpen(false);
    setPaymentType("");
    setSelectedEmployee(null);
    setIsProcessingPayroll(false)
    setMessage("");
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
                        <th className="border p-2 text-left">Department</th>
                        <th className="border p-2 text-left">
                          Basic Salary (KES)
                        </th>
                        <th className="border p-2 text-left">
                          House Allowance (KES)
                        </th>
                        <th className="border p-2 text-left">
                          Transport Allowance (KES)
                        </th>
                        <th className="border p-2 text-left">
                          Personal Relief (KES)
                        </th>
                        <th className="border p-2 text-left">
                          Insurance Relief (KES)
                        </th>
                        <th className="border p-2 text-left">
                          HELB Deduction (KES)
                        </th>
                        <th className="border p-2 text-left">
                          Sacoo Deduction (KES)
                        </th>
                        <th className="border p-2 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(searchTerm ? filteredPayrollData : slicedData).map(
                        (entry) => (
                          <tr key={entry.id} className="hover:bg-gray-50">
                            <td className="border p-2">{entry.name}</td>
                            <td className="border p-2">{entry.position}</td>
                            <td className="border p-2">{entry.department}</td>
                            <td className="border p-2">
                              {entry.basic_salary.toLocaleString()}
                            </td>
                            <td className="border p-2">
                              {entry.house_allowance.toLocaleString()}
                            </td>
                            <td className="border p-2">
                              {entry.transport_allowance.toLocaleString()}
                            </td>
                            <td className="border p-2">
                              {entry.personal_relief.toLocaleString()}
                            </td>
                            <td className="border p-2">
                              {entry.insurance_relief.toLocaleString()}
                            </td>
                            <td className="border p-2">
                              {entry.helb_deduction}
                            </td>
                            <td className="border p-2">
                              {entry.sacco_deduction}
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
                        )
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4">
                  <Button
                    onClick={() =>
                      generateAndDownloadExcelInfo(
                        searchTerm === "" ? payrollData : filteredPayrollData
                      )
                    }
                    className="bg-blue-500 text-white mt-4"
                  >
                    <Download className="mr-2" />
                    Download Excel
                  </Button>
                </div>
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
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Payroll History</CardTitle>
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
                        <th className="border p-2 text-left">Month</th>
                        <th className="border p-2 text-left">
                          Gross Salary (KES)
                        </th>
                        <th className="border p-2 text-left">PAYE (KES)</th>
                        <th className="border p-2 text-left">
                          House Levy (KES)
                        </th>
                        <th className="border p-2 text-left">NHIF (KES)</th>
                        <th className="border p-2 text-left">NSSF (KES)</th>
                        <th className="border p-2 text-left">Net Pay (KES)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(searchTerm
                        ? filteredPayrollHistory
                        : slicedHistory
                      ).map((entry) => (
                        <tr key={entry.id} className="hover:bg-gray-50">
                          <td className="border p-2">
                            {entry.first_name + " " + entry.last_name}
                          </td>
                          <td className="border p-2">{entry.position}</td>
                          <td className="border p-2">
                            {formatMonth(entry.month)}
                          </td>
                          <td className="border p-2">
                            {entry.gross_pay.toLocaleString()}
                          </td>
                          <td className="border p-2">
                            {entry.paye.toLocaleString()}
                          </td>
                          <td className="border p-2">{entry.housing_levy}</td>
                          <td className="border p-2">{entry.nhif}</td>
                          <td className="border p-2">
                            {entry.nssf_tier_i
                              ? entry.nssf_tier_i
                              : entry.nssf_tier_ii}
                          </td>
                          <td className="border p-2">{entry.net_pay}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4">
                  <Button
                    onClick={() =>
                      generateAndDownloadExcel(
                        searchTerm === ""
                          ? payrollHistory
                          : filteredPayrollHistory
                      )
                    }
                    className="bg-blue-500 text-white mt-4"
                  >
                    <Download className="mr-2" />
                    Download Excel
                  </Button>
                </div>
              </CardContent>
            </Card>
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
                  onClick={() => {setPaymentModalOpen(false); setMessage(""); setPaymentType("");
                    setSelectedEmployee(null);}}
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
                            <td className="border p-2">{entry.name}</td>
                            <td className="border p-2">{entry.position}</td>

                            <td className="border p-2">
                              <Button
                                variant="outline"
                                className="text-blue-500 border-blue-500 hover:bg-blue-100"
                                onClick={() =>handleSelectEmployee(entry)}
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
            {message.length > 0 && (
              <Alert className="mt-4 mb-4 bg-green-100 border-green-400 text-green-700">
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
              <Button
                onClick={handleProcessPayment}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
                disabled={
                  !paymentType ||
                  (paymentType === "individual" && !selectedEmployee)
                }
              >
               
                {isProcessingPayroll? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <></>
                )}
                {isProcessingPayroll ? " Processing..." : " Process Payment"}
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
                value={currentEntry?.name}
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
              <Label htmlFor="editSalary">Basic Salary (KES)</Label>
              <Input
                id="editSalary"
                name="salary"
                type="number"
                value={currentEntry?.basic_salary}
                onChange={(e) =>
                  setCurrentEntry((prev) => ({
                    ...prev,
                    basic_salary: Number(e.target.value),
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            {/* Bonus Field */}
            <div className="space-y-2">
              <Label htmlFor="editBonus">Insurance Relief (KES)</Label>
              <Input
                id="editBonus"
                name="bonus"
                type="number"
                value={currentEntry?.insurance_relief}
                onChange={(e) =>
                  setCurrentEntry((prev) => ({
                    ...prev,
                    insurance_relief: Number(e.target.value),
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            {/* Tax Deduction Field */}
            <div className="space-y-2">
              <Label htmlFor="editTaxDeduction">Other Deductions (KES)</Label>
              <Input
                id="editTaxDeduction"
                name="tax"
                type="number"
                value={currentEntry?.other_deductions}
                onChange={(e) =>
                  setCurrentEntry((prev) => ({
                    ...prev,
                    other_deductions: Number(e.target.value),
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            {/* Insurance Deduction Field */}
            <div className="space-y-2">
              <Label htmlFor="editInsuranceDeduction">
                Other Allowance (KES)
              </Label>
              <Input
                id="editInsuranceDeduction"
                name="insurance"
                type="number"
                value={currentEntry?.other_allowances}
                onChange={(e) =>
                  setCurrentEntry((prev) => ({
                    ...prev,
                    other_allowances: Number(e.target.value),
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
                    house_allowance: Number(e.target.value),
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editOtherDeduction">HELB Deduction (KES)</Label>
              <Input
                id="editOtherDeduction"
                name="other"
                type="number"
                value={currentEntry?.helb_deduction}
                onChange={(e) =>
                  setCurrentEntry((prev) => ({
                    ...prev,
                    helb_deduction: Number(e.target.value),
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editOtherDeduction">sacco Deduction (KES)</Label>
              <Input
                id="editOtherDeduction"
                name="other"
                type="number"
                value={currentEntry?.sacco_deduction}
                onChange={(e) =>
                  setCurrentEntry((prev) => ({
                    ...prev,
                    sacco_deduction: Number(e.target.value),
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
              {isUpdatingPayroll ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <></>
              )}
              {isUpdatingPayroll ? "Saving Changes..." : "Save Changes"}
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
  const url = "https://hrmbackend.teqova.biz/api/verifyToken";
  const url2 = "https://hrmbackend.teqova.biz/api/payroll";
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
  const response3 = await fetch(url2);

  const userData = await response.json();
  if (userData.role === "employee") {
    return redirect("/employeedashboard");
  }
  const { payroll } = await response2.json();

  const payrollInfo = await response3.json();
   
  if (userData.message === "token expired") {
    return redirect("/");
  }
  return {
    payrollData: payroll,
    role: userData.user.role,
    payrollInfo: payrollInfo,
  };
}
