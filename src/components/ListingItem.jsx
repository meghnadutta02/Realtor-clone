import React from "react";
import Moment from "react-moment";
import { Link, useNavigate } from "react-router-dom";
import { MdLocationOn, MdModeEdit } from "react-icons/md";
import { RiDeleteBin7Fill } from "react-icons/ri";

const ListingItem = ({ listing, id, user, onDelete }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white shadow-md hover:shadow-xl rounded-md overflow-hidden transition-shadow duration-150 h-[335px] w-[314px]">
      <Link to={`/category/${listing.type}/${id}`} className="w-full h-full">
        <div className="relative">
          <img
            src={listing.imgUrls[0]}
            alt="cover image"
            className="h-[200px] w-[314px] object-cover hover:scale-105 transition-transform duration-200 ease-in"
            loading="lazy"
          />
          <Moment
            fromNow
            className="absolute top-1 left-1 z-20 uppercase text-xs font-semibold text-white bg-[#3377cc] p-[2px] rounded-sm bg-opacity-75"
          >
            {listing.timestamp?.toDate()}
          </Moment>
        </div>
      </Link>
      <div className="w-full py-2 px-3">
        <Link to={`/category/${listing.type}/${id}`}>
          <div className="flex items-center space-x-1">
            <MdLocationOn className="text-green-700 w-4 h-4" />
            <span className="font-semibold text-sm text-gray-600 truncate">
              {listing.address}
            </span>
          </div>

          <p className="font-semibold text-xl truncate">{listing.name}</p>
          <p className="text-[#457b9d] mt-2 font-semibold">
            $
            {listing.offer
              ? Number(listing.discountedPrice).toLocaleString("en-US")
              : Number(listing.regularPrice).toLocaleString("en-US")}
            {listing.type === "rent" && <span className="ml-1">/month</span>}
          </p>
        </Link>
        <div className="flex justify-between mt-2">
          <Link to={`/category/${listing.type}/${id}`}>
            <div className="flex gap-3">
              <p className="font-bold text-xs">
                {listing.rooms > 1 ? `${listing.rooms} Bedrooms` : `1 Bedroom`}
              </p>
              <p className="font-bold text-xs">
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} Baths`
                  : `1 Bath`}
              </p>
            </div>
          </Link>
          {user && (
            <div className="flex gap-2 ">
              <MdModeEdit
                className="w-4 h-4 cursor-pointer"
                onClick={() => navigate(`/edit-listing/${id}`)}
              />
              <RiDeleteBin7Fill
                className="text-red-600 w-4 h-4 cursor-pointer"
                onClick={() => onDelete(id)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingItem;
