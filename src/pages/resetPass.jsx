import React, { useState } from "react";
import { Shield } from "lucide-react";
import { Form, Link } from "react-router-dom";

const RestPass = () => {
  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 ">
        <div className="absolute top-10 lg:left-20 flex items-center justify-center  bg-gray-100">
          <Shield className="mr-2 size-12" />
          <h1 className="text-4xl font-bold">SecureHR</h1>
        </div>

        <div className="w-full max-w-sm md:max-w-lg ">
          <Form className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 shadow-2xl ">
            <h1 className="text-center p-4 text-4xl font-semibold">
              Reset Password
            </h1>
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
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
              >
                Reset Password
              </button>
              <Link
                className="inline-block align-baseline font-bold text-md text-blue-500 hover:text-blue-800"
                to="/"
              >
                Sign in?
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

export default RestPass;
