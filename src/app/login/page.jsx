'use client';

import { Box, Button, FormControl, FormLabel, Input, Heading, useToast } from "@chakra-ui/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import { auth } from "@/config/firebase";
import { useAuth } from "@/utils/AuthProvider";
import NeedAnAccount from "@/components/NeedAnAccount";


export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const toast = useToast();
    const router = useRouter();
    const { user, loading } = useAuth();



    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // const auth = getClientAuth();
            await signInWithEmailAndPassword(auth, email, password);
            //toast to show successful login
            toast({
                title: 'Login was successful!',
                status: 'success',
                duration: 3000,
                isClosable: true,
            })

            router.push('/') // probably best to change this to the dashboard eventually
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


    // This handles the edge case where when a user is logged in and tries to go to /login in the url it will redirect them to their dashboard
    useEffect(() => {
      if (!loading && user) {
        router.push("/dashboard")
      }
    }, [user, loading])

    if (loading || user) return null;


    return (
        <Box maxW="md" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="md">
      <Heading mb={6}>Log In</Heading>
      <form onSubmit={handleLogin}>
        <FormControl mb={4}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormControl>
        <FormControl mb={6}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormControl>
        <Button type="submit" colorScheme="teal" width="full">
          Log In
        </Button>
      </form>
      <NeedAnAccount />
    </Box>
    )
}