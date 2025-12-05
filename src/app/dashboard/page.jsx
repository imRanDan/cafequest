"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/utils/AuthProvider"
import { useRouter } from "next/navigation"
import CafeCard from "@/components/CafeCard"
import { Text, SimpleGrid, Box, Heading, Container } from "@chakra-ui/react";
import {collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase"
import { doc, getDoc, deleteDoc} from "firebase/firestore";
import { useToast } from "@chakra-ui/react";

const orangePrimary = "#FF6B35";

export default function DashboardPage() {
    const { user, loading} = useAuth();
    const router = useRouter();
    const toast = useToast();
    const [savedCafes, setSavedCafes] = useState([]);
    const [userData, setUserData] = useState(null);

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
        <Box bg="white" minH="calc(100vh - 64px)" py={12}>
            <Container maxW="7xl">
                <Box textAlign="center" mb={10}>
                    <Heading as="h2" size="xl" mb={2} color={orangePrimary} fontWeight="800">
                        Welcome to your dashboard ☕️
                    </Heading>
                    <Text fontSize="lg" color="gray.600">
                        {userData?.fullName
                        ? `Welcome back, ${userData.fullName}!`
                        : `Welcome back, ${user.email}`}
                    </Text>
                </Box>

                <Box>
                    <Heading mb={6} color="gray.900" fontWeight="700">Your Saved Cafes</Heading>
                    {savedCafes.length === 0 ? (
                        <Box textAlign="center" py={12} bg="gray.50" borderRadius="xl" borderWidth="1px" borderColor="gray.200">
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
