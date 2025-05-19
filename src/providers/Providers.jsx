"use client";

import { ChakraProvider } from "@chakra-ui/react";
import ThemeProvider from "@/utils/ThemeProvider";
import { AuthProvider } from "@/utils/AuthProvider";
import theme from "../app/theme";

export function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <ChakraProvider theme={theme}>
      {children}
      </ChakraProvider>
    </ThemeProvider>

  );
}
