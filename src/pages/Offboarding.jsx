import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textArea';
import { Checkbox } from '../components/ui/checkbox';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Alert, AlertDescription } from '../components/ui/alert';
import {
  ClipboardList,
  KeyRound,
  Laptop,
  FileCheck,
  UserMinus,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Menu
} from 'lucide-react';
import SidebarLayout from '../components/layout/sidebarLayout';
import { useStore } from "../store/store.jsx";
import { useLoaderData, useNavigate } from 'react-router-dom';

const OffboardingModule = () => {
  const [currentEmployee, setCurrentEmployee] = useState({
    name: 'John Doe',
    department: 'Engineering',
    position: 'Senior Developer',
    lastDay: '2024-04-30',
    manager: 'Jane Smith'
  });
  const { activeModule, changeModule, changeRole, offboardEmployee  } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const data = useLoaderData()
   const navigate = useNavigate()
  useEffect(() => {
    changeModule("Offboarding");
    changeRole(data.userData.role)
    console.log(offboardEmployee)
    if(!offboardEmployee.position){
        navigate("/onboarding")
    }
   
  }, []);


  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  // State for checklist items
  const [checklistItems, setChecklistItems] = useState({
    documents: [
      { id: 1, task: 'Submit resignation letter', completed: true },
      { id: 2, task: 'Complete exit interview form', completed: false },
      { id: 3, task: 'Sign NDA and confidentiality agreements', completed: false }
    ],
    assets: [
      { id: 1, task: 'Return laptop and accessories', completed: false },
      { id: 2, task: 'Return access card', completed: true },
      { id: 3, task: 'Return company phone', completed: false }
    ],
    handover: [
      { id: 1, task: 'Document current projects', completed: false },
      { id: 2, task: 'Transfer project files', completed: false },
      { id: 3, task: 'Update team documentation', completed: false }
    ]
  });

  // State for knowledge transfer
  const [knowledgeTransfer, setKnowledgeTransfer] = useState([
    {
      id: 1,
      project: 'Customer Portal',
      documents: 'Project documentation and roadmap',
      assignee: 'Mike Johnson',
      status: 'In Progress'
    },
    {
      id: 2,
      project: 'API Integration',
      documents: 'API documentation and credentials',
      assignee: 'Sarah Williams',
      status: 'Pending'
    }
  ]);

  const toggleChecklistItem = (section, id) => {
    setChecklistItems(prev => ({
      ...prev,
      [section]: prev[section].map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    }));
    updateProgress();
  };

  const updateProgress = () => {
    const totalItems = Object.values(checklistItems).reduce(
      (acc, section) => acc + section.length,
      0
    );
    const completedItems = Object.values(checklistItems).reduce(
      (acc, section) => acc + section.filter(item => item.completed).length,
      0
    );
    setProgress((completedItems / totalItems) * 100);
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

      <Card className="w-full max-w-5xl m-8">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-bold">Employee Offboarding</CardTitle>
            <CardDescription>Manage employee exit process and handover</CardDescription>
          </div>
          <Badge variant={progress === 100 ? "success" : "secondary"}>
            {Math.round(progress)}% Complete
          </Badge>
        </div>
        <Progress value={progress} className="h-2 bg-gray-200" />
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 gap-4 mb-6 bg-gray-200">
            <TabsTrigger value="overview" className="flex gap-2">
              <ClipboardList className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex gap-2">
              <FileCheck className="w-4 h-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="assets" className="flex gap-2">
              <Laptop className="w-4 h-4" />
              Assets
            </TabsTrigger>
            <TabsTrigger value="handover" className="flex gap-2">
              <KeyRound className="w-4 h-4" />
              Handover
            </TabsTrigger>
            <TabsTrigger value="exit" className="flex gap-2">
              <UserMinus className="w-4 h-4" />
              Exit
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Employee Name</label>
                  <Input value={offboardEmployee.first_name + " " + offboardEmployee.last_name} disabled />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Department</label>
                  <Input value={offboardEmployee.department} disabled />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Position</label>
                  <Input value={offboardEmployee.position} disabled />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Working Day</label>
                  <div className="flex gap-2 items-center">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <Input id="lastDay" type="date" name="lasDay"/>
                  </div>
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription>
                  Please ensure all tasks are completed before the employee's last working day.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <div className="space-y-4">
              {checklistItems.documents.map(item => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={() => toggleChecklistItem('documents', item.id)}
                  />
                  <label className="text-sm">
                    {item.task}
                    {item.completed && (
                      <CheckCircle2 className="w-4 h-4 text-green-500 inline ml-2" />
                    )}
                  </label>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Assets Tab */}
          <TabsContent value="assets">
            <div className="space-y-4">
              {checklistItems.assets.map(item => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={() => toggleChecklistItem('assets', item.id)}
                  />
                  <label className="text-sm">
                    {item.task}
                    {item.completed && (
                      <CheckCircle2 className="w-4 h-4 text-green-500 inline ml-2" />
                    )}
                  </label>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Handover Tab */}
          <TabsContent value="handover">
            <div className="space-y-6">
              <div className="space-y-4">
                {checklistItems.handover.map(item => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() => toggleChecklistItem('handover', item.id)}
                    />
                    <label className="text-sm">
                      {item.task}
                      {item.completed && (
                        <CheckCircle2 className="w-4 h-4 text-green-500 inline ml-2" />
                      )}
                    </label>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Knowledge Transfer</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Project</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Documents</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Assignee</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {knowledgeTransfer.map(item => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm">{item.project}</td>
                          <td className="px-4 py-2 text-sm">{item.documents}</td>
                          <td className="px-4 py-2 text-sm">{item.assignee}</td>
                          <td className="px-4 py-2 text-sm">
                            <Badge variant={item.status === 'Completed' ? 'success' : 'secondary'}>
                              {item.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Exit Tab */}
          <TabsContent value="exit">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Exit Interview</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Reason for Leaving</label>
                    <Textarea placeholder="Please provide the primary reason for leaving..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Feedback</label>
                    <Textarea placeholder="Please share your experience and suggestions..." />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Final Clearance</h3>
                <Alert>
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <AlertDescription>
                    All departments must provide clearance before processing final settlement.
                  </AlertDescription>
                </Alert>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full">
                    Download Clearance Form
                  </Button>
                  <Button className="w-full">Submit Final Clearance</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
    </div>
  </div>
    
  );
};

export default OffboardingModule;


export async function loader() {
    const token = localStorage.getItem("token");
  
    if (!token) {
      return redirect("/");
    }
    const url = "https://hrmbackend.livecrib.pro/api/verifyToken";
    // const url2 = "https://hrmbackend.livecrib.pro/api/getemployees";
  
    const data = { token: token };
  
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  
    const userData = await response.json();
    //const employees = await response2.json();
     console.log(userData)
    if (userData.message === "token expired") {
      return redirect("/");
    }
    return {  userData: userData.user };
  }
  