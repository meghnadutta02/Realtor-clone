import React, { useState, useEffect } from "react";
import { db } from "../config/firebase";
import ListingItem from "../components/ListingItem";
import {
  getDocs,
  collection,
  query,
  orderBy,
  where,
  limit,
  startAfter,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
const Offers = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastItem, setLastItem] = useState(null);
  const fetchMore = async () => {
    try {
      setIsLoading(true);
      const collectionRef = collection(db, "listings");
      const q1 = query(
        collectionRef,
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        startAfter(lastItem),
        limit(4)
      );
      const docSnap = await getDocs(q1);

      if (docSnap.empty) {
        setIsLoading(false);
        toast.info("No more listings");
        return;
      }

      const listings = docSnap.docs.map((doc) => ({
        data: doc.data(),
        id: doc.id,
      }));
      setOfferListings((prev) => [...prev, ...listings]);
      setLastItem(() => docSnap.docs[docSnap.docs.length - 1]);

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    const getListings = async () => {
      const collectionRef = collection(db, "listings");
      const q1 = query(
        collectionRef,
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        limit(8)
      );
      const docSnap = await getDocs(q1);

      setOfferListings(() =>
        docSnap.docs.map((doc) => ({ data: doc.data(), id: doc.id }))
      );
      setLastItem(() => docSnap.docs[docSnap.docs.length - 1]);

      setIsLoading(false);
    };
    getListings();
  }, []);

  if (isLoading) return <Spinner />;
  return (
    <div className="max-w-7xl w-[94%] mx-auto pt-4 mt-5 space-y-7 ">
      {offerListings && offerListings.length > 0 ? (
        <div className="flex flex-col items-center">
          <div className="text-3xl font-bold mb-5 ">Offers</div>

          <div className=" sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8">
            {offerListings.map((listing) => (
              <div key={listing.id} className="mb-5 mx-auto">
                <ListingItem
                  listing={listing.data}
                  id={listing.id}
                  key={listing.id}
                  user={false}
                />
              </div>
            ))}
          </div>
          {lastItem && (
            <div className="bg-white py-1.5 px-3 text-gray-700 border border-gray-300 mb-6 rounded-md hover:border-slate-600 transition duration-150 ease-in-out">
              <button onClick={fetchMore}>Load More</button>
            </div>
          )}
        </div>
      ) : (
       <p>No Listings</p>
      )}
    </div>
  );
};

export default Offers;
