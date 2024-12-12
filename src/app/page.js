"use client"; // Add this directive to indicate that this component uses client-side rendering.

import dynamic from "next/dynamic";
import { useState } from "react";
import { Center, ColorModeScript, Flex, Text } from "@chakra-ui/react";
import theme from "./theme";
const Map = dynamic(() => import("../components/Map"), { ssr: false }); // turn this back into regular import when in dev/coding mode
// import Map from "@/components/Map"; //swap this with the above when launching
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
