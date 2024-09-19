import logo from "../assets/logo.png";
import jsPDF from "jspdf";

export const generatePayslipPDF = (entry, employeeData) => {
  if (!entry) {
    console.error("Entry data is missing.");
    return;
  }

  const doc = new jsPDF();

  // Create an image element
  const img = new Image();
  img.src = logo; // Using the imported logo

  img.onload = function () {
    try {
      const logoUrl = getBase64Image(img);

      doc.addImage(logoUrl, "PNG", 10, 10, 30, 30); // X, Y, Width, Height

      // Adding title and Employee Information
      doc.setFontSize(16);
      doc.text("Payslip", 105, 20, { align: "center" }); // Title below the logo
      doc.setFontSize(12);

      doc.text(`Employee Name: ${employeeData.name || "N/A"}`, 10, 50);
      doc.text(`Employee ID: ${employeeData.employeeId || "N/A"}`, 10, 60);
      doc.text(`Position: ${employeeData.position || "N/A"}`, 10, 70);
      doc.text(`Department: ${employeeData.department || "N/A"}`, 10, 80);
      doc.text(`Join Date: ${employeeData.joinDate || "N/A"}`, 10, 90);

      // Payroll section
      doc.text("Payroll Information", 10, 110);
      doc.setLineWidth(0.5);
      doc.line(10, 112, 200, 112); // Horizontal line for visual separation

      doc.text(`Month: ${entry.month || "N/A"}`, 10, 120);
      doc.text(
        `Basic Salary: KES ${
          entry.salary ? entry.salary.toLocaleString() : "N/A"
        }`,
        10,
        130
      );
      doc.text(
        `Bonus: KES ${entry.bonus ? entry.bonus.toLocaleString() : "N/A"}`,
        10,
        140
      );
      doc.text(
        `Deductions: KES ${
          entry.deductions ? entry.deductions.toLocaleString() : "N/A"
        }`,
        10,
        150
      );
      doc.text(`Overtime (hours): ${entry.overtime || "N/A"}`, 10, 160);
      doc.text(`Leave (days): ${entry.leave || "N/A"}`, 10, 170);
      doc.text(
        `Net Pay: KES ${entry.netPay ? entry.netPay.toLocaleString() : "N/A"}`,
        10,
        180
      );

      // Footer for system-generated notice
      doc.setFontSize(10);
      doc.text("This is a system generated payslip.", 10, 200);

      // Save the PDF
      doc.save(`Payslip_${entry.month || "Unknown"}.pdf`);
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
