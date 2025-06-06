import { Box, Flex, Link, Text, Stack, useColorModeValue } from "@chakra-ui/react";

export default function Footer() {
  const bg = useColorModeValue("gray.100", "gray.900");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const sectionHeading = useColorModeValue("gray.800", "white");

  return (
    <Box bg={bg} py={10} px={6} mt={10}>
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        maxW="6xl"
        mx="auto"
        gap={10}
      >
        <Stack spacing={2}>
          <Text fontWeight="bold" color={sectionHeading}>
            CafeQuest
          </Text>
          <Link href="/landing" color={textColor}>About</Link>
          <Link href="/howtouse" color={textColor}>How to Use</Link>
        </Stack>

        <Stack spacing={2}>
          <Text fontWeight="bold" color={sectionHeading}>
            Coming Soon
          </Text>
          <Text color={textColor}>Terms, privacy & more</Text>
        </Stack>

        <Stack spacing={2}>
          <Text fontWeight="bold" color={sectionHeading}>
            Connect
          </Text>
          <Link href="https://instagram.com" isExternal color={textColor}>Instagram</Link>
          <Link href="https://facebook.com" isExternal color={textColor}>Facebook</Link>
        </Stack>
      </Flex>

      <Text textAlign="center" mt={10} fontSize="sm" color={textColor}>
        &copy; 2025 CafeQuest. All rights reserved. Built by{" "}
        <Link href="https://www.danyalimran.com/" isExternal color="teal.500">
          Danyal Imran
        </Link>.
      </Text>
    </Box>
  );
}
