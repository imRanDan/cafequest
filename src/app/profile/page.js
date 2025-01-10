"use client";

import { Box, VStack, Heading, Text, Container } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <Box minH="100vh" bg="gray.50" py={12}>
      <Container maxW="md">
        <VStack spacing={6}>
          <Heading>My Profile</Heading>
          <Text>Welcome {session?.user?.name}</Text>
          <Text>Email: {session?.user?.email}</Text>
        </VStack>
      </Container>
    </Box>
  );
}
