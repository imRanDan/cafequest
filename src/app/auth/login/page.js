"use client";

import { VStack, Container, Heading, Text, Link } from "@chakra-ui/react";
import LoginForm from "@/components/LoginForm";
import NextLink from "next/link";

export default function LoginPage() {
  return (
    <Container maxW="md" py={12}>
      <VStack spacing={6}>
        <Heading>Welcome to CafeQuest</Heading>
        <Text>Find and save your favorite cafes</Text>
        <LoginForm />
        <Text>
          Don't have an account?{" "}
          <Link as={NextLink} href="/auth/signup" color="teal.500">
            Sign up
          </Link>
        </Text>
      </VStack>
    </Container>
  );
}
