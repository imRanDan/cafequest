"use client"

import { Box, Flex, Button, Text, Spinner } from "@chakra-ui/react";
import Link from "next/link";

export default function Navbar() {
  return (
    <Flex
      px={4}
      py={4}
      justify="space-between"
      align="center"
      bg="gray.800"
      shadow="md"
    >
      <Link href="/" passHref>
        <Text fontSize="xl" fontWeight="bold" color="white" _hover={{ textDecoration: "underline" }}>
          CafeQuest
        </Text>
      </Link>

      <Link href="/landing" passHref>
        <Text fontSize="lg" color="white" _hover={{ textDecoration: "underline" }}>
          About
        </Text>
      </Link>
    
    </Flex>
  );
}
