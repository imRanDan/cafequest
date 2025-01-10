import { Box, Flex, Button, Text } from "@chakra-ui/react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <Flex
      px={4}
      py={4}
      justify="space-between"
      align="center"
      bg="gray.700"
      shadow="sm"
    >
      <Link href="/">
        <Text fontSize="xl" fontWeight="bold">
          CafeQuest
        </Text>
      </Link>

      <Box>
        {session ? (
          <Flex gap={4} align="center">
            <Text>Hello, {session.user.name}</Text>
            <Button
              onClick={() => signOut()}
              colorScheme="teal"
              variant="outline"
            >
              Sign Out
            </Button>
          </Flex>
        ) : (
          <Flex gap={4}>
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/signup">
              <Button colorScheme="teal">Sign Up</Button>
            </Link>
          </Flex>
        )}
      </Box>
    </Flex>
  );
}
