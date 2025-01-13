import React, { useState, useEffect, useMemo } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import { Text, VStack, Badge, Link, Button, Icon } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useToast } from "@chakra-ui/react";
import { FaHeart } from "react-icons/fa";
import "mapbox-gl/dist/mapbox-gl.css";
import Image from "next/image";

export default function MapComponent({ userLocation, results }) {
  const defaultLat = 51.505;
  const defaultLon = -0.09;

  const lat = userLocation?.lat ?? defaultLat;
  const lon = userLocation?.lon ?? defaultLon;

  // Validate and ensure coordinates are numbers
  const validLat = Number(lat);
  const validLon = Number(lon);

  const { data: session } = useSession();
  const toast = useToast();

  // Save cafe handler
  const handleSaveCafe = async (cafe) => {
    if (!session) {
      toast({
        title: "Please login to save cafes",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    try {
      const response = await fetch("/api/cafes/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cafeId: cafe.id,
          name: cafe.tags?.name,
          latitude: cafe.lat,
          longitude: cafe.lon,
        }),
      });

      if (!response.ok) throw new Error("Failed to save cafe");

      toast({
        title: "Cafe saved!",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error saving cafe",
        status: "error",
        duration: 3000,
      });
    }
  };

  // Defining max boundaries for the map (roughly)
  const maxBounds = useMemo(() => {
    if (isNaN(validLat) || isNaN(validLon)) {
      return [
        [-180, -85],
        [180, 85],
      ]; // World bounds as fallback
    }
    return [
      [validLon - 0.1, validLat - 0.1],
      [validLon + 0.1, validLat + 0.1],
    ];
  }, [validLat, validLon]);

  const [viewport, setViewport] = useState({
    latitude: validLat,
    longitude: validLon,
    zoom: 15,
    minZoom: 12,
    maxZoom: 18,
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
  // Map movement handler
  const handleMapMove = (evt) => {
    const { viewState } = evt;
    if (!viewState?.latitude || !viewState?.longitude) return;

    setViewport({
      ...viewState,
      zoom: viewState.zoom || 15,
      minZoom: 12,
      maxZoom: 18,
    });

    // Load more cafes if available
    if (displayLimit < results.length) {
      setDisplayLimit((prev) => Math.min(prev + 10, results.length));
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
          >
            <VStack align="start" spacing={2}>
              <Text fontWeight="bold">
                {selectedCafe.tags?.name || "Unnamed Cafe"}
              </Text>
              <Text fontSize="sm">
                {selectedCafe.tags?.address || "No address"}
              </Text>
              <Button
                size="sm"
                colorScheme="teal"
                leftIcon={<Icon as={FaHeart} />}
                onClick={() => handleSaveCafe(selectedCafe)}
                isDisabled={!session}
              >
                Save Cafe
              </Button>
            </VStack>
          </Popup>
        )}
      </Map>
    </div>
  );
}
