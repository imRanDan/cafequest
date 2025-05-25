import React, { useState, useEffect, useMemo } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import { Text, VStack, Badge, Link, Button, Icon, Flex, Box } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { FaHeart } from "react-icons/fa";
import "mapbox-gl/dist/mapbox-gl.css";
import Image from "next/image";
import { LoadingSpinner } from "./LoadingSpinner";
import { CloseIcon } from "@chakra-ui/icons";
import Footer from "./Footer";
import { auth, db } from "@/config/firebase";
import { doc, setDoc } from "firebase/firestore";


export default function MapComponent({
  userLocation,
  results,
  setUserLocation,
  fetchCafes,
}) {
  const [userCoords, setUserCoords] = useState(null);

  useEffect(() => {
    // // comment this out when ur done with the demo
    // const isDemo = true;

    //   if (isDemo) {
    //     setUserCoords({ lat: 43.6532, lon: -79.3832 }); //Downtown Toronto
    //     return;
    //   }
    // // demo ends here!
    
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserCoords({ lat: latitude, lon: longitude });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported or window is undefined.");
    }
  }, []);

  const defaultLat = 51.505;
  const defaultLon = -0.09;

  const lat = userLocation?.lat ?? userLocation?.lat ?? defaultLat;
  const lon = userLocation?.lon ?? userLocation?.lon ?? defaultLon;

  // Validate and ensure coordinates are numbers
  const validLat = Number(lat);
  const validLon = Number(lon);

  const toast = useToast();

  // This one is ONLY used for save cafe operation
  const [isLoadingCafe, setIsLoadingCafe] = useState(false);

  // This one is for initial loading of the map and cafe data
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (results && results.length >= 0) {
      setIsLoading(false);
    }
  }, [results]);

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
    latitude: defaultLat,
    longitude: defaultLon,
    zoom: 15,
    minZoom: 12,
    maxZoom: 18,
  });

  useEffect(() => {
    if (userCoords) {
      setViewport((prev) => ({
        ...prev,
        latitude: userCoords.lat,
        longitude: userCoords.lon,
      }));
    }
  }, [userCoords]);

  //Use effect so when user searches a location in the search bar and clicks to search it will refresh the maps new location and local cafes
    useEffect(() => {
    if (userLocation?.lat && userLocation?.lon) {
      setViewport((prev) => ({
        ...prev,
        latitude: userLocation.lat,
        longitude: userLocation.lon,
        zoom: 15,
      }));
    }
  }, [userLocation]);

  //This is for the markers that you see on the map
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

  //I used this for limiting results but not sure if it worked LOL
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

  // Returns a clean address vs coords.
  const getFormattedAddress = (tags) => {
    if (!tags) return null;

    const addressParts = [];

    // Check for street address
    if (tags["addr:housenumber"] && tags["addr:street"]) {
      addressParts.push(`${tags["addr:housenumber"]} ${tags["addr:street"]}`);
    } else if (tags.address) {
      addressParts.push(tags.address);
    } else if (tags.street) {
      addressParts.push(tags.street);
    }

    // Check for additional address components
    if (tags["addr:postcode"]) addressParts.push(tags["addr:postcode"]);
    if (tags["addr:city"]) addressParts.push(tags["addr:city"]);
    if (tags["addr:suburb"]) addressParts.push(tags["addr:suburb"]);

    return addressParts.length > 0 ? addressParts.join(", ") : null;
  };

  //get opening hours --TEST
  const getOpeningHours = (tags) => {
    return tags?.opening_hours || "Opening hours not available";
  }

  //link to google maps place search --TEST
  const getGoogleMapsLink = (cafe) => {
    const name = cafe.tags?.name || "Cafe";
    const query = encodeURIComponent(`${name} near ${cafe.lat},${cafe.lon}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  }

  // longgggg handler for saving cafes and checks if user is logged in and other error handlings
  const handleSaveCafe = async (cafe) => {
    if (!cafe) return;
    try{
      setIsLoadingCafe(true);

      const user = auth.currentUser;
      if (!user) {
        toast({
          title: "Not logged in",
          description: "Please log in to save cafes.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const docRef = doc(db, "users", user.uid, "savedCafes", cafe.id.toString());
      await setDoc(docRef, {
        id: cafe.id,
        name: cafe.tags?.name,
        lat: cafe.lat,
        lon: cafe.lon,
        address: getFormattedAddress(cafe.tags),
        openingHours: getOpeningHours,
        timestamp: Date.now(),
      });

      toast({
        title: "Saved!",
        description: "Cafe has been added to your saved list.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error saving cafe:", error);
      toast({
        title: "Error saving cafe",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoadingCafe(false);
    }
  }

  return (
    <>

  <Box w="100%" maxW="6xl" mx="auto" px={4} mb={6}>
    <Box borderRadius="md" overflow="hidden" boxShadow="md" w="100%" h={["60vh", "500px"]} position="relative"> 
          {isLoading && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 1000,
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: "8px",
                padding: "20px",
              }}
            >
              <LoadingSpinner />
            </div>
          )}

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
            {userCoords && (
              <Marker latitude={userCoords.lat} longitude={userCoords.lon}>
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    backgroundColor: "red",
                    border: "2px solid white",
                    borderRadius: "50%",
                    boxShadow: "0 0 5px rgba(0, 0, 0, 0.5",
                  }}
                  title="Your general location"
                />
              </Marker>
            )}
            {/* Cafe Card info on the MAP (live info) */}
            {selectedCafe && (
              <Popup
                latitude={selectedCafe.lat}
                longitude={selectedCafe.lon}
                onClose={() => setSelectedCafe(null)}
              >
                <VStack align="start" spacing={2} position="relative" w="100%">
                  <Button
                    position="absolute"
                    right="-8px"
                    top="-8px"
                    size="sm"
                    borderRadius="full"
                    colorScheme="red"
                    onClick={() => setSelectedCafe(null)}
                    p={1}
                    minW="auto"
                    height="auto"
                  >
                    <CloseIcon boxSize={2} />
                  </Button>

                  <Text color="gray.800" fontWeight="bold">
                    {selectedCafe.tags?.name || "Unnamed Cafe"}
                  </Text>
                  <Text color="gray.800" fontSize="sm">
                    {getFormattedAddress(selectedCafe.tags) ||
                      "Address not available"}
                  </Text>
                  <Text color="gray.600" fontSize="sm">
                    {getOpeningHours(selectedCafe.tags)}
                  </Text>

                  <Link 
                    href={getGoogleMapsLink(selectedCafe)}
                    color="blue.500"
                    isExternal
                    fontSize="sm"
                    >
                      View on Google Maps
                    </Link>


                  <Button 
                    leftIcon={<FaHeart />}
                    colorScheme="pink"
                    size="sm"
                    onClick={() => handleSaveCafe(selectedCafe)}
                    isLoading={isLoadingCafe}
                  >
                    Save
                  </Button>

                </VStack>
              </Popup>
            )}
          </Map>
        </Box>

        <Flex justify="center" mt={4}>
                  <Button
                    colorScheme="teal"
                    onClick={() => {
                      if (userCoords?.lat && userCoords?.lon) {
                        // Trigger SearchBar's logic from here
                        fetchCafes(userCoords.lat, userCoords.lon); // You need to lift this up to parent first
                        setUserLocation({ lat: userCoords.lat, lon: userCoords.lon });
                      } else {
                        toast({
                          title: "Location not available",
                          description: "Make sure location is enabled",
                          status: "error",
                          duration: 3000,
                        });
                      }
                    }}
                  >
                    Find cafes near me
                  </Button>
        </Flex>
    </Box>

        <Footer/>
      </>
  );
}
