import React, { useEffect, useState } from "react";
import { Shield, Eye, EyeOff, Loader } from "lucide-react";
import {
  Form,
  Link,
  redirect,
  useActionData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import { Outlet } from "react-router-dom";
import { Alert, AlertDescription } from "../components/ui/alert";

const PasswordRecovery = () => {
  const [showPassword, updateShowPassword] = useState(false);
  const error = useActionData();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const isLoading = navigation.state === "loading";
  const isSubmitting = navigation.state === "submitting";
  // console.log(error?.message);
  function handleClick() {
    if (showPassword) {
      updateShowPassword(!showPassword);
    } else {
      updateShowPassword(!showPassword);
    }
  }

  useEffect(() => {
    if (error?.success) {
      console.log(error?.success);

      // Delay navigation for 5 seconds (5000 ms)
      const timeoutId = setTimeout(() => {
        navigate("/dashboard");
      }, 5000);

      // Clean up the timeout if the component unmounts or error changes
      return () => clearTimeout(timeoutId);
    }
  }, [error, navigate]);

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 ">
        <div className="absolute top-10 lg:left-20 flex items-center justify-center  bg-gray-100">
          <Shield className="size-12 mr-2" />
          <h1 className="text-4xl font-bold">SecureHR</h1>
        </div>

        <div className="w-full max-w-sm md:max-w-lg ">
          <Form
            method="post"
            className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 shadow-2xl "
          >
            <h1 className="text-center p-4 text-4xl font-semibold">
              Create New Password
            </h1>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-lg font-bold mb-2"
                htmlFor="username"
              >
                New Password:
              </label>
              <input
                className="shadow appearance-none border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:border-blue-400 focus:outline-none focus:shadow-outline"
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter New password"
                required
              />
            </div>
            {showPassword ? (
              <EyeOff
                className="absolute right-5 bottom-10"
                onClick={handleClick}
              />
            ) : (
              <Eye
                className="absolute right-5 bottom-10"
                onClick={handleClick}
              />
            )}
            <div className="relative mb-6 ">
              <label
                className="block text-gray-700 text-lg font-bold mb-2"
                htmlFor="password"
              >
                Retype Password:
              </label>
              <input
                className="shadow appearance-none border-2 focus:border-blue-400 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="cpassword"
                type={showPassword ? "text" : "password"}
                name="cpassword"
                placeholder="Retype New password"
                required
                minLength="8"
              />
              {error?.success && (
                <Alert className="mt-4 bg-green-100 border-green-400 text-green-700">
                  <AlertDescription>{error.success}</AlertDescription>
                </Alert>
              )}
              {error?.message && (
                <Alert className="mt-4 bg-red-100 border-red-400 text-red-700">
                  <AlertDescription>{error.message}</AlertDescription>
                </Alert>
              )}
              {showPassword ? (
                <EyeOff
                  className={`absolute right-5 ${
                    error ? "bottom-20" : "bottom-5"
                  }`}
                  onClick={handleClick}
                />
              ) : (
                <Eye
                  className={`absolute right-5 ${
                    error ? "bottom-20" : "bottom-5"
                  }`}
                  onClick={handleClick}
                />
              )}
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                {isSubmitting || isLoading ? "Reseting..." : "Reset Password"}
              </button>
              <Link
                className="inline-block align-baseline font-bold text-md text-blue-500 hover:text-blue-800"
                to="/resetpassword"
              >
                Resend Email?
              </Link>
            </div>
          </Form>
          <Outlet />
          <p className="text-center text-gray-500 text-md">
            &copy;2024 Livecrib. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
};

export default PasswordRecovery;

export async function action({ request, params }) {
  const formData = await request.formData();
  const newPassword = formData.get("password");
  const confirmPassword = formData.get("cpassword");
  const error = {};

  // Get the full URL from the request object
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  console.log(token, newPassword, confirmPassword);
  if (newPassword !== confirmPassword) {
    error.message = "Passwords don't Match !!!";
    return error;
  }
  const data = { token: token, newPassword: newPassword };
  try {
    const response = await fetch("http://localhost:5174/api/resetpassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const dataRes = await response.json();
    if (dataRes.message === "token expired") {
      error.message = "Token expired, resend reset Email";
      return error;
    }

    if (response.ok) {
      error.success = "Password Reset Successful";
      return error;
    }
  } catch (error) {
    console.log(error);
  }
  return null;
}
