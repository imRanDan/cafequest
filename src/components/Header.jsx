import { Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";
import Map from "./Map";

const Header = () => {
  return (
    <Flex justifyContent={"center"} alignItems={"center"}>
      <Heading px={6} py={6}>Welcome to CafeQuest ☕</Heading>
    </Flex>
  );
};

export default Header;
