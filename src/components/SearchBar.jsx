import { useState, useCallback, useRef } from "react";
import axios from "axios";
import { Input, Button, Stack, useToast } from "@chakra-ui/react";
import debounce from "lodash.debounce";

export default function SearchBar({
  setUserLocation,
  setSearchResults,
  fetchCafes,
}) {
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const lastRequestTime = useRef(0);

  // const fetchSuggestions = useCallback(
  //   // debounce(async (input) => {
  //   //   // if (input.length < 3) return;

  //   //   // const cachedSuggestions = getFromCache("suggestions", input);
  //   //   // if (cachedSuggestions) {
  //   //   //   setSuggestions(cachedSuggestions);
  //   //   //   return;
  //   //   // }

  //   //   try {
  //   //     await waitForRateLimit();
  //   //     const response = await axios.get(
  //   //       `https://nominatim.openstreetmap.org/search?format=json&q=${input}&limit=5`
  //   //     );
  //   //     setSuggestions(response.data);
  //   //     setInCache("suggestions", input, response.data);
  //   //   } catch (error) {
  //   //     console.error("Error fetching location suggestions:", error);
  //   //   }
  //   // }, 1000), // Increased debounce time to 1000ms
  //   // []
  // );

  const handleSearch = useCallback(async () => {
    if (!location.trim()) return;
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${location}`
      );
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setUserLocation({ lat: parseFloat(lat), lon: parseFloat(lon) });
        await fetchCafes(lat, lon);
        setSuggestions([]);
      } else {
        toast({
          title: "Location not found",
          description: "Please try a different location",
          status: "warning",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: "Error searching location",
        description: "Could not search for this location",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [location, setUserLocation, setSearchResults, toast]);

  const handleChange = (e) => {
    const value = e.target.value;
    setLocation(value);
  };

  return (
    <Stack direction="row" spacing={4}>
      <Input
        placeholder="Enter location"
        value={location}
        onChange={handleChange}
      />
      <Button onClick={handleSearch}>Search</Button>
    </Stack>
  );
}
