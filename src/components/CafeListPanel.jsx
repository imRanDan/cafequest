"use client";
import React from "react";
import {
  Box,
  Text,
  Heading,
  VStack,
  HStack,
  Button,
  Icon,
  Divider,
  useBreakpointValue,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";
import { FaHeart, FaMapMarkerAlt, FaClock, FaExternalLinkAlt } from "react-icons/fa";
import { auth, db } from "@/config/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useToast } from "@chakra-ui/react";

const orangePrimary = "#FF6B35";
const orangeDark = "#E55A2B";

// Helper functions (same as Map component)
const getFormattedAddress = (tags) => {
  if (!tags) return null;
  const addressParts = [];
  if (tags["addr:housenumber"] && tags["addr:street"]) {
    addressParts.push(`${tags["addr:housenumber"]} ${tags["addr:street"]}`);
  } else if (tags.address) {
    addressParts.push(tags.address);
  } else if (tags.street) {
    addressParts.push(tags.street);
  }
  if (tags["addr:postcode"]) addressParts.push(tags["addr:postcode"]);
  if (tags["addr:city"]) addressParts.push(tags["addr:city"]);
  if (tags["addr:suburb"]) addressParts.push(tags["addr:suburb"]);
  return addressParts.length > 0 ? addressParts.join(", ") : null;
};

const getOpeningHours = (tags) => {
  return tags?.opening_hours || "Opening hours not available";
};

const getGoogleMapsLink = (cafe) => {
  const name = cafe.tags?.name || "Cafe";
  const query = encodeURIComponent(`${name} near ${cafe.lat},${cafe.lon}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
};

export default function CafeListPanel({ 
  cafes, 
  onCafeClick, 
  selectedCafeId,
  isOpen,
  onClose 
}) {
  const toast = useToast();
  const [savingCafeId, setSavingCafeId] = React.useState(null);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleSaveCafe = async (cafe) => {
    if (!cafe) return;
    try {
      setSavingCafeId(cafe.id);
      const user = auth.currentUser;
      if (!user) {
        toast({
          title: "Not logged in",
          description: "Please log in to save cafes.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const docRef = doc(db, "users", user.uid, "savedCafes", cafe.id.toString());
      await setDoc(docRef, {
        id: cafe.id,
        name: cafe.tags?.name,
        lat: cafe.lat,
        lon: cafe.lon,
        address: getFormattedAddress(cafe.tags),
        openingHours: getOpeningHours(cafe.tags),
        timestamp: Date.now(),
      });

      toast({
        title: "Saved!",
        description: "Cafe has been added to your saved list.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error saving cafe:", error);
      toast({
        title: "Error saving cafe",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSavingCafeId(null);
    }
  };

  const CafeCard = ({ cafe }) => {
    const isSelected = selectedCafeId === cafe.id;
    const address = getFormattedAddress(cafe.tags);
    const hours = getOpeningHours(cafe.tags);

    return (
      <Box
        p={5}
        borderRadius="xl"
        borderWidth="2px"
        borderColor={isSelected ? orangePrimary : "gray.200"}
        bg={isSelected ? `${orangePrimary}05` : "white"}
        cursor="pointer"
        _hover={{
          borderColor: orangePrimary,
          bg: `${orangePrimary}08`,
          transform: "translateY(-2px)",
          boxShadow: "md",
        }}
        transition="all 0.2s"
        onClick={() => onCafeClick(cafe)}
      >
        <VStack align="stretch" spacing={3}>
          <HStack justify="space-between" align="start">
            <Heading size="md" color="gray.900" fontWeight="700">
              {cafe.tags?.name || "Unnamed Cafe"}
            </Heading>
            <Button
              size="sm"
              leftIcon={<FaHeart />}
              colorScheme="pink"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                handleSaveCafe(cafe);
              }}
              isLoading={savingCafeId === cafe.id}
              _hover={{ bg: "pink.50" }}
            >
              Save
            </Button>
          </HStack>

          {address && (
            <HStack spacing={2} color="gray.600">
              <Icon as={FaMapMarkerAlt} color={orangePrimary} boxSize={4} />
              <Text fontSize="sm">{address}</Text>
            </HStack>
          )}

          <HStack spacing={2} color="gray.600">
            <Icon as={FaClock} color={orangePrimary} boxSize={4} />
            <Text fontSize="sm">{hours}</Text>
          </HStack>

          <HStack spacing={3} pt={2}>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<FaExternalLinkAlt />}
              as="a"
              href={getGoogleMapsLink(cafe)}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              borderColor={orangePrimary}
              color={orangePrimary}
              _hover={{ bg: `${orangePrimary}10` }}
            >
              View on Maps
            </Button>
          </HStack>
        </VStack>
      </Box>
    );
  };

  const PanelContent = () => (
    <Box h="100%" bg="white" overflowY="auto">
      <Box p={6} borderBottomWidth="1px" borderBottomColor="gray.200" position="sticky" top={0} bg="white" zIndex={10}>
        <Heading size="lg" color="gray.900" fontWeight="800" mb={2}>
          Nearby Cafes
        </Heading>
        <Text color="gray.600" fontSize="sm">
          {cafes.length} {cafes.length === 1 ? "cafe" : "cafes"} found
        </Text>
      </Box>

      <VStack spacing={4} p={6} align="stretch">
        {cafes.length === 0 ? (
          <Box textAlign="center" py={12}>
            <Text color="gray.500" fontSize="lg">
              No cafes found. Try searching a different location!
            </Text>
          </Box>
        ) : (
          cafes.map((cafe) => (
            <CafeCard key={cafe.id} cafe={cafe} />
          ))
        )}
      </VStack>
    </Box>
  );

  // Mobile: Drawer
  if (isMobile) {
    return (
      <Drawer isOpen={isOpen} placement="bottom" onClose={onClose} size="full">
        <DrawerOverlay />
        <DrawerContent borderTopRadius="2xl">
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            <Heading size="lg">Nearby Cafes</Heading>
            <Text color="gray.600" fontSize="sm" mt={1}>
              {cafes.length} {cafes.length === 1 ? "cafe" : "cafes"} found
            </Text>
          </DrawerHeader>
          <DrawerBody p={0}>
            <VStack spacing={4} p={4} align="stretch">
              {cafes.length === 0 ? (
                <Box textAlign="center" py={12}>
                  <Text color="gray.500">No cafes found.</Text>
                </Box>
              ) : (
                cafes.map((cafe) => (
                  <CafeCard key={cafe.id} cafe={cafe} />
                ))
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop/Tablet: Side Panel
  return (
    <Box
      w={{ base: "100%", md: "400px", lg: "450px" }}
      h="100%"
      borderLeftWidth="1px"
      borderLeftColor="gray.200"
      bg="white"
    >
      <PanelContent />
    </Box>
  );
}

