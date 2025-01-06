"use client";

import { VStack, Container, Heading, Text, Link, Box } from "@chakra-ui/react";
import SignupForm from "@/components/SignupForm";
import NextLink from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignupPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/"); // Redirect if already logged in
    }
  }, [session, router]);

  return (
    <Box minH="100vh" bg="gray.50" py={12}>
      <Container maxW="md" bg="white" p={8} borderRadius="lg" boxShadow="md">
        <VStack spacing={6}>
          <Heading size="xl">Join CafeQuest</Heading>
          <Text color="gray.600">
            Create an account to save your favorite cafes
          </Text>
          <SignupForm />
          <Text>
            Already have an account?{" "}
            <Link as={NextLink} href="/auth/login" color="teal.500">
              Log in
            </Link>
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}
