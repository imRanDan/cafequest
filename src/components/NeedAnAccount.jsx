'use client';

import {Text} from "@chakra-ui/react";
import NextLink from "next/link";


export default function NeedAnAccount() {
    return (
        <Text fontSize='sm' mt={2}>
            Don't have an account? {" "}
            <NextLink  href="signup" passHref >
                Create one
            </NextLink>
        </Text>
    )
}