"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/utils/AuthProvider"
import { useRouter } from "next/navigation"
// import cafes from "@/data/cafes" no need for sample data set as cafecards show now
import CafeCard from "@/components/CafeCard"
import { SimpleGrid, Box, Heading } from "@chakra-ui/react";
import {collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase"
import { doc, getDoc} from "firebase/firestore";

export default function DashboardPage() {
    const { user, loading} = useAuth();
    const router = useRouter();
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

    useEffect(() => {
        if (!loading && !user ) {
            router.push("/login");
        }
    }, [user, loading]);

    if (loading || !user ) return <p>Loading...</p>;

    return (
        <>
        
        <div>
            <h1>Your dashboard!</h1>
            <p>Welcome back, {userData?.name || user.email}!</p>
        </div>


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