"use client";

import { Box, VStack, Heading, Container } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

export default function SavedCafesPage() {
  const { data: session } = useSession();

  return (
    <Box minH="100vh" bg="gray.50" py={12}>
      <Container maxW="container.xl">
        <VStack spacing={6}>
          <Heading>My Saved Cafes</Heading>
          {/* Saved cafes list will go here */}
        </VStack>
      </Container>
    </Box>
  );
}
