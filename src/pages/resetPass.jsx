import React, { useState } from "react";
import { Shield, Mail } from "lucide-react";
import { Form, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription } from "../components/ui/alert";
import bgImage from "../assets/login-bg.png";
import flowLogo from "../assets/FlowLogo.png";

const RestPass = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "https://hrmbackend.teqova.biz/api/forgotpassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setError(data.error || "An error occurred. Please try again.");
      }
    } catch (error) {
      setError("Network error. Please try again later.", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 ">
       {/* Logo Section */}
               <div className="absolute top-10 lg:left-20 flex items-center justify-center bg-gray-100 rounded-full p-2 shadow-lg">
                 <img src={flowLogo} className="h-24 w-24 rounded-full bg-gray-600" />
               </div>

        <div className="w-full max-w-sm md:max-w-lg ">
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 shadow-2xl "
          >
            <h1 className="text-center p-4 text-4xl font-semibold">
              Reset Password
            </h1>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-lg font-bold mb-2"
                htmlFor="email"
              >
                Email:
              </label>
              <input
                className="shadow appearance-none border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:border-blue-400 focus:outline-none focus:shadow-outline"
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center"
              >
                {isLoading ? (
                  "Sending..."
                ) : (
                  <>
                    <Mail className="inline mr-2 h-6 w-6" /> Reset Password
                  </>
                )}
              </Button>
              <Link
                className="inline-block align-baseline font-bold text-md text-blue-500 hover:text-blue-800"
                to="/"
              >
                Sign in?
              </Link>
            </div>
            {message && (
              <Alert className="mt-4 bg-green-100 border-green-400 text-green-700">
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
            {error && (
              <Alert className="mt-4 bg-red-100 border-red-400 text-red-700">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </form>
          <p className="text-center text-black text-md">
            &copy;2025 Teqova. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
};

export default RestPass;
