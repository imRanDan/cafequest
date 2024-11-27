"use client";
import { useState } from "react";
import { Center } from "@chakra-ui/react";
import React from "react";

const SearchBar = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const handleSearchClick = () => {
    const nudgeTimeoutId = setTimeout(() => {
      console.log("Please allow location access for better results.");
    }, 5000);

    const geoSuccess = (position) => {
      clearTimeout(nudgeTimeoutId); //stop the nudge message
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setError(null);
    };

    const geoError = (error) => {
      clearTimeout(nudgeTimeoutId);
      switch (error.code) {
        case error.TIMEOUT:
          console.error("Location request timed out.");
          setError("Location request timed out.");
          break;
        case error.PERMISSION_DENIED:
          console.error("Location permission denied.");
          setError("Location permission denied.");
          break;
        case error.POSITION_UNAVAILABLE:
          console.error("Location unavailable.");
          setError("Location unavailable.");
          break;
        default:
          console.error("An unknown error occured.");
          setError("An unknown error occured.");
      }
    };

    //Prompt for users location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
    } else {
      setError("Geolocation is not supporte by your browser.");
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search for cafes here!"
        onFocus={handleSearchClick} //triggers on focus
        style={{ width: "100%", height: "2em" }}
      />
      {location && (
        <p>
          Your location: {location.latitude}, {location.longitude}
        </p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};
export default SearchBar;
