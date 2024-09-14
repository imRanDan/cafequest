// `app/page.js` is the homepage
import { Center, ColorModeScript, Flex, Input, Text } from "@chakra-ui/react";
import theme from "./theme";

import { MapProvider } from "@/providers/map-provider";
import { MapComponent } from "@/components/Map";

export default function Home() {
    return (
        <div>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <Center display={"flex"} flexDir={"column"}>
                <Text size={"lg"}>Welcome to CafeQuest</Text>
                <Input placeholder="enter location here" width={"300px"} height={"30px"}/>
            </Center>

            <MapProvider>
                    <MapComponent/>
                </MapProvider>

      </div>
    )
  }
