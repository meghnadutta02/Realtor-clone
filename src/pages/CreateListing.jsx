import React, { useState } from "react";
import { AiFillInfoCircle } from "react-icons/ai";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { auth, db } from "../config/firebase";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { addDoc, collection, serverTimestamp} from "firebase/firestore";
import { useNavigate } from "react-router";
const CreateListing = () => {
  const [geolocationEnabled, setgeolocationEnabled] = useState(true);
  const navigate=useNavigate()
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    rooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    latitude: 0,
    longitude: 0,
    images: [],
  });
  const storeImage = (image) => {
    return new Promise(async (resolve, reject) => {
      try {
        const storage = getStorage();
        const filename =
          auth.currentUser.uid + "-" + image.name + "-" + uuidv4();
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);

       
        await uploadTask;

      
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        resolve(downloadURL); 
      } catch (error) {
        reject(error); 
      }
    });
  };

  const key = process.env.REACT_APP_API_KEY;

  const apiEndpoint = "https://api.opencagedata.com/geocode/v1/json";
  const onsubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.discountedPrice >= formData.regularPrice) {
      setIsLoading(false);
      toast.error("Discounted price should be less than regular price");
      return;
    }

    if (formData.images.length > 6) {
      setIsLoading(false);
      toast.error("Only six images are allowed");
      return;
    }

    let geolocation = {};

    if (geolocationEnabled) {
      try {
        const response = await axios.get(apiEndpoint, {
          params: {
            q: formData.address,
            key: key,
          },
        });
        

        if (response.data.results.length === 0) {
          setIsLoading(false);
          toast.error("Please enter a valid address.");
          return;
        } else {
          const { lat, lng } = response.data.results[0].geometry;
          geolocation.lat = lat;
          geolocation.lng = lng;
        }
      } catch (error) {
        setIsLoading(false);
        toast.error("Error fetching location");
      }
    } else {
      geolocation.lat = formData.latitude;
      geolocation.lng = formData.longitude;
    }

    let imgUrls = [];
    try {
      imgUrls = await Promise.all(
        formData.images.map((image) => storeImage(image))
      );

      const formDataCopy = {
        ...formData,
        imgUrls,
        geolocation,
        userRef:auth.currentUser.uid,
        timestamp: serverTimestamp(),
      };

      delete formDataCopy.images;
      !formData.offer && delete formDataCopy.discountedPrice;
      geolocationEnabled && delete formDataCopy.latitude;
      geolocationEnabled && delete formDataCopy.longitude;

     const docRef= await addDoc(collection(db, "listings"), formDataCopy);
      setIsLoading(false);
      toast.success("Listing created successfully");
      navigate(`/category/${formData.type}/${docRef.id}`)
    } catch (err) {
      setIsLoading(false);
      switch (err.code) {
        case "storage/canceled":
          toast.error("The upload was cancelled");
          break;
        case "storage/unknown":
          toast.error("Image upload failed due to unknown errors");
          break;

        case "storage/server-file-wrong-size":
          toast.error("Image size was greater than 2MB");
          break;
      }
    }
  };

  const onChange = (e) => {
    let boolean=null;
    if (e.target.value === "true" ) {
      boolean = true;
    }
   if(e.target.value === "false" ) {
    boolean = false;
  }

    //files
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        images: Array.from(e.target.files),
      }));
    }
    //text/boolean/number
    if (!e.target.files) {
      setFormData((prev) => ({
        ...prev,
        [e.target.id]: boolean!==null ? boolean : e.target.value,
      }));
    }
  };
  const styles =
    "  w-full rounded-sm py-1 md:text-xl shadow-md hover:shadow-lg  active:hover:shadow-lg  focus:hover:shadow-lg transition duration-150 ease-in-out font-medium";
  if (isLoading) return <Spinner />;
  return (
    <div>
      <h1 className="text-3xl text-center mt-6 font-bold">Create a Listing</h1>
      <div className="lg:w-[45%] md:w-[50%] sm:w-[65%] w-[75%] mx-auto mt-5 lg:mt-2 rounded-md p-3 lg:p-8">
        <form onSubmit={onsubmit}>
          <div className="flex justify-around gap-4 mb-10">
            <button
              type="button"
              className={`${styles} ${
                formData.type === "sale" && "bg-slate-600 text-white"
              }`}
              id="type"
              value="sale"
              onClick={onChange}
            >
              SELL
            </button>
            <button
              type="button"
              className={`${styles} ${
                formData.type === "rent" && "bg-slate-600 text-white"
              }`}
              id="type"
              value="rent"
              onClick={onChange}
            >
              RENT
            </button>
          </div>
          <label htmlFor="name" className="block mb-2 font-semibold text-lg">
            Name
          </label>
          <input
            type="text"
            className="appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-700 mb-10"
            id="name"
            placeholder="Name"
            onChange={onChange}
            value={formData.name}
            maxLength="32"
            minLength="10"
            required
          />
          <div className="flex justify-start gap-5">
            <span>
              <label
                htmlFor="rooms"
                className="block mb-2 font-semibold text-lg"
              >
                Bedrooms
              </label>
              <input
                type="number"
                id="rooms"
                placeholder="1"
                min="1"
                required
                value={formData.rooms}
                onChange={onChange}
                max="30"
                className="appearance-none border border-gray-300 rounded w-full py-2 px-6 text-gray-700 leading-tight focus:outline-none focus:border-gray-700 mb-10"
              />
            </span>
            <span>
              <label
                htmlFor="bathrooms"
                className="block mb-2 font-semibold text-lg"
              >
                Bathrooms
              </label>
              <input
                type="number"
                id="bathrooms"
                placeholder="1"
                min="1"
                required
                value={formData.bathrooms}
                max="20"
                onChange={onChange}
                className="appearance-none border border-gray-300 rounded w-full py-2 px-6 text-gray-700 leading-tight focus:outline-none focus:border-gray-700 mb-10"
              />
            </span>
          </div>
          <div className="font-semibold text-lg mb-2">Parking Spot</div>
          <div className="flex justify-around gap-4 mb-10">
            <button
              type="button"
              className={`${styles} ${
                formData.parking && "bg-slate-600 text-white"
              }`}
              id="parking"
              value={true}
              onClick={onChange}
            >
              YES
            </button>
            <button
              type="button"
              className={`${styles} ${
                !formData.parking && "bg-slate-600 text-white"
              }`}
              id="parking"
              value={false}
              onClick={onChange}
            >
              NO
            </button>
          </div>
          <div className="font-semibold text-lg mb-2">Furnished</div>
          <div className="flex justify-around gap-4 mb-10">
            <button
              type="button"
              className={`${styles} ${
                formData.furnished && "bg-slate-600 text-white"
              }`}
              id="furnished"
              value={true}
              onClick={onChange}
            >
              YES
            </button>
            <button
              type="button"
              className={`${styles} ${
                !formData.furnished && "bg-slate-600 text-white"
              }`}
              id="furnished"
              value={false}
              onClick={onChange}
            >
              NO
            </button>
          </div>
          <label htmlFor="address" className="block mb-2 font-semibold text-lg">
            Address
          </label>
          <textarea
            type="text"
            className="appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-700 mb-10"
            id="address"
            placeholder="Address"
            value={formData.address}
            onChange={onChange}
            rows={4}
            required
          />
          {!geolocationEnabled && (
            <div>
              <div className="flex justify-start gap-5">
                <span>
                  <label
                    htmlFor="latitude"
                    className="block mb-2 font-semibold text-lg"
                  >
                    Latitude
                  </label>
                  <input
                    type="number"
                    id="latitude"
                    min="-90"
                    max="90"
                    required
                    value={formData.latitude}
                    onChange={onChange}
                    className="appearance-none border border-gray-300 rounded  py-2 px-6 w-full text-gray-700 leading-tight focus:outline-none focus:border-gray-700 mb-10"
                  />
                </span>
                <span>
                  <label
                    htmlFor="longitude"
                    className="block mb-2 font-semibold text-lg"
                  >
                    Longitude
                  </label>
                  <input
                    type="number"
                    id="longitude"
                    required
                    min="-180"
                    max="180"
                    value={formData.longitude}
                    onChange={onChange}
                    className="appearance-none border border-gray-300 rounded  py-2 px-6 w-full text-gray-700 leading-tight focus:outline-none focus:border-gray-700 mb-10"
                  />
                </span>
              </div>
            </div>
          )}
          <label
            htmlFor="description"
            className="block mb-2 font-semibold text-lg"
          >
            Description
          </label>
          <textarea
            type="text"
            className="appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-gray-700 mb-10"
            id="description"
            placeholder="Description"
            onChange={onChange}
            rows={4}
            value={formData.description}
            required
          />
          <div className="font-semibold text-lg mb-2">Offer</div>
          <div className="flex justify-around gap-4 mb-10">
            <button
              type="button"
              className={`${styles} ${
                formData.offer && "bg-slate-600 text-white"
              }`}
              id="offer"
              value={true}
              onClick={onChange}
            >
              YES
            </button>
            <button
              type="button"
              className={`${styles} ${
                !formData.offer && "bg-slate-600 text-white"
              }`}
              id="offer"
              value={false}
              onClick={onChange}
            >
              NO
            </button>
          </div>

          <div>
            <label
              htmlFor="regularPrice"
              className="block mb-2 font-semibold text-lg"
            >
              Regular Price
            </label>
            <div className="flex justify-start">
              <input
                type="number"
                id="regularPrice"
                onChange={onChange}
                min="50"
                value={formData.regularPrice}
                max="50000000"
                required
                className="appearance-none border border-gray-300 rounded py-2 px-6 text-gray-700 leading-tight focus:outline-none w-1/2 focus:border-gray-700 mb-10 mr-5"
              />
              <span>$/Month</span>
            </div>
          </div>

          {formData.offer && (
            <>
              {" "}
              <label
                htmlFor="discountedPrice"
                className="block mb-2 font-semibold text-lg"
              >
                Discounted Price
              </label>
              <input
                min="50"
                max="50000000"
                type="number"
                required={formData.offer}
                value={formData.discountedPrice}
                id="discountedPrice"
                onChange={onChange}
                className="appearance-none border border-gray-300 rounded py-2 w-1/2 text-gray-700 leading-tight focus:outline-none focus:border-gray-700 mb-10"
              />
            </>
          )}

          <label htmlFor="images" className="block mb-2 font-semibold text-lg">
            Images
          </label>
          <input
            type="file"
            id="images"
            required
            accept=".jpg,.png,.jpeg"
            multiple
            onChange={onChange}
            className="appearance-none border border-gray-300 rounded py-2 px-6 text-gray-700 leading-tight focus:outline-none focus:border-gray-700 mb-2 bg-white w-full block"
          />
          <div className="text-sm text-gray-600 whitespace-nowrap flex items-center gap-2 mb-8">
            <AiFillInfoCircle className="w-4 h-4" />
            Atmost 6 images are allowed
          </div>
          <button
            type="submit"
            className="w-full text-center text-white bg-blue-500 rounded-sm py-2 shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg active:shadow-lg active:bg-blue-800 font-medium"
          >
            CREATE
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;
