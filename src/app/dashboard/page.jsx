"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/utils/AuthProvider"
import { useRouter } from "next/navigation"
// import cafes from "@/data/cafes" no need for sample data set as cafecards show now
import CafeCard from "@/components/CafeCard"
import { Text, SimpleGrid, Box, Heading } from "@chakra-ui/react";
import {collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase"
import { doc, getDoc} from "firebase/firestore";

export default function DashboardPage() {
    const { user, loading} = useAuth();
    const router = useRouter();
    const [savedCafes, setSavedCafes] = useState([]);
    const [userData, setUserData] = useState(null);

    //fetches user data to load in later
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

    //fetches saved cafe data to load in to the dash
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

    

// 🔒 TEST: Unauthenticated Firestore access (leave this commented unless testing)
//     useEffect(() => {
//         const testAccess = async () => {
//             try {
//             const snapshot = await getDocs(collection(db, "users"));
//             console.log("Unprotected access succeeded:", snapshot.docs.length);
//             } catch (err) {
//             console.error("🔒 Firebase permission error (expected):", err.message);
//             }
//         };
//   testAccess();
// }, []);

    // Checks if user is logged in before loading a dash, will redirect unauthorized users to log in
    useEffect(() => {
        if (!loading && !user ) {
            router.push("/login");
        }
    }, [user, loading]);

    if (loading || !user ) return <p>Loading...</p>;

    return (
        <>
        
        <Box textAlign="center" mt={10} mb={6}>
            <Heading as="h2" size="lg" mb={2}>
                Welcome to your dashboard ☕️
            </Heading>
            <Text fontSize="md" color="gray.600">
                {userData?.fullName
                ? `Welcome back, ${userData.fullName}!`
                : `Welcome back, ${user.email}`}
            </Text>
        </Box>


        <Box p={6}>
            <Heading mb={4}>Your Saved Cafes</Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3}} spacing={6}>
                {savedCafes.map((cafe) => (
                    <CafeCard 
                        key={cafe.id} cafe={cafe} />
                ))}
            </SimpleGrid>
        </Box>
        </>

    )
}