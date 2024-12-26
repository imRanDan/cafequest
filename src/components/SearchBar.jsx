import { useState, useCallback } from "react";
import axios from "axios";
import { Input, Button, Stack } from "@chakra-ui/react";
import debounce from "lodash.debounce";

export default function SearchBar({ setUserLocation, setSearchResults }) {
  const [location, setLocation] = useState("");

  const handleSearch = useCallback(
    debounce(async (location) => {
      if (location) {
        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/search?format=json&q=${location}`
          );
          const { lat, lon } = response.data[0];
          setUserLocation({ lat, lon });
          fetchCafes(lat, lon);
        } catch (error) {
          console.error("Error fetching location data:", error);
        }
      }
    }, 500),
    []
  );

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
      console.error("Error fetching cafes data:", error);
    }
  };

  const handleChange = (e) => {
    setLocation(e.target.value);
    handleSearch(e.target.value);
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
