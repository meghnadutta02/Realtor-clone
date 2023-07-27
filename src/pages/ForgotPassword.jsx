import React, { useState } from "react";
import { auth } from "../config/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Outh from "../components/Outh";
const ForgotPassword = () => {
  const [formData, setFormData] = useState({ email: "" });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, formData.email);
      toast.success("Password reset link sent to mail");
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-email":
          toast.error("Invalid email address. Please enter a valid email.");
          break;
        case "auth/user-not-found":
          toast.error("User with the provided email not found.");
          break;
        default:
          toast.error(
            "Failed to send the password reset link. Please try again later."
          );
          break;
      }
    }
  };

  return (
    <div className="min-h-screen flex sm:mt-[10%] mt-[20%]  justify-center">
      <div className="max-w-md h-[70%] w-[80%] mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Reset Password</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
              id="email"
              onChange={handleChange}
              type="email"
              placeholder="Email"
            />
          </div>

          <div className="flex items-center justify-between text-sm sm:text-lg">
            <div className="inline-block align-baseline font-bold text-sm text-blue-500 whitespace-nowrap">
              Don't have an account?{" "}
              <Link to="/register" className="text-red-500 font-semibold">
                Register
              </Link>
            </div>
            <Link
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              to="/sign-in"
            >
              Sign in instead
            </Link>
          </div>

          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ease-in-out w-full mt-6"
            type="submit"
          >
            Send reset password link
          </button>
          <div className="text-center my-3 text-gray-400 relative">OR</div>

          <Outh />
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
