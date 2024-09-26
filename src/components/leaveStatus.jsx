import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Calendar } from "lucide-react";

const LeaveStatusCard = ({ employeeId }) => {
  const [currentLeaves, setCurrentLeaves] = useState([]);
  const [pastLeaves, setPastLeaves] = useState([]);

  useEffect(() => {
    // In a real application, you would fetch this data from your backend
    // This is just mock data for demonstration
    setCurrentLeaves([
      {
        id: 1,
        type: "Annual",
        startDate: "2024-10-01",
        endDate: "2024-10-05",
        status: "Pending",
      },
      {
        id: 2,
        type: "Sick",
        startDate: "2024-10-15",
        endDate: "2024-10-16",
        status: "Approved",
      },
    ]);

    setPastLeaves([
      {
        id: 3,
        type: "Annual",
        startDate: "2024-09-01",
        endDate: "2024-09-05",
        status: "Approved",
      },
      {
        id: 4,
        type: "Sick",
        startDate: "2024-08-15",
        endDate: "2024-08-16",
        status: "Rejected",
      },
    ]);
  }, [employeeId]);

  const LeaveItem = ({ leave }) => (
    <div className="flex items-center justify-between p-2 border-b last:border-b-0">
      <div className="flex items-center">
        <Calendar className="w-4 h-4 mr-2" />
        <div>
          <p className="font-semibold">{leave.type} Leave</p>
          <p className="text-sm text-gray-500">
            {new Date(leave.startDate).toLocaleDateString()} -{" "}
            {new Date(leave.endDate).toLocaleDateString()}
          </p>
        </div>
      </div>
      <Badge
        variant={
          leave.status === "Approved"
            ? "success"
            : leave.status === "Rejected"
            ? "destructive"
            : "default"
        }
      >
        {leave.status}
      </Badge>
    </div>
  );

  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle>Leave Status</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="current">
          <TabsList className="grid w-full grid-cols-2 bg-gray-200">
            <TabsTrigger value="current">Current & Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past Leaves</TabsTrigger>
          </TabsList>
          <TabsContent value="current">
            {currentLeaves.length > 0 ? (
              currentLeaves.map((leave) => (
                <LeaveItem key={leave.id} leave={leave} />
              ))
            ) : (
              <p className="text-center text-gray-500">
                No current or upcoming leave applications.
              </p>
            )}
          </TabsContent>
          <TabsContent value="past">
            {pastLeaves.length > 0 ? (
              pastLeaves.map((leave) => (
                <LeaveItem key={leave.id} leave={leave} />
              ))
            ) : (
              <p className="text-center text-gray-500">
                No past leave applications.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LeaveStatusCard;
