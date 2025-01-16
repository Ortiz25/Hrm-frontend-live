import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textArea.jsx';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Trophy, ThumbsUp, Star, Heart, Target, Rocket, Award, Menu, Loader } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';
import SidebarLayout from "../components/layout/sidebarLayout.jsx";
import { useStore } from "../store/store.jsx";
import { redirect, useLoaderData } from 'react-router-dom';


const RecognitionPage = () => {
    const { activeModule, changeModule, changeRole, role } = useStore();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [errors, setErrors] = useState({});
    const data = useLoaderData();
    const [isLoading, setIsloading] = useState(false)
  
    useEffect(() => {
        changeRole(data.role.role);
        changeModule("Recognitions")
      
    }, []);
    console.log(data.recognitions)
    // Focus style class
    const focusClass = "bg-gray-900 text-white ring-2 ring-offset-2 ring-gray-600";

    const today = new Date();

    // Format the date as 'YYYY-MM-DD'
    const formattedDate = today.toISOString().split('T')[0]; 

    // State management for recognition form
    const [recognitionForm, setRecognitionForm] = useState({
        recipientName: '',
        recipientID: '',
        recognitionType: '',
        category: '',
        message: '',
        impact: '',
        tags: [],
        likes: 0,
        recognition_date:formattedDate 
    });

    const [recognitionHistory, setRecognitionHistory] = useState(data.recognitions);

    const [showSuccess, setShowSuccess] = useState(false);

     // Function to fetch all recognitions from the backend
     const fetchRecognitions = async () => {
        try {
            const response = await fetch('http://hrmdemo.teqova.biz/api/recognitions');
            if (response.ok) {
                const data = await response.json();
                setRecognitionHistory(data);
            } else {
                console.error('Failed to fetch recognitions');
            }
        } catch (error) {
            console.error('Error fetching recognitions:', error);
        }
    };

    // Recognition types and their corresponding icons
    const recognitionTypes = {
        'Kudos': ThumbsUp,
        'Achievement Award': Trophy,
        'Star Performer': Star,
        'Innovation Champion': Rocket,
        'Team Player': Heart,
        'Goal Crusher': Target
    };

    const categories = [
        'Innovation',
        'Leadership',
        'Teamwork',
        'Customer Success',
        'Technical Excellence',
        'Core Values',
        'Project Success'
    ];

    const impactLevels = [
        'Individual',
        'Team',
        'Department',
        'Organization'
    ];

    const commonTags = [
        'technical', 'innovation', 'collaboration',
        'leadership', 'customer-focus', 'efficiency',
        'mentoring', 'problem-solving'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
       
        try {
            setIsloading(true)
         
            if(recognitionForm.recipientID === data.role.employee.employee_number){
    
                setErrors({message: "Self Recognition Prohibited !!!"})
                return
            }
            const response = await fetch('http://hrmdemo.teqova.biz/api/recognition', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(recognitionForm)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Recognition history updated:', result);
                setRecognitionForm({
                    recipientName: '',
                    recipientID: '',
                    recognitionType: '',
                    category: '',
                    message: '',
                    impact: '',
                    tags: [],
                    likes: 0,
                    recognition_date:formattedDate 
                })
                setIsloading(false)
                setShowSuccess(true)
                const myTimeout = setTimeout(()=>{setShowSuccess(false)}, 5000);

            } else {
                console.error('Error updating recognition history');
                setErrors({message: "Error updating recognition history"})
                setRecognitionForm({
                    recipientName: '',
                    recipientID: '',
                    recognitionType: '',
                    category: '',
                    message: '',
                    impact: '',
                    tags: [],
                    likes: 0,
                    recognition_date:formattedDate 
                })
                setIsloading(false)
                fetchRecognitions();
                alert("Recognition Submitted successfully")
            }
        } catch (error) {
            console.error('Request failed:', error);
            setIsloading(false)
        }
    };

    const handleTagToggle = (tag) => {
        setRecognitionForm(prev => ({
            ...prev,
            tags: prev.tags.includes(tag)
                ? prev.tags.filter(t => t !== tag)
                : [...prev.tags, tag]
        }));
    };

    const handleLike = async (id) => {
        console.log(id)
        try {
            const response = await fetch(`http://hrmdemo.teqova.biz/api/recognition/${id}/like`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                 fetchRecognitions();
            } else {
                console.error('Failed to update likes');
            }
        } catch (error) {
            console.error('Error updating likes:', error);
        }
    };

    return (
        <div className="h-screen flex overflow-hidden">
            {sidebarOpen && (
                <div className="h-full flex-shrink-0">
                    <SidebarLayout
                        activeModule={activeModule}
                        setActiveModule={changeModule}
                    />
                </div>
            )}

            <div className="flex-1 flex flex-col h-full">
                <header className="flex-shrink-0 bg-white border-b">
                    <div className="px-4 py-3 flex items-center justify-between">
                        <Button 
                            variant="ghost" 
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="hover:bg-gray-100"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                        <h1 className="text-xl font-semibold">{activeModule}</h1>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Recognition Form Card */}
                  { <Card className="max-w-4xl mx-auto">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-3xl font-bold">Create Recognition</CardTitle>
                            <CardDescription>Acknowledge and celebrate your colleagues' achievements</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        placeholder="Recipient's name"
                                        value={recognitionForm.recipientName}
                                        onChange={(e) => setRecognitionForm(prev => ({
                                            ...prev,
                                            recipientName: e.target.value
                                        }))}
                                        required
                                        className="w-full"
                                    />
                                    <Input
                                        placeholder="Recipient's No/ID"
                                        value={recognitionForm. recipientID}
                                        onChange={(e) => setRecognitionForm(prev => ({
                                            ...prev,
                                            recipientID: e.target.value
                                        }))}
                                        required
                                        className="w-full"
                                    />
                                    
                                    <Select
                                        value={recognitionForm.impact}
                                        onValueChange={(value) => setRecognitionForm(prev => ({
                                            ...prev,
                                            impact: value
                                        }))}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select impact level" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-200">
                                            {impactLevels.map(level => (
                                                <SelectItem key={level} value={level} className="hover:bg-gray-400">
                                                    {level}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xl font-medium text-gray-900">Recognition Type:</label>
                                    <hr/>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.entries(recognitionTypes).map(([type, Icon]) => (
                                            <button
                                                key={type}
                                                type="button"
                                                className={`shadow-lg hover:bg-gray-600 px-4 py-2 rounded font-medium ${recognitionForm.recognitionType === type ? focusClass : ""}`}
                                                onClick={() => setRecognitionForm(prev => ({
                                                    ...prev,
                                                    recognitionType: type
                                                }))}
                                            >
                                                <Icon className="h-4 w-4" />
                                                <span>{type}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xl font-medium text-gray-700">Category:</label>
                                    <hr/>
                                    <div className="flex flex-wrap gap-2">
                                        {categories.map(category => (
                                            <button
                                                key={category}
                                                type="button"
                                                className={`shadow-lg hover:bg-gray-600 px-4 py-2 rounded font-medium ${recognitionForm.category === category ? focusClass : ""}`}
                                                onClick={() => setRecognitionForm(prev => ({
                                                    ...prev,
                                                    category: category
                                                }))}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <Textarea
                                    placeholder="Write your recognition message..."
                                    value={recognitionForm.message}
                                    onChange={(e) => setRecognitionForm(prev => ({
                                        ...prev,
                                        message: e.target.value
                                    }))}
                                    className="min-h-[96px] w-full"
                                    required
                                />

                                <div className="space-y-3">
                                    <label className="text-xl font-medium text-gray-700">Tags:?</label>
                                    <hr/>
                                    <div className="flex flex-wrap gap-2">
                                        {commonTags.map(tag => (
                                            <Badge
                                                key={tag}
                                                variant={recognitionForm.tags.includes(tag) ? "default" : "outline"}
                                                className="cursor-pointer transition-colors hover:bg-gray-100 p-2"
                                                onClick={() => handleTagToggle(tag)}
                                            >
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                 
                 {  errors && errors.message &&              <Alert className="mt-4 bg-red-100 border-red-400 text-red-700">
                <AlertDescription>{errors.message}</AlertDescription>
              </Alert>}
                                <Button type="submit" className="w-full">
                                   
                                    {isLoading ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <></>
                )}
                {isLoading ? "Submitting..." : " Submit Recognition"}
                                </Button>
                            </form>

                            {showSuccess && (
                                <Alert className="bg-green-50 border-green-200 text-green-900 mt-6">
                                    <AlertDescription>Recognition submitted successfully!</AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>}

                    <Card className="max-w-4xl mx-auto shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Recognition History</CardTitle>
              <CardDescription>View and interact with recent recognitions</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {recognitionHistory.map(item => {
                const IconComponent = recognitionTypes[item.recognitionType] || Award;
                
                return (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-3">
                            <div className="flex items-center flex-wrap gap-2">
                              <IconComponent className="h-5 w-5 text-blue-500" />
                              <h4 className="font-bold">{item.recipient_name}</h4>
                              <Badge className="bg-blue-100 text-blue-800">
                                {item.category}
                              </Badge>
                              <Badge variant="outline" className="text-gray-600 bg-green-100">
                                {item.impact}
                              </Badge>
                            </div>
                            <p className="text-emerald-600 leading-relaxed">
                              {item.message}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {item.tags.map(tag => (
                                <Badge 
                                  key={tag} 
                                  variant="secondary" 
                                  className="text-xs bg-gray-100"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>{item.date}</span>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleLike(item.id)}
                                className="flex items-center gap-1 hover:text-blue-600"
                              >
                                <ThumbsUp className="h-4 w-4" />
                                <span>{item.likes}</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </CardContent>
          </Card>
                </main>
            </div>
        </div>
    );
};

export default RecognitionPage;


export async function loader() {
  const token = localStorage.getItem("token");

  if (!token) {
    return redirect("/");
  }
  const url = "http://hrmdemo.teqova.biz/api/verifyToken";
  const url2 = "http://hrmdemo.teqova.biz/api/recognitions";
  const data = { token: token };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const response2 = await fetch(url2);

   const userData = await response.json();
   const recognitions = await response2.json();


   if (userData.message === "token expired") {
    return redirect("/"); 
  }
  
 
  return {
   
    role: userData.user,
    recognitions:recognitions
  
  };
  
}
