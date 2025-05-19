"use client"

import { Box, Flex, Button, Text, Spinner, useToast } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
// import { getClientAuth } from "@/config/firebase";
import { auth } from "@/config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  // const auth = getClientAuth();

  //listens for auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  //logout handler
  const handleLogout = async () => {
    await signOut(auth);
    toast({
      title: 'Logged out successfully.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  }

  return (
    <Flex
      px={6}
      py={6}
      justify="space-between"
      align="center"
      bg="gray.800"
      shadow="md"
    >
      <Link href="/" passHref>
        <Text p={2} fontSize="xl" fontWeight="bold" color="white" _hover={{ textDecoration: "underline" }}>
          CafeQuest
        </Text>
      </Link>

    {/* Checks if user is logged in then show logout */}
      {loading ? (
      <Spinner color="white" />
    ) : user ? (
      <Flex align="center" gap={4}>
        <Text color="white">Hello, {user.email}</Text>
        <Button onClick={handleLogout} colorScheme="red" size="sm">
          Logout
        </Button>
      </Flex>
    ) : (
      // If user is logged out, show login and signup buttons.
      <Flex align="center" gap={4}>
        <Link href="/login" passHref>
          <Button colorScheme="teal" variant="outline" size="sm">
            Login
          </Button>
        </Link>
        <Link href="/signup" passHref>
          <Button colorScheme="teal" size="sm">
            Sign Up
          </Button>
        </Link>
      </Flex>
    )}

      <Link href="/landing" passHref>
        <Text p={2} fontSize="lg" color="white" _hover={{ textDecoration: "underline" }}>
          About
        </Text>
      </Link>
    
    </Flex>
  );
}
