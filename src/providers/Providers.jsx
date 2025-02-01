"use client";

import { ChakraProvider } from "@chakra-ui/react";
import theme from "../app/theme";

export function Providers({ children }) {
  return (
    <ChakraProvider theme={theme}>{children}</ChakraProvider>
  );
}
