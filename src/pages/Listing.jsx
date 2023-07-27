import React, { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { MdLocationOn } from "react-icons/md";
import { Carousel } from "react-responsive-carousel";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { BiSolidShare } from "react-icons/bi";
import { auth, db } from "../config/firebase";
import { FaBed, FaBath, FaParking, FaChair } from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router";

const Listing = () => {
  const { category, id } = useParams();
  const [formOpen, setFormOpen] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [listing, setListing] = useState(null);
  const prev = "<";
  const next = ">";
  const [uid, setUid] = useState(null);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const getListing = async () => {
      const docRef = doc(db, "listings", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setUid(docSnap.data().userRef);

        setIsLoading(false);
      } else {
        navigate("/");
        toast.error("Listing does not exist");
      }
    };
    getListing();
  }, [id, navigate]);
  useEffect(() => {
    const getUser = async () => {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setName(docSnap.data().name);
        setEmail(docSnap.data().email);
      } else {
        navigate("/");
        toast.error("Owner does not exist");
      }
    };
    if (uid) getUser();
  }, [formOpen, uid]);

  if (isLoading) return <Spinner />;

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
        fontSize: "280%",
      }}
    >
      <span>{prev}</span>
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
        fontSize: "280%",
      }}
    >
      <span>{next}</span>
    </button>
  );

  const copy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard", {
      autoClose: 1000,
    });
  };
  return (
    <div className="w-[95%] sm:w-[86%] mx-auto mt-10">
      <BiSolidShare
        className="z-50 text-gray-400 sm:text-3xl   bg-white rounded-full top-[15.5%] right-[9%]  text-2xl cursor-pointer absolute"
        onClick={copy}
      />
      <Carousel
        autoPlay
        useKeyboardArrows
        swipeable
        showThumbs={false}
        infiniteLoop
        renderArrowPrev={renderArrowPrev}
        renderArrowNext={renderArrowNext}
      >
        {listing.imgUrls.map((imgUrl) => (
          <img
            key={imgUrl}
            src={imgUrl}
            alt="Listing Slide"
            className=" sm:h-[420px]h-[320px] lg:h-[415px] object-cover overflow-hidden"
          />
        ))}
      </Carousel>
      {listing.offer}
      <div className="flex mt-10 flex-col gap-y-10 md:flex-row shadow-lg bg-white p-3 gap-x-2">
        <div className=" md:w-[60%]">
          <p className="text-2xl text-blue-900 font-semibold">
            {listing.name} - $
            {listing.offer
              ? Number(listing.discountedPrice).toLocaleString("en-US")
              : Number(listing.regularPrice).toLocaleString("en-US")}{" "}
            {listing.type === "rent" && "/ month"}
          </p>
          <div className="flex items-center space-x-1 mt-3">
            <MdLocationOn className="text-green-700 w-6 h-6" />
            <span className="font-semibold  ">{listing.address}</span>
          </div>
          <div className="flex gap-5 w-[75%] justify-start items-center">
            <p className="bg-red-700 p-1 w-full text-white text-md rounded-md my-3 font-semibold  text-center max-w-[200px]">
              {listing.type === "rent" ? "For Rent" : "For Sale"}
            </p>
            {listing.offer && (
              <p className="bg-green-700 p-1 text-white text-md rounded-md my-3 font-semibold w-full text-center max-w-[200px]">
                ${+listing.regularPrice - +listing.discountedPrice} discount
              </p>
            )}
          </div>

          <p className="mb-5 mt-2">
            <span className="font-semibold">Description - </span>
            {listing.description}
          </p>
          <div className="flex sm:flex-row flex-col justify-start gap-x-9 gap-y-5">
          <span className="flex justify-start gap-x-9">
              <span className="flex gap-2 items-center">
                <FaBed className="w-5 h-5" />
                <span className="font-semibold">
                  {+listing.rooms > 1
                    ? `${listing.rooms} Beds`
                    : listing.rooms + " Bed"}
                </span>
              </span>
              <span className="flex gap-2 justify-center items-center">
                <FaBath className="w-5 h-5" />
                <span className="font-semibold">
                  {+listing.bathrooms > 1
                    ? listing.bathrooms + " Baths"
                    : listing.bathrooms + " Bath"}
                </span>
              </span>
            </span>
            <span className="flex justify-start gap-x-9">
              <span className="flex gap-2 justify-center items-center">
                {listing.parking && (
                  <>
                    <FaParking className="w-5 h-5" />
                    <span className="font-semibold"> Parking Spot</span>
                  </>
                )}
              </span>{" "}
              <span className="flex gap-2 justify-center items-center">
                {listing.furnished && (
                  <>
                    <FaChair className="w-5 h-5" />
                    <span className="font-semibold">Furnished</span>
                  </>
                )}
              </span>
            </span>
          </div>
          {listing.userRef !== auth.currentUser?.uid && (
            <span>
              {!formOpen ? (
                <div className="flex justify-center mt-7">
                  <button
                    type="button"
                    className="text center uppercase bg-blue-600 rounded-lg text-white text-md py-2 w-[43%] hover:bg-blue-700 hover:shadow-lg transition duration-150 ease-in-out focus:bg-blue-700 focus:shadow-lg "
                    onClick={() => setFormOpen(true)}
                  >
                    Contact {listing.type === "rent" ? "landlord" : "seller"}
                  </button>
                </div>
              ) : (
                <>
                  <label
                    htmlFor="message"
                    className="block mb-2 mt-5 font-semibold text-md"
                  >
                    {name && `Send a message to ${name}`}
                  </label>
                  <textarea
                    type="text"
                    className="appearance-none border border-gray-300 rounded lg:w-[90%] w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-700 mb-4"
                    id="message"
                    placeholder="Type your message here"
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    value={message}
                    required
                  />
                  <div className="flex justify-start mb-4">
                    <a
                      href={`mailto:${email}?Subject=Listing for ${listing.name} on realtor.com&body=${message}`}
                      className=" max-w-[200px] bg-blue-500 rounded-md text-white text-md hover:bg-blue-700 hover:shadow-lg transition duration-150 ease-in-out focus:bg-blue-700 focus:shadow-lg text-center py-2 w-[43%]"
                    >
                      SEND
                    </a>
                  </div>
                </>
              )}
            </span>
          )}
        </div>
        <div className=" z-20 overflow-x-hidden sm:h-[370px] md:w-[39%] h-[200px]">
          <MapContainer
            center={[listing.geolocation.lat, listing.geolocation.lng]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[listing.geolocation.lat, listing.geolocation.lng]}
            >
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default Listing;
