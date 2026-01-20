'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInWithEmailLink, isSignInWithEmailLink } from 'firebase/auth';
import { auth, db } from '@/config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useAuth } from '@/utils/AuthProvider';
import { Box, Container, Heading, Text, Spinner } from '@chakra-ui/react';

const orangePrimary = "#FF6B35";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [status, setStatus] = useState('verifying');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleEmailLink = async () => {
      try {
        // Check if this is an email link
        if (!isSignInWithEmailLink(auth, window.location.href)) {
          setError('Invalid sign-in link. Please request a new one.');
          setStatus('error');
          return;
        }

        // Get the email from localStorage
        const email = window.localStorage.getItem('emailForSignIn');
        const fullName = window.localStorage.getItem('fullNameForSignIn');

        if (!email) {
          setError('Email not found. Please request a new sign-in link.');
          setStatus('error');
          return;
        }

        // Complete the sign-in
        const result = await signInWithEmailLink(auth, email, window.location.href);
        
        // Clear the email from localStorage
        window.localStorage.removeItem('emailForSignIn');

        // If this is a new user (signup), create their profile
        if (fullName && result.user) {
          const userDoc = await getDoc(doc(db, 'users', result.user.uid));
          
          if (!userDoc.exists()) {
            await setDoc(doc(db, 'users', result.user.uid), {
              fullName: fullName,
              email: result.user.email,
              createdAt: new Date().toISOString(),
            });
          }
          
          // Clear fullName from localStorage
          window.localStorage.removeItem('fullNameForSignIn');
        }

        setStatus('success');
        
        // Redirect to dashboard after a brief delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);

      } catch (err) {
        console.error('Email link sign-in error:', err);
        setError(err.message || 'Failed to sign in. Please try again.');
        setStatus('error');
      }
    };

    handleEmailLink();
  }, [router]);

  if (status === 'verifying') {
    return (
      <Box bg="white" minH="calc(100vh - 64px)" display="flex" alignItems="center" justifyContent="center">
        <Container maxW="md" textAlign="center">
          <Spinner size="xl" color={orangePrimary} thickness="4px" mb={4} />
          <Heading color={orangePrimary} mb={2}>Verifying your email...</Heading>
          <Text color="gray.600">Please wait while we sign you in.</Text>
        </Container>
      </Box>
    );
  }

  if (status === 'success') {
    return (
      <Box bg="white" minH="calc(100vh - 64px)" display="flex" alignItems="center" justifyContent="center">
        <Container maxW="md" textAlign="center">
          <Heading color={orangePrimary} mb={2}>Success!</Heading>
          <Text color="gray.600">You've been signed in. Redirecting...</Text>
        </Container>
      </Box>
    );
  }

  if (status === 'error') {
    return (
      <Box bg="white" minH="calc(100vh - 64px)" display="flex" alignItems="center" justifyContent="center">
        <Container maxW="md" textAlign="center">
          <Heading color="red.500" mb={4}>Sign-in Failed</Heading>
          <Text color="gray.700" mb={4}>{error}</Text>
          <Text color="gray.600">
            Please <a href="/login" style={{ color: orangePrimary, textDecoration: 'underline' }}>request a new sign-in link</a>.
          </Text>
        </Container>
      </Box>
    );
  }

  return null;
}
