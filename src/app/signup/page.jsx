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
import { sendSignInLinkToEmail, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '@/config/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useAuth } from '@/utils/AuthProvider';
import AlreadyHaveAnAccount from '@/components/AlreadyHaveAnAccount';
import GoogleIcon from '@/components/GoogleIcon';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Divider, Flex } from '@chakra-ui/react';

const orangePrimary = "#FF6B35";

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Store email and fullName in localStorage for the callback
      window.localStorage.setItem('emailForSignIn', email);
      window.localStorage.setItem('fullNameForSignIn', fullName);

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
    } catch (err) {
      setError(err.message);
      toast({
        title: 'Signup failed',
        description: err.message || 'Something went wrong.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user already exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Create user profile for new users
        await setDoc(doc(db, 'users', user.uid), {
          fullName: user.displayName || 'User',
          email: user.email,
          createdAt: new Date().toISOString(),
        });
      }

      toast({
        title: 'Signup successful!',
        description: 'Welcome to CafeQuest!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      router.push('/dashboard');
    } catch (err) {
      toast({
        title: 'Google signup failed',
        description: err.message || 'Something went wrong.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
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
          {emailSent ? (
            <Box>
              <Text color="gray.700" mb={4} fontSize="lg">
                We sent a sign-in link to <strong>{email}</strong>
              </Text>
              <Text color="gray.600" mb={4}>
                Click the link in the email to complete your signup. The link will expire in 1 hour.
              </Text>
              <Button 
                bg={orangePrimary}
                color="white"
                w="full"
                fontWeight="700"
                _hover={{ bg: "#E55A2B" }}
                onClick={() => setEmailSent(false)}
              >
                Send another email
              </Button>
            </Box>
          ) : (
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
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                onClick={handleGoogleSignup}
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

          <AlreadyHaveAnAccount />
        </Box>
      </Container>
    </Box>
  );
}
