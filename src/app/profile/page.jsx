"use client"

import { useEffect, useState } from 'react';
import { useAuth } from '@/utils/AuthProvider';
import { useRouter } from 'next/navigation';
import { Box, Heading, Text, Button, Container, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, useDisclosure } from "@chakra-ui/react";
import { signOut, deleteUser } from "firebase/auth";
import {auth} from "@/config/firebase";
import { useToast } from '@chakra-ui/react';
import { doc, getDoc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useRef } from 'react';

const orangePrimary = "#FF6B35";

export default function ProfilePage() {
    const { user, loading} = useAuth();
    const [fullName, setFullName] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef();

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

    const handleDeleteAccount = async () => {
        if (!user) return;
        
        setIsDeleting(true);
        try {
            // Delete all saved cafes subcollection
            const savedCafesRef = collection(db, "users", user.uid, "savedCafes");
            const savedCafesSnapshot = await getDocs(savedCafesRef);
            const deletePromises = savedCafesSnapshot.docs.map(doc => deleteDoc(doc.ref));
            await Promise.all(deletePromises);

            // Delete user document from Firestore
            const userDocRef = doc(db, "users", user.uid);
            await deleteDoc(userDocRef);

            // Delete the Firebase Auth account
            await deleteUser(user);

            toast({
                title: "Account deleted successfully.",
                description: "Your account and all data have been permanently removed.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });

            router.push("/");
        } catch (error) {
            console.error("Error deleting account:", error);
            toast({
                title: "Failed to delete account",
                description: error.message || "Something went wrong. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsDeleting(false);
            onClose();
        }
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
                        mb={4}
                    >
                        Logout
                    </Button>

                    <Button 
                        variant="outline"
                        borderColor="red.300"
                        color="red.600"
                        mt={2}
                        onClick={onOpen}
                        fontWeight="600"
                        _hover={{ bg: "red.50", borderColor: "red.400" }}
                        w="full"
                    >
                        Delete Account
                    </Button>
                </Box>
            </Container>

            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete Account
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure? This will permanently delete your account and all your saved cafes. 
                            This action cannot be undone. You will be able to sign up again with the same email.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose} isDisabled={isDeleting}>
                                Cancel
                            </Button>
                            <Button 
                                colorScheme="red" 
                                onClick={handleDeleteAccount} 
                                ml={3}
                                isLoading={isDeleting}
                                loadingText="Deleting..."
                            >
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    )
}
