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

  // Bright orange theme
  const orangePrimary = "#FF6B35";
  const orangeDark = "#E55A2B";

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
    <Box 
      bg="white" 
      py={4} 
      borderBottomWidth="1px"
      borderBottomColor="gray.200"
      shadow="sm"
      position="sticky"
      top={0}
      zIndex={100}
    >
      <Flex
        maxW="7xl"
        mx="auto"
        px={{ base: 4, md: 8 }}
        align="center"
        justify="space-between"
        wrap="wrap"
      >
        {/* Left: Logo & Nav */}
        <Flex align="center" gap={{ base: 4, md: 8 }}>
          <Link href="/landing" passHref>
            <Text
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="900"
              color={orangePrimary}
              _hover={{ 
                color: orangeDark,
                transform: "scale(1.05)",
                transition: "all 0.2s"
              }}
              cursor="pointer"
              letterSpacing="-0.02em"
            >
              ☕ CafeQuest
            </Text>
          </Link>
          <HStack spacing={6} display={{ base: "none", md: "flex" }}>
            <Link href="/">
              <Text
                color="gray.700" 
                fontWeight="600"
                fontSize="md"
                _hover={{ 
                  color: orangePrimary,
                  cursor: "pointer"
                }}
                transition="color 0.2s"
              >
                Explore
              </Text>
            </Link>
            <Link href="/howtouse">
              <Text
                color="gray.700" 
                fontWeight="600"
                fontSize="md"
                _hover={{ 
                  color: orangePrimary,
                  cursor: "pointer"
                }}
                transition="color 0.2s"
              >
                How It Works
              </Text>
            </Link>
          </HStack>
        </Flex>

        {/* Right: Auth/User */}
        <Flex align="center" gap={3}>
          {loading ? (
            <Spinner color={orangePrimary} size="sm" />
          ) : user ? (
            isDesktop ? (
              <>
                <Link href="/dashboard">
                  <Button 
                    size="md" 
                    variant="ghost" 
                    color="gray.700"
                    fontWeight="600"
                    _hover={{ 
                      bg: `${orangePrimary}10`,
                      color: orangePrimary
                    }}
                  >
                    Dashboard
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button 
                    size="md" 
                    variant="ghost"
                    color="gray.700"
                    fontWeight="600"
                    _hover={{ 
                      bg: `${orangePrimary}10`,
                      color: orangePrimary
                    }}
                  >
                    Profile
                  </Button>
                </Link>
                <Button 
                  onClick={handleLogout} 
                  bg={orangePrimary}
                  color="white"
                  size="md"
                  fontWeight="700"
                  borderRadius="full"
                  px={6}
                  _hover={{ 
                    bg: orangeDark,
                    transform: "translateY(-2px)",
                    boxShadow: "lg"
                  }}
                  transition="all 0.2s"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<Avatar size="sm" name={user.email} bg={orangePrimary} />}
                  variant="ghost"
                  aria-label="User menu"
                  _hover={{ bg: `${orangePrimary}10` }}
                />
                <MenuList borderColor="gray.200" shadow="xl">
                  <MenuItem 
                    as={Link} 
                    href="/dashboard"
                    _hover={{ bg: `${orangePrimary}10`, color: orangePrimary }}
                  >
                    Dashboard
                  </MenuItem>
                  <MenuItem 
                    as={Link} 
                    href="/profile"
                    _hover={{ bg: `${orangePrimary}10`, color: orangePrimary }}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem 
                    onClick={handleLogout} 
                    color="red.500"
                    _hover={{ bg: "red.50" }}
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            )
          ) : (
            <>
              <Link href="/login">
                <Button 
                  variant="outline" 
                  borderColor="gray.300"
                  color="gray.700"
                  size="md"
                  fontWeight="600"
                  borderRadius="full"
                  px={6}
                  _hover={{ 
                    borderColor: orangePrimary,
                    color: orangePrimary,
                    bg: `${orangePrimary}05`
                  }}
                  transition="all 0.2s"
                >
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button 
                  bg={orangePrimary}
                  color="white"
                  size="md"
                  fontWeight="700"
                  borderRadius="full"
                  px={6}
                  _hover={{ 
                    bg: orangeDark,
                    transform: "translateY(-2px)",
                    boxShadow: "lg"
                  }}
                  transition="all 0.2s"
                >
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
