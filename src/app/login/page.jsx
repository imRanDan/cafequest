'use client';

import { Box, Button, FormControl, FormLabel, Input, Heading, useToast, Container, Text, Divider, Flex } from "@chakra-ui/react";
import { sendSignInLinkToEmail, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import { auth } from "@/config/firebase";
import { useAuth } from "@/utils/AuthProvider";
import NeedAnAccount from "@/components/NeedAnAccount";
import GoogleIcon from "@/components/GoogleIcon";

const orangePrimary = "#FF6B35";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const toast = useToast();
    const router = useRouter();
    const { user, loading } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // Store email in localStorage for the callback
            window.localStorage.setItem('emailForSignIn', email);

            // Configure the action code settings
            const actionCodeSettings = {
                url: `${window.location.origin}/auth/callback`,
                handleCodeInApp: true,
            };

            await sendSignInLinkToEmail(auth, email, actionCodeSettings);
            
            setEmailSent(true);
            toast({
                title: 'Check your email!',
                description: `We sent a sign-in link to ${email}`,
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Login failed',
                description: error.message || 'Something went wrong.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            
            toast({
                title: 'Login successful!',
                description: 'Welcome back!',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            router.push('/');
        } catch (error) {
            toast({
                title: 'Google login failed',
                description: error.message || 'Something went wrong.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
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
                    {emailSent ? (
                        <Box>
                            <Text color="gray.700" mb={4} fontSize="lg">
                                We sent a sign-in link to <strong>{email}</strong>
                            </Text>
                            <Text color="gray.600" mb={4}>
                                Click the link in the email to sign in. The link will expire in 1 hour.
                            </Text>
                            <Button 
                                bg={orangePrimary}
                                color="white"
                                width="full"
                                fontWeight="700"
                                _hover={{ bg: "#E55A2B" }}
                                onClick={() => setEmailSent(false)}
                            >
                                Send another email
                            </Button>
                        </Box>
                    ) : (
                        <form onSubmit={handleLogin}>
                            <FormControl mb={6}>
                                <FormLabel color="gray.900" fontWeight="600">Email</FormLabel>
                                <Input
                                    type="email"
                                    placeholder="you@example.com"
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
                            <Button 
                                type="submit" 
                                bg={orangePrimary}
                                color="white"
                                width="full"
                                fontWeight="700"
                                _hover={{ bg: "#E55A2B" }}
                                mb={4}
                            >
                                Send Sign-In Link
                            </Button>
                        </form>
                    )}

                    {!emailSent && (
                        <>
                            <Flex align="center" my={4}>
                                <Divider />
                                <Text px={4} color="gray.500" fontSize="sm">OR</Text>
                                <Divider />
                            </Flex>

                            <Button 
                                onClick={handleGoogleLogin}
                                w="full"
                                variant="outline"
                                borderColor="gray.300"
                                color="gray.700"
                                fontWeight="600"
                                _hover={{ bg: "gray.50", borderColor: "gray.400" }}
                                leftIcon={<GoogleIcon />}
                                mb={4}
                            >
                                Continue with Google
                            </Button>
                        </>
                    )}

                    <NeedAnAccount />
                </Box>
            </Container>
        </Box>
    )
}
