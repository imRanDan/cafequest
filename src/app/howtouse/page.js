"use client";

import {
  Box,
  Flex,
  Heading,
  Text,
  useColorModeValue,
  Divider,
  Button,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Link from "next/link";

const MotionBox = motion.create(Box);
const MotionHeading = motion.create(Heading);
const MotionText = motion.create(Text);
const MotionButton = motion(Button);

export default function HowToUse() {
  const bg = useColorModeValue("gray.50", "gray.800");
  const border = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");

  return (
    <Flex justify="center" p={6}>
      <MotionBox
        maxW="4xl"
        w="full"
        p={8}
        bg={bg}
        borderRadius="xl"
        borderWidth="1px"
        borderColor={border}
        boxShadow="md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <MotionHeading
          size="xl"
          mb={4}
          textAlign="center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          How to Use CafeQuest
        </MotionHeading>

        <Divider mb={6} />

        {steps.map((step, index) => (
          <MotionBox
            key={index}
            mb={6}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.2, duration: 0.5 }}
          >
            <Heading size="md" mb={2} color={textColor}>
              {step.title}
            </Heading>
            <Text color={textColor}>{step.description}</Text>
          </MotionBox>

          
        ))}

                {/* CTA */}
          <Box textAlign="center">
            <Link href="/" passHref>
              <MotionButton
                colorScheme="teal"
                size="lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                Start Exploring
              </MotionButton>
            </Link>
          </Box>
      </MotionBox>
  
    </Flex>
  );
}

const steps = [
  {
    title: "1. Enable Your Location",
    description:
      "CafeQuest uses your device's location to show cafes nearby. Make sure location access is allowed in your browser or device settings.",
  },
  {
    title: "2. Search by Area",
    description:
      "If you're planning ahead, you can search any area or city using the search bar. We'll display cafes within a 5km radius.",
  },
  {
    title: "3. Save Your Favorites",
    description:
      "When logged in, you can save cafes you like for easy access later. Your saved list is tied to your account — not just your device.",
  },
  {
    title: "4. Explore via the Map",
    description:
      "Use the interactive map to click on any cafe marker and view more details. It's the fastest way to explore what’s around you.",
  },
];
