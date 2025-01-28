import { useState } from "react";
import { signIn } from "next-auth/react";
import { Box, Button, FormControl, FormLabel, Input, VStack, useToast, useColorModeValue, Text } from "@chakra-ui/react";
import { FaSignInAlt } from "react-icons/fa";

export default function LoginForm() {
  const bgColor = useColorModeValue("gray.300", "gray.500");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const cardBgColor = useColorModeValue("gray.500", "gray.700");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      toast({
        title: "Error",
        description: "Invalid credentials",
        status: "error",
        duration: 3000,
      });
    }

    setIsLoading(false);
  };


  return (
    <Box bg={bgColor} p={6} borderRadius="lg" boxShadow="md">
      <VStack spacing={4} textAlign="center">
        <FaSignInAlt size={30} color={iconColor} />
        <Text fontSize="2xl" color={textColor}>Log In</Text>
        <FormControl id="email" isRequired>
          <FormLabel color={textColor}>Email</FormLabel>
          <Input
            borderColor={"gray.800"}
            color={"gray.800"}
            _placeholder={{ color: "gray.800" }}
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel color={textColor}>Password</FormLabel>
          <Input
            borderColor={"gray.800"}
            color={"gray.800"}
            _placeholder={{ color: "gray.200" }}
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <Button
          type="submit"
          isLoading={isLoading}
          colorScheme="teal"
          width="full"
        >
          Log In
        </Button>
        <Button
          color={"gray.800"}
          borderColor={"gray.800"}
          rounded={"full"}
          onClick={() => signIn("google")}
          variant="outline"
          width="full"
        >
          Sign in with Google
        </Button>
      </VStack>
    </Box>
  );
}
