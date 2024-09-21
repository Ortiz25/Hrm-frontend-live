import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card.jsx";
import { Button } from "../components/ui/button.jsx";
import { Input } from "../components/ui/input.jsx";
import { Label } from "../components/ui/label.jsx";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs.jsx";
import {
  LayoutDashboard,
  TrendingUp,
  Search,
  Menu,
  RefreshCcw,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import SidebarLayout from "../components/layout/sidebarLayout.jsx";
import { useStore } from "../store/store.jsx";
import { useCallback } from "react";
import EmployeeSearch from "../components/ui/employeeSearch.jsx";

// Mock data for employees
const initialEmployeeData = [
  {
    id: 1,
    name: "Alice Smith",
    position: "Senior Developer",
    targets: { performance: 90, goals: 95, productivity: 85 },
    evaluations: [
      { date: "2024-01", performance: 88, goals: 92, productivity: 86 },
      { date: "2024-02", performance: 92, goals: 95, productivity: 88 },
    ],
  },
  {
    id: 2,
    name: "Bob Johnson",
    position: "Data Analyst",
    targets: { performance: 85, goals: 80, productivity: 85 },
    evaluations: [
      { date: "2024-01", performance: 82, goals: 78, productivity: 84 },
      { date: "2024-02", performance: 78, goals: 80, productivity: 82 },
    ],
  },
  {
    id: 3,
    name: "Carol Davis",
    position: "Marketing Manager",
    targets: { performance: 88, goals: 92, productivity: 90 },
    evaluations: [
      { date: "2024-01", performance: 86, goals: 90, productivity: 88 },
      { date: "2024-02", performance: 89, goals: 91, productivity: 92 },
    ],
  },
  {
    id: 4,
    name: "David Wilson",
    position: "HR Specialist",
    targets: { performance: 85, goals: 88, productivity: 87 },
    evaluations: [
      { date: "2024-01", performance: 84, goals: 86, productivity: 85 },
      { date: "2024-02", performance: 86, goals: 89, productivity: 88 },
    ],
  },
  {
    id: 5,
    name: "Eva Brown",
    position: "Project Manager",
    targets: { performance: 92, goals: 95, productivity: 93 },
    evaluations: [
      { date: "2024-01", performance: 90, goals: 93, productivity: 91 },
      { date: "2024-02", performance: 93, goals: 96, productivity: 94 },
    ],
  },
  {
    id: 6,
    name: "Frank Miller",
    position: "Customer Service Representative",
    targets: { performance: 82, goals: 85, productivity: 80 },
    evaluations: [
      { date: "2024-01", performance: 80, goals: 83, productivity: 79 },
      { date: "2024-02", performance: 83, goals: 86, productivity: 82 },
    ],
  },
  {
    id: 7,
    name: "Grace Taylor",
    position: "Software Engineer",
    targets: { performance: 90, goals: 88, productivity: 92 },
    evaluations: [
      { date: "2024-01", performance: 89, goals: 87, productivity: 90 },
      { date: "2024-02", performance: 91, goals: 89, productivity: 93 },
    ],
  },
];

const Perfomance = () => {
  const { activeModule, changeModule } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Performance");
  const [employees, setEmployees] = useState(initialEmployeeData);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newEvaluation, setNewEvaluation] = useState({
    date: "",
    performance: "",
    goals: "",
    productivity: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSelectEmployee = (employee) => {
    setSelectedEmployee(employee);

    setSearchTerm("");
    setSearchResults([]);
    console.log(selectedEmployee);
  };

  const handleTargetChange = (metric, value) => {
    setSelectedEmployee((prev) => ({
      ...prev,
      targets: { ...prev.targets, [metric]: parseInt(value) },
    }));
  };

  const handleEvaluationChange = (metric, value) => {
    setNewEvaluation((prev) => ({ ...prev, [metric]: value }));
  };

  const handleAddEvaluation = () => {
    const updatedEmployee = {
      ...selectedEmployee,
      evaluations: [...selectedEmployee.evaluations, newEvaluation],
    };
    setEmployees(
      employees.map((emp) =>
        emp.id === selectedEmployee.id ? updatedEmployee : emp
      )
    );
    setSelectedEmployee(updatedEmployee);
    setNewEvaluation({
      date: "",
      performance: "",
      goals: "",
      productivity: "",
    });
  };

  const handleUpdateTargets = () => {
    const updatedEmployees = employees.map((emp) =>
      emp.id === selectedEmployee.id
        ? { ...emp, targets: selectedEmployee.targets }
        : emp
    );
    setEmployees(updatedEmployees);
    alert("Targets updated successfully!");
  };

  const getLatestEvaluation = (employee) => {
    console.log(employee);
    return employee?.evaluations[employee.evaluations.length - 1];
  };

  const calculateAchievement = (target, actual) => {
    return ((actual / target) * 100).toFixed(2);
  };

  const AveragePerformanceChart = () => {
    console.log(selectedEmployee, searchTerm);
    const data = !selectedEmployee
      ? employees.map((employee) => ({
          name: employee.name,
          ...getLatestEvaluation(employee),
        }))
      : [
          {
            name: selectedEmployee?.name,
            ...getLatestEvaluation(selectedEmployee),
          },
        ];

    console.log(data);

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="performance" fill="#8884d8" />
          <Bar dataKey="goals" fill="#82ca9d" />
          <Bar dataKey="productivity" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
    );
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

        <div className="flex-1 p-8 overflow-y-auto h-screen">
          <Card className="shadow-2xl">
            <CardHeader>
              <CardTitle>{activeTab}</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview">
                <TabsList className="bg-gray-100 p-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="targets">Targets</TabsTrigger>
                  <TabsTrigger value="evaluations">Evaluations</TabsTrigger>
                  <TabsTrigger value="results">Results</TabsTrigger>
                </TabsList>
                <RefreshCcw
                  className="inline-block mr-4 mt-2 float-right hover:cursor-pointer"
                  onClick={() => {
                    setSelectedEmployee(null);
                  }}
                />
                <TabsContent value="overview">
                  <div className="grid grid-cols-2 gap-4 ">
                    <div className="col-span-2">
                      <AveragePerformanceChart />
                    </div>
                    <EmployeeSearch
                      employees={employees}
                      onSelectEmployee={handleSelectEmployee}
                      onDataSend={setSearchResults}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="targets">
                  {selectedEmployee && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <h4 className="text-lg font-medium mb-2">
                          {selectedEmployee.name} - {selectedEmployee.position}
                        </h4>
                      </div>
                      <div>
                        <Label htmlFor="performance-target">
                          Performance Target
                        </Label>
                        <Input
                          id="performance-target"
                          type="number"
                          value={selectedEmployee.targets.performance}
                          onChange={(e) =>
                            handleTargetChange("performance", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="goals-target">Goals Target</Label>
                        <Input
                          id="goals-target"
                          type="number"
                          value={selectedEmployee.targets.goals}
                          onChange={(e) =>
                            handleTargetChange("goals", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="productivity-target">
                          Productivity Target
                        </Label>
                        <Input
                          id="productivity-target"
                          type="number"
                          value={selectedEmployee.targets.productivity}
                          onChange={(e) =>
                            handleTargetChange("productivity", e.target.value)
                          }
                        />
                      </div>
                      <div className="col-span-2">
                        <Button onClick={handleUpdateTargets}>
                          Update Targets
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="evaluations">
                  {selectedEmployee && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <h4 className="text-lg font-medium mb-2">
                          {selectedEmployee.name} - {selectedEmployee.position}
                        </h4>
                      </div>
                      <div>
                        <Label htmlFor="evaluation-date">Evaluation Date</Label>
                        <Input
                          id="evaluation-date"
                          type="text"
                          placeholder="e.g., 2024-03"
                          value={newEvaluation.date}
                          onChange={(e) =>
                            handleEvaluationChange("date", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="performance-score">
                          Performance Score
                        </Label>
                        <Input
                          id="performance-score"
                          type="number"
                          placeholder="e.g., 85"
                          value={newEvaluation.performance}
                          onChange={(e) =>
                            handleEvaluationChange(
                              "performance",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="goals-score">Goals Score</Label>
                        <Input
                          id="goals-score"
                          type="number"
                          placeholder="e.g., 90"
                          value={newEvaluation.goals}
                          onChange={(e) =>
                            handleEvaluationChange("goals", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="productivity-score">
                          Productivity Score
                        </Label>
                        <Input
                          id="productivity-score"
                          type="number"
                          placeholder="e.g., 88"
                          value={newEvaluation.productivity}
                          onChange={(e) =>
                            handleEvaluationChange(
                              "productivity",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="col-span-2">
                        <Button onClick={handleAddEvaluation}>
                          Add Evaluation
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="results">
                  <div className="grid grid-cols-2 gap-4">
                    <EmployeeSearch
                      employees={employees}
                      onSelectEmployee={handleSelectEmployee}
                      onDataSend={setSearchResults}
                    />
                    <div className="text-xl font-semibold col-span-2 border-t-2 pt-4">
                      Perfomance Trends
                    </div>
                    {selectedEmployee && (
                      <>
                        <div className="col-span-2 m-2 border-b-2">
                          <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={selectedEmployee.evaluations}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Line
                                type="monotone"
                                dataKey="performance"
                                stroke="#8884d8"
                              />
                              <Line
                                type="monotone"
                                dataKey="goals"
                                stroke="#82ca9d"
                              />
                              <Line
                                type="monotone"
                                dataKey="productivity"
                                stroke="#ffc658"
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>

                        <div className="col-span-2 border-b-2">
                          <div>
                            <h4 className="text-xl font-medium mb-2">
                              {selectedEmployee.name} -{" "}
                              {selectedEmployee.position}
                            </h4>
                          </div>
                          <div className="border border-slate-300 w-5/12 inline-block  mr-2 p-2 bg-gray-100 hover:bg-gray-300">
                            <Label>Latest Evaluation Date</Label>
                            <p>{getLatestEvaluation(selectedEmployee).date}</p>
                          </div>
                          <div className="border border-slate-300 w-5/12 inline-block p-2 bg-gray-100 hover:bg-gray-300">
                            <Label>Performance Score</Label>
                            <p>
                              {
                                getLatestEvaluation(selectedEmployee)
                                  .performance
                              }
                            </p>
                          </div>
                          <div className="border border-slate-300 w-5/12 inline-block  mr-2 mt-2 p-2 bg-gray-100 hover:bg-gray-300">
                            <Label>Goals Score</Label>
                            <p>{getLatestEvaluation(selectedEmployee).goals}</p>
                          </div>
                          <div className="border border-slate-300 w-5/12 inline-block p-2 mt-2 bg-gray-100 hover:bg-gray-300">
                            <Label>Productivity Score</Label>
                            <p>
                              {
                                getLatestEvaluation(selectedEmployee)
                                  .productivity
                              }
                            </p>
                          </div>
                          <div className="border border-slate-300 w-5/12 inline-block  mr-2 mt-2 p-2 bg-gray-100 hover:bg-gray-300">
                            <Label>Performance Achievement (%)</Label>
                            <p>
                              {calculateAchievement(
                                selectedEmployee.targets.performance,
                                getLatestEvaluation(selectedEmployee)
                                  .performance
                              )}
                            </p>
                          </div>
                          <div className="border border-slate-300 w-5/12 inline-block p-2 mt-2 bg-gray-100 hover:bg-gray-300">
                            <Label>Goals Achievement (%)</Label>
                            <p>
                              {calculateAchievement(
                                selectedEmployee.targets.goals,
                                getLatestEvaluation(selectedEmployee).goals
                              )}
                            </p>
                          </div>
                          <div className="border border-slate-300 w-5/12 inline-block  mr-2 p-2 mb-6 mt-2 bg-gray-100 hover:bg-gray-300">
                            <Label>Productivity Achievement (%)</Label>
                            <p>
                              {calculateAchievement(
                                selectedEmployee.targets.productivity,
                                getLatestEvaluation(selectedEmployee)
                                  .productivity
                              )}
                            </p>
                          </div>
                        </div>
                        {selectedEmployee && (
                          <div className="mt-4 mb-4 border-b-2 col-span-2">
                            <h4 className="text-xl font-semibold mb-2">
                              Latest Evaluation vs Targets
                            </h4>
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="bg-gray-100">
                                  <th className="border p-2 text-left">
                                    Metric
                                  </th>
                                  <th className="border p-2 text-left">
                                    Target
                                  </th>
                                  <th className="border p-2 text-left">
                                    Actual
                                  </th>
                                  <th className="border p-2 text-left">
                                    Achievement
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {Object.entries(selectedEmployee.targets).map(
                                  ([metric, target]) => {
                                    const actual =
                                      getLatestEvaluation(selectedEmployee)[
                                        metric
                                      ];
                                    return (
                                      <tr
                                        key={metric}
                                        className="hover:bg-gray-50"
                                      >
                                        <td className="border p-2">{metric}</td>
                                        <td className="border p-2">{target}</td>
                                        <td className="border p-2">{actual}</td>
                                        <td className="border p-2">
                                          {calculateAchievement(target, actual)}
                                          %
                                        </td>
                                      </tr>
                                    );
                                  }
                                )}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Perfomance;
