"use client";

import {
  Box,
  Flex,
  Button,
  Text,
  Spinner,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  IconButton,
  useBreakpointValue,
  HStack,
  Link as ChakraLink,
} from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "@/config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const router = useRouter();

  const isDesktop = useBreakpointValue({ base: false, md: true });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    toast({
      title: "Logged out successfully.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
    router.push("/login");
  };

  return (
    <Box bg="gray.800" py={4} shadow="sm">
      <Flex
        maxW="6xl"
        mx="auto"
        px={4}
        align="center"
        justify="space-between"
        wrap="wrap"
      >
        {/* Left: Logo */}
        <Link href="/" passHref>
          <Text
            fontSize="xl"
            fontWeight="bold"
            color="white"
            _hover={{ textDecoration: "underline" }}
          >
            CafeQuest
          </Text>
        </Link>

        {/* Right: Auth/User */}
        <Flex align="center" gap={4}>
          {loading ? (
            <Spinner color="white" />
          ) : user ? (
            isDesktop ? (
              <>
                <Link href="/dashboard">
                  <Button size="sm" variant="ghost" colorScheme="teal">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button size="sm" variant="ghost" colorScheme="teal">
                    Profile
                  </Button>
                </Link>
                <Button onClick={handleLogout} colorScheme="red" size="sm">
                  Logout
                </Button>
              </>
            ) : (
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<Avatar size="sm" name={user.email} />}
                  variant="ghost"
                  aria-label="User menu"
                />
                <MenuList>
                  <MenuItem as={Link} href="/dashboard">
                    Dashboard
                  </MenuItem>
                  <MenuItem as={Link} href="/profile">
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout} color="red.500">
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            )
          ) : (
            <>
              <Link href="/login">
                <Button colorScheme="teal" variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button colorScheme="teal" size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}
