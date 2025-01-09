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
          <Heading size="xl" color="gray.800">
            Join CafeQuest
          </Heading>
          <Text fontSize="md" color="gray.600" textAlign="center">
            Create an account to save your favorite cafes
          </Text>
          <SignupForm />
          <Text color="gray.600">
            Already have an account?{" "}
            <Link
              as={NextLink}
              href="/auth/login"
              color="teal.500"
              _hover={{ color: "teal.600", textDecoration: "underline" }}
            >
              Log in
            </Link>
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}
