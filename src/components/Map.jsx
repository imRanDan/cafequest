import React, { useState, useEffect, useMemo } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import { Text, VStack, Badge, Link } from "@chakra-ui/react";
import "mapbox-gl/dist/mapbox-gl.css";
import Image from "next/image";

export default function MapComponent({ userLocation, results }) {
  const defaultLat = 51.505;
  const defaultLon = -0.09;

  const lat = userLocation?.lat ?? defaultLat;
  const lon = userLocation?.lon ?? defaultLon;

  const [viewport, setViewport] = useState({
    latitude: lat,
    longitude: lon,
    zoom: 15, //start more zoomed in
    minZoom: 12, //prevent excessive zoom out
    maxZoom: 18, // Limit maximum zoom in
  });

  useEffect(() => {
    setViewport((prevViewport) => ({
      ...prevViewport,
      latitude: lat,
      longitude: lon,
    }));
  }, [lat, lon]);

  const icon = useMemo(
    () => ({
      url: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      size: [25, 41],
      anchor: [12, 41],
      popupAnchor: [1, -34],
    }),
    []
  );

  const [selectedCafe, setSelectedCafe] = useState(null);
  const [displayLimit, setDisplayLimit] = useState(10);

  const limitedResults = results.slice(0, displayLimit);

  // Handle map movement
  const handleMapMove = (evt) => {
    console.log("Map moved:", evt);
    setViewport(evt.viewport);
    // Increase display limit when user moves the map
    if (displayLimit < results.length) {
      setDisplayLimit((prevLimit) => {
        const newLimit = Math.min(prevLimit + 10, results.length);
        console.log("New display limit:", newLimit);
        return newLimit;
      });
    }
  };

  return (
    <div style={{ width: "90%", height: "600px", position: "relative" }}>
      <Map
        {...viewport}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        onMove={handleMapMove}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >
        {limitedResults.map(
          (cafe, index) =>
            cafe.lat &&
            cafe.lon && (
              <Marker
                key={index}
                latitude={cafe.lat}
                longitude={cafe.lon}
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  setSelectedCafe(cafe);
                }}
              >
                <Image src={icon.url} alt="Marker" width={25} height={41} />
              </Marker>
            )
        )}

        {selectedCafe && (
          <Popup
            latitude={selectedCafe.lat}
            longitude={selectedCafe.lon}
            onClose={() => setSelectedCafe(null)}
            closeButton={true}
            closeOnClick={false}
            offsetTop={-30}
          >
            <VStack
              align="start"
              spacing={2}
              p={2}
              bg="white"
              borderRadius="md"
            >
              <Text fontWeight="bold" fontSize="md" color="gray.800">
                {selectedCafe.tags?.name || "Unnamed Cafe"}
              </Text>
              <Badge colorScheme="teal">{selectedCafe.tags?.amenity}</Badge>
              {selectedCafe.tags?.["addr:street"] && (
                <Text fontSize="sm" color="gray.600">
                  {selectedCafe.tags["addr:street"]}
                </Text>
              )}
              {selectedCafe.tags?.["opening_hours"] && (
                <Text fontSize="sm" color="gray.600">
                  Hours: {selectedCafe.tags["opening_hours"]}
                </Text>
              )}
              {selectedCafe.tags?.website && (
                <Link
                  href={selectedCafe.tags.website}
                  isExternal
                  color="blue.500"
                >
                  Website
                </Link>
              )}
            </VStack>
          </Popup>
        )}
      </Map>
    </div>
  );
}
