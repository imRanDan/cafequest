'use client';

import { Box, Button, FormControl, FormLabel, Input, Heading, useToast, Container } from "@chakra-ui/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import { auth } from "@/config/firebase";
import { useAuth } from "@/utils/AuthProvider";
import NeedAnAccount from "@/components/NeedAnAccount";

const orangePrimary = "#FF6B35";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const toast = useToast();
    const router = useRouter();
    const { user, loading } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast({
                title: 'Login was successful!',
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
            router.push('/')
        } catch (error) {
            toast({
                title: 'Login failed',
                description: error.message || 'Invalid credentials.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }
    };

    useEffect(() => {
      if (!loading && user) {
        router.push("/dashboard")
      }
    }, [user, loading])

    if (loading || user) return null;

    return (
        <Box bg="white" minH="calc(100vh - 64px)" py={12}>
            <Container maxW="md">
                <Box 
                    mx="auto" 
                    p={8} 
                    bg="white"
                    borderWidth="1px" 
                    borderColor="gray.200"
                    borderRadius="xl"
                    boxShadow="lg"
                >
                    <Heading mb={6} color={orangePrimary} fontWeight="800">Log In</Heading>
                    <form onSubmit={handleLogin}>
                        <FormControl mb={4}>
                            <FormLabel color="gray.900" fontWeight="600">Email</FormLabel>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                bg="white"
                                color="gray.900"
                                borderColor="gray.300"
                                _focus={{ borderColor: orangePrimary, boxShadow: `0 0 0 1px ${orangePrimary}` }}
                                _placeholder={{ color: "gray.400" }}
                            />
                        </FormControl>
                        <FormControl mb={6}>
                            <FormLabel color="gray.900" fontWeight="600">Password</FormLabel>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                bg="white"
                                color="gray.900"
                                borderColor="gray.300"
                                _focus={{ borderColor: orangePrimary, boxShadow: `0 0 0 1px ${orangePrimary}` }}
                                _placeholder={{ color: "gray.400" }}
                            />
                        </FormControl>
                        <Button 
                            type="submit" 
                            bg={orangePrimary}
                            color="white"
                            width="full"
                            fontWeight="700"
                            _hover={{ bg: "#E55A2B" }}
                            mb={4}
                        >
                            Log In
                        </Button>
                    </form>
                    <NeedAnAccount />
                </Box>
            </Container>
        </Box>
    )
}
