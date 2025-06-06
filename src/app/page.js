"use client";

import { useState, useRef } from "react";
import Head from "next/head";
import {
  Box,
  Center,
  Container,
  Flex,
  Stack,
  Switch,
  Text,
  Heading,
  Divider,
  useColorModeValue,
  Button,
} from "@chakra-ui/react";
import SearchBar from "../components/SearchBar";
import Map from "../components/Map";
import axios from "axios";
import { useToast } from "@chakra-ui/react";

export default function HomePage() {
  const [userLocation, setUserLocation] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const toast = useToast();
  const [hideTimHortons, setHideTimHortons] = useState(false);
  const [hideStarbucks, setHideStarbucks] = useState(false);
  const lastRequestTime = useRef(0);

  const cardBg = useColorModeValue("gray.100", "gray.700");

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

      <Container maxW="6xl" py={10}>
        {/* Heading */}
        <Center mb={8}>
          <Heading size="lg" textAlign="center">
            Welcome to CafeQuest ☕
          </Heading>
        </Center>

        {/* Controls Box */}
        <Box
          bg={cardBg}
          p={6}
          rounded="xl"
          shadow="md"
          maxW="lg"
          mx="auto"
          mb={10}
        >
          <Heading size="md" mb={4} color="gray.700" _dark={{ color: "gray.200" }}>
            Search & Filters
          </Heading>

          <Stack spacing={4} mb={4}>
            <Flex justify="space-between" align="center">
              <Text fontSize="sm">Hide Tim Hortons</Text>
              <Switch
                colorScheme="red"
                isChecked={hideTimHortons}
                onChange={() => setHideTimHortons((prev) => !prev)}
              />
            </Flex>

            <Flex justify="space-between" align="center">
              <Text fontSize="sm">Hide Starbucks</Text>
              <Switch
                colorScheme="red"
                isChecked={hideStarbucks}
                onChange={() => setHideStarbucks((prev) => !prev)}
              />
            </Flex>
          </Stack>

          <Divider my={4} />

          <SearchBar
            setUserLocation={setUserLocation}
            setSearchResults={setSearchResults}
            fetchCafes={fetchCafes}
          />
        </Box>

        {/* Map */}
        <Box w="100%" maxW="6xl" mx="auto" mb={6}>
          <Map
            userLocation={userLocation}
            results={searchResults}
            setUserLocation={setUserLocation}
            fetchCafes={fetchCafes}
            hideTimHortons={hideTimHortons}
            hideStarbucks={hideStarbucks}
          />
        </Box>

        {/* CTA Button (if needed) */}
        {/* {userLocation && (
          <Center>
            <Button
              colorScheme="teal"
              size="lg"
              rounded="xl"
              px={8}
              mt={4}
              onClick={() =>
                fetchCafes(userLocation.lat, userLocation.lon)
              }
            >
              Show cafes near me
            </Button>
          </Center>
        )} */}
      </Container>
    </>
  );
}
