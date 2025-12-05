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
  useBreakpointValue,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  IconButton,
} from "@chakra-ui/react";
import { FaHeart, FaMapMarkerAlt, FaClock, FaExternalLinkAlt, FaChevronRight, FaChevronLeft } from "react-icons/fa";
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
  onClose,
  isCollapsed,
  onToggleCollapse
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
        p={4}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={isSelected ? orangePrimary : "gray.200"}
        bg={isSelected ? `${orangePrimary}05` : "white"}
        cursor="pointer"
        _hover={{
          borderColor: orangePrimary,
          bg: `${orangePrimary}08`,
        }}
        transition="all 0.2s"
        onClick={() => onCafeClick(cafe)}
      >
        <VStack align="stretch" spacing={2}>
          <HStack justify="space-between" align="start">
            <Heading size="sm" color="gray.900" fontWeight="700" flex="1">
              {cafe.tags?.name || "Unnamed Cafe"}
            </Heading>
            <Button
              size="xs"
              leftIcon={<FaHeart />}
              variant="outline"
              borderColor="pink.400"
              color="pink.500"
              onClick={(e) => {
                e.stopPropagation();
                handleSaveCafe(cafe);
              }}
              isLoading={savingCafeId === cafe.id}
              _hover={{ bg: "pink.50", borderColor: "pink.500" }}
            >
              Save
            </Button>
          </HStack>

          {address && (
            <HStack spacing={2} color="gray.600">
              <Icon as={FaMapMarkerAlt} color={orangePrimary} boxSize={3} />
              <Text fontSize="xs">{address}</Text>
            </HStack>
          )}

          <HStack spacing={2} color="gray.600">
            <Icon as={FaClock} color={orangePrimary} boxSize={3} />
            <Text fontSize="xs" noOfLines={1}>{hours}</Text>
          </HStack>

          <Button
            size="xs"
            variant="outline"
            leftIcon={<FaExternalLinkAlt />}
            as="a"
            href={getGoogleMapsLink(cafe)}
            target="_blank"
            onClick={(e) => e.stopPropagation()}
            borderColor={orangePrimary}
            color={orangePrimary}
            _hover={{ bg: `${orangePrimary}10` }}
            mt={1}
          >
            View on Maps
          </Button>
        </VStack>
      </Box>
    );
  };

  const PanelContent = () => (
    <Box h="100%" bg="white" overflowY="auto">
      <Box 
        p={4} 
        borderBottomWidth="1px" 
        borderBottomColor="gray.200" 
        position="sticky" 
        top={0} 
        bg="white" 
        zIndex={10}
      >
        <HStack justify="space-between" align="center">
          <Box>
            <Heading size="md" color={orangePrimary} fontWeight="800" mb={1}>
              Nearby Cafes
            </Heading>
            <Text color="gray.600" fontSize="xs">
              {cafes.length} {cafes.length === 1 ? "cafe" : "cafes"} found
            </Text>
          </Box>
          {!isMobile && (
            <IconButton
              aria-label="Collapse panel"
              icon={isCollapsed ? <FaChevronLeft /> : <FaChevronRight />}
              size="sm"
              variant="ghost"
              onClick={onToggleCollapse}
              color={orangePrimary}
            />
          )}
        </HStack>
      </Box>

      <VStack spacing={3} p={4} align="stretch">
        {cafes.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Text color="gray.500" fontSize="sm">
              No cafes found. Try searching a different location!
            </Text>
          </Box>
        ) : (
          cafes.map((cafe, index) => (
            <CafeCard key={`${cafe.id}-${cafe.lat}-${cafe.lon}-${index}`} cafe={cafe} />
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
            <Heading size="lg" color={orangePrimary}>Nearby Cafes</Heading>
            <Text color="gray.600" fontSize="sm" mt={1}>
              {cafes.length} {cafes.length === 1 ? "cafe" : "cafes"} found
            </Text>
          </DrawerHeader>
          <DrawerBody p={0}>
            <VStack spacing={3} p={4} align="stretch">
              {cafes.length === 0 ? (
                <Box textAlign="center" py={12}>
                  <Text color="gray.500">No cafes found.</Text>
                </Box>
              ) : (
                cafes.map((cafe, index) => (
                  <CafeCard key={`${cafe.id}-${cafe.lat}-${cafe.lon}-${index}`} cafe={cafe} />
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
      w={isCollapsed ? "60px" : { base: "100%", md: "380px", lg: "420px" }}
      h="100%"
      borderLeftWidth="1px"
      borderLeftColor="gray.200"
      bg="white"
      transition="width 0.3s"
      position="relative"
    >
      {isCollapsed ? (
        <Box h="100%" display="flex" alignItems="center" justifyContent="center" p={2}>
          <IconButton
            aria-label="Expand panel"
            icon={<FaChevronLeft />}
            size="md"
            variant="ghost"
            onClick={onToggleCollapse}
            color={orangePrimary}
            transform="rotate(180deg)"
          />
        </Box>
      ) : (
        <>
          <PanelContent />
        </>
      )}
    </Box>
  );
}
