import React, { useEffect, useState } from 'react'
import {auth} from "../config/firebase"
import { onAuthStateChanged } from 'firebase/auth'
const useAuthStatus = () => {
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
  return {loggedIn,isLoading}
}

export default useAuthStatus