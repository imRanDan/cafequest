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
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  IconButton,
} from "@chakra-ui/react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaTrash, FaMapMarkerAlt } from "react-icons/fa";
import Map from "@/components/Map";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const toast = useToast();
  const [savedCafes, setSavedCafes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch saved cafes
  useEffect(() => {
    const fetchSavedCafes = async () => {
      try {
        const response = await fetch("/api/cafes/saved");
        if (!response.ok) throw new Error("Failed to fetch saved cafes");
        const data = await response.json();
        setSavedCafes(data);
      } catch (error) {
        console.error("Error fetching saved cafes:", error);
        toast({
          title: "Error fetching saved cafes",
          status: "error",
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchSavedCafes();
    }
  }, [session, toast]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  const handleLogout = async () => {
    try {
      await signOut();
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

  const handleRemoveCafe = async (cafeId) => {
    try {
      const response = await fetch(`/api/cafes/saved?cafeId=${cafeId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to remove cafe");

      setSavedCafes(savedCafes.filter(cafe => cafe.cafeId !== cafeId));
      toast({
        title: "Cafe removed successfully",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error removing cafe",
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleViewOnMap = (cafe) => {
    router.push(`/?lat=${cafe.latitude}&lon=${cafe.longitude}`);
  };

  if (status === "loading" || isLoading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <Container maxW="container.lg" py={10}>
      <VStack spacing={8} align="stretch">
        {/* Profile Header */}
        <Flex justify="space-between" align="center" mb={8}>
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
          <Button colorScheme="teal" variant="outline" onClick={handleLogout}>
            Sign Out
          </Button>
        </Flex>

        {/* Saved Cafes Section */}
        <Box>
          <Heading size="md" mb={4}>
            Saved Cafes
          </Heading>
          {savedCafes.length === 0 ? (
            <Text color="gray.500">No saved cafes yet</Text>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {savedCafes.map((cafe) => (
                <Card key={cafe.id}>
                  <CardHeader>
                    <Flex justify="space-between" align="center">
                      <Heading size="sm">{cafe.name}</Heading>
                      <IconButton
                        icon={<FaTrash />}
                        variant="ghost"
                        colorScheme="red"
                        size="sm"
                        onClick={() => handleRemoveCafe(cafe.cafeId)}
                        aria-label="Remove cafe"
                      />
                    </Flex>
                  </CardHeader>
                  <CardBody>
                    <Flex justify="space-between" align="center">
                      <Text fontSize="sm" color="gray.500">
                        Saved on {new Date(cafe.createdAt).toLocaleDateString()}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {cafe.location?.address || "Address not available"}
                      </Text>
                      <IconButton
                        icon={<FaMapMarkerAlt />}
                        colorScheme="teal"
                        size="sm"
                        onClick={() => handleViewOnMap(cafe)}
                        aria-label="View on map"
                      />
                    </Flex>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          )}
        </Box>
      </VStack>
    </Container>
  );
}
