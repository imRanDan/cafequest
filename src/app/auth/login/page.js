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
  useColorModeValue,
} from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import GoogleIcon from "@/components/GoogleIcon";
import { text } from "figlet";

export default function LoginPage() {
  const bgColor = useColorModeValue("gray.300", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const cardBgColor = useColorModeValue("gray.200", "gray.700");

  const { data: session, status } = useSession();
  const router = useRouter();
  const toast = useToast();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          status: "error",
          duration: 3000,
        });
        return;
      }

      router.push("/profile");
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg={bgColor} py={12}>
      <Container maxW="md" bg={cardBgColor} p={8} borderRadius="lg" boxShadow="lg">
        <VStack spacing={6}>
          <Heading size="xl" color={textColor}>
            Sign In
          </Heading>

          <Divider />

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel color={textColor}>Email</FormLabel>
                <Input
                  color={textColor}
                  borderColor="gray.800"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel color={textColor}>Password</FormLabel>
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
