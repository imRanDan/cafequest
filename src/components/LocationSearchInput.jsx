"use client";

import usePlacesAutocomplete, {getGeocode, getLatLng} from "use-places-autocomplete";
import { Input, List, ListItem, Box } from "@chakra-ui/react";

export default function LocationSearchInput({ onSelect}) {
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

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (description) => {
    setValue(description, false);
    clearSuggestions();

    const results = await getGeocode({ address: description});
    const { lat, lng} = await getLatLng(results[0]);
    onSelect({ lat, lon: lng});
  };

  return (
    <Box position="relative">
        <Input
            value={value}
            onChange={handleInput}
            placeholder="Search by city, address, or postal code!"
            isDisabled={!ready}
        /> 
        {status === "OK" && (
            <List 
                position="absolute"
                zIndex="999"
                width="100%"
                border="1px solid #ccc"
                borderRadius="md"
                bg="white"
                mt={2}
            >
                {data.map(({ place_id, description }) => (
                    <ListItem
                        key={place_id}
                        p={2}
                        _hover={{ bg: "gray.100", cursor: "pointer" }}
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