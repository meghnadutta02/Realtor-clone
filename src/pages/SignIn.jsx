import React, { useState } from "react";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import {auth} from "../config/firebase"
import { toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import Outh from "../components/Outh";
const SignIn = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const handlePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };
  const navigate=useNavigate();
  const onSubmit=async(e)=>{
    e.preventDefault();
    try {
      const result=await signInWithEmailAndPassword(auth,formData.email,formData.password)
      if(result.user)
      {
        navigate("/")
      }
    } catch (error) {
      switch (error.code) {
        case 'auth/invalid-email':
          toast.error('Invalid email format.');
          break;
        case 'auth/user-disabled':
          toast.error('The user account has been disabled.');
          break;
        case 'auth/user-not-found':
          toast.error('User with the provided email not found.');
          break;
        case 'auth/wrong-password':
          toast.error('Incorrect password.');
          break;
        default:
          toast.error('An error occurred during sign-in. Please try again later.');
          break;
      }
  
    }
  }
  

  return (
    <div className="min-h-screen flex sm:mt-[10%] mt-[20%]  justify-center">
      <div className="max-w-md h-[70%] w-[80%] mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Sign In</h2>
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
        <div className="mb-6 relative">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>

          <input
            className="relative appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
            id="password"
            onChange={handleChange}
            type={passwordVisible ? "text" : "password"}
            placeholder="Password"
          />

          <div
            className="absolute bottom-2 right-2 cursor-pointer"
            onClick={handlePasswordVisibility}
          >
            {passwordVisible ? (
              <RiEyeOffFill className="text-gray-500" />
            ) : (
              <RiEyeFill className="text-gray-500" />
            )}
          </div>
        </div>
        <div className="flex items-center justify-between text-sm sm:text-lg">
          <Link
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            to="/forgot-password"
          >
            Forgot Password?
          </Link>

          <div className="inline-block align-baseline font-bold text-sm text-blue-500 whitespace-nowrap">
            Don't have an account?{" "}
            <Link to="/register" className="text-red-500 font-semibold">
              Register
            </Link>
          </div>
        </div>
        <button
              className="bg-blue-500 w-full hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ease-in-out mt-6"
              type="submit"
            >
              Sign in
            </button>

            <div className="text-center my-3 text-gray-400 relative">OR</div>
        
        <Outh />
        </form>
      </div>
    </div>
  );
};

export default SignIn;
