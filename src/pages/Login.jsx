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
import { Mail } from "lucide-react";
import bgImage from "../assets/login-bg.png";
import flowLogo from "../assets/FlowLogo.png";

const LoginPage = () => {
  const [showPassword, updateShowPassword] = useState(false);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const isLoading = navigation.state === "loading";
  const navigate = useNavigate();

  const errors = useActionData();

  useEffect(() => {
    if (
      errors?.email ===
      "Please reset your Registration Password, Redirecting..."
    ) {
      const timeoutId = setTimeout(() => {
        navigate("/resetpassword");
      }, 5000);
      return () => clearTimeout(timeoutId);
    }
  }, [errors]);

  function handleClick() {
    updateShowPassword(!showPassword);
  }

  return (
    <>
      <div className="relative flex items-center justify-center min-h-screen bg-gray-100"  >
        {/* Logo Section */}
        <div className="absolute top-10 lg:left-20 flex items-center justify-center bg-gray-100 rounded-full p-2 shadow-lg">
          <img src={flowLogo} className="h-24 w-24 rounded-full bg-gray-600" />
        </div>

        {/* Login Form */}
        <div className="w-full max-w-sm md:max-w-lg">
          <Form
            method="post"
            className="bg-white shadow-xl rounded-lg px-8 pt-6 pb-8"
          >
            <h1 className="text-center p-4 text-4xl font-semibold">Login</h1>

            {/* Username Input */}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-lg font-bold mb-2"
                htmlFor="username"
              >
                Username:
              </label>
              <input
                className="shadow-sm border-2 border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative mb-6">
              <label
                className="block text-gray-700 text-lg font-bold mb-2"
                htmlFor="password"
              >
                Password:
              </label>
              <input
                className="shadow-sm border-2 border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                required
                minLength="8"
              />
              {errors && (
                <p className="text-red-500 text-md italic">{errors.email}</p>
              )}

              {/* Eye Icon for Show/Hide Password */}
              {showPassword ? (
                <EyeOff
                  className="absolute right-5 bottom-3 cursor-pointer text-gray-500"
                  onClick={handleClick}
                />
              ) : (
                <Eye
                  className="absolute right-5 bottom-3 cursor-pointer text-gray-500"
                  onClick={handleClick}
                />
              )}
            </div>

            {/* Buttons & Links */}
            <div className="flex items-center justify-between">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
                {isSubmitting || isLoading ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isSubmitting ? "Signing In..." : "Sign In"}
              </button>

              <Link
                className="text-blue-500 hover:text-blue-700 font-bold"
                to="/resetpassword"
              >
                Forgot Password?
              </Link>
            </div>
          </Form>

          {/* Footer */}
          <p className="text-center text-black text-md mt-4">
            &copy;2025 Teqova. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;

export async function action({ request, params }) {
  const data = await request.formData();
  const errors = {};
  const loginData = {
    email: data.get("email"),
    password: data.get("password").trim(),
  };

  let url = "https://hrmbackend.teqova.biz/api/login";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });
  const resData = await response.json();
  // console.log(resData);
  if (resData.status === 404) {
    errors.email = resData.message;
    return errors;
  }
  if (resData.status === 401) {
    errors.email = resData.message;
    return errors;
  }

  if (
    resData.message ===
    "Please reset your Registration Password, Redirecting..."
  ) {
    errors.email = "Please reset your Registration Password, Redirecting...";
    return errors;
  }
  console.log(resData);
  if (resData.message === "User does not exist") {
    errors.email = "User does not exist";
    return errors;
  }

  localStorage.setItem("token", resData.token);
  localStorage.setItem("name", resData.name);

  return redirect("/dashboard");
}

export async function loader() {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }
  const url = "https://hrmbackend.teqova.biz/api/verifyToken";
  const data = { token: token };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const userData = await response.json();
  console.log(userData);
  if (userData.message === "token expired") {
    return null;
  }
  return redirect("/dashboard");
}
