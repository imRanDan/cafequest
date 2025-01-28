import React from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import CoffeeIcon from "./CoffeeIcon";

const Hero = () => {
  const textColor = useColorModeValue("gray.800", "black"); // Darker text for light mode

  return (
    <Box p={5} textAlign="center" bg="gray.100">
      <Heading mb={4} color={textColor}>Welcome to CafeQuest ☕</Heading>
      <Text mb={4} color={textColor}>Discover the best cafes around you!</Text>
      <Button colorScheme="teal" mb={6}>Get Started</Button>

      <Flex direction="column" align="center">
        <CoffeeIcon />
        <Heading size="lg" mb={2} color={textColor}>What is CafeQuest?</Heading>
        <Text mb={4} color={textColor}>
          CafeQuest is your ultimate guide to discovering the best cafes around you.
        </Text>

        <CoffeeIcon />
        <Heading size="lg" mb={2} color={textColor}>Why CafeQuest?</Heading>
        <Text mb={4} color={textColor}>
          With personalized recommendations and user reviews, finding your next cafe is easy!
        </Text>

        <CoffeeIcon />
        <Heading size="lg" mb={2} color={textColor}>How It Works</Heading>
        <Text mb={4} color={textColor}>
          1. Search for cafes.<br />
          2. Explore the list.<br />
          3. Save your favorites.<br />
          4. Enjoy your coffee adventures!
        </Text>

        <Heading size="lg" mb={2} color={textColor}>Join CafeQuest Today!</Heading>
        <Text mb={4} color={textColor}>Sign up or log in to start your coffee journey.</Text>
        <Flex justify="center" gap={4}>
          <Button colorScheme="teal">Sign Up</Button>
          <Button variant="outline">Log In</Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Hero;
