import React, { useEffect, useState } from "react";
import { 

  FileText,
  Users, 
  UserCheck, 
  GraduationCap, 
  BarChart3, 
  UsersRound,
  ArrowUpRight,
  ArrowDownRight,
  X, 

} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";




// Dashboard Summary Component
const ReportSummary = () => {
  const summaryData = {
    attendance: {
      current: 95.8,
      previous: 94.2,
      trend: "up"
    },
    staffComposition: {
      total: 456,
      departments: 8,
      trend: "up"
    },
    genderDistribution: {
      male: 55,
      female: 45,
      trend: "neutral"
    },
    ageGroups: {
      under30: 30,
      thirtyToFifty: 55,
      overFifty: 15,
      trend: "up"
    },
    attrition: {
      current: 4.2,
      previous: 5.1,
      trend: "down"
    },
    education: {
      graduate: 65,
      postGraduate: 25,
      others: 10,
      trend: "up"
    },
    accessLevels: {
      admin: 15,
      manager: 45,
      employee: 396,
      trend: "up"
    }
  };

  const MetricCard = ({ title, value, subValue, icon: Icon, trend, format = "number" }) => {
    const formatValue = (val) => {
      if (format === "percent") return `${val}%`;
      if (format === "number") return val.toLocaleString();
      return val;
    };

    return (
      <div className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{formatValue(value)}</h3>
            <div className="flex items-center mt-2">
              {trend === "up" && (
                <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              )}
              {trend === "down" && (
                <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${
                trend === "up" ? "text-green-500" : 
                trend === "down" ? "text-red-500" : 
                "text-gray-500"
              }`}>
                {subValue}
              </span>
            </div>
          </div>
          <div className="p-2 bg-blue-50 rounded-lg">
            <Icon className="w-6 h-6 text-blue-500" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-gray-50 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="text-blue-500" />
          Reports Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Monthly Attendance Rate"
            value={summaryData.attendance.current}
            subValue={`${summaryData.attendance.previous}% last month`}
            icon={UserCheck}
            trend={summaryData.attendance.trend}
            format="percent"
          />
          
          <MetricCard
            title="Total Staff"
            value={summaryData.staffComposition.total}
            subValue={`${summaryData.staffComposition.departments} departments`}
            icon={Users}
            trend={summaryData.staffComposition.trend}
          />
          
          <MetricCard
            title="Gender Ratio (M/F)"
            value={summaryData.genderDistribution.male}
            subValue={`${summaryData.genderDistribution.female}% female`}
            icon={UsersRound}
            trend={summaryData.genderDistribution.trend}
            format="percent"
          />
          
          <MetricCard
            title="Attrition Rate"
            value={summaryData.attrition.current}
            subValue={`${summaryData.attrition.previous}% last quarter`}
            icon={Users}
            trend={summaryData.attrition.trend}
            format="percent"
          />
          
          <MetricCard
            title="Education (Graduate)"
            value={summaryData.education.graduate}
            subValue={`${summaryData.education.postGraduate}% post-graduate`}
            icon={GraduationCap}
            trend={summaryData.education.trend}
            format="percent"
          />
          
          <MetricCard
            title="Age Distribution"
            value={summaryData.ageGroups.thirtyToFifty}
            subValue="30-50 years age group"
            icon={Users}
            trend={summaryData.ageGroups.trend}
            format="percent"
          />

          <MetricCard
            title="Access Levels"
            value={summaryData.accessLevels.employee}
            subValue={`${summaryData.accessLevels.manager} managers`}
            icon={FileText}
            trend={summaryData.accessLevels.trend}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportSummary