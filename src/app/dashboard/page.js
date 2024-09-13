// `app/dashboard/page.js` is the UI for the `/dashboard` URL
import { Center, ColorModeScript, Flex, Input, Text } from "@chakra-ui/react";
import theme from "../theme";

export default function Page() {
    return (
        <div>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <Center display={"flex"} flexDir={"column"}>
                <Text>
                    This is the Dashboard
                </Text>
            </Center>
      </div>
    )
  }