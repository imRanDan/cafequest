import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
  Link,
  Divider,
  Flex,
} from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box bg="gray.900" color="gray.300" mt={16}>
      <Container as={Stack} maxW={"6xl"} py={10}>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          {/* Column 1 */}
          <Stack align={"flex-start"}>
            <Text fontWeight="bold" mb={2}>
              CafeQuest
            </Text>
            <Link href="/landing">About</Link>
            <Link href="/howtouse">How to Use</Link>
          </Stack>

          {/* Column 2 */}
          <Stack align={"flex-start"}>
            <Text fontWeight="bold" mb={2}>
              Coming Soon
            </Text>
            <Text fontSize="sm" color="gray.500">
              Terms, privacy & more
            </Text>
          </Stack>


          {/* Column 3 */}
          <Stack align={"flex-start"}>
            <Text fontWeight="bold" mb={2}>
              Connect
            </Text>
            <Link href="https://www.instagram.com/" isExternal>
              Instagram
            </Link>
            <Link href="https://www.facebook.com/" isExternal>
              Facebook
            </Link>
          </Stack>
        </SimpleGrid>

        <Divider my={8} borderColor="gray.700" />

        {/* Bottom Row */}
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align="center"
          textAlign={{ base: "center", md: "left" }}
        >
          <Text fontSize="sm">
            &copy; 2025 CafeQuest. All rights reserved. Built by{" "}
            <Link href="https://www.danyalimran.com" isExternal textDecor="underline">
              Danyal Imran
            </Link>
            .
          </Text>
        </Flex>
      </Container>
    </Box>
  );
}
