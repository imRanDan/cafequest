"use client";

import { useState, useRef } from "react";
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
  IconButton,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { FaList } from "react-icons/fa";
import LocationSearchInput from "@/components/LocationSearchInput";
import Map from "../components/Map";
import CafeListPanel from "@/components/CafeListPanel";
import axios from "axios";
import { useToast } from "@chakra-ui/react";

const orangePrimary = "#FF6B35";

export default function HomePage() {
  const [userLocation, setUserLocation] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCafeId, setSelectedCafeId] = useState(null);
  const toast = useToast();
  const [hideTimHortons, setHideTimHortons] = useState(false);
  const [hideStarbucks, setHideStarbucks] = useState(false);
  const [openLate, setOpenLate] = useState(false);
  const lastRequestTime = useRef(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

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
      
      // Simple check for late hours (9pm = 21:00)
      if (/24\s*\/\s*7/i.test(openingHours)) return true;
      const latePattern = /(\d{1,2})(?::?(\d{2}))?\s*-\s*(\d{1,2})(?::?(\d{2}))?/g;
      let match;
      while ((match = latePattern.exec(openingHours)) !== null) {
        const closeHour = parseInt(match[3], 10);
        if (closeHour >= 21 || closeHour < 6) return true; // Open past 9pm or overnight
      }
      return false;
    }
    
    return true;
  });

  const handleCafeClick = (cafe) => {
    setSelectedCafeId(cafe.id);
    // Scroll to top on mobile when panel opens
    if (isMobile) {
      onOpen();
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

      <Box bg="gray.50" minH="calc(100vh - 64px)">
        <Container maxW="full" px={0}>
          {/* Search & Filters Bar */}
          <Box
            bg={cardBg}
            borderBottomWidth="1px"
            borderBottomColor={borderColor}
            px={{ base: 4, md: 8 }}
            py={6}
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
                <Heading size="md" mb={4} color="gray.900" fontWeight="700">
                  Search & Filters
                </Heading>
                <Stack spacing={4} direction={{ base: "column", sm: "row" }} align="center">
                  <Flex justify="space-between" align="center" w={{ base: "100%", sm: "auto" }} minW="200px">
                    <Text fontSize="sm" fontWeight="600" color="gray.700">Hide Tim Hortons</Text>
                    <Switch
                      colorScheme="orange"
                      isChecked={hideTimHortons}
                      onChange={() => setHideTimHortons((prev) => !prev)}
                    />
                  </Flex>

                  <Flex justify="space-between" align="center" w={{ base: "100%", sm: "auto" }} minW="200px">
                    <Text fontSize="sm" fontWeight="600" color="gray.700">Hide Starbucks</Text>
                    <Switch
                      colorScheme="orange"
                      isChecked={hideStarbucks}
                      onChange={() => setHideStarbucks((prev) => !prev)}
                    />
                  </Flex>

                  <Flex justify="space-between" align="center" w={{ base: "100%", sm: "auto" }} minW="200px">
                    <Text fontSize="sm" fontWeight="600" color="gray.700">Open late (≥ 9pm)</Text>
                    <Switch
                      colorScheme="orange"
                      isChecked={openLate}
                      onChange={() => setOpenLate(v => !v)}
                    />
                  </Flex>
                </Stack>

                <Divider my={4} />

                <LocationSearchInput
                  onSelect={async ({ lat, lon}) => {
                    setUserLocation({ lat, lon});
                    await fetchCafes(lat, lon);
                  }}
                />
              </Box>

              {/* Mobile: Show List Button */}
              {isMobile && filteredResults.length > 0 && (
                <IconButton
                  aria-label="Show cafe list"
                  icon={<FaList />}
                  bg={orangePrimary}
                  color="white"
                  size="lg"
                  borderRadius="full"
                  onClick={onOpen}
                  _hover={{ bg: "#E55A2B" }}
                />
              )}
            </Flex>
          </Box>

          {/* Map + Side Panel Layout */}
          <Flex direction={{ base: "column", md: "row" }} h={{ base: "auto", md: "calc(100vh - 200px)" }}>
            {/* Map Section */}
            <Box
              flex="1"
              position="relative"
              h={{ base: "60vh", md: "100%" }}
              borderRightWidth={{ base: 0, md: "1px" }}
              borderRightColor={borderColor}
            >
              <Box
                w="100%"
                h="100%"
                borderRadius={{ base: 0, md: "2xl" }}
                overflow="hidden"
                m={{ base: 0, md: 4 }}
                boxShadow={{ base: "none", md: "xl" }}
                borderWidth={{ base: 0, md: "1px" }}
                borderColor={borderColor}
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

            {/* Side Panel - Desktop/Tablet */}
            {!isMobile && (
              <CafeListPanel
                cafes={filteredResults}
                onCafeClick={handleCafeClick}
                selectedCafeId={selectedCafeId}
              />
            )}
          </Flex>

          {/* Mobile Drawer */}
          {isMobile && (
            <CafeListPanel
              cafes={filteredResults}
              onCafeClick={handleCafeClick}
              selectedCafeId={selectedCafeId}
              isOpen={isOpen}
              onClose={onClose}
            />
          )}
        </Container>
      </Box>
    </>
  );
}
