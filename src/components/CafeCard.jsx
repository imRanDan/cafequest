import { Box, VStack, Text, Button, useToast } from "@chakra-ui/react";
import { useState } from "react";

export default function CafeCard({ cafe }) {
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  const handleUnsave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/cafes/saved/${cafe.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to unsave cafe");

      toast({
        title: "Cafe removed from saved",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error removing cafe",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
      <VStack align="start" spacing={3}>
        <Text fontWeight="bold" fontSize="xl">
          {cafe.name}
        </Text>
        <Text color="gray.600">{cafe.address}</Text>
        <Button
          colorScheme="red"
          variant="outline"
          isLoading={isSaving}
          onClick={handleUnsave}
        >
          Remove from Saved
        </Button>
      </VStack>
    </Box>
  );
}
