"use client";

import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Avatar,
  Button,
  Flex,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!session) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      router.push("/");
      toast({
        title: "Logged out successfully",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error logging out",
        status: "error",
        duration: 3000,
      });
    }
  };

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={8} align="stretch">
        <Flex justify="space-between" align="center">
          <Flex gap={4} align="center">
            <Avatar
              size="xl"
              name={session.user.name}
              src={session.user.image}
            />
            <VStack align="start" spacing={1}>
              <Heading size="lg">{session.user.name}</Heading>
              <Text color="gray.600">{session.user.email}</Text>
            </VStack>
          </Flex>
          <Button colorScheme="red" variant="outline" onClick={handleLogout}>
            Sign Out
          </Button>
        </Flex>
      </VStack>
    </Container>
  );
}
