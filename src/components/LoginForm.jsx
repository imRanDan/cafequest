import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button, Input, VStack, Text, useToast } from "@chakra-ui/react";

export default function LoginForm() {
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
    <VStack as="form" onSubmit={handleSubmit} spacing={4}>
      <Input
        borderColor={"gray.800"}
        color={"gray.800"}
        _placeholder={{ color: "gray.800" }}
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        borderColor={"gray.800"}
        color={"gray.800"}
        _placeholder={{ color: "gray.200" }}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        type="submit"
        isLoading={isLoading}
        colorScheme="teal"
        width="100%"
      >
        Sign In
      </Button>
      <Button
        color={"gray.800"}
        borderColor={"gray.800"}
        rounded={"full"}
        onClick={() => signIn("google")}
        variant="outline"
        width="100%"
      >
        Sign in with Google
      </Button>
    </VStack>
  );
}
