import React, { useState, useEffect } from "react";
import { AlertCircle, FileText, Clock, Paperclip } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textArea";

const WarningModule = () => {
  const [warningTypes, setWarningTypes] = useState([
    { id: 1, name: "1st Warning", expiryDays: 30 },
    { id: 2, name: "2nd Warning", expiryDays: 60 },
    { id: 3, name: "3rd Warning", expiryDays: 90 },
    { id: 4, name: "Final Warning", expiryDays: 180 },
    { id: 5, name: "Verbal Warning", expiryDays: 14 },
  ]);

  const [warnings, setWarnings] = useState([]);
  const [appeals, setAppeals] = useState([]);
  const [newWarning, setNewWarning] = useState({
    employeeId: "",
    typeId: "",
    description: "",
    date: "",
    attachments: [],
  });

  useEffect(() => {
    const currentDate = new Date();
    setWarnings((prevWarnings) =>
      prevWarnings.filter((warning) => {
        const expiryDate = new Date(warning.date);
        const warningType = warningTypes.find(
          (type) => type.id === warning.typeId
        );
        expiryDate.setDate(expiryDate.getDate() + warningType.expiryDays);
        return expiryDate > currentDate;
      })
    );
  }, [warningTypes]);

  const handleNewWarning = () => {
    if (
      newWarning.employeeId &&
      newWarning.typeId &&
      newWarning.description &&
      newWarning.date
    ) {
      setWarnings([...warnings, { ...newWarning, id: Date.now() }]);
      setNewWarning({
        employeeId: "",
        typeId: "",
        description: "",
        date: "",
        attachments: [],
      });
      console.log(warnings);
    } else {
      alert("Please fill in all fields");
    }
  };

  const handleAppeal = (warningId) => {
    const appealDescription = prompt("Enter appeal description:");
    if (appealDescription) {
      setAppeals([
        ...appeals,
        {
          warningId,
          description: appealDescription,
          date: new Date().toISOString(),
        },
      ]);
    }
  };

  const handleFileUpload = (event) => {
    setNewWarning({
      ...newWarning,
      attachments: [...newWarning.attachments, ...event.target.files],
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Warnings</h1>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Issue New Warning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Employee ID"
              value={newWarning.employeeId}
              onChange={(e) =>
                setNewWarning({ ...newWarning, employeeId: e.target.value })
              }
            />
            <select
              value={newWarning.typeId}
              onChange={(e) =>
                setNewWarning({
                  ...newWarning,
                  typeId: parseInt(e.target.value),
                })
              }
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="">Select Warning Type</option>
              {warningTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name} expires in {type.expiryDays} Days
                </option>
              ))}
            </select>
            <Textarea
              placeholder="Warning Description"
              value={newWarning.description}
              onChange={(e) =>
                setNewWarning({ ...newWarning, description: e.target.value })
              }
              className="col-span-2"
            />
            <Input
              type="date"
              value={newWarning.date}
              onChange={(e) =>
                setNewWarning({ ...newWarning, date: e.target.value })
              }
            />
            <Input type="file" multiple onChange={handleFileUpload} />
            <Button onClick={handleNewWarning} className="col-span-2">
              Issue Warning
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Warnings</CardTitle>
        </CardHeader>
        <CardContent>
          {warnings.map((warning) => (
            <Alert key={warning.id} className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Warning for Employee {warning.employeeId}</AlertTitle>
              <AlertDescription>
                <p>{warning.description}</p>
                <p>Date: {new Date(warning.date).toLocaleDateString()}</p>
                <p>
                  Type:{" "}
                  {
                    warningTypes.find((type) => type.id === warning.typeId)
                      ?.name
                  }
                </p>
                <p>Attachments: {warning.attachments.length}</p>
                <Button
                  onClick={() => handleAppeal(warning.id)}
                  className="mt-2"
                >
                  Appeal
                </Button>
              </AlertDescription>
            </Alert>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default WarningModule;
