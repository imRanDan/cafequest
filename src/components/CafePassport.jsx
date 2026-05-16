"use client";

import { useState, useEffect } from "react";
import { Box, HStack, VStack, Text, Button, Icon, Badge, Divider } from "@chakra-ui/react";
import { FaWifi, FaPlug, FaChair, FaCheck, FaTimes, FaStamp } from "react-icons/fa";
import { auth, db } from "@/config/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useToast } from "@chakra-ui/react";

const orangePrimary = "#FF6B35";

const questions = [
  { key: "wifiGood", label: "WiFi good?", icon: FaWifi, color: "blue" },
  { key: "hasOutlets", label: "Are there outlets?", icon: FaPlug, color: "green" },
  { key: "plentySeating", label: "Plenty of seating?", icon: FaChair, color: "purple" },
];

export default function CafePassport({ cafeId, cafeName, cafeAddress }) {
  const [isVisited, setIsVisited] = useState(false);
  const [answers, setAnswers] = useState({
    wifiGood: null,
    hasOutlets: null,
    plentySeating: null,
  });
  const [loading, setLoading] = useState(true);
  const [markingVisited, setMarkingVisited] = useState(false);
  const [savingAnswers, setSavingAnswers] = useState({});
  const toast = useToast();

  // Check if cafe is visited and load answers
  useEffect(() => {
    if (!cafeId) return;

    const checkVisited = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        if (!user) {
          setLoading(false);
          return;
        }

        const visitedRef = doc(db, "users", user.uid, "visitedCafes", cafeId.toString());
        const visitedDoc = await getDoc(visitedRef);

        if (visitedDoc.exists()) {
          const data = visitedDoc.data();
          setIsVisited(true);
          setAnswers({
            wifiGood: data.wifiGood ?? null,
            hasOutlets: data.hasOutlets ?? null,
            plentySeating: data.plentySeating ?? null,
          });
        } else {
          setIsVisited(false);
          setAnswers({
            wifiGood: null,
            hasOutlets: null,
            plentySeating: null,
          });
        }
      } catch (error) {
        console.error("Error checking visited status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkVisited();

    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged(() => {
      checkVisited();
    });

    return () => unsubscribe();
  }, [cafeId]);

  const handleMarkVisited = async () => {
    const user = auth.currentUser;
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to mark cafes as visited.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setMarkingVisited(true);

      const visitedRef = doc(db, "users", user.uid, "visitedCafes", cafeId.toString());
      await setDoc(visitedRef, {
        cafeId: cafeId.toString(),
        cafeName: cafeName || "Unnamed Cafe",
        cafeAddress: cafeAddress || "",
        visitedAt: new Date().toISOString(),
        wifiGood: null,
        hasOutlets: null,
        plentySeating: null,
      });

      setIsVisited(true);

      toast({
        title: "Cafe marked as visited! ✈️",
        description: "Now you can answer questions about your experience.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error marking as visited:", error);
      toast({
        title: "Error",
        description: "Failed to mark cafe as visited. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setMarkingVisited(false);
    }
  };

  const handleAnswer = async (questionKey, value) => {
    const user = auth.currentUser;
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to answer questions.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!isVisited) {
      toast({
        title: "Mark as visited first",
        description: "Please mark this cafe as visited before answering questions.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setSavingAnswers((prev) => ({ ...prev, [questionKey]: true }));

      const visitedRef = doc(db, "users", user.uid, "visitedCafes", cafeId.toString());
      const visitedDoc = await getDoc(visitedRef);
      const existingData = visitedDoc.exists() ? visitedDoc.data() : {};

      await setDoc(visitedRef, {
        ...existingData,
        [questionKey]: value,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      setAnswers((prev) => ({ ...prev, [questionKey]: value }));

      toast({
        title: "Answer saved!",
        description: "Thanks for sharing your experience.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error saving answer:", error);
      toast({
        title: "Error",
        description: "Failed to save answer. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSavingAnswers((prev) => ({ ...prev, [questionKey]: false }));
    }
  };

  if (loading) {
    return (
      <Box p={3} bg="gray.50" borderRadius="md">
        <Text fontSize="xs" color="gray.500">Loading...</Text>
      </Box>
    );
  }

  return (
    <Box p={3} bg="gray.50" borderRadius="md" borderWidth="1px" borderColor="gray.200">
      {!isVisited ? (
        <VStack spacing={3} align="stretch">
          <HStack spacing={2} align="center">
            <Icon as={FaStamp} color={orangePrimary} boxSize={4} />
            <Text fontSize="sm" fontWeight="600" color="gray.700">
              Have you visited this cafe?
            </Text>
          </HStack>
          <Button
            size="sm"
            leftIcon={<Icon as={FaCheck} />}
            bg={orangePrimary}
            color="white"
            onClick={handleMarkVisited}
            isLoading={markingVisited}
            _hover={{ bg: "#E55A2B" }}
            fontSize="xs"
          >
            Mark as Visited
          </Button>
        </VStack>
      ) : (
        <VStack spacing={3} align="stretch">
          <HStack spacing={2} align="center">
            <Icon as={FaStamp} color="green.500" boxSize={4} />
            <Text fontSize="sm" fontWeight="600" color="green.700">
              ✓ Visited
            </Text>
          </HStack>
          
          <Divider borderColor="gray.300" />
          
          <Text fontSize="xs" fontWeight="600" color="gray.700" mb={1}>
            Share your experience:
          </Text>
          
          <VStack spacing={2} align="stretch">
            {questions.map((question) => {
              const answer = answers[question.key];
              const isSaving = savingAnswers[question.key];

              return (
                <Box key={question.key}>
                  <HStack spacing={2} mb={1}>
                    <Icon as={question.icon} color={`${question.color}.500`} boxSize={3} />
                    <Text fontSize="xs" fontWeight="500" color="gray.700">
                      {question.label}
                    </Text>
                  </HStack>
                  
                  <HStack spacing={1}>
                    <Button
                      size="xs"
                      leftIcon={<Icon as={FaCheck} />}
                      colorScheme={answer === true ? "green" : "gray"}
                      variant={answer === true ? "solid" : "outline"}
                      onClick={() => handleAnswer(question.key, true)}
                      isLoading={isSaving}
                      flex="1"
                      fontSize="xs"
                      h="24px"
                    >
                      Yes
                    </Button>
                    <Button
                      size="xs"
                      leftIcon={<Icon as={FaTimes} />}
                      colorScheme={answer === false ? "red" : "gray"}
                      variant={answer === false ? "solid" : "outline"}
                      onClick={() => handleAnswer(question.key, false)}
                      isLoading={isSaving}
                      flex="1"
                      fontSize="xs"
                      h="24px"
                    >
                      No
                    </Button>
                  </HStack>
                </Box>
              );
            })}
          </VStack>
        </VStack>
      )}
    </Box>
  );
}
