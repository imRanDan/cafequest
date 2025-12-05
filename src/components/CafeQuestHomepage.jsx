"use client";
import React from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Container,
  SimpleGrid,
  Icon,
  Stack,
  IconButton,
  useColorMode,
} from "@chakra-ui/react";
import { FaMapMarkedAlt, FaHeart, FaFilter, FaClock, FaSearchLocation, FaSun, FaMoon } from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);

export default function CafeQuestHomepage() {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  
  // Bright orange theme - always vibrant
  const orangePrimary = "#FF6B35";
  const orangeLight = "#FF8C42";
  const orangeDark = "#E55A2B";
  
  const features = [
    {
      icon: FaMapMarkedAlt,
      title: "Interactive Map",
      description: "Explore cafes on an interactive Mapbox map with real-time markers and details.",
    },
    {
      icon: FaSearchLocation,
      title: "Smart Search",
      description: "Google Places autocomplete finds cafes by city, postal code, or GPS location.",
    },
    {
      icon: FaFilter,
      title: "Smart Filters",
      description: "Hide chain cafes like Tim Hortons & Starbucks, or find late-night spots open past 9pm.",
    },
    {
      icon: FaHeart,
      title: "Save Favorites",
      description: "Bookmark your favorite cafes and access them anytime from your personal dashboard.",
    },
    {
      icon: FaClock,
      title: "Opening Hours",
      description: "See real-time opening hours from OpenStreetMap data with smart overnight parsing.",
    },
  ];

  return (
    <Box bg="white" minH="100vh" position="relative">
      {/* Theme Toggle - Floating Button */}
      <IconButton
        aria-label="Toggle theme"
        icon={isDark ? <FaSun /> : <FaMoon />}
        onClick={toggleColorMode}
        position="fixed"
        top={4}
        right={4}
        zIndex={1000}
        bg={orangePrimary}
        color="white"
        _hover={{ bg: orangeDark, transform: "scale(1.1)" }}
        borderRadius="full"
        boxShadow="lg"
        size="lg"
      />

      {/* Hero Section - Bright Orange */}
      <Box
        bg={orangePrimary}
        color="white"
        py={{ base: 24, md: 32 }}
        position="relative"
        overflow="hidden"
      >
        {/* Decorative circles */}
        <Box
          position="absolute"
          top="-100px"
          right="-100px"
          width="400px"
          height="400px"
          borderRadius="full"
          bg="whiteAlpha.200"
          filter="blur(80px)"
        />
        <Box
          position="absolute"
          bottom="-150px"
          left="-150px"
          width="500px"
          height="500px"
          borderRadius="full"
          bg="whiteAlpha.100"
          filter="blur(100px)"
        />

        <Container maxW="7xl" position="relative" zIndex={1}>
          <MotionBox
            textAlign="center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Heading
              as="h1"
              fontSize={{ base: "5xl", md: "7xl", lg: "8xl" }}
              fontWeight="900"
              mb={6}
              letterSpacing="-0.02em"
            >
              ☕ CafeQuest
            </Heading>
            <Text 
              fontSize={{ base: "xl", md: "2xl", lg: "3xl" }} 
              mb={4} 
              fontWeight="600"
              opacity={0.95}
            >
              Discover Your Next Favorite Cafe
            </Text>
            <Text 
              fontSize={{ base: "lg", md: "xl" }} 
              mb={10} 
              opacity={0.9} 
              maxW="3xl" 
              mx="auto"
              lineHeight="1.7"
            >
              Search by location, filter by your preferences, and explore local coffee spots with our interactive map powered by real-time data.
            </Text>
            <Stack
              direction={{ base: "column", sm: "row" }}
              spacing={4}
              justify="center"
            >
              <Link href="/" passHref>
                <Button
                  size="lg"
                  bg="white"
                  color={orangePrimary}
                  fontSize="lg"
                  fontWeight="700"
                  px={10}
                  py={7}
                  borderRadius="full"
                  _hover={{ 
                    bg: "gray.50", 
                    transform: "translateY(-3px)",
                    boxShadow: "xl"
                  }}
                  _active={{ transform: "translateY(0)" }}
                  transition="all 0.2s"
                  boxShadow="xl"
                >
                  Explore Cafes →
                </Button>
              </Link>
              <Link href="/signup" passHref>
                <Button
                  size="lg"
                  variant="outline"
                  borderWidth="3px"
                  borderColor="white"
                  color="white"
                  fontSize="lg"
                  fontWeight="700"
                  px={10}
                  py={7}
                  borderRadius="full"
                  _hover={{ 
                    bg: "whiteAlpha.200",
                    borderColor: "white",
                    transform: "translateY(-3px)"
                  }}
                >
                  Sign Up Free
                </Button>
              </Link>
            </Stack>
          </MotionBox>
        </Container>
      </Box>

      {/* Features Section - Clean White */}
      <Box bg="white" py={24}>
        <Container maxW="7xl">
          <MotionBox
            textAlign="center"
            mb={12}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Heading
              as="h2"
              fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
              fontWeight="800"
              mb={5}
              color="gray.900"
              letterSpacing="-0.02em"
            >
              Why CafeQuest?
            </Heading>
            <Text 
              fontSize={{ base: "lg", md: "xl" }} 
              color="gray.600" 
              maxW="2xl" 
              mx="auto"
              lineHeight="1.7"
            >
              Built with modern tech and real-world data to help you find the perfect coffee spot, every time.
            </Text>
          </MotionBox>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
            {features.map((feature, idx) => (
              <MotionBox
                key={idx}
                bg="white"
                p={10}
                borderRadius="2xl"
                borderWidth="1px"
                borderColor="gray.100"
                _hover={{ 
                  borderColor: orangePrimary,
                  boxShadow: "xl",
                  transform: "translateY(-8px)"
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                style={{ transition: "all 0.3s" }}
              >
                <Box
                  bg={`${orangePrimary}15`}
                  width="64px"
                  height="64px"
                  borderRadius="xl"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mb={6}
                >
                  <Icon
                    as={feature.icon}
                    boxSize={8}
                    color={orangePrimary}
                  />
                </Box>
                <Heading 
                  as="h3" 
                  fontSize="2xl" 
                  fontWeight="700"
                  mb={3} 
                  color="gray.900"
                >
                  {feature.title}
                </Heading>
                <Text 
                  fontSize="md" 
                  color="gray.600"
                  lineHeight="1.7"
                >
                  {feature.description}
                </Text>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* How It Works Section - Light Gray Background */}
      <Box bg="gray.50" py={24}>
        <Container maxW="7xl">
          <MotionBox
            textAlign="center"
            mb={16}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Heading 
              as="h2" 
              fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
              fontWeight="800"
              mb={5}
              color="gray.900"
              letterSpacing="-0.02em"
            >
              How It Works
            </Heading>
            <Text 
              fontSize={{ base: "lg", md: "xl" }} 
              color="gray.600"
              lineHeight="1.7"
            >
              Three simple steps to your next great cafe
            </Text>
          </MotionBox>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={12}>
            {[
              {
                step: "1",
                title: "Search or Allow Location",
                description: "Type a city, postal code, or let us use your GPS to find nearby cafes within 5km.",
              },
              {
                step: "2",
                title: "Filter & Explore",
                description: "Use filters to hide chains or find late-night spots. Click markers for details.",
              },
              {
                step: "3",
                title: "Save Your Favorites",
                description: "Sign up to bookmark cafes and access them anytime from your dashboard.",
              },
            ].map((item, idx) => (
              <MotionBox
                key={idx}
                textAlign="center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
              >
                <Box
                  bg={orangePrimary}
                  color="white"
                  borderRadius="full"
                  width="80px"
                  height="80px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="3xl"
                  fontWeight="900"
                  mx="auto"
                  mb={6}
                  boxShadow="lg"
                >
                  {item.step}
                </Box>
                <Heading 
                  as="h3" 
                  fontSize="2xl"
                  fontWeight="700"
                  mb={4}
                  color="gray.900"
                >
                  {item.title}
                </Heading>
                <Text 
                  fontSize="md" 
                  color="gray.600"
                  lineHeight="1.7"
                >
                  {item.description}
                </Text>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA Section - Bright Orange */}
      <Box
        bg={orangePrimary}
        color="white"
        py={20}
        textAlign="center"
      >
        <Container maxW="5xl">
          <Heading 
            as="h2" 
            fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
            fontWeight="900"
            mb={6}
            letterSpacing="-0.02em"
          >
            Ready to Find Your Next Cafe?
          </Heading>
          <Text 
            fontSize={{ base: "lg", md: "xl" }} 
            mb={10} 
            opacity={0.95}
            maxW="2xl"
            mx="auto"
            lineHeight="1.7"
          >
            Join coffee lovers exploring local cafes with CafeQuest
          </Text>
          <Link href="/" passHref>
            <Button
              size="lg"
              bg="white"
              color={orangePrimary}
              fontSize="xl"
              fontWeight="700"
              px={12}
              py={8}
              borderRadius="full"
              _hover={{ 
                bg: "gray.50", 
                transform: "translateY(-3px)",
                boxShadow: "2xl"
              }}
              boxShadow="xl"
            >
              Start Exploring Now →
            </Button>
          </Link>
        </Container>
      </Box>
    </Box>
  );
}
