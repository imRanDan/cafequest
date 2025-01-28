import { Box, Flex, Button, Text, Spinner } from "@chakra-ui/react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session, status } = useSession();

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

      <Box>
        {status === "loading" ? (
          <Spinner size="sm" color="teal.200" />
        ) : session ? (
          <Flex gap={4} align="center">
            <Text color="white">Hello, {session.user.name}</Text>
            <Link href="/profile" passHref>
              <Button variant="ghost" color="white" _hover={{ bg: "gray.600" }}>
                Profile
              </Button>
            </Link>
            <Button
              onClick={() => signOut({ callbackUrl: "/" })}
              colorScheme="teal"
              variant="outline"
            >
              Sign Out
            </Button>
          </Flex>
        ) : (
          <Flex gap={4}>
            <Link href="/auth/login" passHref>
              <Button variant="ghost" color="white" _hover={{ bg: "gray.600" }}>
                Login
              </Button>
            </Link>
            <Link href="/auth/signup" passHref>
              <Button colorScheme="teal">Sign Up</Button>
            </Link>
          </Flex>
        )}
      </Box>
    </Flex>
  );
}
