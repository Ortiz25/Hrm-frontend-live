import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";

const DisciplinarySummaryCard = ({ employeeId, yearToFilter }) => {
  const [disciplinaryRecord, setDisciplinaryRecord] = useState({
    warnings: [],
    cases: [],
    clearSlate: false,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const url = "https://hrmbackend.teqova.biz/api/discplinary";

        const data = { employeeId: employeeId };

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();

        const cases = result.cases;
        const warnings = result.warnings;
        setDisciplinaryRecord((prevState) => ({
          warnings: [...warnings],
          cases: [...cases],
          clearSlate: warnings || cases ? false : true,
        }));

        // console.log(disciplinaryRecord);
      } catch (error) {
        console.log("Error", error);
      }
    }
    fetchData();
  }, []);

  const WarningItem = ({ warning }) => (
    <div className="flex items-center justify-between p-2 border-b last:border-b-0">
      <div className="flex items-center">
        <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />
        <div>
          <p className="font-semibold">{warning.type}</p>
          <p className="text-sm text-gray-500">
            {new Date(warning.issue_date).toLocaleDateString()}
          </p>
        </div>
      </div>
      <p className="text-sm">{warning.description}</p>
    </div>
  );

  const CaseItem = ({ case: disciplinaryCase }) => (
    <div className="flex items-center justify-between p-2 border-b last:border-b-0">
      <div className="flex items-center">
        <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
        <div>
          <p className="font-semibold">Disciplinary Case</p>
          <p className="text-sm text-gray-500">
            {new Date(disciplinaryCase.action_date).toLocaleDateString()}
          </p>
        </div>
      </div>
      <Badge
        variant={
          disciplinaryCase.status === "Ongoing" ? "destructive" : "default"
        }
      >
        {disciplinaryCase.status}
      </Badge>
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Disciplinary Summary</CardTitle>
      </CardHeader>
      <CardContent>
        {disciplinaryRecord.clearSlate ? (
          <div className="flex items-center justify-center p-4">
            <CheckCircle className="w-6 h-6 mr-2 text-green-500" />
            <p className="text-lg font-semibold text-green-500">Clear Slate</p>
          </div>
        ) : (
          <>
            {disciplinaryRecord.warnings.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Warnings</h3>
                {disciplinaryRecord.warnings.map((warning) => (
                  <WarningItem key={warning.id} warning={warning} />
                ))}
              </div>
            )}
            {disciplinaryRecord.cases.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Disciplinary Cases</h3>
                {disciplinaryRecord.cases.map((disciplinaryCase) => (
                  <CaseItem key={disciplinaryCase.id} case={disciplinaryCase} />
                ))}
              </div>
            )}
            {disciplinaryRecord.warnings.length === 0 &&
              disciplinaryRecord.cases.length === 0 && (
                <div className="flex items-center justify-center p-4">
                  <CheckCircle className="w-6 h-6 mr-2 text-green-500" />
                  <p className="text-lg font-semibold text-green-500">
                    No Active Disciplinary Records in {yearToFilter}
                  </p>
                </div>
              )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DisciplinarySummaryCard;
