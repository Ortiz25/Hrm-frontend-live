import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@headlessui/react";
import SidebarLayout from "../components/layout/sidebarLayout";
import { Menu } from "lucide-react";
import { Input } from "../components/ui/input.jsx";
import { useStore } from "../store/store.jsx";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { Label } from "../components/ui/label.jsx";

const initialExpiringDocuments = [
  { name: "Contract A", expiryDate: "2024-10-01" },
  { name: "Policy B", expiryDate: "2024-09-25" },
];

const HRDocumentModule = () => {
  const { activeModule, changeModule } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Document types and documents state
  const [expandedType, setExpandedType] = useState(null);
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
      setExpandedType(null); // Close the dropdown if it's already open
    } else {
      setExpandedType(type); // Open the selected dropdown
    }
  };

  // Handle document download
  const handleDownload = (document) => {
    console.log("Downloading document:", document);
    // Simulate a document download process (e.g., redirect to download link)
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
          {/* Document Types Section */}
          <div className="bg-white shadow rounded-lg p-4">
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
                    <ul className="mt-2 pl-4 space-y-1 list-inside list-decimal  indent-4">
                      {docType.documents.map((document, idx) => (
                        <li
                          key={idx}
                          className="text-blue-600 cursor-pointer indent-4 "
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
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold">Upload Document</h2>
            <div className="space-y-4 mt-4">
              <input type="file" onChange={handleFileUpload} />
              <select
                name="Document"
                className="inline-block w-2\4 border border-gray-300 p-2 ml-2 "
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

          {/* Access Control Section */}
          {/* <div className="bg-white shadow rounded-lg p-4">
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
