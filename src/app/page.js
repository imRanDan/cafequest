// `app/page.js` is the homepage
import { Center, ColorModeScript, Flex, Input, Text } from "@chakra-ui/react";
import theme from "./theme";
import Map from "@/components/Map";
import Head from "next/head";

export default function Home() {
  return (
    <div>
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossorigin=""
        />
      </Head>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Center display={"flex"} flexDir={"column"}>
        <Text size={"lg"}>Welcome to CafeQuest ☕</Text>
      </Center>

      <Map />
    </div>
  );
}
