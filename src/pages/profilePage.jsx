import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  MapPin,
  Edit,
  Menu,
  Network,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card.jsx";
import { Button } from "../components/ui/button.jsx";
import SidebarLayout from "../components/layout/sidebarLayout.jsx";
import { useStore } from "../store/store";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { activeModule, changeModule } = useStore();

  useEffect(() => {
    // Mock user data for demonstration
    const mockUser = {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      position: "Senior Developer",
      department: "Engineering",
      joinDate: "2022-01-15",
      location: "Nairobi, Kenya",
    };
    setUser(mockUser);
    changeModule("Profile");
  }, []);

  const handleEdit = () => setIsEditing(true);

  const handleSave = () => {
    // Implement save logic here
    setIsEditing(false);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

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
          <Button
            variant="ghost"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2"
          >
            <Menu />
          </Button>
          <h1 className="text-xl font-bold">{activeModule}</h1>
        </div>

        <Card className="w-full max-w-full md:max-w-6xl mx-auto m-6 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl md:text-4xl font-bold mb-4">
              User Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 m-4">
              {/* Name Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center">
                <User className="mr-4 md:mr-6 size-14" />
                <span className="font-semibold text-xl md:text-2xl">Name:</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    className="ml-0 sm:ml-4 p-1 pl-6 border rounded"
                  />
                ) : (
                  <span className="ml-0 sm:ml-4 text-xl md:text-2xl">
                    {user.name}
                  </span>
                )}
              </div>

              {/* Email Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center">
                <Mail className="mr-4 md:mr-6 size-14" />
                <span className="font-semibold text-xl md:text-2xl">
                  Email:
                </span>
                <span className="ml-0 sm:ml-4 text-xl md:text-2xl">
                  {user.email}
                </span>
              </div>

              {/* Phone Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center">
                <Phone className="mr-4 md:mr-6 size-14" />
                <span className="font-semibold text-xl md:text-2xl">
                  Phone:
                </span>
                {isEditing ? (
                  <input
                    type="tel"
                    value={user.phone}
                    onChange={(e) =>
                      setUser({ ...user, phone: e.target.value })
                    }
                    className="ml-0 sm:ml-4 p-1 pl-6 border rounded"
                  />
                ) : (
                  <span className="ml-0 sm:ml-4 text-xl md:text-2xl">
                    {user.phone}
                  </span>
                )}
              </div>

              {/* Position Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center">
                <Network className="mr-4 md:mr-6 size-14" />
                <span className="font-semibold text-xl md:text-2xl">
                  Position:
                </span>
                <span className="ml-0 sm:ml-4 text-xl md:text-2xl">
                  {user.position}
                </span>
              </div>

              {/* Department Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center">
                <Briefcase className="mr-4 md:mr-6 size-14" />
                <span className="font-semibold text-xl md:text-2xl">
                  Department:
                </span>
                <span className="ml-0 sm:ml-4 text-xl md:text-2xl">
                  {user.department}
                </span>
              </div>

              {/* Join Date Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center">
                <Calendar className="mr-4 md:mr-6 size-14" />
                <span className="font-semibold text-xl md:text-2xl">
                  Join Date:
                </span>
                <span className="ml-0 sm:ml-4 text-xl md:text-2xl">
                  {user.joinDate}
                </span>
              </div>

              {/* Location Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center">
                <MapPin className="mr-4 md:mr-6 size-14" />
                <span className="font-semibold text-xl md:text-2xl">
                  Location:
                </span>
                {isEditing ? (
                  <input
                    type="text"
                    value={user.location}
                    onChange={(e) =>
                      setUser({ ...user, location: e.target.value })
                    }
                    className="ml-0 sm:ml-4 p-1 pl-6 border rounded"
                  />
                ) : (
                  <span className="ml-0 sm:ml-4 text-xl md:text-2xl">
                    {user.location}
                  </span>
                )}
              </div>
            </div>

            {/* Edit/Save Button */}
            <div className="mt-6">
              {isEditing ? (
                <Button
                  onClick={handleSave}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  Save Changes
                </Button>
              ) : (
                <Button
                  onClick={handleEdit}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Edit className="mr-2" size={16} />
                  Edit Profile
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
