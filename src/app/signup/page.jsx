'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
  Container
} from '@chakra-ui/react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/config/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useAuth } from '@/utils/AuthProvider';
import AlreadyHaveAnAccount from '@/components/AlreadyHaveAnAccount';
import { doc, setDoc } from 'firebase/firestore';

const orangePrimary = "#FF6B35";

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user, loading } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        fullName: fullName,
        email: user.email,
        createdAt: new Date().toISOString(),
      })

      toast({
        title: 'Account successfully created.',
        description: "You've successfully signed up!",
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      router.push('/');
    } catch (err) {
      toast({
        title: 'Signup failed',
        description: err.message || 'Something went wrong.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  };

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading]);

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
          <Heading mb={6} color={orangePrimary} fontWeight="800">Sign Up</Heading>
          <form onSubmit={handleSignup}>
            <FormControl mb={4} isRequired>
              <FormLabel color="gray.900" fontWeight="600">Full Name</FormLabel>
              <Input  
                type="text"
                placeholder="Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                bg="white"
                color="gray.900"
                borderColor="gray.300"
                _focus={{ borderColor: orangePrimary, boxShadow: `0 0 0 1px ${orangePrimary}` }}
                _placeholder={{ color: "gray.400" }}
              />         
            </FormControl>

            <FormControl mb={4} isRequired>
              <FormLabel color="gray.900" fontWeight="600">Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                bg="white"
                color="gray.900"
                borderColor="gray.300"
                _focus={{ borderColor: orangePrimary, boxShadow: `0 0 0 1px ${orangePrimary}` }}
                _placeholder={{ color: "gray.400" }}
              />
            </FormControl>

            <FormControl mb={4} isRequired>
              <FormLabel color="gray.900" fontWeight="600">Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                bg="white"
                color="gray.900"
                borderColor="gray.300"
                _focus={{ borderColor: orangePrimary, boxShadow: `0 0 0 1px ${orangePrimary}` }}
                _placeholder={{ color: "gray.400" }}
              />
            </FormControl>

            {error && <Text color="red.500" mb={4}>{error}</Text>}

            <Button 
              bg={orangePrimary}
              color="white"
              type="submit" 
              w="full"
              fontWeight="700"
              _hover={{ bg: "#E55A2B" }}
              mb={4}
            >
              Sign Up
            </Button>
          </form>
          <AlreadyHaveAnAccount />
        </Box>
      </Container>
    </Box>
  );
}
