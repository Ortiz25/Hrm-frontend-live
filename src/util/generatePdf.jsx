import logo from "../assets/logo.png";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import { formatMonth, formatDate, getFullMonthName } from "./helpers";

export const generatePayslipPDF = (entry) => {
  if (!entry) {
    console.error("Entry data is missing.");
    return;
  }

  const doc = new jsPDF();

  // Create an image element
  const img = new Image();
  img.src = logo; // Using the imported logo
  console.log(entry);
  img.onload = function () {
    try {
      const logoUrl = getBase64Image(img);
      const deductions =
        +entry.paye +
        +entry.nssf_tier_i +
        +entry.nssf_tier_i +
        +entry.nhif +
        +entry.housing_levy +
        +entry.other_deductions;

      doc.addImage(logoUrl, "PNG", 10, 10, 30, 30); // X, Y, Width, Height

      // Adding title and Employee Information
      doc.setFontSize(16);
      doc.text("Payslip", 105, 20, { align: "center" }); // Title below the logo
      doc.setFontSize(12);

      doc.text(`Employee Name: ${entry.employee_name || "N/A"}`, 10, 50);
      doc.text(`Employee ID: ${entry.employee_number || "N/A"}`, 10, 60);
      doc.text(`Position: ${entry.position || "N/A"}`, 10, 70);
      doc.text(`Department: ${entry.department || "N/A"}`, 10, 80);
      doc.text(`Join Date: ${formatDate(entry.hire_date) || "N/A"}`, 10, 90);

      // Payroll section
      doc.text("Payroll Information", 10, 110);
      doc.setLineWidth(0.5);
      doc.line(10, 112, 200, 112); // Horizontal line for visual separation

      doc.text(`Month: ${getFullMonthName(entry.month) || "N/A"}`, 10, 120);
      doc.text(
        `Gross Salary: KES ${
          entry.gross_pay ? entry.gross_pay.toLocaleString() : "N/A"
        }`,
        10,
        130
      );
      doc.text(
        `Taxable Income: KES ${
          entry.taxable_income ? entry.taxable_income.toLocaleString() : "N/A"
        }`,
        10,
        140
      );
      doc.text(
        `Deductions: KES ${deductions ? deductions.toLocaleString() : "N/A"}`,
        10,
        150
      );
      doc.text(`Overtime (hours): ${entry.overtime || "N/A"}`, 10, 160);
      doc.text(`Leave (days): ${entry.annual_leave_balance || "N/A"}`, 10, 170);
      doc.text(
        `Net Pay: KES ${
          entry.net_pay ? entry.net_pay.toLocaleString() : "N/A"
        }`,
        10,
        180
      );

      // Footer for system-generated notice
      doc.setFontSize(10);
      doc.text("This is a system generated payslip.", 10, 200);

      // Save the PDF
      doc.save(`Payslip_${formatMonth(entry.month) || "Unknown"}.pdf`);
    } catch (error) {
      console.error("Error occurred while generating the PDF:", error);
    }
  };

  img.onerror = function () {
    console.error("Failed to load the image.");
  };

  // Function to convert image to base64
  function getBase64Image(img) {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL("image/png");
  }
};



// PDF Generation Functions
export const generateHeader = (pdf, title) => {
  pdf.setFontSize(20);
  pdf.setTextColor(44, 62, 80);
  pdf.text(title, 15, 20);
  
  pdf.setFillColor(52, 152, 219);
  pdf.rect(160, 10, 35, 15, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.text('COMPANY', 165, 19);
  
  pdf.setTextColor(44, 62, 80);
  pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 15, 30);
  
  pdf.setDrawColor(52, 152, 219);
  pdf.setLineWidth(0.5);
  pdf.line(15, 35, 195, 35);
};

export const generateAttendanceReport = () => {
  const pdf = new jsPDF();
  generateHeader(pdf, 'Monthly Attendance Report');
  
  pdf.autoTable({
    startY: 45,
    head: [['Month', 'Present (%)', 'Absent (%)', 'Late (%)']],
    body: sampleData.attendance.monthlyData.map(row => [
      row.month,
      row.present.toString(),
      row.absent.toString(),
      row.late.toString()
    ]),
    theme: 'grid',
    headStyles: { fillColor: [52, 152, 219] }
  });
  
  pdf.setFontSize(14);
  pdf.text('Summary', 15, pdf.lastAutoTable.finalY + 20);
  
  pdf.setFontSize(10);
  pdf.text(`Average Attendance Rate: ${sampleData.attendance.summary.avgAttendance}%`, 15, pdf.lastAutoTable.finalY + 30);
  pdf.text(`Average Absence Rate: ${sampleData.attendance.summary.avgAbsence}%`, 15, pdf.lastAutoTable.finalY + 40);
  pdf.text(`Average Late Rate: ${sampleData.attendance.summary.avgLate}%`, 15, pdf.lastAutoTable.finalY + 50);
  
  return pdf;
};

export const generateAccessReport = () => {
  const pdf = new jsPDF();
  generateHeader(pdf, 'Access Level Report');
  
  pdf.autoTable({
    startY: 45,
    head: [['Access Level', 'Number of Users', 'Permissions']],
    body: sampleData.accessLevels.levels.map(row => [
      row.level,
      row.count.toString(),
      row.permissions
    ]),
    theme: 'grid',
    headStyles: { fillColor: [52, 152, 219] }
  });
  
  return pdf;
};

export const generateStaffReport = () => {
  const pdf = new jsPDF();
  generateHeader(pdf, 'Staff Composition Report');
  
  pdf.autoTable({
    startY: 45,
    head: [['Department', 'Employee Count', 'Percentage (%)']],
    body: sampleData.staffComposition.departments.map(row => [
      row.name,
      row.count.toString(),
      row.percentage.toString()
    ]),
    theme: 'grid',
    headStyles: { fillColor: [52, 152, 219] }
  });
  
  return pdf;
};

export const generateGenderReport = () => {
  const pdf = new jsPDF();
  generateHeader(pdf, 'Gender Distribution Report');
  
  pdf.setFontSize(14);
  pdf.text('Overall Gender Distribution', 15, 45);
  
  pdf.autoTable({
    startY: 55,
    head: [['Gender', 'Percentage (%)']],
    body: [
      ['Male', sampleData.genderDistribution.overall.male.toString()],
      ['Female', sampleData.genderDistribution.overall.female.toString()]
    ],
    theme: 'grid',
    headStyles: { fillColor: [52, 152, 219] }
  });
  
  pdf.setFontSize(14);
  pdf.text('Department-wise Distribution', 15, pdf.lastAutoTable.finalY + 20);
  
  pdf.autoTable({
    startY: pdf.lastAutoTable.finalY + 30,
    head: [['Department', 'Male (%)', 'Female (%)']],
    body: sampleData.genderDistribution.byDepartment.map(row => [
      row.department,
      row.male.toString(),
      row.female.toString()
    ]),
    theme: 'grid',
    headStyles: { fillColor: [52, 152, 219] }
  });
  
  return pdf;
};
