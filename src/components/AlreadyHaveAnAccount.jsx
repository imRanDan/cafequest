"use client"

import { Text} from "@chakra-ui/react"
import NextLink from "next/link";

export default function AlreadyHaveAnAccount() {
    return (
        <Text fontSize='sm' mt={2}>
            Already have an account? {" "}
            <NextLink href='login' passHref>
                Log in here
            </NextLink>
        </Text>
    );
}