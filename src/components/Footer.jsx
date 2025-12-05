import { Box, Flex, Link, Text, Stack } from "@chakra-ui/react";

const orangePrimary = "#FF6B35";

export default function Footer() {
  return (
    <Box bg="white" py={10} px={6} borderTopWidth="1px" borderTopColor="gray.200">
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        maxW="7xl"
        mx="auto"
        gap={10}
      >
        <Stack spacing={2}>
          <Text fontWeight="800" fontSize="lg" color={orangePrimary}>
            CafeQuest
          </Text>
          <Link href="/landing" color="gray.600" _hover={{ color: orangePrimary }}>About</Link>
          <Link href="/howtouse" color="gray.600" _hover={{ color: orangePrimary }}>How to Use</Link>
        </Stack>

        <Stack spacing={2}>
          <Text fontWeight="700" color="gray.900">
            Coming Soon
          </Text>
          <Text color="gray.600">Terms, privacy & more</Text>
        </Stack>

        <Stack spacing={2}>
          <Text fontWeight="700" color="gray.900">
            Connect
          </Text>
          <Link href="https://instagram.com" isExternal color="gray.600" _hover={{ color: orangePrimary }}>Instagram</Link>
          <Link href="https://facebook.com" isExternal color="gray.600" _hover={{ color: orangePrimary }}>Facebook</Link>
        </Stack>
      </Flex>

      <Text textAlign="center" mt={10} fontSize="sm" color="gray.600">
        &copy; 2025 CafeQuest. All rights reserved. Built by{" "}
        <Link href="https://www.danyalimran.com/" isExternal color={orangePrimary} fontWeight="600">
          Danyal Imran
        </Link>.
      </Text>
    </Box>
  );
}
