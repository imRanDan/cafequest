"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  VStack,
  Input,
  Button,
  useToast,
  FormControl,
  FormLabel,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

export default function SignupForm() {
  const bgColor = useColorModeValue("gray.300", "gray.800");
  const cardBgColor = useColorModeValue("gray.500", "gray.700");
    const textColor = useColorModeValue("gray.800", "black"); // Darker text for light mode
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error(await res.text());

      toast({
        title: "Account created successfully!",
        status: "success",
        duration: 3000,
      });
      router.push("/auth/login");
    } catch (error) {
      toast({
        title: "Error creating account",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack as="form" onSubmit={handleSubmit} spacing={4} w="100%">
      <FormControl isInvalid={errors.name}>
        <FormLabel color={"gray.800"}>Name</FormLabel>
        <Input
          color={"gray.800"}
          borderColor={"gray.800"}
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter your name"
        />
        <FormErrorMessage>{errors.name}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={errors.email}>
        <FormLabel color={"gray.800"}>Email</FormLabel>
        <Input
          color={"gray.800"}
          borderColor={"gray.800"}
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Enter your email"
        />
        <FormErrorMessage>{errors.email}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={errors.password}>
        <FormLabel color={"gray.800"}>Password</FormLabel>
        <InputGroup>
          <Input
            color={"gray.800"}
            borderColor={"gray.800"}
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="Enter a password"
          />
          <InputRightElement>
            <IconButton
              icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
              onClick={() => setShowPassword(!showPassword)}
              variant="ghost"
              aria-label={showPassword ? "Hide password" : "Show password"}
            />
          </InputRightElement>
        </InputGroup>
        <FormErrorMessage>{errors.password}</FormErrorMessage>
      </FormControl>

      <Button
        type="submit"
        colorScheme="teal"
        width="100%"
        isLoading={isLoading}
        loadingText="Creating account..."
      >
        Sign Up
      </Button>
    </VStack>
  );
}
