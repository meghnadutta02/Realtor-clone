import React, { useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import { db } from "../config/firebase";
import Spinner from "./Spinner";
import { useNavigate } from "react-router";
const Slider = () => {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const getListings = async () => {
      const q = query(
        collection(db, "listings"),
        orderBy("timestamp", "desc"),
        limit(5)
      );
      const docSnap = await getDocs(q);
      setListings(() =>
        docSnap.docs.map((doc) => ({ data: doc.data(), id: doc.id }))
      );
      setIsLoading(false);
    };
    getListings();
  }, []);
  const renderArrowPrev = (onClickHandler, hasPrev, label) => (
    <button
      type="button"
      onClick={onClickHandler}
      title={label}
      style={{
        zIndex: 2,
        position: "absolute",
        top: "40%",
        left: 15,
        color: "rgb(148 157 165)",
        background: "transparent",
        border: "none",
        fontSize: "350%",
      }}
    >
      <span>{"<"}</span>
    </button>
  );

  const renderArrowNext = (onClickHandler, hasNext, label) => (
    <button
      type="button"
      onClick={onClickHandler}
      title={label}
      style={{
        zIndex: 2,
        position: "absolute",
        top: "40%",
        right: 15,
        color: "rgb(148 157 165)",
        background: "transparent",
        border: "none",
        fontSize: "350%",
      }}
    >
      <span>{">"}</span>
    </button>
  );
  if (isLoading) return <Spinner />;
  if (listings.length === 0) return <></>;
  return (
    <div>
      <Carousel
        autoPlay
        useKeyboardArrows
        swipeable
        showThumbs={false}
        showStatus={false}
        infiniteLoop
        renderArrowPrev={renderArrowPrev}
        renderArrowNext={renderArrowNext}
      >
        {listings.map((listing) => (
          <div
            onClick={() => navigate(`/category/${listing.data.type}/${listing.id}`)}
            key={listing.id}
             className="cursor-pointer"
          >
            <img
              src={listing.data.imgUrls[0]}
              alt="Listing Slide"
              className="sm:h-[307px] h-[180px] md:h-[370px] object-cover overflow-hidden relative "
            />
            <p className="absolute z-40 top-3 left-3 p-2 bg-opacity-6 text-[#f1faee] font-medium max-w-[90%] bg-[#457b9d] shadow-lg opacity-90 rounded-br-2xl rounded-tr-sm">
                {listing.data.name}
            </p>
            <p className="absolute z-40 bottom-3 left-3 p-2 bg-opacity-6 text-[#f1faee] font-semibold max-w-[90%] bg-red-500 shadow-lg opacity-90 rounded-br-2xl rounded-tr-sm">
            ${listing.offer
              ? Number(listing.data.discountedPrice).toLocaleString("en-US")
              : Number(listing.data.regularPrice).toLocaleString("en-US")}
                {listing.data.type==="rent" && " / month"}
            </p>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Slider;
