// theme.js
"use client";
import { extendTheme } from "@chakra-ui/react";

const config = {
  initialColorMode: "light", // Force light mode
  useSystemColorMode: false, // Don't use system preferences
  forcedColorMode: "light", // Force light mode always
};

const styles = {
  global: {
    body: {
      bg: "white", // Always white background
      color: "gray.900", // Always dark text
    },
  },
};

const theme = extendTheme({
  config,
  styles,
  fonts: {
    heading: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
  },
  colors: {
    brand: {
      50: "#f5faff",
      100: "#dbefff",
      200: "#bfe5ff",
      300: "#9dd6ff",
      400: "#7bc7ff",
      500: "#5ab8ff",
      600: "#4791cc",
      700: "#356a99",
      800: "#244466",
      900: "#122233",
    },
  },
});

export default theme;
