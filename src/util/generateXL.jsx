import * as XLSX from "xlsx";

export const generateAndDownloadExcelInfo = (initialPayrollData) => {
  const data = [
    [
      "Name",
      "Position",
      "Basic Salary (KES)",
      "House Allowance (KES)",
      "Transport Allowance (KES)",
      "Personal Relief (KES)",
      "Insurance Relief (KES)",
      "HELB Deduction (KES)",
      "SACCO Deduction (KES)",
    ], // Headers
    ...initialPayrollData.map((entry) => [
      entry.name,
      entry.position,
      entry.basic_salary,
      entry.house_allowance,
      entry.transport_allowance,
      entry.personal_relief,
      entry.insurance_relief,
      entry.helb_deduction,
      entry.sacco_deduction,
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

export const generateAndDownloadExcel = (initialPayrollData) => {
  const data = [
    [
      "Name",
      "Position",
      "Salary (KES)",
      "Paye (KES)",
      "Deductions (KES)",
      "Net Pay (KES)",
    ], // Headers
    ...initialPayrollData.map((entry) => [
      entry.first_name + " " + entry.last_name,
      entry.position,
      entry.gross_pay,
      entry.paye,
      +entry.nssf_tier_ii +
        +entry.nssf_tier_i +
        +entry.paye +
        +entry.helb_deduction +
        +entry.housing_levy +
        +entry.other_deductions,
      entry.net_pay, // Net Pay
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
