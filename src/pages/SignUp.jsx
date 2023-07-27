import React, { useState } from "react";

import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../config/firebase";
import { doc} from "firebase/firestore";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  updateProfile,

} from "firebase/auth";
import { serverTimestamp, setDoc } from "firebase/firestore";
import Outh from "../components/Outh";

const SignUp = () => {
  const navigate=useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const handlePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
     const result= await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      updateProfile(result.user, { displayName: formData.name });
      //saving inside db
      console.log(result.user);
      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();
      const userRef = doc(db, "users", result.user.uid);
      await setDoc(userRef, formDataCopy);
      navigate("/");
    } catch (error) {
      if (error.code === "auth/weak-password") {
        toast.error("Weak password. Please choose a stronger password.");
      } else if (error.code === "auth/email-already-in-use") {
        toast.error("The email address is already in use.");
      } else if (error.code === "auth/invalid-email") {
        toast.error("Invalid email address. Please enter a valid email.");
      } else {
        toast.error("Something went wrong");
      }
    }
  };
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };
 

  return (
    <div className="min-h-screen flex sm:mt-[10%] mt-[20%]  justify-center">
      <div className="max-w-md h-[70%] w-[80%] mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Register</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              className="appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
              id="name"
              onChange={handleChange}
              type="name"
              placeholder="Full Name"
            />
          </div>
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
          <div className="mb-4 relative">
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
          <div className="text-sm">
            Have an account?{" "}
            <Link to="/sign-in" className="text-red-500 font-semibold">
              Sign In
            </Link>
          </div>
          
            <button
              className="bg-blue-500 mt-6 w-full hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ease-in-out"
              type="submit"
            >
              Sign up
            </button>

            <div className="text-center my-3 text-gray-400 relative">OR</div>
        
        <Outh />
        
        </form>
      </div>
    </div>
  );
};

export default SignUp;
