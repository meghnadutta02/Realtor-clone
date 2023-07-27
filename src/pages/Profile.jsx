import React, { useEffect } from "react";
import { useState } from "react";
import { auth, db } from "../config/firebase";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import { FcHome } from "react-icons/fc";
import { toast } from "react-toastify";
import { updateProfile } from "firebase/auth";
import ListingItem from "../components/ListingItem";
import {
  doc,
  updateDoc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
  deleteDoc,
} from "firebase/firestore";

const Profile = () => {
  const [formData, setFormData] = useState({
    email: auth.currentUser.email,
    name: auth.currentUser.displayName,
  });
  const onDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      const docRef = doc(db, "listings", id);
      await deleteDoc(docRef);
      toast.success("Your listing has been deleted successfully!");
      getListings();
    }
  };

  const [changeDetail, setChangeDetail] = useState(false);
  const handleChange = (e) => {
    setFormData({ name: e.target.value });
  };

  const navigate = useNavigate();
  const edit = async () => {
    try {
      if (auth.currentUser.displayName !== formData.name) {
        //updating displayName in firebase auth
        await updateProfile(auth.currentUser, { displayName: formData.name });
        //updating displayName in firestore db
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, { name: formData.name });
        toast.success("Profile details updated!");
      } else toast.info("No change in username");
    } catch (error) {
      toast.error("Could not update profile details");
    } finally {
      setChangeDetail(false);
    }
  };
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const logout = async () => {
    await auth.signOut();
    navigate("/");
  };
  const getListings = async () => {
    setIsLoading(true);
    const collectionRef = collection(db, "listings");

    const q = query(
      collectionRef,
      where("userRef", "==", auth.currentUser.uid),
      orderBy("timestamp", "desc")
    );
    const querySnap = await getDocs(q);
    const documents = querySnap.docs.map((doc) => ({
      data: doc.data(),
      id: doc.id,
    }));
    setListings(documents);
    setIsLoading(false);
    console.log(listings);
  };
  useEffect(() => {
    getListings();
  }, [auth.currentUser.uid]);

  return (
    <section className=" my-3">
      <h1 className="text-2xl text-center mb-3">My Profile</h1>
      <div className="bg-white rounded-md lg:w-[48%] xs:w-[72%] w-[82%] mx-auto p-3">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="name"
        >
          Name
        </label>
        <input
          className={`appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 mb-3 ${
            changeDetail && "bg-red-200 focus:border-red-500 "
          }`}
          id="name"
          value={formData.name}
          onChange={handleChange}
          type="text"
          disabled={!changeDetail}
          placeholder="name"
        />

        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="email"
        >
          Email
        </label>

        <input
          className="relative appearance-none border border-gray-300 rounded w-full py-2 mb-3 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
          id="email"
          value={formData.email}
          type="email"
          placeholder="email"
        />

        <div className="flex justify-between whitespace-nowrap text-sm sm:text-md my-4">
          <div>
            {!changeDetail ? (
              <>
                <span
                  className="text-red-600 cursor-pointer hover:text-red-700 transition duration-200 ease-in-out font-semibold "
                  onClick={() => setChangeDetail(!changeDetail)}
                >
                  Edit{" "}
                </span>
                your name
              </>
            ) : (
              <span
                className="text-red-600 cursor-pointer hover:text-red-700 transition duration-200 ease-in-out font-semibold "
                onClick={edit}
              >
                Apply change
              </span>
            )}
          </div>
          <button
            type="button"
            className="text-blue-500 hover:text-blue-700 transition duration-200 ease-in-out"
            onClick={logout}
          >
            Sign out
          </button>
        </div>
      </div>
      <div className="mx-auto lg:w-[48%] xs:w-[72%] w-[82%] bg-blue-600 text-white uppercase mt-[4%] rounded-md flex items-center justify-center shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800">
        <Link to="/create-listing" className="flex items-center py-2 gap-2">
          <FcHome className="text-3xl bg-red-200 rounded-full border-2 " />
          <span className="ml-2">Sell or Rent your home</span>
        </Link>
      </div>
      <div className="mt-8 sm:w-[96%] w-[92%] px-3 mx-auto">
        {!isLoading && listings.length > 0 && (
          <div className="flex flex-col items-center">

              <h1 className="text-3xl font-semibold mb-5">My Listings</h1>
              
          
            <div className=" sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8">
              {listings.map((listing) => (
                <div className="mb-5 ">
                  <ListingItem
                    listing={listing.data}
                    id={listing.id}
                    key={listing.id}
                    user={true}
                    onDelete={() => onDelete(listing.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Profile;
