import React from 'react';
import { Box, Button, Flex, Heading, Text, VStack, Icon, useColorModeValue } from '@chakra-ui/react';
import { FaCoffee, FaSearch, FaHeart, FaSignInAlt } from 'react-icons/fa';
import Link from 'next/link';
import { useSession } from 'next-auth/react';


export default function CafeQuestHomepage() {
  const { data: session } = useSession();
  const bgColor = useColorModeValue("gray.300", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const cardBgColor = useColorModeValue("gray.500", "gray.700");

  return (
    <Box bg={bgColor} minH="100vh" py={10} px={5} textAlign="center">
      {/* Header */}
      <Heading as="h1" size="2xl" mb={4} color="brown.800">
        Welcome to CafeQuest ☕
      </Heading>
      <Text fontSize="lg" color="gray.600" mb={8}>
        Discover the best cafes around you!
      </Text>

      {/* Hero Section */}
      <Box bg={cardBgColor} shadow="md" rounded="lg" p={6} mb={8} mx="auto" maxW="4xl">
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
          With personalized recommendations and user reviews, finding your next cafe is easy!
        </Text>
      </Box>

      {/* Steps Section */}
      <Flex wrap="wrap" justify="center" gap={6} mb={8}>
        {[
          { icon: FaSearch, title: "Search", description: "Search for cafes near you." },
          { icon: FaCoffee, title: "Explore", description: "Explore the list of cafes." },
          { icon: FaHeart, title: "Save Favorites", description: "Keep track of your favorite spots." },
          { icon: FaSignInAlt, title: "Enjoy", description: "Savor your coffee adventures!" }
        ].map((step, idx) => (
          <VStack
            key={idx}
            bg={cardBgColor}
            shadow="md"
            rounded="lg"
            p={4}
            w="200px"
            textAlign="center"
          >
            <Icon as={step.icon} boxSize={8} color="brown.600" mb={4} />
            <Heading as="h3" size="md" mb={2} color={textColor}>
              {step.title}
            </Heading>
            <Text color={textColor}>{step.description}</Text>
          </VStack>
        ))}
      </Flex>

      {/* Conditional CTA Section */}
      {!session && (
        <Box bg={cardBgColor} shadow="md" rounded="lg" p={6} mx="auto" maxW="4xl">
          <Heading as="h2" size="lg" color="brown.800" mb={4}>
            Join CafeQuest Today!
          </Heading>
          <Text color={textColor} mb={6}>
            Sign up or log in to start your coffee journey.
          </Text>
          <Flex justify="center" gap={4}>
            <Link href="/auth/signup" passHref>
              <Button colorScheme="brown" bg="brown.600" color="white" _hover={{ bg: "brown.700" }}>
                Sign Up
              </Button>
            </Link>
            <Link href="/auth/login" passHref>
              <Button variant="outline" colorScheme="brown">
                Log In
              </Button>
            </Link>
          </Flex>
        </Box>
      )}

      {/* Footer */}
      <Text mt={10} color="gray.500" fontSize="sm">
        &copy; 2025 CafeQuest. All rights reserved.
      </Text>
    </Box>
  );
}