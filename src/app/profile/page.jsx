"use client"

import { useEffect, useState } from 'react';
import { useAuth } from '@/utils/AuthProvider';
import { useRouter } from 'next/navigation';
import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { signOut } from "firebase/auth";
import {auth} from "@/config/firebase";
import { useToast } from '@chakra-ui/react';
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";


export default function ProfilePage() {
    const { user, loading} = useAuth();
    const [fullName, setFullName] = useState("");
    const router = useRouter();
    const toast = useToast();

    // if loading and no user then show redirect to login
    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading])


    const handleLogout = async () => {
        await signOut(auth);
        toast({
            title: "Logged out successfully.",
            status: "info",
            duraiton: 3000,
            isClosable: true,
        });
        router.push("/login");
    }

    if (loading || !user) return <p>Loading....</p>


    return (
        <Box maxW='md' mx='auto' mt={10} p={4} borderWidth={1} borderRadius='lg'>
            <Heading size='md' mb={4}>Your profile</Heading>
            <Text><strong>Email:</strong>{user.email}</Text>
            <Text><strong>Name:</strong>{user.name}</Text>
            {/* For future reference, add full name, profile pic, etc. here */}
            <Button colorScheme='red' mt={6} onClick={handleLogout}>
                Logout
            </Button>
        </Box>
    )
}