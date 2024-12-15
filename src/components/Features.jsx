import React from "react";
import {
  Flex,
  Box,
  Icon,
  chakra,
  Stack,
  SimpleGrid,
  GridItem,
} from "@chakra-ui/react";

const FeatureCard = ({ title, children }) => {
  return (
    <Flex>
      <Flex shrink={0}>
        <Icon
          boxSize={5}
          mt={1}
          mr={2}
          color="brand.500"
          _dark={{
            color: "brand.300",
          }}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          ></path>
        </Icon>
      </Flex>
      <Box ml={4}>
        <chakra.dt
          fontSize="lg"
          fontWeight="bold"
          lineHeight="6"
          _light={{
            color: "gray.900",
          }}
        >
          {title}
        </chakra.dt>
        <chakra.dd
          mt={2}
          color="gray.500"
          _dark={{
            color: "gray.400",
          }}
        >
          {children}
        </chakra.dd>
      </Box>
    </Flex>
  );
};

export const Features = () => {
  return (
    <Flex
      bg="#edf3f8"
      _dark={{
        bg: "#3e3e3e",
      }}
      p={20}
      w="auto"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        shadow="xl"
        bg="white"
        _dark={{
          bg: "gray.800",
        }}
        px={8}
        py={20}
        mx="auto"
      >
        <SimpleGrid
          alignItems="center"
          columns={{
            base: 1,
            lg: 3,
          }}
          spacingY={{
            base: 10,
            lg: 32,
          }}
          spacingX={{
            base: 10,
            lg: 24,
          }}
        >
          <Box alignSelf="start">
            <chakra.h2
              _light={{
                color: "brand.500",
              }}
              fontWeight="semibold"
              textTransform="uppercase"
              letterSpacing="wide"
            >
              CafeQuest
            </chakra.h2>
            <chakra.h2
              mb={3}
              fontSize={{
                base: "3xl",
                md: "4xl",
              }}
              fontWeight="extrabold"
              textAlign={{
                base: "center",
                sm: "left",
              }}
              _light={{
                color: "black",
              }}
              lineHeight="shorter"
              letterSpacing="tight"
            >
              All-in-one platform for finding your next cafe
            </chakra.h2>
            <chakra.p
              mb={6}
              fontSize={{
                base: "lg",
                md: "xl",
              }}
              textAlign={{
                base: "center",
                sm: "left",
              }}
              color="gray.600"
              _dark={{
                color: "gray.500",
              }}
            >
              Looking to get your caffeine fix and discover and enjoy the local
              scene? Whether you're going on your own, with friends, or on a
              date, cafequest will help you find your next spot.
            </chakra.p>
          </Box>
          <GridItem colSpan={2}>
            <Stack
              spacing={{
                base: 10,
                md: 0,
              }}
              display={{
                md: "grid",
              }}
              gridTemplateColumns={{
                md: "repeat(2,1fr)",
              }}
              gridColumnGap={{
                md: 8,
              }}
              gridRowGap={{
                md: 10,
              }}
            >
              <FeatureCard title="Location-Based Discovery">
                CafeQuest uses your location to help you find local cafes
                tailored to your preferences. Whether you're exploring solo,
                meeting up with friends, or on a date, we'll guide you to your
                next perfect spot.{" "}
              </FeatureCard>
              <FeatureCard title="Seamless Search Experience">
                With CafeQuest, discovering your next cafe is effortless. Filter
                by location, ambiance, or offerings to find exactly what you're
                looking for, anytime and anywhere.
              </FeatureCard>
              <FeatureCard title="Cafe Recommendations">
                {" "}
                CafeQuest learns your preferences to offer personalized
                recommendations. From cozy hideaways to trendy spots, find cafes
                that match your vibe and get exactly what you're craving.
              </FeatureCard>
              <FeatureCard title="Save and Share Your Favorites">
                {" "}
                Found a cafe you love? Save it to your personal list, share it
                with friends, or come back whenever you need a new spot.
                CafeQuest makes sure your favorite cafes are always at your
                fingertips.{" "}
              </FeatureCard>
              <FeatureCard title="Explore New Cafes">
                {" "}
                CafeQuest makes discovering new cafes easy. Break out of your
                routine, explore hidden gems in your area, and enjoy new
                experiences with every visit.
              </FeatureCard>
              <FeatureCard title="User Reviews and Ratings">
                {" "}
                Read reviews from fellow coffee enthusiasts to make the best
                choice. With CafeQuest’s community feedback, you'll know exactly
                what to expect from every cafe before you go.{" "}
              </FeatureCard>
            </Stack>
          </GridItem>
        </SimpleGrid>
      </Box>
    </Flex>
  );
};
