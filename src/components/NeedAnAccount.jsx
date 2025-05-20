'use client';

import {Text, Link as ChakraLink} from "@chakra-ui/react";
import NextLink from "next/link";


export default function NeedAnAccount() {
    return (
        <Text fontSize='sm' mt={2}>
            Don't have an account? {" "}
            <NextLink href="signup" passHref>
                <ChakraLink color='teal.500'>Create one</ChakraLink>
            </NextLink>
        </Text>
    )
}