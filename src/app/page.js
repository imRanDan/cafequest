"use client";

import { useState } from "react";
import Head from "next/head";
import { Center, Flex, Text } from "@chakra-ui/react";
import SearchBar from "../components/SearchBar";
import Map from "../components/Map";

export default function HomePage() {
  const [userLocation, setUserLocation] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  return (
    <div>
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
      <Center display={"flex"} flexDir={"column"} mb={4}>
        <Text fontSize={"2xl"}>Welcome to CafeQuest ☕</Text>
      </Center>
      <Flex direction={"column"} align={"center"} gap={4}>
        {/* Pass setSearchResults to SearchBar */}
        <SearchBar
          setUserLocation={setUserLocation}
          setSearchResults={setSearchResults}
        />
        {/* Pass both userLocation and searchResults to the Map */}
        <Map userLocation={userLocation} results={searchResults} />
      </Flex>
    </div>
  );
}
