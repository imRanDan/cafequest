"use client";

import { VStack, Container, Heading, Text, Link } from "@chakra-ui/react";
import SignupForm from "@/components/SignupForm";
import NextLink from "next/link";

export default function SignupPage() {
  return (
    <Container maxW="md" py={12}>
      <VStack spacing={6}>
        <Heading>Join CafeQuest</Heading>
        <Text>Create an account to save your favorite cafes</Text>
        <SignupForm />
        <Text>
          Already have an account?{" "}
          <Link as={NextLink} href="/auth/login" color="teal.500">
            Log in
          </Link>
        </Text>
      </VStack>
    </Container>
  );
}
