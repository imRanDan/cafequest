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
  Container,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaCoffee, FaSearch } from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion";
import Footer from "@/components/Footer"; // ✅ Make sure this is imported

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);
const MotionButton = motion(Button);

export default function CafeQuestHomepage() {
  const bgColor = useColorModeValue("gray.300", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const cardBgColor = useColorModeValue("gray.500", "gray.700");

  return (
<Flex direction="column" minH="100vh" bg={bgColor}>
      {/* Main Content Area */}
      <Box flex="1">
        <Container maxW="6xl" py={10} px={6}>
          {/* Heading */}
          <Box textAlign="center" mb={10}>
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
              color="gray.400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Discover the best cafes around you!
            </MotionText>
          </Box>

          {/* What & Why Section */}
          <MotionBox
            bg={cardBgColor}
            shadow="md"
            rounded="lg"
            p={6}
            mx="auto"
            maxW="3xl"
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

          {/* Action Cards */}
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="center"
            align="stretch"
            gap={6}
            mt={10}
            mb={10}
            maxW="4xl"
            mx="auto"
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
              <MotionBox
                key={idx}
                bg={cardBgColor}
                shadow="md"
                rounded="lg"
                p={6}
                flex="1"
                minW={{ base: "100%", md: "auto" }}
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
              </MotionBox>
            ))}
          </Flex>

          {/* CTA */}
          <Box textAlign="center">
            <Link href="/" passHref>
              <MotionButton
                colorScheme="teal"
                size="lg"
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
        </Container>
      </Box>
    </Flex>
  );
}
