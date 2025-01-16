import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateP9PDF = (payrollData) => {
  console.log(payrollData)
   // Map payroll data to monthlyData schema
   const monthlyData = Array(12).fill(null).map((_, index) => {
    const monthData = payrollData.find(
      data => new Date(`${data.year}-${data.month}-01`).getMonth() === index
    );
  
    return monthData
      ? {
          employeeId: monthData.employee_id,
          employeeName: monthData.employee_name,
          employeeNumber: monthData.employee_number,
          position: monthData.position,
          department: monthData.department,
          hireDate: monthData.hire_date,
          grossPay: parseFloat(monthData.gross_pay),
          totalGross: parseFloat(monthData.gross_pay),
          chargeablePay: parseFloat(monthData.taxable_income),
          taxCharged: parseFloat(monthData.paye),
          payeTax: parseFloat(monthData.paye),
        }
      : {
          employeeId: null,
          employeeName: null,
          employeeNumber: null,
          position: null,
          department: null,
          hireDate: null,
          grossPay: 0,
          totalGross: 0,
          chargeablePay: 0,
          taxCharged: 0,
          payeTax: 0,
        };
  });
  const data = {
    employerName: 'Teqova Business Solutions',
    employerPin: 'P051397932M',
    employeeName: payrollData[0].employee_name,
    employeePin: payrollData[0].kra_pin,
    year: '2024',
    monthlyData
};
console.log(monthlyData)
  
  // Create new PDF document
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // Set font
  doc.setFont('helvetica');

  // Add header
  doc.setFontSize(16);
  doc.text('KENYA REVENUE AUTHORITY', doc.internal.pageSize.width / 2, 20, { align: 'center' });
  doc.text('DOMESTIC TAXES DEPARTMENT', doc.internal.pageSize.width / 2, 28, { align: 'center' });
  doc.text(`TAX DEDUCTION CARD YEAR ${data.year}`, doc.internal.pageSize.width / 2, 36, { align: 'center' });

  // Add employee information
  doc.setFontSize(10);
  doc.text(`Employer's Name: ${data.employerName}`, 15, 50);
  doc.text(`Employee's Main Name: ${data.employeeName}`, 15, 56);
  
  doc.text(`Employer's PIN: ${data.employerPin}`, doc.internal.pageSize.width - 80, 50);
  doc.text(`Employee's PIN: ${data.employeePin}`, doc.internal.pageSize.width - 80, 56);

  // Define the months
  const months = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ];

  // Prepare table data
  const tableData = months.map((month, index) => {
    const monthData = data.monthlyData[index] || {};
    return [
      month,
      monthData.grossPay?.toLocaleString() || '-',
      '-', // Benefits - Non-Cash
      '-', // Value of Quarters
      monthData.totalGross?.toLocaleString() || '-',
      '-', // Defined Contribution
      '200', // Owner Occupied Interest
      '20,000', // Retirement Contribution
      monthData.chargeablePay?.toLocaleString() || '-',
      monthData.taxCharged?.toLocaleString() || '-',
      '1,162', // Personal Relief
      '-', // Insurance Relief
      monthData.payeTax?.toLocaleString() || '-'
    ];
  });

  // Calculate totals
  const totals = data.monthlyData.reduce((acc, curr) => ({
    grossPay: (acc.grossPay || 0) + (curr.grossPay || 0),
    totalGross: (acc.totalGross || 0) + (curr.totalGross || 0),
    chargeablePay: (acc.chargeablePay || 0) + (curr.chargeablePay || 0),
    taxCharged: (acc.taxCharged || 0) + (curr.taxCharged || 0),
    payeTax: (acc.payeTax || 0) + (curr.payeTax || 0)
  }), {});

  // Add totals row
  tableData.push([
    'TOTALS',
    totals.grossPay.toLocaleString(),
    '-',
    '-',
    totals.totalGross.toLocaleString(),
    '-',
    '2,400',
    '240,000',
    totals.chargeablePay.toLocaleString(),
    totals.taxCharged.toLocaleString(),
    '13,944',
    '-',
    totals.payeTax.toLocaleString()
  ]);

  // Add table
  doc.autoTable({
    startY: 70,
    head: [
      ['MONTH', 'Gross Pay', 'Benefits - Non-Cash', 'Value of Quarters', 'Total Gross Earnings',
       'Defined Contribution Retirement Scheme', 'Owner Occupied Interest', 'Retirement Contribution',
       'Chargeable Pay', 'Tax Charged', 'Personal Relief', 'Insurance Relief', 'PAYE Tax'],
      ['', 'Kshs.', 'Kshs.', 'Kshs.', 'Kshs.', 'Kshs.', 'Kshs.', 'Kshs.',
       'Kshs.', 'Kshs.', 'Kshs.', 'Kshs.', 'Kshs.'],
      ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', '(J-K)']
    ],
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 1,
      lineColor: [0, 0, 0],
      lineWidth: 0.1
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 20, halign: 'right' },
      2: { cellWidth: 20, halign: 'right' },
      3: { cellWidth: 20, halign: 'right' },
      4: { cellWidth: 20, halign: 'right' },
      5: { cellWidth: 20, halign: 'right' },
      6: { cellWidth: 20, halign: 'right' },
      7: { cellWidth: 20, halign: 'right' },
      8: { cellWidth: 20, halign: 'right' },
      9: { cellWidth: 20, halign: 'right' },
      10: { cellWidth: 20, halign: 'right' },
      11: { cellWidth: 20, halign: 'right' },
      12: { cellWidth: 20, halign: 'right' }
    }
  });

  // Add footer text
  const footerY = doc.previousAutoTable.finalY + 10;
  
  doc.setFontSize(10);
  doc.text('IMPORTANT', 15, footerY);
  doc.setFontSize(8);
  doc.text('1. Use P9A', 15, footerY + 6);
  doc.text('(a) For all liable employees and where director/employee received benefits in addition to cash emoluments.', 25, footerY + 12);
  doc.text('(b) Where an employee is eligible to deduction on owner occupied interest.', 25, footerY + 18);
  doc.text('2. (a) Deductible interest in respect of any month must not exceed Kshs. 8,333/= except for December', 15, footerY + 24);
  doc.text('where the amount shall be Kshs. 8,337/=', 25, footerY + 30);

  // Add right side footer
  doc.text('NAMES OF FINANCIAL INSTITUTION ADVANCING MORTAGAGE LOAN:', doc.internal.pageSize.width - 140, footerY + 6);
  doc.text('L.R NO. OF OWNER OCCUPIED PROPERTY:', doc.internal.pageSize.width - 140, footerY + 18);
  doc.text('DATE OF OCCUPATION OF HOUSE:', doc.internal.pageSize.width - 140, footerY + 30);

  return doc;
};

// Usage example:
const generateAndDownloadP9 = (data) => {
  const doc = generateP9PDF(data);
  doc.save('p9-form.pdf');
};

export default generateAndDownloadP9;