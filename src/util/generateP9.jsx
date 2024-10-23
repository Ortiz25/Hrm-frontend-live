import { jsPDF } from "jspdf";



const employeePayslips = {
    employeeName: "Samuel Deya Otieno",
    employeePIN: "A005569109C",
    employerName: "Armada Human Capital",
    employerPIN: "PO51397932M",
    payslipData: [
      { month: 'January', grossPay: 13750, benefits: 0, totalGross: 13750, tax: 1524, PAYE: 1162 },
      { month: 'February', grossPay: 25000, benefits: 0, totalGross: 25000, tax: 3464, PAYE: 1162 },
      { month: 'March', grossPay: 25000, benefits: 0, totalGross: 25000, tax: 3464, PAYE: 1162 },
      { month: 'April', grossPay: 28810, benefits: 0, totalGross: 28810, tax: 4226, PAYE: 1162 },
      { month: 'May', grossPay: 30000, benefits: 0, totalGross: 30000, tax: 4489, PAYE: 1162 },
      // Add other months...
    ],
  };
// Function to generate the P9 PDF
export const generateP9PDF = () => {
    const doc = new jsPDF();

    // Add P9 Form Header
    doc.setFontSize(16);
    doc.text('TAX DEDUCTION CARD YEAR 2016', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('KENYA REVENUE AUTHORITY - DOMESTIC TAXES DEPARTMENT', 105, 30, { align: 'center' });

    // Employee and Employer details
    doc.text(`Employer's Name: ${employeePayslips.employerName}`, 20, 50);
    doc.text(`Employer's PIN: ${employeePayslips.employerPIN}`, 20, 60);
    doc.text(`Employee's Name: ${employeePayslips.employeeName}`, 20, 70);
    doc.text(`Employee's PIN: ${employeePayslips.employeePIN}`, 20, 80);

    // Draw table headers
    const headers = ['Month', 'Gross Pay', 'Benefits', 'Total Gross', 'Tax Payable', 'PAYE Tax'];
    let startY = 100;
    const columnWidths = [30, 30, 30, 30, 30, 30];

    headers.forEach((header, i) => {
      doc.rect(20 + i * columnWidths[i], startY, columnWidths[i], 10).stroke();
      doc.text(header, 22 + i * columnWidths[i], startY + 8);
    });

    // Draw table rows
    employeePayslips.payslipData.forEach((row, index) => {
      const rowY = startY + 10 + index * 10;
      const rowData = [row.month, row.grossPay, row.benefits, row.totalGross, row.tax, row.PAYE];
      rowData.forEach((cell, i) => {
        doc.rect(20 + i * columnWidths[i], rowY, columnWidths[i], 10).stroke();
        doc.text(cell.toString(), 22 + i * columnWidths[i], rowY + 8);
      });
    });

    // Calculate total tax
    const totalTax = employeePayslips.payslipData.reduce((acc, curr) => acc + curr.tax, 0);
    doc.text(`TOTAL TAX: ${totalTax} Kshs`, 160, startY + employeePayslips.payslipData.length * 10 + 30);

    // Save the PDF
    doc.save('P9_form.pdf');
  };
