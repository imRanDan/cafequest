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
import { auth, db } from '@/config/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useAuth } from '@/utils/AuthProvider';
import AlreadyHaveAnAccount from '@/components/AlreadyHaveAnAccount';
import { doc, setDoc } from 'firebase/firestore';

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
      // const auth = getClientAuth(); // 👈 safe for client
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        fullName: fullName,
        email: user.email,
        createdAt: new Date().toISOString(),
      })

      //Save the users name + email to Firestore
      toast({
        title: 'Account successfully created.',
        description: "You've successfully signed up!",
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      router.push('/'); // or wherever post-signup but for now it pushes you to /
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
    <Box maxW="md" mx="auto" mt={10} p={6} boxShadow="md" borderWidth={1} borderRadius="md">
      <Heading mb={6}>Sign Up</Heading>
      <form onSubmit={handleSignup}>
        <FormControl mb={4} isRequired>
          <FormLabel>Full Name</FormLabel>
            <Input  
              type="text"
              placeholder="Jane Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              >         
            </Input>
        </FormControl>

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
