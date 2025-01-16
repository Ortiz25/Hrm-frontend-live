import React, { useState, useEffect, useRef } from "react";
import {
  AlertCircle,
  FileText,
  Clock,
  Paperclip,
  Loader,
  TriangleAlert,
} from "lucide-react";
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
import {
  Form,
  redirect,
  useNavigate,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import { formatDate } from "../util/helpers";

const WarningModule = ({ warningsData, actionData }) => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const isLoading = navigation.state === "loading";
  const [refresh, updateRefresh] = useState(false);
  const [warnings, setWarnings] = useState(warningsData);

  const formRef = useRef();

  if (actionData) {
    formRef.current.reset();
  }
  console.log(warnings)
  async function handleDownload(id, attachments) {
    try {
      // Extract the file name from the attachment
      const fileName = attachments[0].split("/").pop();

      // Construct the download URL
      const url = `http://hrmdemo.teqova.biz/api/download/${fileName}`;

      // Fetch the file
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      // Create a blob from the response
      const blob = await response.blob();

      // Create a temporary link element to trigger the download
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName; // Set the downloaded file name
      document.body.appendChild(link);
      link.click();

      // Remove the temporary link element
      document.body.removeChild(link);
    } catch (error) {
      console.log(error);
    }
  }

  const slicedData = warnings.slice(0, 3);

  useEffect(() => {
    console.log(refresh);
  }, [refresh]);

  const handleAppeal = async (warningId) => {
    if (confirm("Confirm Case Closure !!")) {
      try {
        console.log(warningId);
        const data = { id: warningId };
        const url = "http://hrmdemo.teqova.biz/api/deletewarning";
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();
        if (result.message === "warning deleted") {
          const url2 = "http://hrmdemo.teqova.biz/api/warnings";

          const response2 = await fetch(url2);

          const { warnings } = await response2.json();
          setWarnings(warnings);
        }
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Closure canceld");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Warnings</h1>
      <Form ref={formRef} method="put" encType="multipart/form-data">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Issue New Warning</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Employee Name" name="employeeName" required />
              <Input placeholder="Employee ID" name="employeeId" required />
              <Textarea
                placeholder="Warning Description"
                name="description"
                className="col-span-2"
                required
              />
              <Input type="date" name="date" required />
              <Input type="file" multiple name="file" />
              <Button type="submit" className="col-span-2">
                {isSubmitting || isLoading ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <></>
                )}
                {isSubmitting ? "Uploading..." : "Upload Warning"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </Form>

      <Card>
        <CardHeader>
          <CardTitle>Active Warnings</CardTitle>
        </CardHeader>
        <CardContent>
          {warnings.map((warning) => (
            <Alert key={warning.id} className="mb-4">
              <AlertCircle className="h-5 w-5 text-red-700" />
              <AlertTitle>
                Warning for Employee {warning.employee_number}
              </AlertTitle>
              <AlertDescription>
                <p className="text-red-500">{warning.description}</p>
                <p>
                  <span className="font-bold">Name:</span> {warning.name}
                </p>
                <p>
                  <span className="font-bold">Date: </span>
                  {new Date(warning.issue_date).toLocaleDateString()}
                </p>

                <p>
                  <span className="font-bold">Attachments:</span>{" "}
                  {warning.attachments.length}
                </p>
                <div className="flex justify-between mt-2">
                  <Button
                    onClick={() =>
                      handleDownload(warning.id, warning.attachments)
                    }
                    className="mt-2"
                  >
                    <Paperclip size={18} />
                    Download Attachment
                  </Button>
                  <Button
                    onClick={() => handleAppeal(warning.id)}
                    className="mt-2"
                    variant="destructive"
                  >
                    Close Case
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default WarningModule;
