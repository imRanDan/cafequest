import { useState, useCallback } from "react";
import axios from "axios";
import { Input, Button, Stack, useToast } from "@chakra-ui/react";
import debounce from "lodash.debounce";

export default function SearchBar({ setUserLocation, setSearchResults }) {
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const fetchCafes = async (latitude, longitude) => {
    try {
      const query = `
        [out:json];
        node["amenity"="cafe"](around:5000,${latitude},${longitude});
        out body;
      `;
      const response = await axios.post(
        "https://overpass-api.de/api/interpreter",
        query,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      setSearchResults(response.data.elements);
    } catch (error) {
      toast({
        title: "Error fetching cafes",
        description: "Could not find cafes in this area",
        status: "error",
        duration: 3000,
      });
      console.error("Error fetching cafes data:", error);
    }
  };

  const fetchSuggestions = useCallback(
    debounce(async (input) => {
      if (input.length < 3) return;
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${input}&limit=5`
        );
        setSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
      }
    }, 300),
    []
  );

  const handleSearch = async () => {
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
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setLocation(value);
    fetchSuggestions(value);
  };

  return (
    <Stack direction="row" spacing={4}>
      <Input
        placeholder="Enter location"
        value={location}
        onChange={handleChange}
      />
      <Button onClick={() => handleSearch(location)}>Search</Button>
    </Stack>
  );
}
