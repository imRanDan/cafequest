"use client"

import { Box, Flex, Heading, Text, useColorModeValue, Divider } from "@chakra-ui/react";


export default function HowToUse() {
  const bg = useColorModeValue("gray.50", "gray.800");
  const border = useColorModeValue("gray.200", "gray.700");

  return (
    <Flex justify="center" p={6}>
      <Box
        maxW="4xl"
        w="full"
        p={8}
        bg={bg}
        borderRadius="xl"
        borderWidth="1px"
        borderColor={border}
        boxShadow="md"
      >
        <Heading size="xl" mb={4} textAlign="center">
          How to Use CafeQuest
        </Heading>

        <Divider mb={6} />

        <Box mb={6}>
          <Heading size="md" mb={2}>
            1. Enable Your Location
          </Heading>
          <Text>
            CafeQuest uses your device's location to show cafes nearby. Make sure location access is allowed in your browser or device settings.
          </Text>
        </Box>

        <Box mb={6}>
          <Heading size="md" mb={2}>
            2. Search by Area
          </Heading>
          <Text>
            If you're planning ahead, you can search any area or city using the search bar. We'll display cafes within a 5km radius.
          </Text>
        </Box>

        <Box mb={6}>
          <Heading size="md" mb={2}>
            3. Save Your Favorites
          </Heading>
          <Text>
            When logged in, you can save cafes you like for easy access later. Your saved list is tied to your account — not just your device.
          </Text>
        </Box>

        <Box>
          <Heading size="md" mb={2}>
            4. Explore via the Map
          </Heading>
          <Text>
            Use the interactive map to click on any cafe marker and view more details. It's the fastest way to explore what’s around you.
          </Text>
        </Box>
      </Box>
    </Flex>
  );
}
