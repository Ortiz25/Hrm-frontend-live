import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Network,
  Briefcase,
  Calendar,
  MapPin,
  Edit,
  Check,
  X,
  Menu,
  Loader,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card.jsx";
import { Button } from "../components/ui/button.jsx";
import { Input } from "../components/ui/input.jsx";
import SidebarLayout from "../components/layout/sidebarLayout.jsx";
import { useStore } from "../store/store";
import {
  Form,
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router-dom";
import { formatDate } from "../util/helpers.jsx";
import ProfileField from "../components/profileField.jsx";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { activeModule, changeModule, changeRole } = useStore();
  const [isSaving, setIsSaving] = useState(false);
  const userDetails = useLoaderData();
  const data = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (data?.message === "Profile updated") {
      setUser(data?.user[0]);
      setIsEditing(!isEditing);
    }
  }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const data = { token: token };

      try {
        const url = "https://hrmbackend.livecrib.pro/api/profile";

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

        const { result } = await response.json();

        // Set the user state with the fetched or mock data
        setUser(result[0]);
        changeRole(userDetails.role);

        // Update the module
        changeModule("Profile");
      } catch (error) {
        console.error("Error fetching the profile:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run only on mount

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {sidebarOpen && (
        <SidebarLayout
          activeModule={activeModule}
          setActiveModule={changeModule}
        />
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
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
        <div className="flex-1 overflow-auto py-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Form method="post">
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 text-white p-6">
                  <h2 className="text-3xl font-bold text-center">
                    User Profile
                  </h2>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <ProfileField
                      icon={User}
                      label="Name"
                      value={`${user?.first_name} ${user?.last_name}`}
                      isEditing={isEditing}
                      name="name"
                    />
                    <ProfileField
                      icon={Mail}
                      label="Email"
                      value={userDetails?.email}
                      isEditing={false}
                    />
                    <ProfileField
                      icon={Phone}
                      label="Phone"
                      value={user?.phone_number}
                      isEditing={isEditing}
                      name="phone_number"
                    />
                    <ProfileField
                      icon={Network}
                      label="Position"
                      value={user?.position}
                      isEditing={false}
                    />
                    <ProfileField
                      icon={Briefcase}
                      label="Department"
                      value={user?.department}
                      isEditing={false}
                    />
                    <ProfileField
                      icon={Calendar}
                      label="Join Date"
                      value={new Date(user?.hire_date).toLocaleDateString()}
                      isEditing={false}
                    />
                    <ProfileField
                      icon={MapPin}
                      label="Location"
                      value={user?.location}
                      isEditing={isEditing}
                      name="location"
                    />
                  </div>
                  <div className="mt-8 flex justify-end space-x-4">
                    {isEditing ? (
                      <>
                        <Button
                          type="submit"
                          className="bg-green-500 hover:bg-green-600"
                        >
                          {isSubmitting ? (
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="mr-2" size={16} />
                          )}
                          {isSubmitting
                            ? "Updating profile..."
                            : "Save Changes"}
                        </Button>
                        <Button
                          onClick={() => {
                            setIsEditing(!isEditing);
                          }}
                          variant="destructive"
                        >
                          <X className="mr-2" size={16} />
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(!isEditing);
                        }}
                        className="px-4 py-2 rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 "
                      >
                        <Edit className="mr-2" size={16} />
                        Edit Profile
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

export async function loader() {
  const token = localStorage.getItem("token");

  if (!token) {
    return redirect("/");
  }
  const url = "https://hrmbackend.livecrib.pro/api/verifyToken";
  const data = { token: token };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const userData = await response.json();

  if (userData.message === "token expired") {
    return redirect("/");
  }
  return userData.user[0];
}

export async function action({ request, params }) {
  const data = await request.formData();
  const token = localStorage.getItem("token");
  if (!token) {
    return redirect("/");
  }

  const profileData = {
    name: data.get("name"),
    location: data.get("location"),
    phoneNumber: data.get("phone_number"),
    token: token,
  };

  console.log(profileData);

  const url = "https://hrmbackend.livecrib.pro/api/updateprofile";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profileData),
  });
  const userData = await response.json();

  if (userData.message === "Profile updated") {
    return userData;
  }

  return null;
}
