"use client";

import usePlacesAutocomplete, {getGeocode, getLatLng} from "use-places-autocomplete";
import {
  Input,
  List,
  ListItem,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";

export default function LocationSearchInput({ onSelect }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: "ca" },
    },
    debounce: 400,
  });

  // ✅ Call all hooks here, at the top
  const bg = useColorModeValue("white", "gray.700");
  const color = useColorModeValue("black", "white");
  const hoverBg = useColorModeValue("gray.100", "gray.600");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (description) => {
    setValue(description, false);
    clearSuggestions();

    const results = await getGeocode({ address: description });
    const { lat, lng } = await getLatLng(results[0]);
    onSelect({ lat, lon: lng });
  };

  return (
    <Box position="relative">
      <Input
        placeholder="Search by city or postal code"
        value={value}
        onChange={handleInput}
        isDisabled={!ready}
      />
      {status === "OK" && (
        <List
          bg={bg}
          color={color}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="md"
          mt={2}
          spacing={1}
          zIndex="999"
          position="absolute"
          width="100%"
        >
          {data.map(({ place_id, description }) => (
            <ListItem
              key={place_id}
              p={2}
              _hover={{ bg: hoverBg, cursor: "pointer" }}
              onClick={() => handleSelect(description)}
            >
              {description}
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}
