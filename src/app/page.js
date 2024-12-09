"use client";
import { useState } from "react";
import { Center, ColorModeScript, Flex, Text } from "@chakra-ui/react";
import theme from "./theme";
import Map from "@/components/Map";
import Head from "next/head";
import SearchBar from "@/components/SearchBar";

export default function Home() {
  const [userLocation, setUserLocation] = useState(null); // State for user's location
  const [searchResults, setSearchResults] = useState([]); // State for search results

  return (
    <div>
      <Head>
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
