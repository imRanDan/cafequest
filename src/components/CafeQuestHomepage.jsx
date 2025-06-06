"use client";
import React from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaCoffee, FaSearch } from "react-icons/fa";
import Link from "next/link";
import Footer from "./Footer";
import { motion } from "framer-motion";

const MotionBox = motion.create(Box);
const MotionVStack = motion.create(VStack);
const MotionHeading = motion.create(Heading);
const MotionText = motion.create(Text);
const MotionButton = motion.create(Button);

export default function CafeQuestHomepage() {
  const bgColor = useColorModeValue("gray.300", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const cardBgColor = useColorModeValue("gray.500", "gray.700");

  return (
    <Flex direction="column" minH="100vh" bg={bgColor}>
      <Box flex="1" py={6} px={5} textAlign="center">
        <MotionHeading
          as="h1"
          size="2xl"
          mb={4}
          color="brown.800"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Welcome to CafeQuest ☕
        </MotionHeading>

        <MotionText
          fontSize="lg"
          color="gray.600"
          mb={8}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Discover the best cafes around you!
        </MotionText>

        <MotionBox
          bg={cardBgColor}
          shadow="md"
          rounded="lg"
          p={6}
          mx="auto"
          maxW="4xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Heading as="h2" size="lg" mb={4} color={textColor}>
            What is CafeQuest?
          </Heading>
          <Text color={textColor} mb={6}>
            CafeQuest is your ultimate guide to discovering the best cafes around you.
          </Text>
          <Heading as="h2" size="lg" mb={4} color={textColor}>
            Why CafeQuest?
          </Heading>
          <Text color={textColor}>
            Find great cafes in your area with our easy-to-use search!
          </Text>
        </MotionBox>

        <Flex
          wrap="wrap"
          justify="center"
          gap={6}
          mt={10}
          mb={10}
        >
          {[
            {
              icon: FaSearch,
              title: "Search",
              description: "Search for cafes near you.",
            },
            {
              icon: FaCoffee,
              title: "Explore",
              description: "Explore the list of cafes.",
            },
          ].map((step, idx) => (
            <MotionVStack
              key={idx}
              bg={cardBgColor}
              shadow="md"
              rounded="lg"
              p={4}
              minW="200px"
              textAlign="center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.2, duration: 0.5 }}
            >
              <Icon as={step.icon} boxSize={8} color="brown.600" mb={4} />
              <Heading as="h3" size="md" mb={2} color={textColor}>
                {step.title}
              </Heading>
              <Text color={textColor}>{step.description}</Text>
            </MotionVStack>
          ))}
        </Flex>

        <Link href="/" passHref>
          <MotionButton
            colorScheme="teal"
            size="lg"
            mt={6}
            mb={10}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            Start Exploring
          </MotionButton>
        </Link>
      </Box>

      <Footer />
    </Flex>
  );
}
