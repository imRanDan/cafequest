import { Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";
import Map from "./Map";

const Header = () => {
  return (
    <Flex justifyContent={"center"} alignItems={"center"}>
      <Heading>Welcome to CafeQuest ☕</Heading>
    </Flex>
  );
};

export default Header;
