"use client"

import { Text, Link } from "@chakra-ui/react"
import NextLink from "next/link";

const orangePrimary = "#FF6B35";

export default function AlreadyHaveAnAccount() {
    return (
        <Text fontSize='sm' mt={2} color="gray.700">
            Already have an account? {" "}
            <Link as={NextLink} href="/login" color={orangePrimary} fontWeight="600" _hover={{ textDecoration: "underline" }}>
                Log in here
            </Link>
        </Text>
    );
}
