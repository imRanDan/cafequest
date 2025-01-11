"use client";

import {
  Box,
  VStack,
  Container,
  Heading,
  Button,
  Text,
  Input,
  FormControl,
  FormLabel,
  Divider,
} from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import GoogleIcon from "@/components/GoogleIcon";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (session) {
      router.push("/profile");
    }
  }, [session, router]);

  if (status === "loading") {
    return <Box>Loading...</Box>;
  }

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Email login logic here
    setIsLoading(false);
  };

  return (
    <Box minH="100vh" bg="gray.100" py={12}>
      <Container maxW="md" bg="white" p={8} borderRadius="lg" boxShadow="lg">
        <VStack spacing={6}>
          <Heading size="xl" color="gray.800">
            Sign In
          </Heading>

          <Divider />

          <form onSubmit={handleEmailLogin} style={{ width: "100%" }}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel color="gray.800">Email</FormLabel>
                <Input
                  color="gray.800"
                  borderColor="gray.800"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel color="gray.800">Password</FormLabel>
                <Input
                  color="gray.800"
                  borderColor="gray.800"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>

              <Button
                type="submit"
                w="full"
                colorScheme="teal"
                isLoading={isLoading}
              >
                Sign In
              </Button>

              <Button
                w="full"
                onClick={() => signIn("google", { callbackUrl: "/profile" })}
                colorScheme="blue"
                leftIcon={<GoogleIcon />}
              >
                Continue with Google
              </Button>
            </VStack>
          </form>

          <Text color="gray.600">
            Don't have an account?{" "}
            <Button
              variant="link"
              color="teal.600"
              _hover={{ color: "teal.700" }}
              onClick={() => router.push("/auth/signup")}
            >
              Sign Up
            </Button>
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}
