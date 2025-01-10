"use client";

import {
  Box,
  VStack,
  Heading,
  Container,
  SimpleGrid,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import CafeCard from "@/components/CafeCard";

export default function SavedCafesPage() {
  const { data: session, status } = useSession();
  const [savedCafes, setSavedCafes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSavedCafes = async () => {
      try {
        const response = await fetch("/api/cafes/saved");
        const data = await response.json();
        setSavedCafes(data);
      } catch (error) {
        console.error("Error fetching saved cafes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchSavedCafes();
    }
  }, [session]);

  if (status === "loading" || isLoading) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50" py={12}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <Heading color="gray.800">My Saved Cafes</Heading>
          {savedCafes.length === 0 ? (
            <Text color="gray.600">No saved cafes yet.</Text>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {savedCafes.map((cafe) => (
                <CafeCard key={cafe.id} cafe={cafe} />
              ))}
            </SimpleGrid>
          )}
        </VStack>
      </Container>
    </Box>
  );
}
