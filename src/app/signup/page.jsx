'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text
} from '@chakra-ui/react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useAuth } from '@/utils/AuthProvider';
import AlreadyHaveAnAccount from '@/components/AlreadyHaveAnAccount';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user, loading } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // const auth = getClientAuth(); // 👈 safe for client
      await createUserWithEmailAndPassword(auth, email, password);

      toast({
        title: 'Account successfully created.',
        description: "You've successfully signed up!",
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      router.push('/'); // or wherever post-signup
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
    <Box maxW="md" mx="auto" mt={10} p={6} borderWidth={1} boxShadow="md" borderRadius="md">
      <Heading mb={6}>Sign Up</Heading>
      <form onSubmit={handleSignup}>
        <FormControl mb={4} isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>

        <FormControl mb={4} isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>

        {error && <Text color="red.500" mb={4}>{error}</Text>}

        <Button colorScheme="teal" type="submit" w="full">
          Sign Up
        </Button>
      </form>
      <AlreadyHaveAnAccount />
    </Box>
  );
}
