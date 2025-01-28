"use client";

import { VStack, Container, Heading, Text, Link, Box, useColorModeValue } from "@chakra-ui/react";
import SignupForm from "@/components/SignupForm";
import NextLink from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { text } from "figlet";

export default function SignupPage() {
  const bgColor = useColorModeValue("gray.300", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const cardBgColor = useColorModeValue("gray.200", "gray.700");

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/"); // Redirect if already logged in
    }
  }, [session, router]);

  return (
    <Box minH="100vh" bg={bgColor} py={12}>
      <Container maxW="md" bg={cardBgColor} p={8} borderRadius="lg" boxShadow="md">
        <VStack spacing={6}>
          <Heading size="xl" color={textColor}>
            Join CafeQuest
          </Heading>
          <Text fontSize="md" color={textColor} textAlign="center">
            Create an account to save your favorite cafes
          </Text>
          <SignupForm />
          <Text color={textColor}>
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
