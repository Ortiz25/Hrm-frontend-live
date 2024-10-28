import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@headlessui/react";
import SidebarLayout from "../components/layout/sidebarLayout";
import { 
  Menu, 
  Download, 
  FileText,
  X, 
  ChevronDown, 
  ChevronUp 
} from "lucide-react";
import { Input } from "../components/ui/input.jsx";
import { useStore } from "../store/store.jsx";
import { Label } from "../components/ui/label.jsx";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { generateAccessReport, generateGenderReport, generateAttendanceReport, generateStaffReport } from "../util/generatePdf.jsx";

// Sample data for reports
const sampleData = {
  attendance: {
    monthlyData: [
      { month: 'January', present: 95, absent: 5, late: 2 },
      { month: 'February', present: 93, absent: 7, late: 3 },
      { month: 'March', present: 96, absent: 4, late: 1 },
    ],
    summary: { avgAttendance: 94.6, avgAbsence: 5.4, avgLate: 2 }
  },
  accessLevels: {
    levels: [
      { level: 'Admin', count: 5, permissions: 'Full Access' },
      { level: 'Manager', count: 15, permissions: 'Department Access' },
      { level: 'Employee', count: 80, permissions: 'Limited Access' },
    ]
  },
  staffComposition: {
    departments: [
      { name: 'Engineering', count: 30, percentage: 30 },
      { name: 'Sales', count: 25, percentage: 25 },
      { name: 'Marketing', count: 20, percentage: 20 },
      { name: 'HR', count: 15, percentage: 15 },
      { name: 'Finance', count: 10, percentage: 10 },
    ]
  },
  genderDistribution: {
    overall: { male: 55, female: 45 },
    byDepartment: [
      { department: 'Engineering', male: 70, female: 30 },
      { department: 'Sales', male: 50, female: 50 },
      { department: 'Marketing', male: 45, female: 55 },
    ]
  },
  ageDistribution: {
    groups: [
      { range: '20-30', percentage: 30 },
      { range: '31-40', percentage: 40 },
      { range: '41-50', percentage: 20 },
      { range: '51+', percentage: 10 },
    ]
  },
  attrition: {
    quarterly: [
      { quarter: 'Q1', rate: 4.2, voluntary: 3.1, involuntary: 1.1 },
      { quarter: 'Q2', rate: 3.8, voluntary: 2.8, involuntary: 1.0 },
    ]
  },
  education: {
    levels: [
      { level: 'Bachelors', percentage: 50 },
      { level: 'Masters', percentage: 30 },
      { level: 'PhD', percentage: 5 },
      { level: 'Others', percentage: 15 },
    ]
  }
};

// Initial data for documents
const initialExpiringDocuments = [
  { name: "Contract A", expiryDate: "2024-10-01" },
  { name: "Policy B", expiryDate: "2024-09-25" },
];

const reportTypes = [
  {
    title: "Monthly Attendance Report",
    description: "Track employee attendance patterns and trends",
    period: "Monthly",
    icon: FileText
  },
  {
    title: "Employee Access Level Report",
    description: "Overview of system and document access rights",
    period: "Quarterly",
    icon: FileText
  },
  {
    title: "Staff Composition Report",
    description: "Detailed breakdown of workforce demographics",
    period: "Quarterly",
    icon: FileText
  },
  {
    title: "Gender Distribution Report",
    description: "Analysis of gender diversity across departments",
    period: "Bi-annual",
    icon: FileText
  },
  {
    title: "Age Demographics Report",
    description: "Age distribution analysis of workforce",
    period: "Annual",
    icon: FileText
  },
  {
    title: "Attrition Analysis Report",
    description: "Employee turnover rates and patterns",
    period: "Quarterly",
    icon: FileText
  },
  {
    title: "Education Profile Report",
    description: "Educational qualification distribution",
    period: "Annual",
    icon: FileText
  }
];



const reportGenerators = {
  'Monthly Attendance Report': generateAttendanceReport,
  'Employee Access Level Report': generateAccessReport,
  'Staff Composition Report': generateStaffReport,
  'Gender Distribution Report': generateGenderReport,
};

