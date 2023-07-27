import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import { useMediaQuery } from "react-responsive";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 640 }); // Define the breakpoint for mobile screens
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });
  }, []);

  const handleNavClick = (path) => {
    if (isMobile) {
      setShowDropdown(false);
      navigate(path);
    } else {
      navigate(path);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const styles = "font-semibold text-gray-500 py-3 text-md cursor-pointer";
  const styles1 = "font-semibold text-gray-500 py-1.5 px-1 text-sm cursor-pointer";
  return (
    <header className="border-b shadow-md sticky top-0 bg-white left-0 right-0 z-40">
      <div className="w-5/6 mx-auto flex justify-between items-center">
        <div>
          <img
            src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg"
            alt="logo"
            className="h-5 cursor-pointer"
            onClick={() => handleNavClick("/")}
          />
        </div>
        {isMobile ? (
          // For mobile screens, display the Snackbar dropdown
          <>
            <div
              className={`${
                showDropdown ? "block" : "hidden"
              } fixed top-0 left-0 right-0 bg-white border-b p-3`}
            >
              <div
                className={`${styles1} ${
                  location.pathname === "/" && "text-red-500"
                }`}
                onClick={() => handleNavClick("/")}
              >
                Home
              </div>
              <div
                className={`${styles1} ${
                  location.pathname === "/offers" &&
                  "text-red-500"
                }`}
                onClick={() => handleNavClick("/offers")}
              >
                Offers
              </div>
              {!loggedIn ? (
                <div
                  className={`${styles1} ${
                    location.pathname === "/sign-in" &&
                    "text-red-500"
                  }`}
                  onClick={() => handleNavClick("/sign-in")}
                >
                  Sign in
                </div>
              ) : (
                <div
                  className={`${styles1} p-0 ${
                    location.pathname === "/profile" &&
                    "text-red-500 "
                  }`}
                  onClick={() => handleNavClick("/profile")}
                >
                  Profile
                </div>
              )}
            </div>
            <div
              className="cursor-pointer sm:hidden"
              onClick={() => toggleDropdown()}
            >
              {/* Icon for the mobile dropdown */}
              {showDropdown ? (
                <FiX className="h-6 w-6 z-50 absolute top-5 right-5" />
              ) : (
                <FiMenu className="h-6 w-6 my-3" />
              )}
            </div>
          </>
        ) : (
          // For larger screens, display the regular Navbar
          <div className="flex md:gap-9 gap-6">
            <div
              className={`${styles} ${
                location.pathname === "/" && "border-b-[3px] border-b-red-500"
              }`}
              onClick={() => handleNavClick("/")}
            >
              Home
            </div>
            <div
              className={`${styles} ${
                location.pathname === "/offers" &&
                "border-b-[3px] border-b-red-500"
              }`}
              onClick={() => handleNavClick("/offers")}
            >
              Offers
            </div>
            {!loggedIn ? (
              <div
                className={`${styles} ${
                  location.pathname === "/sign-in" &&
                  "border-b-[3px] border-b-red-500"
                }`}
                onClick={() => handleNavClick("/sign-in")}
              >
                Sign in
              </div>
            ) : (
              <div
                className={`${styles} ${
                  location.pathname === "/profile" &&
                  "border-b-[3px] border-b-red-500"
                }`}
                onClick={() => handleNavClick("/profile")}
              >
                Profile
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
