"use client"

import { useEffect } from "react"
import { useAuth } from "@/utils/AuthProvider"
import { useRouter } from "next/navigation"
import cafes from "@/data/cafes"
import CafeCard from "@/components/CafeCard"
import { SimpleGrid, Box, Heading } from "@chakra-ui/react";

export default function DashboardPage() {
    const { user, loading} = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user ) {
            router.push("login");
        }
    }, [user, loading]);

    if (loading || !user ) return <p>Loading...</p>;

    return (
        <>
        
        <div>
            <h1>Welcome to your dashboard!</h1>
            <p>You're logged in as {user.email}</p>
        </div>


        <Box p={6}>
            <Heading mb={4}>Featured Cafes</Heading>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3}} spacing={6}>
                {cafes.map((cafe) => (
                    <CafeCard key={cafe.id} cafe={cafe} />
                ))}
            </SimpleGrid>
        </Box>
        </>

    )
}