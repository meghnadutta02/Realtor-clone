import React, { useState, useEffect } from "react";
import Slider from "../components/Slider";
import { db } from "../config/firebase";
import ListingItem from "../components/ListingItem";
import {
  getDocs,
  collection,
  query,
  orderBy,
  where,
  limit,
} from "firebase/firestore";
import { Link } from "react-router-dom";

const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getListings = async () => {
      const collectionRef = collection(db, "listings");
      const q1 = query(
        collectionRef,
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        limit(4)
      );
      const docSnap = await getDocs(q1);

      setOfferListings(() =>
        docSnap.docs.map((doc) => ({ data: doc.data(), id: doc.id }))
      );
    };
    getListings();
  }, []);
  const [rentListings, setRentListings] = useState([]);

  useEffect(() => {
    const getListings = async () => {
      const collectionRef = collection(db, "listings");
      const q1 = query(
        collectionRef,
        where("type", "==", "rent"),
        orderBy("timestamp", "desc"),
        limit(4)
      );
      const docSnap = await getDocs(q1);

      setRentListings(() =>
        docSnap.docs.map((doc) => ({ data: doc.data(), id: doc.id }))
      );
    };
    getListings();
  }, []);
  const [saleListings, setSaleListings] = useState([]);

  useEffect(() => {
    const getListings = async () => {
      const collectionRef = collection(db, "listings");
      const q1 = query(
        collectionRef,
        where("type", "==", "sale"),
        orderBy("timestamp", "desc"),
        limit(4)
      );
      const docSnap = await getDocs(q1);

      setSaleListings(() =>
        docSnap.docs.map((doc) => ({ data: doc.data(), id: doc.id }))
      );
    };
    getListings();
  }, []);

  return (
    <div className="">
      <Slider />
      <div className="max-w-7xl w-[94%] mx-auto pt-4 mt-8 space-y-7 ">
        {offerListings && offerListings.length > 0 && (
          <div className="flex flex-col items-center">
            <div className="mb-5 text-center">
              <div className="text-3xl font-semibold ">Recent Offers</div>
              <Link to="/offers">
                <span className="underline cursor-pointer text-blue-600 text-sm hover:text-blue-800 transition duration-150 ease-in-out">
                  Show more
                </span>
              </Link>
            </div>
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
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className="flex flex-col items-center">
            <div className="mb-5 text-center">
              <div className="text-3xl font-semibold ">Places for Rent</div>
              <Link to="/category/rent">
                <span className="underline cursor-pointer text-blue-600 text-sm hover:text-blue-800 transition duration-150 ease-in-out">
                  Show more
                </span>
              </Link>
            </div>
            <div className=" sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8">
              {rentListings.map((listing) => (
                <div key={listing.id} className="mb-5 ">
                  <ListingItem
                    listing={listing.data}
                    id={listing.id}
                    key={listing.id}
                    user={false}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className="flex flex-col items-center">
            <div className="mb-5 text-center">
              <div className="text-3xl font-semibold ">Places for sale</div>
              <Link to="/category/sale">
                <span className="underline cursor-pointer text-blue-600 text-sm hover:text-blue-800 transition duration-150 ease-in-out">
                  Show more
                </span>
              </Link>
            </div>
            <div className=" sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8">
              {saleListings.map((listing) => (
                <div key={listing.id} className="mb-5 ">
                  <ListingItem
                    listing={listing.data}
                    id={listing.id}
                    key={listing.id}
                    user={false}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
