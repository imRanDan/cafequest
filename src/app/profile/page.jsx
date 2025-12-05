"use client"

import { useEffect, useState } from 'react';
import { useAuth } from '@/utils/AuthProvider';
import { useRouter } from 'next/navigation';
import { Box, Heading, Text, Button, Container } from "@chakra-ui/react";
import { signOut } from "firebase/auth";
import {auth} from "@/config/firebase";
import { useToast } from '@chakra-ui/react';
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

const orangePrimary = "#FF6B35";

export default function ProfilePage() {
    const { user, loading} = useAuth();
    const [fullName, setFullName] = useState("");
    const router = useRouter();
    const toast = useToast();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading])

    useEffect(() => {
        if (!loading && user) {
            const fetchUserProfile = async () => {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setFullName(data.fullName || "No name set");
                }
            };
            fetchUserProfile();
        }
    }, [user, loading]);

    const handleLogout = async () => {
        await signOut(auth);
        toast({
            title: "Logged out successfully.",
            status: "info",
            duration: 3000,
            isClosable: true,
        });
        router.push("/login");
    }

    if (loading || !user) return <p>Loading....</p>

    return (
        <Box bg="white" minH="calc(100vh - 64px)" py={12}>
            <Container maxW="md">
                <Box 
                    maxW='md' 
                    mx='auto' 
                    p={8} 
                    bg="white"
                    borderWidth="1px" 
                    borderColor="gray.200"
                    borderRadius="xl"
                    boxShadow="lg"
                >
                    <Heading size='lg' mb={6} color={orangePrimary} fontWeight="800">Your Profile</Heading>
                    <Box mb={4}>
                        <Text fontWeight="600" color="gray.700" mb={1}>Email:</Text>
                        <Text color="gray.900">{user.email}</Text>
                    </Box>
                    <Box mb={6}>
                        <Text fontWeight="600" color="gray.700" mb={1}>Name:</Text>
                        <Text color="gray.900">{fullName}</Text>
                    </Box>
                    <Button 
                        bg={orangePrimary}
                        color="white"
                        mt={6} 
                        onClick={handleLogout}
                        fontWeight="700"
                        _hover={{ bg: "#E55A2B" }}
                        w="full"
                    >
                        Logout
                    </Button>
                </Box>
            </Container>
        </Box>
    )
}