const HRDocumentModule = () => {
  const { activeModule, changeModule } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Document types and documents state
  const [expandedType, setExpandedType] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  
  const documentTypes = [
    { type: "Employment Contracts:", documents: ["Contract A", "Contract B"] },
    { type: "Company Policies:", documents: ["Policy A", "Policy B"] },
    { type: "Standard operating procedure:", documents: ["SOP A", "SOP B"] },
    {
      type: "Compliance Documents:",
      documents: ["Compliance A", "Compliance B"],
    },
    { type: "Training Materials:", documents: ["Training A", "Training B"] },
  ];

  // Document upload state
  const [selectedFile, setSelectedFile] = useState(null);

  // Role-based access state
  const roles = ["super_admin", "admin", "employee"];
  const [selectedRole, setSelectedRole] = useState(roles[0]);

  // Onboarding state
  const [newEmployeeData, setNewEmployeeData] = useState({
    name: "",
    position: "",
    startDate: "",
  });

  // Offboarding state
  const [employeeId, setEmployeeId] = useState("");

  // Expiry alerts state
  const [expiringDocuments, setExpiringDocuments] = useState(
    initialExpiringDocuments
  );

  useEffect(() => {
    changeModule("HR Documents");
  }, []);

  // Handle file upload
  const handleFileUpload = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadSubmit = () => {
    console.log("File uploaded:", selectedFile);
    setSelectedFile(null);
  };

  // Handle onboarding new employee
  const handleOnboardingSubmit = () => {
    console.log("Onboarding new employee:", newEmployeeData);
    setNewEmployeeData({
      name: "",
      position: "",
      startDate: "",
    });
  };

  // Handle offboarding employee
  const handleOffboardingSubmit = () => {
    console.log("Offboarding employee ID:", employeeId);
    setEmployeeId("");
  };

  // Toggle dropdown for document type
  const toggleDropdown = (type) => {
    if (expandedType === type) {
      setExpandedType(null);
    } else {
      setExpandedType(type);
    }
  };

  // Handle document download
  const handleDownload = (document) => {
    console.log("Downloading document:", document);
  };

  // Handle report generation
  const handleGenerateReport = (report) => {
    setSelectedReport(report);
    console.log(`Generating ${report.title}...`);
    
    // Generate and download PDF
    setTimeout(() => {
      const generator = reportGenerators[report.title];
      if (generator) {
        const pdf = generator();
        pdf.save(`${report.title.toLowerCase().replace(/ /g, '_')}.pdf`);
      }
      setSelectedReport(null);
    }, 1000);
  };

  return (
    <div className="flex h-screen">
      {sidebarOpen && (
        <SidebarLayout
          activeModule={activeModule}
          setActiveModule={changeModule}
        />
      )}
      <div className="flex-1 overflow-auto">
        <div className="p-4 bg-white shadow-md flex justify-between items-center">
          <Button variant="ghost" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu />
          </Button>
          <h1 className="text-xl font-bold">{activeModule}</h1>
        </div>

        <div className="p-4 space-y-6">
       

          {/* Reports Generation Section */}
          <Card className="bg-white shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Generate Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reportTypes.map((report, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{report.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                        <p className="text-xs text-gray-500 mt-2">Period: {report.period}</p>
                      </div>
                      <report.icon className="text-gray-400" size={20} />
                    </div>
                    <Button
                      onClick={() => handleGenerateReport(report)}
                      className="w-full mt-4 bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center gap-2"
                      disabled={selectedReport === report}
                    >
                      {selectedReport === report ? (
                        "Generating..."
                      ) : (
                        <>
                          <Download size={16} />
                          Generate Report
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Document Types Section */}
          <div className="bg-white shadow-xl rounded-lg p-4">
            <h2 className="text-2xl font-bold">Document Types:</h2>
            <ul className="mt-4 space-y-2">
              {documentTypes.map((docType, index) => (
                <li key={index} className="border-b py-2 indent-4">
                  <div
                    className="flex justify-between items-center cursor-pointer font-semibold"
                    onClick={() => toggleDropdown(docType.type)}
                  >
                    <span>{docType.type}</span>
                    {expandedType === docType.type ? (
                      <ChevronUp />
                    ) : (
                      <ChevronDown />
                    )}
                  </div>
                  {expandedType === docType.type && (
                    <ul className="mt-2 pl-4 space-y-1 list-inside list-decimal indent-4">
                      {docType.documents.map((document, idx) => (
                        <li
                          key={idx}
                          className="text-blue-600 cursor-pointer indent-4"
                        >
                          <a onClick={() => handleDownload(document)}>
                            {document}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Document Upload Section */}
          <div className="bg-white shadow-xl rounded-lg p-4">
            <h2 className="text-xl font-semibold">Upload Document</h2>
            <div className="space-y-4 mt-4">
              <input type="file" onChange={handleFileUpload} />
              <select
                name="Document"
                className="inline-block w-2/4 border border-gray-300 p-2 ml-2"
              >
                {documentTypes.map((doc, index) => (
                  <option key={index} value={doc.type}>
                    {doc.type}
                  </option>
                ))}
              </select>
              <div>
                <Button
                  onClick={handleUploadSubmit}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                  Upload
                </Button>
              </div>
            </div>
          </div>

          {/* Access Control Section
          <div className="bg-white shadow-xl rounded-lg p-4">
            <h2 className="text-xl font-semibold">Document Access Control</h2>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="border border-gray-300 p-2 rounded-md mt-4"
            >
              {roles.map((role, index) => (
                <option key={index} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <p className="mt-2">
              The selected role, <strong>{selectedRole}</strong>, has access to:
            </p>
            <ul className="mt-4 space-y-2">
              <li>Employment Contracts</li>
              <li>Company Policies</li>
            </ul>
          </div> */}

          {/* Expiry Alerts Section */}
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold">Document Expiry Alerts</h2>
            <ul className="space-y-2 mt-4">
              {expiringDocuments.map((doc, index) => (
                <li key={index} className="border-b py-2">
                  {doc.name} - Expires on: {doc.expiryDate}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDocumentModule;