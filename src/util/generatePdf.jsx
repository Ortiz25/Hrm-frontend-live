import logo from "../assets/logo.png";
import jsPDF from "jspdf";
import { formatMonth, formatDate } from "./helpers";

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

      doc.text(`Month: ${formatMonth(entry.month) || "N/A"}`, 10, 120);
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
