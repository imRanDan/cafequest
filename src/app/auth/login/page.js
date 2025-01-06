"use client";

import { Box, VStack, Container, Heading, Text, Link } from "@chakra-ui/react";
import LoginForm from "@/components/LoginForm";
import NextLink from "next/link";

export default function LoginPage() {
  return (
    <Box minH="100vh" bg="gray.50" py={12}>
      <Container maxW="md" bg="white" p={8} borderRadius="lg" boxShadow="md">
        <VStack spacing={6}>
          <Heading textAlign={"center"} color="gray.800">
            Welcome to CafeQuest
          </Heading>
          <Text color="gray.600">Find and save your favorite cafes</Text>
          <LoginForm />
          <Text color="gray.600">
            Don't have an account?{" "}
            <Link as={NextLink} href="/auth/signup" color="teal.500">
              Sign up
            </Link>
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}
