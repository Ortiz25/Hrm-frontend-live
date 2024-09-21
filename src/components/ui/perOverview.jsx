import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const initialEmployeeData = [
  {
    id: 1,
    name: "Alice Smith",
    position: "Senior Developer",
    rating: 4,
    performance: 92,
  },
  {
    id: 2,
    name: "Bob Johnson",
    position: "Data Analyst",
    rating: 3,
    performance: 78,
  },
  {
    id: 3,
    name: "Carol Williams",
    position: "Project Manager",
    rating: 5,
    performance: 95,
  },
];

const StarRating = ({ rating }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={i < rating ? "text-yellow-400" : "text-gray-300"}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const PerformanceOverview = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [employees] = useState(initialEmployeeData);

  return (
    <div className="flex-1 p-4 overflow-y-auto overflow-x-auto shadow-2xl rounded">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">{activeTab}</h2>
        {activeTab === "Overview" && (
          <div className="space-y-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees.map((employee) => (
                    <tr key={employee.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {employee.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {employee.position}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StarRating rating={employee.rating} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="overflow-hidden rounded-lg shadow-lg border">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={employees}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="performance" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceOverview;
