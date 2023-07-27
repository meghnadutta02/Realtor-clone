import React from 'react'
import { auth, db } from "../config/firebase";
import { FcGoogle } from "react-icons/fc";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from 'react-router';
import { toast } from "react-toastify";
import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { serverTimestamp, setDoc } from "firebase/firestore";

const Outh = () => {
    const provider = new GoogleAuthProvider();
  const navigate = useNavigate();
  const googleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      //check if the user already exists
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
      if (!docSnap.exists()) {
        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      navigate("/");
    } catch (error) {
      if (error.code === "auth/account-exists-with-different-credential") {
        toast.error(
          "An account already exists with the same email address but different sign-in credentials."
        );
      } else if (error.code === "auth/popup-closed-by-user") {
        toast.error("The sign-in popup was closed by the user.");
      } else {
        toast.error("Something went wrong with Google authentication.");
      }
    }
  };
  return (
    <button
    className="flex items-center justify-center bg-red-400 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline  hover:bg-red-500 transition duration-200 ease-in-out w-full"
    onClick={googleAuth}
    type="button"
  >
    <FcGoogle className="mr-2 rounded-full bg-white w-5 h-5" /> Sign
    in with Google
  </button>
  )
}

export default Outh