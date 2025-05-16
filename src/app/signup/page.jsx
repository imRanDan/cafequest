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
import { getClientAuth } from '@/config/firebase';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const auth = getClientAuth(); // 👈 safe for client
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/'); // or wherever post-signup
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} boxShadow="md" borderRadius="md">
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
    </Box>
  );
}
