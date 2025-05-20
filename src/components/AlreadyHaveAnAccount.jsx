"use client"

import { Text, Link as ChakraLink } from "@chakra-ui/react"
import NextLink from "next/link";

export default function AlreadyHaveAnAccount() {
    return (
        <Text fontSize='sm' mt={2}>
            Already have an account? {" "}
            <NextLink href='login' passHref>
                <ChakraLink color='teal.500'>Log in here</ChakraLink>
            </NextLink>
        </Text>
    );
}