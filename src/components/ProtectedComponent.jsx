import React, { useEffect, useState } from 'react'
import {auth} from "../config/firebase"
import { onAuthStateChanged } from 'firebase/auth'
import { Navigate, Outlet } from "react-router";
import Spinner from './Spinner';
const ProtectedComponent = () => {
    const [loggedIn,setLoggedIn]=useState(false)
    const [isLoading,setIsLoading]=useState(true)
    useEffect(()=>{
        onAuthStateChanged(auth,(user)=>{
            if(user){
                setLoggedIn(true)
            }
            setIsLoading(false)
        })
    },[])
    if(isLoading)
    {
       return <Spinner/>
    }
  return loggedIn ? <Outlet /> : <Navigate to="/sign-in"/>;
};

export default ProtectedComponent;
