import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
import {getAuth} from "firebase/auth"
const firebaseConfig = {
  apiKey: "AIzaSyDVYgwx_4Qvad71eBMhU7bbhTWe7Jd-XKA",
  authDomain: "realtor-clone-9214e.firebaseapp.com",
  projectId: "realtor-clone-9214e",
  storageBucket: "realtor-clone-9214e.appspot.com",
  messagingSenderId: "702002624980",
  appId: "1:702002624980:web:6859c568b472f631f5fe41",
  measurementId: "G-4TCZ6MHFLE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);
export const auth=getAuth(app);
