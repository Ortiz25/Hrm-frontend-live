import React, { useState } from "react";
import { Shield, Eye, EyeOff } from "lucide-react";
import { Form, Link } from "react-router-dom";

const LoginPage = () => {
  const [showPassword, updateShowPassword] = useState(false);

  function handleClick() {
    if (showPassword) {
      updateShowPassword(!showPassword);
    } else {
      updateShowPassword(!showPassword);
    }
  }

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 ">
        <div className="absolute top-10 lg:left-20 flex items-center justify-center  bg-gray-100">
          <Shield className="mr-2 size-12" />
          <h1 className="text-4xl font-bold">SecureHR</h1>
        </div>

        <div className="w-full max-w-sm md:max-w-lg ">
          <Form className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 shadow-2xl ">
            <h1 className="text-center p-4 text-4xl font-semibold">Login</h1>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-lg font-bold mb-2"
                for="username"
              >
                Username:
              </label>
              <input
                className="shadow appearance-none border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:border-blue-400 focus:outline-none focus:shadow-outline"
                id="username"
                name="username"
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="relative mb-6 ">
              <label
                className="block text-gray-700 text-lg font-bold mb-2"
                for="password"
              >
                Password:
              </label>
              <input
                className="shadow appearance-none border-2 focus:border-blue-400 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="password"
                required
                minLength="8"
              />
              <p className="text-red-500 text-sm italic">
                Click sign-in to Demo the APP.
              </p>
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
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
              >
                <Link to="/dashboard"> Sign In</Link>
              </button>
              <Link
                className="inline-block align-baseline font-bold text-md text-blue-500 hover:text-blue-800"
                to="/resetpassword"
              >
                Forgot Password?
              </Link>
            </div>
          </Form>
          <p className="text-center text-gray-500 text-md">
            &copy;2024 Livecrib. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
