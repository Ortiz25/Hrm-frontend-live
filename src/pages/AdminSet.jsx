import React, { useEffect, useState } from "react";
import {
  Menu,
  Moon,
  Sun,
  PlusCircle,
  Trash2,
  UserPlus,
  MoreHorizontal,
  Key,
  Edit,
  TriangleAlert,
  Loader,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Description,
  Dialog as Dialog1,
  DialogPanel as DialogPanel1,
  DialogTitle as DialogTitle1,
} from "@headlessui/react";
import { useStore } from "../store/store.jsx";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Switch } from "../components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Button1,
} from "../components/ui/dropdownMenu.jsx";
import SidebarLayout from "../components/layout/sidebarLayout";
import { AlertTriangle } from "lucide-react";
import {
  Form,
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router-dom";
import { generatePassword } from "../store/store.jsx";

const AdminSettingsModule = () => {
  const { activeModule, changeModule, disciplinaryAction, changeUser } =
    useStore();
  const [error, updateError] = useState({});
  const actionData = useActionData();
  const [isDeleting, updateDelete] = useState(false);
  const adminData = useLoaderData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const isLoading = navigation.state === "loading";
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [leaveTypes, setLeaveTypes] = useState(["Annual", "Sick", "Personal"]);
  const [newLeaveType, setNewLeaveType] = useState("");
  const [newActionType, setNewActionType] = useState("");
  const [settings, setSettings] = useState({
    autoApproveLeaves: false,
    maxConsecutiveLeaves: 14,
    notifyManagerOnLeaveRequest: true,
    enforceProgressiveDiscipline: true,
    theme: "light",
  });
  const [users, setUsers] = useState(adminData.users);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [showPassword, updateShowPassword] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserActionModalOpen, setIsUserActionModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);
  const [editUserData, setEditUserData] = useState({
    name: "",
    email: "",
    role: "User",
    password: "",
    confirmPassword: "",
  });
  const generatedPass = generatePassword();

  function handleClick() {
    updateShowPassword(!showPassword);
  }

  useEffect(() => {
    const fetchData = async () => {
      const url2 = "http://localhost:5174/api/adminsettings";
      const response2 = await fetch(url2);

      const userData = await response2.json();
      setUsers(userData.users);
    };
    if (actionData?.message === "user update succesful") {
      fetchData();
      setIsEditUserModalOpen(!isEditUserModalOpen);
    }

    if (actionData?.message === "password Mismatch") {
      updateError({ message: "password Mismatch" });
    }

    if (actionData?.message === "password update succesful") {
      fetchData();
      setIsResetPasswordModalOpen(!isResetPasswordModalOpen);
    }
  }, [actionData]);

  useEffect(() => {
    changeModule("Admin Settings");
    changeUser(adminData.role);
  }, [changeModule]);

  const handleAddLeaveType = () => {
    if (newLeaveType && !leaveTypes.includes(newLeaveType)) {
      setLeaveTypes([...leaveTypes, newLeaveType]);
      setNewLeaveType("");
    }
  };

  const handleAddActionType = () => {
    if (newActionType && !disciplinaryAction.includes(newActionType)) {
      useStore.setState({
        disciplinaryAction: [...disciplinaryAction, newActionType],
      });
      setNewActionType("");
    }
  };

  const handleDeleteUser = async (user) => {
    try {
      updateDelete(!isDeleting);
      const url = "http://localhost:5174/api/deleteuser";
      const data = { userId: user.id };
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const deleteData = await response.json();

      if (deleteData.message === "user deleted") {
        updateDelete(!isDeleting);
        setIsUserActionModalOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openUserActionModal = (user) => {
    setSelectedUser(user);
    setIsUserActionModalOpen(true);
  };

  const openEditUserModal = (user) => {
    setSelectedUser(user);
    setIsEditUserModalOpen(true);
  };

  const closeEditUserModal = () => {
    setIsEditUserModalOpen(false);
    setSelectedUser(null);
  };

  const openResetPasswordModal = (user) => {
    setSelectedUser(user);
    setIsResetPasswordModalOpen(true);
  };

  const closeResetPasswordModal = () => {
    setIsResetPasswordModalOpen(false);
    setSelectedUser(null);
  };

  const handleRemoveLeaveType = (type) => {
    setLeaveTypes(leaveTypes.filter((t) => t !== type));
  };

  const handleRemoveActionType = (type) => {
    useStore.setState({
      disciplinaryAction: disciplinaryAction.filter((t) => t !== type),
    });
  };

  const handleSettingChange = (setting, value) => {
    setSettings((prev) => ({ ...prev, [setting]: value }));
  };

  return (
    <div className={`flex h-screen`}>
      {sidebarOpen && (
        <SidebarLayout
          activeModule={activeModule}
          setActiveModule={changeModule}
        />
      )}
      <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900">
        <div className="p-4 bg-white dark:bg-gray-800 shadow-md flex justify-between items-center">
          <Button variant="ghost" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold dark:text-white">{activeModule}</h1>
        </div>
        <div className="p-6">
          <Card>
            <CardHeader>
              <CardTitle>Admin Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="leave">
                <TabsList className="grid w-full grid-cols-4 bg-gray-200">
                  <TabsTrigger value="leave">Leave</TabsTrigger>
                  <TabsTrigger value="disciplinary">Disciplinary</TabsTrigger>
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="users">Users</TabsTrigger>
                </TabsList>
                <TabsContent value="leave" className="space-y-4">
                  <h3 className="text-lg font-semibold mb-2">Leave Types</h3>
                  <ul className="space-y-2">
                    {leaveTypes.map((type) => (
                      <li
                        key={type}
                        className="flex justify-between items-center"
                      >
                        {type}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveLeaveType(type)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                  <div className="flex space-x-2">
                    <Input
                      value={newLeaveType}
                      onChange={(e) => setNewLeaveType(e.target.value)}
                      placeholder="New leave type"
                    />
                    <Button onClick={handleAddLeaveType}>
                      <PlusCircle className="h-4 w-4 mr-2" /> Add
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="disciplinary" className="space-y-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Disciplinary Action Types
                  </h3>
                  <ul className="space-y-2">
                    {disciplinaryAction?.map((type) => (
                      <li
                        key={type}
                        className="flex justify-between items-center"
                      >
                        {type}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveActionType(type)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                  <div className="flex space-x-2">
                    <Input
                      value={newActionType}
                      onChange={(e) => setNewActionType(e.target.value)}
                      placeholder="New action type"
                    />
                    <Button onClick={handleAddActionType}>
                      <PlusCircle className="h-4 w-4 mr-2" /> Add
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="general" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Auto-approve leave requests</span>
                    <Switch
                      checked={settings.autoApproveLeaves}
                      onCheckedChange={(value) =>
                        handleSettingChange("autoApproveLeaves", value)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Maximum consecutive leave days</span>
                    <Input
                      type="number"
                      value={settings.maxConsecutiveLeaves}
                      onChange={(e) =>
                        handleSettingChange(
                          "maxConsecutiveLeaves",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-20"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Notify manager on leave request</span>
                    <Switch
                      checked={settings.notifyManagerOnLeaveRequest}
                      onCheckedChange={(value) =>
                        handleSettingChange(
                          "notifyManagerOnLeaveRequest",
                          value
                        )
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Enforce progressive discipline</span>
                    <Switch
                      checked={settings.enforceProgressiveDiscipline}
                      onCheckedChange={(value) =>
                        handleSettingChange(
                          "enforceProgressiveDiscipline",
                          value
                        )
                      }
                    />
                  </div>
                </TabsContent>
                <TabsContent value="users" className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">User Management</h3>
                    <Dialog
                      open={isAddUserModalOpen}
                      onOpenChange={setIsAddUserModalOpen}
                    >
                      <DialogTrigger asChild>
                        <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                          <UserPlus className="h-4 w-4 mr-2" /> Add User
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="bg-white dark:bg-gray-800">
                        <Form method="put">
                          <DialogHeader>
                            <DialogTitle className="text-2xl text-center">
                              Add New User
                            </DialogTitle>
                            <DialogDescription className="text-center">
                              Fill in the details to add a new user to the
                              system.
                            </DialogDescription>
                          </DialogHeader>

                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-right">
                                Name
                              </Label>
                              <Input
                                id="name"
                                name="name"
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label
                                htmlFor="employee-id"
                                className="text-right"
                              >
                                Employee ID/No:
                              </Label>
                              <Input
                                id="employeeId"
                                name="employeeId"
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="email" className="text-right">
                                Email
                              </Label>
                              <Input
                                id="email"
                                type="email"
                                name="email"
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="password" className="text-right">
                                Reg Password
                              </Label>
                              <Input
                                id="password"
                                type="text"
                                name="password"
                                value={generatedPass}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="role" className="text-right">
                                Role
                              </Label>
                              <Select name="role">
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-200">
                                  <SelectItem value="employee">
                                    Employee
                                  </SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                  <SelectItem value="super_admin">
                                    Super Admin
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <button
                              type="submit"
                              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2"
                            >
                              Add User
                            </button>
                          </DialogFooter>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-lg font-bold">
                          Name
                        </TableHead>
                        <TableHead className="text-lg font-bold">
                          Email
                        </TableHead>
                        <TableHead className="text-lg font-bold">
                          Role
                        </TableHead>
                        <TableHead className="text-right text-lg font-bold">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.first_name + " " + user.last_name}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.role}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button1
                                  variant="ghost"
                                  className="h-8 w-8 p-1"
                                >
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-6 w-6" />
                                </Button1>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="bg-gray-200"
                              >
                                <DropdownMenuLabel className="font-bold text-md">
                                  Actions
                                </DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => openEditUserModal(user)}
                                  className="hover:bg-gray-400"
                                >
                                  <Edit className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="hover:bg-gray-400"
                                  onClick={() => openResetPasswordModal(user)}
                                >
                                  <Key className="mr-2 h-4 w-4" /> Reset
                                  Password
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="hover:bg-gray-400"
                                  onClick={() => openUserActionModal(user)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Disable User */}
      <Dialog1
        open={isUserActionModalOpen}
        onClose={() => {
          setIsUserActionModalOpen(!isUserActionModalOpen);
        }}
      >
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-30"
          aria-hidden="true"
        ></div>
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4 text-center">
              <AlertTriangle className="inline mr-4 size-10 text-red-500" />
              Delete User !!
            </h3>
            <p>
              Are you sure you want to delete{" "}
              <span className="text-red-500 font-bold">
                {selectedUser?.first_name + " " + selectedUser?.last_name}
              </span>
              ? This action cannot be undone !!!
            </p>
            <div className="mt-6 flex justify-between">
              <Button
                onClick={() => handleDeleteUser(selectedUser)}
                variant="destructive"
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                {isDeleting ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <></>
                )}
                {isDeleting ? "Deleting.." : "Delete User"}
              </Button>
              <Button
                variant="outlinehandleResetPassword"
                onClick={() => setIsUserActionModalOpen(false)}
                className="outline outline-offset-2 outline-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Dialog1>

      {/* Edit User */}
      <Dialog1
        open={isEditUserModalOpen}
        onClose={() => {
          setIsEditUserModalOpen(isEditUserModalOpen);
        }}
      >
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-30"
          aria-hidden="true"
        ></div>
        <Form
          method="put"
          className="fixed inset-0 flex items-center justify-center p-4"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4 text-center">Edit User !</h3>
            <p>Modify the user details below</p>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-left">
                  User ID:
                </Label>
                <Input
                  id="userId"
                  name="userId"
                  value={selectedUser?.id}
                  className="col-span-3"
                  readOnly
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-left">
                  Name:
                </Label>
                <Input
                  id="editName"
                  name="editName"
                  value={
                    selectedUser?.first_name + " " + selectedUser?.last_name
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-left">
                  Email:
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={selectedUser?.email}
                  name="email"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-role" className="text-left">
                  Role:
                </Label>
                <Select name="role">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder={selectedUser?.role} />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-200">
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                {isSubmitting || isLoading ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <></>
                )}
                {isSubmitting ? "Saving.." : "Save Changes"}
              </button>
              <Button
                variant="outline"
                onClick={closeEditUserModal}
                className="outline outline-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Form>
      </Dialog1>

      {/* Reset Password Modal */}
      <Dialog1
        open={isResetPasswordModalOpen}
        onClose={() => {
          setIsResetPasswordModalOpen(!isResetPasswordModalOpen);
        }}
      >
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-30"
          aria-hidden="true"
        ></div>
        <Form
          method="put"
          className="fixed inset-0 flex items-center justify-center p-4"
        >
          <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4 text-center">
              Reset Password !
            </h3>
            <p>
              Enter a new password for{" "}
              <span className="font-bold text-red-500">
                {selectedUser?.name}
              </span>{" "}
              .
            </p>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-left">
                  User ID:
                </Label>
                <Input
                  id="userId"
                  name="userId"
                  value={selectedUser?.id}
                  className="col-span-3"
                  readOnly
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-password" className="text-right">
                  New Password
                </Label>
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  minLength="8"
                  className="col-span-3"
                />
                {showPassword ? (
                  <EyeOff
                    className={`absolute right-9`}
                    onClick={handleClick}
                  />
                ) : (
                  <Eye
                    className={`absolute right-9
                      }`}
                    onClick={handleClick}
                  />
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="confirm-password" className="text-right">
                  Confirm Password
                </Label>
                <Input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  name="confirm-password"
                  minLength="8"
                  className="col-span-3"
                />
                {showPassword ? (
                  <EyeOff
                    className={`absolute right-9`}
                    onClick={handleClick}
                  />
                ) : (
                  <Eye
                    className={`absolute right-9 
                      }`}
                    onClick={handleClick}
                  />
                )}
              </div>
            </div>
            {error?.message === "password Mismatch" && (
              <p className="text-red-500 text-md text-bold italic text-center">
                password Missmatch !!
              </p>
            )}

            <div className="mt-6 flex justify-between">
              <button
                type="submit"
                className="bg-green-500 hover:bg-red-600 text-white px-4 py-2 rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                {isSubmitting || isLoading ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <></>
                )}
                {isSubmitting ? "Reseting.." : "Reset Password"}
              </button>
              <Button
                variant="outline"
                onClick={closeResetPasswordModal}
                className="outline outline-2"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Form>
      </Dialog1>
    </div>
  );
};

export default AdminSettingsModule;

export async function action({ request, params }) {
  const data = await request.formData();

  const adminData = {
    employeeId: data.get("employeeId"),
    name: data.get("name"),
    userId: data.get("userId"),
    editName: data.get("editName"),
    role: data.get("role"),
    email: data.get("email"),
    cpassword: data.get("confirm-password"),
    password: data.get("password"),
  };

  if (adminData.password && adminData.password !== adminData.cpassword) {
    return { message: "password Mismatch" };
  }
  let url = "http://localhost:5174/api/updateuser";
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(adminData),
  });
  const resData = await response.json();
  return resData;
}

export async function loader() {
  const token = localStorage.getItem("token");

  if (!token) {
    return redirect("/");
  }
  const url = "http://localhost:5174/api/verifyToken";
  const url2 = "http://localhost:5174/api/adminsettings";
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
  if (userData.role === "employee") {
    return redirect("/employeedashboard");
  }
  const { users, leaveTypes } = await response2.json();
  console.log(users, leaveTypes);
  if (userData.message === "token expired") {
    return redirect("/");
  }
  return { users: users, leaveTypes: leaveTypes, role: userData.role };
}
