import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Dummy data for employees
const initialEmployeeData = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    bankDetails: "Bank A - 1234567890",
    kraPin: "A123456789B",
    nhif: "NHIF123456",
    nssf: "NSSF789012",
    position: "Software Engineer",
    department: "Engineering",
    hireDate: "2023-01-15",
    company: "TechCorp",
    grossSalary: 75000,
    paye: 15000,
    insurance: 2000,
    nhifDeduction: 1000,
    nssfDeduction: 1000,
  },
  // Add more dummy data here
];

const HRManagementSystem = () => {
  const [employees] = useState(initialEmployeeData);

  const calculateNetSalary = (employee) => {
    return employee.grossSalary - employee.paye - employee.insurance - employee.nhifDeduction - employee.nssfDeduction;
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
    const payslip = generatePayslip(employee);
    // In a real application, you'd send this to a printer or generate a PDF
    console.log(payslip);
    alert("Payslip printed! Check the console for details.");
  };

  const handleMakePayments = () => {
    // In a real application, this would trigger the payment process
    alert("Salary payments initiated for all employees!");
  };

  return (
    <div className="p-4 space-y-6">
      <Tabs defaultValue="employees">
        <TabsList>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
        </TabsList>

        <TabsContent value="employees">
          <Card>
            <CardHeader>
              <CardTitle>Employee Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">Name</th>
                      <th className="border p-2 text-left">Position</th>
                      <th className="border p-2 text-left">Department</th>
                      <th className="border p-2 text-left">Hire Date</th>
                      <th className="border p-2 text-left">Gross Salary ($)</th>
                      <th className="border p-2 text-left">Net Salary ($)</th>
                      <th className="border p-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((employee) => (
                      <tr key={employee.id} className="hover:bg-gray-50">
                        <td className="border p-2">{employee.name}</td>
                        <td className="border p-2">{employee.position}</td>
                        <td className="border p-2">{employee.department}</td>
                        <td className="border p-2">{employee.hireDate}</td>
                        <td className="border p-2">{employee.grossSalary.toLocaleString()}</td>
                        <td className="border p-2">{calculateNetSalary(employee).toLocaleString()}</td>
                        <td className="border p-2">
                          <Button onClick={() => handlePrintPayslip(employee)} size="sm">Print Payslip</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll">
          <Card>
            <CardHeader>
              <CardTitle>Payroll Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button onClick={handleMakePayments}>Make Salary Payments</Button>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2 text-left">Name</th>
                        <th className="border p-2 text-left">Gross Salary ($)</th>
                        <th className="border p-2 text-left">PAYE ($)</th>
                        <th className="border p-2 text-left">Insurance ($)</th>
                        <th className="border p-2 text-left">NHIF ($)</th>
                        <th className="border p-2 text-left">NSSF ($)</th>
                        <th className="border p-2 text-left">Net Salary ($)</th>
                        <th className="border p-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((employee) => (
                        <tr key={employee.id} className="hover:bg-gray-50">
                          <td className="border p-2">{employee.name}</td>
                          <td className="border p-2">{employee.grossSalary.toLocaleString()}</td>
                          <td className="border p-2">{employee.paye.toLocaleString()}</td>
                          <td className="border p-2">{employee.insurance.toLocaleString()}</td>
                          <td className="border p-2">{employee.nhifDeduction.toLocaleString()}</td>
                          <td className="border p-2">{employee.nssfDeduction.toLocaleString()}</td>
                          <td className="border p-2">{calculateNetSalary(employee).toLocaleString()}</td>
                          <td className="border p-2">
                            <Button onClick={() => handlePrintPayslip(employee)} size="sm">Print Payslip</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HRManagementSystem;