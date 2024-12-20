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
  const today = new Date();

  useEffect(() => {
    async function fetchData() {
      try {
        const url = "http://localhost:5174/api/leaverequests";
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

        const leaveRequests = result.requests;
        const pastApprovedLeaves = leaveRequests.filter((request) => {
          return (
            request.status === "approved" && new Date(request.end_date) < today
          );
        });

        const currentOrUpcomingLeaves = leaveRequests.filter((request) => {
          const startDate = new Date(request.start_date);
          const endDate = new Date(request.end_date);

          return (
            (request.status === "approved" || request.status === "pending") &&
            (startDate >= today || (startDate <= today && endDate >= today))
          );
        });
        setCurrentLeaves(currentOrUpcomingLeaves);
        setPastLeaves(pastApprovedLeaves);
      } catch (error) {
        console.log("Error", error);
      }
    }

    fetchData();
  }, [employeeId]);

  const LeaveItem = ({ leave }) => (
    <div className="flex items-center justify-between p-2 border-b last:border-b-0">
      <div className="flex items-center">
        <Calendar className="w-4 h-4 mr-2" />
        <div>
          <p className="font-semibold">{leave.leave_type} Leave</p>
          <p className="text-sm text-gray-500">
            {new Date(leave.start_date).toLocaleDateString()} -{" "}
            {new Date(leave.end_date).toLocaleDateString()}
          </p>
        </div>
      </div>
      <Badge
        variant={
          leave.status === "approved"
            ? "success"
            : leave.status === "rejected"
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
            <TabsTrigger value="current">Current & Pending</TabsTrigger>
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
