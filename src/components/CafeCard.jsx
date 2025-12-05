import { Box, Image, Text, Stack, Badge, Button} from "@chakra-ui/react";

export default function CafeCard({ cafe, onDelete }) {
  const fallbackImage = "https://plus.unsplash.com/premium_photo-1664970900025-1e3099ca757a?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

  return (
    <Box 
      borderWidth="1px" 
      borderColor="gray.200"
      borderRadius="lg" 
      overflow="hidden" 
      shadow="md" 
      bg="white"
      _hover={{ shadow: "lg"}} 
      transition="all 0.2s"
    >
      <Image 
        src={cafe.image || fallbackImage} 
        alt={cafe.name || "Cafe"} 
        objectFit="cover" 
        height="200px" 
        width="100%" 
        fallbackSrc={fallbackImage} 
      />

      <Box p={4} bg="white">
        <Stack spacing={2}>
          <Text fontWeight="bold" fontSize="xl" color="gray.900">{cafe.name || "Unnamed Cafe"}</Text>
          <Text fontSize="sm" color="gray.700">{cafe.address || "Address not available"}</Text>
          <Text fontSize="sm" color="gray.600">{cafe.description || "No description available"}</Text>
          <Text fontSize="sm" color="gray.700">{cafe.openingHours}</Text>
          <Badge colorScheme="green" width="fit-content">Open</Badge>

          {onDelete && (
            <Button
              mt={3}
              size="sm"
              variant="outline"
              borderColor="red.400"
              color="red.500"
              onClick={onDelete}
              _hover={{ bg: "red.50", borderColor: "red.500" }}
            >
              Delete
            </Button>
          )}
        </Stack>
      </Box>
    </Box>
  )
    
}
