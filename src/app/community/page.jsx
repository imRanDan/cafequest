"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  Badge,
  SimpleGrid,
  Icon,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  useToast,
} from "@chakra-ui/react";
import { db } from "@/config/firebase";
import { collection, getDocs, query, orderBy, limit, where, Timestamp } from "firebase/firestore";
import { FaWifi, FaPlug, FaChair, FaCoffee, FaUsers, FaFire } from "react-icons/fa";
import Link from "next/link";

const orangePrimary = "#FF6B35";

export default function CommunityPage() {
  const [topCafes, setTopCafes] = useState([]);
  const [communityStats, setCommunityStats] = useState({
    totalVisits: 0,
    totalCafes: 0,
    avgWifiRating: 0,
    avgOutletsRating: 0,
    avgSeatingRating: 0,
  });
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchCommunityData();
  }, []);

  const fetchCommunityData = async () => {
    try {
      setLoading(true);
      
      // Get all visited cafes from all users
      const usersRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersRef);
      
      const cafeVisits = {}; // cafeId -> { visits, wifiGood, hasOutlets, plentySeating, cafeName, cafeAddress }
      let totalVisits = 0;
      
      // Calculate one week ago
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      for (const userDoc of usersSnapshot.docs) {
        const visitedCafesRef = collection(db, "users", userDoc.id, "visitedCafes");
        const visitedCafesSnapshot = await getDocs(visitedCafesRef);
        
        visitedCafesSnapshot.forEach((cafeDoc) => {
          const data = cafeDoc.data();
          const visitedAt = data.visitedAt ? new Date(data.visitedAt) : new Date();
          
          // Only count visits from the last week for "this week" stats
          const isThisWeek = visitedAt >= oneWeekAgo;
          
          if (!cafeVisits[data.cafeId]) {
            cafeVisits[data.cafeId] = {
              cafeId: data.cafeId,
              cafeName: data.cafeName || "Unnamed Cafe",
              cafeAddress: data.cafeAddress || "",
              visits: 0,
              visitsThisWeek: 0,
              wifiGood: { yes: 0, no: 0 },
              hasOutlets: { yes: 0, no: 0 },
              plentySeating: { yes: 0, no: 0 },
            };
          }
          
          cafeVisits[data.cafeId].visits++;
          if (isThisWeek) {
            cafeVisits[data.cafeId].visitsThisWeek++;
          }
          totalVisits++;
          
          // Aggregate answers
          if (data.wifiGood === true) cafeVisits[data.cafeId].wifiGood.yes++;
          if (data.wifiGood === false) cafeVisits[data.cafeId].wifiGood.no++;
          
          if (data.hasOutlets === true) cafeVisits[data.cafeId].hasOutlets.yes++;
          if (data.hasOutlets === false) cafeVisits[data.cafeId].hasOutlets.no++;
          
          if (data.plentySeating === true) cafeVisits[data.cafeId].plentySeating.yes++;
          if (data.plentySeating === false) cafeVisits[data.cafeId].plentySeating.no++;
        });
      }
      
      // Convert to array and sort by visits this week
      const cafesArray = Object.values(cafeVisits)
        .filter(cafe => cafe.visitsThisWeek > 0)
        .sort((a, b) => b.visitsThisWeek - a.visitsThisWeek)
        .slice(0, 10);
      
      setTopCafes(cafesArray);
      
      // Calculate community stats
      const allCafes = Object.values(cafeVisits);
      let wifiYes = 0, wifiNo = 0;
      let outletsYes = 0, outletsNo = 0;
      let seatingYes = 0, seatingNo = 0;
      
      allCafes.forEach(cafe => {
        wifiYes += cafe.wifiGood.yes;
        wifiNo += cafe.wifiGood.no;
        outletsYes += cafe.hasOutlets.yes;
        outletsNo += cafe.hasOutlets.no;
        seatingYes += cafe.plentySeating.yes;
        seatingNo += cafe.plentySeating.no;
      });
      
      const totalWifi = wifiYes + wifiNo;
      const totalOutlets = outletsYes + outletsNo;
      const totalSeating = seatingYes + seatingNo;
      
      setCommunityStats({
        totalVisits,
        totalCafes: allCafes.length,
        avgWifiRating: totalWifi > 0 ? Math.round((wifiYes / totalWifi) * 100) : 0,
        avgOutletsRating: totalOutlets > 0 ? Math.round((outletsYes / totalOutlets) * 100) : 0,
        avgSeatingRating: totalSeating > 0 ? Math.round((seatingYes / totalSeating) * 100) : 0,
      });
      
    } catch (error) {
      console.error("Error fetching community data:", error);
      toast({
        title: "Error",
        description: "Failed to load community data. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const getPercentage = (yes, no) => {
    const total = yes + no;
    if (total === 0) return null;
    return Math.round((yes / total) * 100);
  };

  if (loading) {
    return (
      <Box minH="calc(100vh - 64px)" bg="gray.50" py={12}>
        <Container maxW="7xl">
          <VStack spacing={4}>
            <Spinner size="xl" color={orangePrimary} />
            <Text color="gray.600">Loading community data...</Text>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="calc(100vh - 64px)" bg="gray.50" py={8}>
      <Container maxW="7xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box>
            <Heading size="xl" color={orangePrimary} mb={2}>
              Community Hub
            </Heading>
            <Text color="gray.600" fontSize="lg">
              See what the community is discovering this week
            </Text>
          </Box>

          {/* Community Stats */}
          <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200">
            <Heading size="md" mb={4} color="gray.700">
              Community Stats
            </Heading>
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
              <Stat>
                <StatLabel>Total Visits</StatLabel>
                <StatNumber color={orangePrimary}>{communityStats.totalVisits}</StatNumber>
                <StatHelpText>All time</StatHelpText>
              </Stat>
              <Stat>
                <StatLabel>Unique Cafes</StatLabel>
                <StatNumber color={orangePrimary}>{communityStats.totalCafes}</StatNumber>
                <StatHelpText>Visited</StatHelpText>
              </Stat>
              <Stat>
                <StatLabel>WiFi Quality</StatLabel>
                <StatNumber color={orangePrimary}>{communityStats.avgWifiRating}%</StatNumber>
                <StatHelpText>Good WiFi</StatHelpText>
              </Stat>
              <Stat>
                <StatLabel>Has Outlets</StatLabel>
                <StatNumber color={orangePrimary}>{communityStats.avgOutletsRating}%</StatNumber>
                <StatHelpText>Yes</StatHelpText>
              </Stat>
            </SimpleGrid>
          </Box>

          {/* Top Cafes This Week */}
          <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.200">
            <HStack spacing={2} mb={4}>
              <Icon as={FaFire} color={orangePrimary} boxSize={5} />
              <Heading size="md" color="gray.700">
                Top Cafes This Week
              </Heading>
            </HStack>
            
            {topCafes.length === 0 ? (
              <Box textAlign="center" py={8}>
                <Text color="gray.500">No cafes visited this week yet. Be the first!</Text>
                <Link href="/">
                  <Text color={orangePrimary} fontWeight="600" mt={2} _hover={{ textDecoration: "underline" }}>
                    Start exploring →
                  </Text>
                </Link>
              </Box>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                {topCafes.map((cafe, index) => {
                  const wifiPct = getPercentage(cafe.wifiGood.yes, cafe.wifiGood.no);
                  const outletsPct = getPercentage(cafe.hasOutlets.yes, cafe.hasOutlets.no);
                  const seatingPct = getPercentage(cafe.plentySeating.yes, cafe.plentySeating.no);
                  
                  return (
                    <Box
                      key={cafe.cafeId}
                      p={4}
                      bg="gray.50"
                      borderRadius="md"
                      borderWidth="1px"
                      borderColor="gray.200"
                      _hover={{ boxShadow: "md", borderColor: orangePrimary }}
                      transition="all 0.2s"
                    >
                      <VStack align="stretch" spacing={3}>
                        <HStack justify="space-between" align="start">
                          <VStack align="start" spacing={1} flex="1">
                            <HStack spacing={2}>
                              <Badge colorScheme="orange" fontSize="xs">
                                #{index + 1}
                              </Badge>
                              <Heading size="sm" color="gray.900" fontWeight="700">
                                {cafe.cafeName}
                              </Heading>
                            </HStack>
                            {cafe.cafeAddress && (
                              <Text fontSize="xs" color="gray.600" noOfLines={1}>
                                {cafe.cafeAddress}
                              </Text>
                            )}
                          </VStack>
                          <Badge colorScheme="red" fontSize="xs">
                            <Icon as={FaUsers} mr={1} />
                            {cafe.visitsThisWeek}
                          </Badge>
                        </HStack>
                        
                        <Divider borderColor="gray.300" />
                        
                        <VStack align="stretch" spacing={2}>
                          <HStack spacing={2} justify="space-between">
                            <HStack spacing={2}>
                              <Icon as={FaWifi} color="blue.500" boxSize={3} />
                              <Text fontSize="xs" color="gray.600">WiFi</Text>
                            </HStack>
                            {wifiPct !== null ? (
                              <Badge colorScheme={wifiPct >= 50 ? "green" : "red"} fontSize="xs">
                                {wifiPct}%
                              </Badge>
                            ) : (
                              <Text fontSize="xs" color="gray.400">No data</Text>
                            )}
                          </HStack>
                          
                          <HStack spacing={2} justify="space-between">
                            <HStack spacing={2}>
                              <Icon as={FaPlug} color="green.500" boxSize={3} />
                              <Text fontSize="xs" color="gray.600">Outlets</Text>
                            </HStack>
                            {outletsPct !== null ? (
                              <Badge colorScheme={outletsPct >= 50 ? "green" : "red"} fontSize="xs">
                                {outletsPct}%
                              </Badge>
                            ) : (
                              <Text fontSize="xs" color="gray.400">No data</Text>
                            )}
                          </HStack>
                          
                          <HStack spacing={2} justify="space-between">
                            <HStack spacing={2}>
                              <Icon as={FaChair} color="purple.500" boxSize={3} />
                              <Text fontSize="xs" color="gray.600">Seating</Text>
                            </HStack>
                            {seatingPct !== null ? (
                              <Badge colorScheme={seatingPct >= 50 ? "green" : "red"} fontSize="xs">
                                {seatingPct}%
                              </Badge>
                            ) : (
                              <Text fontSize="xs" color="gray.400">No data</Text>
                            )}
                          </HStack>
                        </VStack>
                      </VStack>
                    </Box>
                  );
                })}
              </SimpleGrid>
            )}
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
