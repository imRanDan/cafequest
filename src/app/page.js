"use client";

import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import {
  Box,
  Container,
  Flex,
  Stack,
  Switch,
  Text,
  Heading,
  Divider,
  useColorModeValue,
  Button,
  SimpleGrid,
  VStack,
  HStack,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaHeart, FaMapMarkerAlt, FaClock, FaExternalLinkAlt } from "react-icons/fa";
import LocationSearchInput from "@/components/LocationSearchInput";
import Map from "../components/Map";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { auth, db } from "@/config/firebase";
import { doc, setDoc } from "firebase/firestore";

const orangePrimary = "#FF6B35";

export default function HomePage() {
  const [userLocation, setUserLocation] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCafeId, setSelectedCafeId] = useState(null);
  const toast = useToast();
  const [hideTimHortons, setHideTimHortons] = useState(false);
  const [hideStarbucks, setHideStarbucks] = useState(false);
  const [openLate, setOpenLate] = useState(false);
  const [savingCafeId, setSavingCafeId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const lastRequestTime = useRef(0);
  
  const cafesPerPage = 12;

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const cache = useRef({
    suggestions: {},
    cafes: {},
    expirationTime: 30 * 60 * 1000,
  });

  const getCacheKey = (type, query) => `${type}-${query}`;
  const getFromCache = (type, query) => {
    const key = getCacheKey(type, query);
    const cached = cache.current[type][key];
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > cache.current.expirationTime) {
      delete cache.current[type][key];
      return null;
    }
    return cached.data;
  };

  const setInCache = (type, query, data) => {
    const key = getCacheKey(type, query);
    cache.current[type][key] = {
      data,
      timestamp: Date.now(),
    };
  };

  const waitForRateLimit = async () => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime.current;
    if (timeSinceLastRequest < 1000) {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 - timeSinceLastRequest)
      );
    }
    lastRequestTime.current = Date.now();
  };

  const fetchCafes = async (latitude, longitude) => {
    const cacheKey = `${latitude},${longitude}`;
    const cachedCafes = getFromCache("cafes", cacheKey);
    if (cachedCafes) {
      setSearchResults(cachedCafes);
      return;
    }

    try {
      await waitForRateLimit();

      const query = `
        [out:json][timeout:25];
        (
          node["amenity"="cafe"](around:5000,${latitude},${longitude});
          way["amenity"="cafe"](around:5000,${latitude},${longitude});
        );
        out body;
        >;
        out skel qt;
        out meta;
      `;

      const formData = new URLSearchParams();
      formData.append("data", query);

      const response = await axios.post(
        "https://overpass-api.de/api/interpreter",
        formData.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.data?.elements) {
        setSearchResults(response.data.elements);
        setInCache("cafes", cacheKey, response.data.elements);
      } else {
        throw new Error("No cafe data received");
      }
    } catch (error) {
      toast({
        title: "Error fetching cafes",
        description: "Could not find cafes in this area.",
        status: "error",
        duration: 3000,
      });
      console.error("Error fetching cafes:", error);
    }
  };

  // Filter cafes based on filters
  const filteredResults = searchResults.filter((cafe) => {
    const brand = (cafe?.tags?.brand || '').toLowerCase();
    const name = (cafe?.tags?.name || '').toLowerCase();

    if (hideTimHortons && name.includes("tim hortons")) return false;
    if (hideStarbucks && name.includes("starbucks")) return false;
    
    if (openLate) {
      const openingHours = cafe.tags?.opening_hours || '';
      if (!openingHours) return false;
      
      if (/24\s*\/\s*7/i.test(openingHours)) return true;
      const latePattern = /(\d{1,2})(?::?(\d{2}))?\s*-\s*(\d{1,2})(?::?(\d{2}))?/g;
      let match;
      while ((match = latePattern.exec(openingHours)) !== null) {
        const closeHour = parseInt(match[3], 10);
        if (closeHour >= 21 || closeHour < 6) return true;
      }
      return false;
    }
    
    return true;
  });

  const handleCafeClick = (cafe) => {
    setSelectedCafeId(cafe.id);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredResults.length / cafesPerPage);
  const startIndex = (currentPage - 1) * cafesPerPage;
  const endIndex = startIndex + cafesPerPage;
  const currentCafes = filteredResults.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [hideTimHortons, hideStarbucks, openLate, searchResults.length]);

  const getFormattedAddress = (tags) => {
    if (!tags) return null;
    const addressParts = [];
    if (tags["addr:housenumber"] && tags["addr:street"]) {
      addressParts.push(`${tags["addr:housenumber"]} ${tags["addr:street"]}`);
    } else if (tags.address) {
      addressParts.push(tags.address);
    }
    if (tags["addr:postcode"]) addressParts.push(tags["addr:postcode"]);
    if (tags["addr:city"]) addressParts.push(tags["addr:city"]);
    return addressParts.length > 0 ? addressParts.join(", ") : null;
  };

  const getGoogleMapsLink = (cafe) => {
    const name = cafe.tags?.name || "Cafe";
    const query = encodeURIComponent(`${name} near ${cafe.lat},${cafe.lon}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  const handleSaveCafe = async (cafe) => {
    if (!cafe) return;
    try {
      setSavingCafeId(cafe.id);
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
        openingHours: cafe.tags?.opening_hours || "Opening hours not available",
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
      setSavingCafeId(null);
    }
  };

  return (
    <>
      <Head>
        <title>CafeQuest</title>
        <meta name="description" content="Find the best cafes around you" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </Head>

      <Box bg="white" minH="calc(100vh - 64px)">
        <Container maxW="full" px={0}>
          {/* Search & Filters Bar */}
          <Box
            bg="white"
            borderBottomWidth="1px"
            borderBottomColor="gray.200"
            px={{ base: 4, md: 8 }}
            py={{ base: 4, md: 6 }}
            position="sticky"
            top="64px"
            zIndex={50}
            shadow="sm"
          >
            <Flex
              direction={{ base: "column", md: "row" }}
              align={{ base: "stretch", md: "center" }}
              justify="space-between"
              gap={4}
            >
              <Box flex="1">
                <Flex justify="space-between" align="center" mb={4}>
                  <Heading size="md" color={orangePrimary} fontWeight="700">
                    Search & Filters
                  </Heading>
                  <IconButton
                    display={{ base: "flex", md: "none" }}
                    aria-label={isFiltersOpen ? "Hide filters" : "Show filters"}
                    icon={isFiltersOpen ? <FaChevronUp /> : <FaChevronDown />}
                    size="sm"
                    variant="ghost"
                    color={orangePrimary}
                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                    _hover={{ bg: `${orangePrimary}10` }}
                  />
                </Flex>
                
                {/* Search Bar - Always Visible */}
                <Box mb={4}>
                  <LocationSearchInput
                    onSelect={async ({ lat, lon}) => {
                      setUserLocation({ lat, lon});
                      await fetchCafes(lat, lon);
                    }}
                  />
                </Box>

                {/* Filters - Collapsible on Mobile */}
                <Box display={{ base: isFiltersOpen ? "block" : "none", md: "block" }}>
                  <Stack spacing={3} direction={{ base: "column", md: "row" }} align={{ base: "stretch", md: "center" }}>
                    <Flex justify="space-between" align="center" w="100%" bg="gray.50" p={3} borderRadius="lg" borderWidth="1px" borderColor="gray.200">
                      <Text fontSize="sm" fontWeight="600" color="gray.900">Hide Tim Hortons</Text>
                      <Switch
                        colorScheme="orange"
                        isChecked={hideTimHortons}
                        onChange={() => setHideTimHortons((prev) => !prev)}
                        size="md"
                      />
                    </Flex>

                    <Flex justify="space-between" align="center" w="100%" bg="gray.50" p={3} borderRadius="lg" borderWidth="1px" borderColor="gray.200">
                      <Text fontSize="sm" fontWeight="600" color="gray.900">Hide Starbucks</Text>
                      <Switch
                        colorScheme="orange"
                        isChecked={hideStarbucks}
                        onChange={() => setHideStarbucks((prev) => !prev)}
                        size="md"
                      />
                    </Flex>

                    <Flex justify="space-between" align="center" w="100%" bg="gray.50" p={3} borderRadius="lg" borderWidth="1px" borderColor="gray.200">
                      <Text fontSize="sm" fontWeight="600" color="gray.900">Open late (≥ 9pm)</Text>
                      <Switch
                        colorScheme="orange"
                        isChecked={openLate}
                        onChange={() => setOpenLate(v => !v)}
                        size="md"
                      />
                    </Flex>
                  </Stack>
                </Box>
              </Box>
            </Flex>
          </Box>

          {/* Map Section */}
          <Box
            w="100%"
            h={{ base: "60vh", md: "70vh" }}
            minH={{ base: "400px", md: "500px" }}
            position="relative"
            borderBottomWidth="1px"
            borderBottomColor="gray.200"
            bg="gray.100"
          >
            <Box
              w="100%"
              h="100%"
              position="relative"
              overflow="hidden"
            >
              <Map
                userLocation={userLocation}
                results={searchResults}
                setUserLocation={setUserLocation}
                fetchCafes={fetchCafes}
                hideTimHortons={hideTimHortons}
                hideStarbucks={hideStarbucks}
                openLate={openLate}
                selectedCafeId={selectedCafeId}
                onCafeClick={handleCafeClick}
              />
            </Box>
          </Box>

          {/* Cafe List Under Map */}
          {filteredResults.length > 0 && (
            <Box bg="gray.50" py={8}>
              <Container maxW="7xl">
                <Flex justify="space-between" align="center" mb={6}>
                  <Heading size="lg" color={orangePrimary} fontWeight="800">
                    Nearby Cafes ({filteredResults.length})
                  </Heading>
                  <Text fontSize="sm" color="gray.600">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredResults.length)} of {filteredResults.length}
                  </Text>
                </Flex>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                  {currentCafes.map((cafe, index) => {
                    const isSelected = selectedCafeId === cafe.id;
                    const address = getFormattedAddress(cafe.tags);
                    const hours = cafe.tags?.opening_hours || "Opening hours not available";
                    
                    return (
                      <Box
                        key={`${cafe.id}-${cafe.lat}-${cafe.lon}-${index}`}
                        p={4}
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor={isSelected ? orangePrimary : "gray.200"}
                        bg={isSelected ? `${orangePrimary}05` : "white"}
                        cursor="pointer"
                        _hover={{
                          borderColor: orangePrimary,
                          bg: `${orangePrimary}08`,
                        }}
                        transition="all 0.2s"
                        onClick={() => handleCafeClick(cafe)}
                      >
                        <VStack align="stretch" spacing={2}>
                          <HStack justify="space-between" align="start">
                            <Heading size="sm" color="gray.900" fontWeight="700" flex="1">
                              {cafe.tags?.name || "Unnamed Cafe"}
                            </Heading>
                            <Button
                              size="xs"
                              leftIcon={<FaHeart />}
                              variant="outline"
                              borderColor="pink.400"
                              color="pink.500"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSaveCafe(cafe);
                              }}
                              isLoading={savingCafeId === cafe.id}
                              _hover={{ bg: "pink.50", borderColor: "pink.500" }}
                            >
                              Save
                            </Button>
                          </HStack>

                          {address && (
                            <HStack spacing={2} color="gray.600">
                              <Icon as={FaMapMarkerAlt} color={orangePrimary} boxSize={3} />
                              <Text fontSize="xs">{address}</Text>
                            </HStack>
                          )}

                          <HStack spacing={2} color="gray.600">
                            <Icon as={FaClock} color={orangePrimary} boxSize={3} />
                            <Text fontSize="xs" noOfLines={1}>{hours}</Text>
                          </HStack>

                          <Button
                            size="xs"
                            variant="outline"
                            leftIcon={<FaExternalLinkAlt />}
                            as="a"
                            href={getGoogleMapsLink(cafe)}
                            target="_blank"
                            onClick={(e) => e.stopPropagation()}
                            borderColor={orangePrimary}
                            color={orangePrimary}
                            _hover={{ bg: `${orangePrimary}10` }}
                            mt={1}
                          >
                            View on Maps
                          </Button>
                        </VStack>
                      </Box>
                    );
                  })}
                </SimpleGrid>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Flex justify="center" align="center" gap={2} mt={8}>
                    <IconButton
                      aria-label="Previous page"
                      icon={<FaChevronLeft />}
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      isDisabled={currentPage === 1}
                      bg="white"
                      borderWidth="1px"
                      borderColor="gray.300"
                      color={orangePrimary}
                      _hover={{ bg: "gray.50", borderColor: orangePrimary }}
                      _disabled={{ opacity: 0.4, cursor: "not-allowed" }}
                    />
                    
                    <HStack spacing={1}>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        // Show first page, last page, current page, and pages around current
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <Button
                              key={page}
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                              bg={currentPage === page ? orangePrimary : "white"}
                              color={currentPage === page ? "white" : "gray.700"}
                              borderWidth="1px"
                              borderColor={currentPage === page ? orangePrimary : "gray.300"}
                              _hover={{
                                bg: currentPage === page ? "#E55A2B" : "gray.50",
                                borderColor: orangePrimary,
                              }}
                              minW="40px"
                            >
                              {page}
                            </Button>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <Text key={page} color="gray.400" px={2}>
                              ...
                            </Text>
                          );
                        }
                        return null;
                      })}
                    </HStack>

                    <IconButton
                      aria-label="Next page"
                      icon={<FaChevronRight />}
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      isDisabled={currentPage === totalPages}
                      bg="white"
                      borderWidth="1px"
                      borderColor="gray.300"
                      color={orangePrimary}
                      _hover={{ bg: "gray.50", borderColor: orangePrimary }}
                      _disabled={{ opacity: 0.4, cursor: "not-allowed" }}
                    />
                  </Flex>
                )}
              </Container>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
}
