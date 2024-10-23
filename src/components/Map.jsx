"use client";

import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useRef, useEffect, useState } from "react";
import "../styles/globals.css";

// Map's styling
export const defaultMapContainerStyle = {
  width: "100%",
  height: "80vh",
  borderRadius: "15px 0px 0px 15px",
};

// Default coordinates and options
const defaultMapCenter = {
  lat: 35.8799866,
  lng: 76.5048004,
};

const defaultMapZoom = 18;

const defaultMapOptions = {
  zoomControl: true,
  tilt: 0,
  gestureHandling: "auto",
  mapTypeId: "satellite",
};

const libraries = ["places"]; // Ensure 'places' is loaded for autocomplete

const MapComponent = () => {
  // Load the Google Maps script via the @react-google-maps/api hook
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API,
    libraries,
  });

  const inputRef = useRef(null); // Ref for the autocomplete input
  const mapRef = useRef(null); // Ref for the Google Map instance
  const [selectedLocation, setSelectedLocation] = useState(null); // State to store selected location
  const [userLocation, setUserLocation] = useState(null);
  const [cafes, setCafes] = useState([]);
  const [selectedCafe, setSelectedCafe] = useState(null);

  useEffect(() => {
    // Asks for users location on initial load
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userPos);
          if (mapRef.current) {
            mapRef.current.panTo(userPos);
            mapRef.current.setZoom(15);
          }
        },
        () => {
          console.error("Gelocation permission denied");
        }
      );
    }
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current
      );
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry && mapRef.current) {
          // Set the selected location and pan the map
          const location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };
          setSelectedLocation(location); // Update state with selected location
          mapRef.current.panTo(location); // Recenter map
          mapRef.current.setZoom(15); // Adjust zoom level
        }
      });
    }
  }),
    [isLoaded];

  useEffect(() => {
    const locationToSearch = selectedLocation || userLocation;

    if (isLoaded && mapRef.current && locationToSearch) {
      const service = new window.google.maps.places.PlacesService(
        mapRef.current
      );

      const request = {
        location: locationToSearch,
        radius: 5000, //a 5km radius
        type: "cafe",
        keyword: "local independent coffee",
      };

      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setCafes(results);
        } else {
          console.error("Error fetching nearby cafes", status);
        }
      });
    }
  }, [isLoaded, selectedLocation, userLocation]);

  const handleMarkerClick = (cafe) => {
    setSelectedCafe(cafe);
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="text"
        placeholder="Enter a location"
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <GoogleMap
        mapContainerStyle={defaultMapContainerStyle}
        center={selectedLocation || userLocation || defaultMapCenter}
        zoom={defaultMapZoom}
        options={defaultMapOptions}
        onLoad={(map) => {
          mapRef.current = map; // Store the map instance
          if (userLocation) {
            map.panTo(userLocation);
            map.setZoom(15);
          }
        }}
      >
        {/* Marker for nearby cafes */}
        {cafes.map((cafe, index) => (
          <Marker
            key={index}
            position={{
              lat: cafe.geometry.location.lat(),
              lng: cafe.geometry.location.lng(),
            }}
            title={cafe.name}
            onClick={() => handleMarkerClick(cafe)} //set selected cafe on marker through click
          />
        ))}

        {selectedLocation && <Marker position={selectedLocation} />}

        {userLocation && !selectedLocation && (
          <Marker position={userLocation} />
        )}

        {/* InfoWindow section to display cafe details */}
        {selectedCafe && (
          <InfoWindow
            position={{
              lat: selectedCafe.geometry.location.lat(),
              lng: selectedCafe.geometry.location.lng(),
            }}
            onCloseClick={() => setSelectedCafe(null)} //Clears selected cafe
          >
            <div className="info-window-content">
              <h2>{selectedCafe.name}</h2>
              <p>Rating: {selectedCafe.rating ? selectedCafe.rating : "N/A"}</p>
              <p>{selectedCafe.vicinity}</p>{" "}
              {/* this displays the cafes address */}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export { MapComponent };
