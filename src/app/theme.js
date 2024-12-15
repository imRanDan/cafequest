// theme.js
"use client";
import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools"; // For conditional styles based on color mode

const config = {
  initialColorMode: "dark", // Default to dark mode
  useSystemColorMode: true, // Allow switching based on system preferences
};

const styles = {
  global: (props) => ({
    body: {
      bg: mode("gray.50", "gray.900")(props), // Light: gray.50; Dark: gray.900
      color: mode("gray.800", "gray.100")(props), // Light: gray.800; Dark: gray.100
    },
  }),
};

const theme = extendTheme({
  config,
  styles,
  fonts: {
    heading: "'Inter', sans-serif", // You can replace 'Inter' with your font
    body: "'Inter', sans-serif",
  },
  colors: {
    brand: {
      50: "#f5faff",
      100: "#dbefff",
      200: "#bfe5ff",
      300: "#9dd6ff",
      400: "#7bc7ff",
      500: "#5ab8ff", // Primary brand color
      600: "#4791cc",
      700: "#356a99",
      800: "#244466",
      900: "#122233",
    },
  },
});

export default theme;
