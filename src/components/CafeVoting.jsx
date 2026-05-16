"use client";

import { useState, useEffect } from "react";
import { Box, HStack, VStack, Text, Button, Icon, Badge, IconButton, Collapse, useDisclosure } from "@chakra-ui/react";
import { FaLaptop, FaPlug, FaWifi, FaCheck, FaTimes, FaDollarSign, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { auth, db } from "@/config/firebase";
import { doc, setDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useToast } from "@chakra-ui/react";

const orangePrimary = "#FF6B35";

const amenities = [
  { key: "laptopFriendly", label: "Laptop Friendly", icon: FaLaptop, color: "blue" },
  { key: "hasOutlets", label: "Has Outlets", icon: FaPlug, color: "green" },
  { key: "hasWifi", label: "Has WiFi", icon: FaWifi, color: "purple" },
  { key: "wifiFree", label: "WiFi is Free", icon: FaDollarSign, color: "orange" },
];

export default function CafeVoting({ cafeId, cafeName }) {
  const [votes, setVotes] = useState({
    laptopFriendly: { yes: 0, no: 0, userVote: null },
    hasOutlets: { yes: 0, no: 0, userVote: null },
    hasWifi: { yes: 0, no: 0, userVote: null },
    wifiFree: { yes: 0, no: 0, userVote: null },
  });
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState({});
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: false });
  const toast = useToast();

  // Fetch aggregated votes and user's vote
  useEffect(() => {
    if (!cafeId) return;

    const fetchVotes = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        
        // Get all votes for this cafe
        const votesRef = collection(db, "cafeVotes", cafeId.toString(), "votes");
        const votesSnapshot = await getDocs(votesRef);
        
        const aggregated = {
          laptopFriendly: { yes: 0, no: 0, userVote: null },
          hasOutlets: { yes: 0, no: 0, userVote: null },
          hasWifi: { yes: 0, no: 0, userVote: null },
          wifiFree: { yes: 0, no: 0, userVote: null },
        };

        votesSnapshot.forEach((docSnap) => {
          const voteData = docSnap.data();
          const isUserVote = user && docSnap.id === user.uid;

          amenities.forEach((amenity) => {
            if (voteData[amenity.key] === true) {
              aggregated[amenity.key].yes++;
              if (isUserVote) aggregated[amenity.key].userVote = true;
            } else if (voteData[amenity.key] === false) {
              aggregated[amenity.key].no++;
              if (isUserVote) aggregated[amenity.key].userVote = false;
            }
          });
        });

        setVotes(aggregated);
      } catch (error) {
        console.error("Error fetching votes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVotes();

    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged(() => {
      fetchVotes();
    });

    return () => unsubscribe();
  }, [cafeId]);

  const handleVote = async (amenityKey, value) => {
    const user = auth.currentUser;
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to vote on amenities.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setVoting((prev) => ({ ...prev, [amenityKey]: true }));

      const voteRef = doc(db, "cafeVotes", cafeId.toString(), "votes", user.uid);
      
      // Get existing vote to update
      const existingVote = await getDoc(voteRef);
      const existingData = existingVote.exists() ? existingVote.data() : {};

      // Update the specific amenity vote
      await setDoc(voteRef, {
        ...existingData,
        [amenityKey]: value,
        cafeId: cafeId.toString(),
        cafeName: cafeName || "Unnamed Cafe",
        userId: user.uid,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      // Update local state
      setVotes((prev) => {
        const newVotes = { ...prev };
        const prevUserVote = newVotes[amenityKey].userVote;
        
        // Remove previous vote count
        if (prevUserVote === true) newVotes[amenityKey].yes--;
        if (prevUserVote === false) newVotes[amenityKey].no--;

        // Add new vote count
        if (value === true) newVotes[amenityKey].yes++;
        if (value === false) newVotes[amenityKey].no++;

        newVotes[amenityKey].userVote = value;
        return newVotes;
      });

      toast({
        title: "Vote recorded!",
        description: `Thanks for helping the community.`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error submitting vote:", error);
      toast({
        title: "Error",
        description: "Failed to submit vote. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setVoting((prev) => ({ ...prev, [amenityKey]: false }));
    }
  };

  const getPercentage = (yes, no) => {
    const total = yes + no;
    if (total === 0) return null;
    return Math.round((yes / total) * 100);
  };

  const getTotalVotes = () => {
    return amenities.reduce((total, amenity) => {
      const voteData = votes[amenity.key];
      return total + voteData.yes + voteData.no;
    }, 0);
  };

  if (loading) {
    return (
      <Box p={2} bg="gray.50" borderRadius="md">
        <Text fontSize="xs" color="gray.500">Loading...</Text>
      </Box>
    );
  }

  const totalVotes = getTotalVotes();
  const hasVotes = totalVotes > 0;

  return (
    <Box bg="gray.50" borderRadius="md" borderWidth="1px" borderColor="gray.200">
      <Button
        onClick={onToggle}
        variant="ghost"
        size="sm"
        w="100%"
        justifyContent="space-between"
        p={2}
        h="auto"
        _hover={{ bg: "gray.100" }}
        fontWeight="500"
      >
        <HStack spacing={2}>
          <Text fontSize="xs" color="gray.700">
            Community Votes
          </Text>
          {hasVotes && (
            <Badge colorScheme="blue" fontSize="xs" px={1.5}>
              {totalVotes}
            </Badge>
          )}
        </HStack>
        <Icon 
          as={isOpen ? FaChevronUp : FaChevronDown} 
          boxSize={3} 
          color="gray.500"
        />
      </Button>

      <Collapse in={isOpen} animateOpacity>
        <Box p={2} pt={0}>
          <VStack spacing={2} align="stretch" mt={2}>
            {amenities.map((amenity) => {
              const voteData = votes[amenity.key];
              const total = voteData.yes + voteData.no;
              const percentage = getPercentage(voteData.yes, voteData.no);
              const isVoting = voting[amenity.key];

              return (
                <Box key={amenity.key}>
                  <HStack justify="space-between" mb={1}>
                    <HStack spacing={1.5}>
                      <Icon as={amenity.icon} color={`${amenity.color}.500`} boxSize={3} />
                      <Text fontSize="xs" fontWeight="500" color="gray.700">
                        {amenity.label}
                      </Text>
                    </HStack>
                    {total > 0 && (
                      <Badge
                        colorScheme={percentage >= 50 ? "green" : "red"}
                        fontSize="xs"
                        px={1.5}
                      >
                        {percentage}%
                      </Badge>
                    )}
                  </HStack>
                  
                  <HStack spacing={1}>
                    <Button
                      size="xs"
                      leftIcon={<Icon as={FaCheck} />}
                      colorScheme={voteData.userVote === true ? "green" : "gray"}
                      variant={voteData.userVote === true ? "solid" : "outline"}
                      onClick={() => handleVote(amenity.key, true)}
                      isLoading={isVoting}
                      flex="1"
                      fontSize="xs"
                      h="22px"
                      px={2}
                    >
                      Yes
                    </Button>
                    <Button
                      size="xs"
                      leftIcon={<Icon as={FaTimes} />}
                      colorScheme={voteData.userVote === false ? "red" : "gray"}
                      variant={voteData.userVote === false ? "solid" : "outline"}
                      onClick={() => handleVote(amenity.key, false)}
                      isLoading={isVoting}
                      flex="1"
                      fontSize="xs"
                      h="22px"
                      px={2}
                    >
                      No
                    </Button>
                  </HStack>
                </Box>
              );
            })}
          </VStack>
        </Box>
      </Collapse>
    </Box>
  );
}
