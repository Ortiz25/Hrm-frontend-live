import * as XLSX from "xlsx";

// Function to generate and download Excel file with bold headers
export const generateAndDownloadExcel = (initialPayrollData) => {
  // Prepare data for the Excel sheet
  const data = [
    [
      "Name",
      "Position",
      "Salary ($)",
      "Bonus ($)",
      "Deductions ($)",
      "Net Pay ($)",
    ], // Headers
    ...initialPayrollData.map((entry) => [
      entry.name,
      entry.position,
      entry.grossSalary,
      entry.bonus,
      entry.deductions,
      entry.salary + entry.bonus - entry.deductions, // Net Pay
    ]),
  ];

  // Create a new workbook and add a worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(data); // Array of Arrays to Sheet

  // Apply bold style to the header row
  const headerRange = XLSX.utils.decode_range(worksheet["!ref"]); // Get range of cells
  for (let C = headerRange.s.c; C <= headerRange.e.c; C++) {
    const cell = worksheet[XLSX.utils.encode_cell({ r: 0, c: C })]; // Header cells (row 0)
    if (cell) {
      cell.s = {
        font: { bold: true }, // Bold font style
      };
    }
  }

  // Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Payroll Data");

  // Generate Excel file and trigger download
  XLSX.writeFile(workbook, "payroll-report.xlsx");
};
