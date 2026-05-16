"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/utils/AuthProvider"
import { useRouter } from "next/navigation"
import CafeCard from "@/components/CafeCard"
import { Text, SimpleGrid, Box, Heading, Container, VStack, HStack, Badge, Icon, Divider } from "@chakra-ui/react";
import { FaStamp, FaWifi, FaPlug, FaChair, FaCheck, FaTimes, FaCoffee } from "react-icons/fa";
import {collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase"
import { doc, getDoc, deleteDoc} from "firebase/firestore";
import { useToast } from "@chakra-ui/react";
import { useVisitedCafes } from "@/utils/useVisitedCafes";

const orangePrimary = "#FF6B35";

export default function DashboardPage() {
    const { user, loading} = useAuth();
    const router = useRouter();
    const toast = useToast();
    const [savedCafes, setSavedCafes] = useState([]);
    const [userData, setUserData] = useState(null);
    const { visitedCafes, loading: loadingVisited } = useVisitedCafes();

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) return;
            const userDocRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(userDocRef);

            if (docSnap.exists()) {
                setUserData(docSnap.data());
            }
        };
        fetchUserData()
    }, [user])

    useEffect(() => {
        const fetchSaved = async () => {
            if (!user) return;
            const savedRef = collection(db, "users", user.uid, "savedCafes");
            const snapshot = await getDocs(savedRef);
            const cafes = snapshot.docs.map(doc => doc.data());
            setSavedCafes(cafes);
        }
        fetchSaved()
    }, [user]);

    const handleDeleteCafe = async (cafeId) => {
        try{
            const docRef = doc(db, "users", user.uid, "savedCafes", cafeId.toString());
            await deleteDoc(docRef);
            setSavedCafes((prev) => prev.filter((cafe) => cafe.id.toString() !== cafeId.toString()));
            toast({
                title: "Cafe deleted",
                status: "info",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error("Error deleting cafe:", error);
        }
    }

    useEffect(() => {
        if (!loading && !user ) {
            router.push("/login");
        }
    }, [user, loading]);

    if (loading || !user ) return <p>Loading...</p>;

    return (
        <Box bg="white" minH="calc(100vh - 64px)" py={{ base: 4, md: 6 }}>
            <Container maxW="7xl" px={{ base: 4, md: 6 }}>
                <Box textAlign="center" mb={{ base: 4, md: 6 }}>
                    <Heading as="h2" size="xl" mb={2} color={orangePrimary} fontWeight="800">
                        Welcome to your dashboard ☕️
                    </Heading>
                    <Text fontSize="lg" color="gray.600">
                        {userData?.fullName
                        ? `Welcome back, ${userData.fullName}!`
                        : `Welcome back, ${user.email}`}
                    </Text>
                </Box>

                {/* Passport Section */}
                <Box mb={8}>
                    <HStack spacing={2} mb={{ base: 3, md: 4 }}>
                        <Icon as={FaStamp} color={orangePrimary} boxSize={5} />
                        <Heading color="gray.900" fontWeight="700">Your Passport</Heading>
                        {visitedCafes.length > 0 && (
                            <Badge colorScheme="green" fontSize="sm" px={2} py={1}>
                                {visitedCafes.length} visited
                            </Badge>
                        )}
                    </HStack>
                    {visitedCafes.length === 0 ? (
                        <Box textAlign="center" py={{ base: 4, md: 6 }} bg="gray.50" borderRadius="xl" borderWidth="1px" borderColor="gray.200">
                            <Text color="gray.500" fontSize="lg">No cafes visited yet. Start exploring and mark cafes as visited!</Text>
                        </Box>
                    ) : (
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3}} spacing={4}>
                            {visitedCafes.map((cafe) => (
                                <Box
                                    key={cafe.cafeId}
                                    p={4}
                                    bg="white"
                                    borderRadius="lg"
                                    borderWidth="1px"
                                    borderColor="gray.200"
                                    boxShadow="sm"
                                    _hover={{ boxShadow: "md" }}
                                    transition="all 0.2s"
                                >
                                    <VStack align="stretch" spacing={2}>
                                        <HStack justify="space-between" align="start">
                                            <Heading size="sm" color="gray.900" fontWeight="700">
                                                {cafe.cafeName || "Unnamed Cafe"}
                                            </Heading>
                                            <Badge colorScheme="green" fontSize="xs">
                                                ✓ Visited
                                            </Badge>
                                        </HStack>
                                        {cafe.cafeAddress && (
                                            <Text fontSize="xs" color="gray.600">
                                                {cafe.cafeAddress}
                                            </Text>
                                        )}
                                        <Divider borderColor="gray.200" />
                                        <VStack align="stretch" spacing={1}>
                                            <HStack spacing={2}>
                                                <Icon as={FaWifi} color={cafe.wifiGood === true ? "green.500" : cafe.wifiGood === false ? "red.500" : "gray.300"} boxSize={3} />
                                                <Text fontSize="xs" color="gray.600">
                                                    WiFi: {cafe.wifiGood === true ? "Good" : cafe.wifiGood === false ? "Poor" : "Not answered"}
                                                </Text>
                                            </HStack>
                                            <HStack spacing={2}>
                                                <Icon as={FaPlug} color={cafe.hasOutlets === true ? "green.500" : cafe.hasOutlets === false ? "red.500" : "gray.300"} boxSize={3} />
                                                <Text fontSize="xs" color="gray.600">
                                                    Outlets: {cafe.hasOutlets === true ? "Yes" : cafe.hasOutlets === false ? "No" : "Not answered"}
                                                </Text>
                                            </HStack>
                                            <HStack spacing={2}>
                                                <Icon as={FaChair} color={cafe.plentySeating === true ? "green.500" : cafe.plentySeating === false ? "red.500" : "gray.300"} boxSize={3} />
                                                <Text fontSize="xs" color="gray.600">
                                                    Seating: {cafe.plentySeating === true ? "Plenty" : cafe.plentySeating === false ? "Limited" : "Not answered"}
                                                </Text>
                                            </HStack>
                                            {cafe.cafeName?.toLowerCase().includes("starbucks") && (
                                                <HStack spacing={2}>
                                                    <Icon as={FaCoffee} color={cafe.hasNitroColdBrew === true ? "orange.500" : cafe.hasNitroColdBrew === false ? "red.500" : "gray.300"} boxSize={3} />
                                                    <Text fontSize="xs" color="gray.600">
                                                        Nitro Cold Brew: {cafe.hasNitroColdBrew === true ? "Yes" : cafe.hasNitroColdBrew === false ? "No" : "Not answered"}
                                                    </Text>
                                                </HStack>
                                            )}
                                        </VStack>
                                    </VStack>
                                </Box>
                            ))}
                        </SimpleGrid>
                    )}
                </Box>

                <Divider borderColor="gray.300" mb={8} />

                {/* Saved Cafes Section */}
                <Box>
                    <Heading mb={{ base: 3, md: 4 }} color="gray.900" fontWeight="700">Your Saved Cafes</Heading>
                    {savedCafes.length === 0 ? (
                        <Box textAlign="center" py={{ base: 4, md: 6 }} bg="gray.50" borderRadius="xl" borderWidth="1px" borderColor="gray.200">
                            <Text color="gray.500" fontSize="lg">No saved cafes yet. Start exploring and save your favorites!</Text>
                        </Box>
                    ) : (
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3}} spacing={6}>
                            {savedCafes.map((cafe) => (
                                <CafeCard 
                                    key={cafe.id} 
                                    cafe={cafe} 
                                    onDelete={() => handleDeleteCafe(cafe.id)}
                                />
                            ))}
                        </SimpleGrid>
                    )}
                </Box>
            </Container>
        </Box>
    )
}
