import React from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaCoffee, FaSearch } from 'react-icons/fa';
import Link from 'next/link';
import Footer from './Footer';

export default function CafeQuestHomepage() {
  const bgColor = useColorModeValue('gray.300', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.200');
  const cardBgColor = useColorModeValue('gray.500', 'gray.700');

  return (
    <Flex direction="column" minH="100vh" bg={bgColor}>


      {/* Main Content */}
      <Box flex="1" py={6} px={5} textAlign="center">
        <Heading as="h1" size="2xl" mb={4} color="brown.800">
          Welcome to CafeQuest ☕
        </Heading>
        <Text fontSize="lg" color="gray.600" mb={8}>
          Discover the best cafes around you!
        </Text>

        <Box
          bg={cardBgColor}
          shadow="md"
          rounded="lg"
          p={6}
          mx="auto"
          maxW="4xl"
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
        </Box>

        <Flex wrap="wrap" justify="center" gap={6} mt={10} mb={10}>
          {[
            {
              icon: FaSearch,
              title: 'Search',
              description: 'Search for cafes near you.',
            },
            {
              icon: FaCoffee,
              title: 'Explore',
              description: 'Explore the list of cafes.',
            },
          ].map((step, idx) => (
            <VStack
              key={idx}
              bg={cardBgColor}
              shadow="md"
              rounded="lg"
              p={4}
              minW="200px"
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

        <Link href="/" passHref>
          <Button colorScheme="teal" size="lg" mt={6} mb={10}>
            Start Exploring
          </Button>
        </Link>
      </Box>

      {/* Footer */}
      <Footer />
    </Flex>
  );
}
