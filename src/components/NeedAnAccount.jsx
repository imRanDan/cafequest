'use client';

import {Text, Link} from "@chakra-ui/react";
import NextLink from "next/link";

const orangePrimary = "#FF6B35";

export default function NeedAnAccount() {
    return (
        <Text fontSize='sm' mt={2} color="gray.700">
            Don't have an account? {" "}
            <Link as={NextLink} href="/signup" color={orangePrimary} fontWeight="600" _hover={{ textDecoration: "underline" }}>
                Create one
            </Link>
        </Text>
    )
}
