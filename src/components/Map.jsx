"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { Center } from "@chakra-ui/react";
import Script from "next/script";

// Helper component to update the map's center dynamically
function RecenterMap({ userLocation }) {
  const map = useMap();

  useEffect(() => {
    if (userLocation) {
      map.setView(userLocation, 13); // Update the map's center and keep the zoom level
    }
  }, [userLocation, map]);

  return null;
}

function Map({ userLocation }) {
  const defaultPosition = [51.505, -0.09]; // Default to London

  return (
    <>
      {/* Dynamically load Leaflet JS */}
      <Script
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        crossOrigin=""
      />
      <Center>
        <MapContainer
          center={userLocation || defaultPosition} // Initial center (default or user)
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {userLocation && <Marker position={userLocation} />}{" "}
          {/* Add marker */}
          <RecenterMap userLocation={userLocation} />{" "}
          {/* Dynamically recenter map */}
        </MapContainer>
      </Center>
    </>
  );
}

export default Map;
