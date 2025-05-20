import { Box, Image, Text, Stack, Badge} from "@chakra-ui/react";

export default function CafeCard({ cafe }) {
  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" shadow="md" bg="white">
      <Image src={cafe.image} alt={cafe.name} objectFit="cover" height="200px" width="100%" />

      <Box p={4}>
        <Stack spacing={2}>
          <Text fontWeight="bold" fontSize="xl">{cafe.name}</Text>
          <Text color="gray.600" fontSize="sm">{cafe.address}</Text>
          <Text fontSize="sm">{cafe.description}</Text>
          <Badge colorScheme="green" width="fit-content">Open</Badge>
        </Stack>
      </Box>
    </Box>
  )
    
}
