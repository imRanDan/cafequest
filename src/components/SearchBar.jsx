import { useState, useCallback, useRef } from "react";
import axios from "axios";
import { Input, Button, Stack, useToast } from "@chakra-ui/react";
import debounce from "lodash.debounce";

export default function SearchBar({ setUserLocation, setSearchResults }) {
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const lastRequestTime = useRef(0);
  const cache = useRef({
    suggestions: {},
    cafes: {},
    expirationTime: 30 * 60 * 1000, //30 minutes for info to be cached
  });

  const getCacheKey = (type, query) => `${type} - ${query}`;

  const getFromCache = (type, query) => {
    const key = getCacheKey(type, query);
    const cached = cache.current[type][key];
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > cache.current.expirationTime) {
      delete cache.current[type][key];
      return null;
    }
    return cached.data;
  };

  const setInCache = (type, query, data) => {
    const key = getCacheKey(type, query);
    cache.current[type][key] = {
      data,
      timestamp: Date.now(),
    };
  };

  const waitForRateLimit = async () => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime.current;
    if (timeSinceLastRequest < 1000) {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 - timeSinceLastRequest)
      );
    }
    lastRequestTime.current = Date.now();
  };

  const fetchCafes = async (latitude, longitude) => {
    const cacheKey = `${latitude}, ${longitude}`;
    const cachedCafes = getFromCache("cafes", cacheKey);

    if (cachedCafes) {
      setSearchResults(cachedCafes);
      return;
    }

    try {
      await waitForRateLimit();
      const query = `
        [out:json][timeout:25];
        (
          node["amenity"="cafe"](around:5000,${latitude},${longitude});
          way["amenity"="cafe"](around:5000,${latitude},${longitude});
        );
        out body;
        >;
        out skel qt;
        out meta;
      `;

      const formData = new URLSearchParams();
      formData.append("data", query);

      const response = await axios.post(
        "https://overpass-api.de/api/interpreter",
        formData.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.data && response.data.elements) {
        setSearchResults(response.data.elements);
      } else {
        throw new Error("No cafe data received");
      }
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

      const cachedSuggestions = getFromCache("suggestions", input);
      if (cachedSuggestions) {
        setSuggestions(cachedSuggestions);
        return;
      }

      try {
        await waitForRateLimit();
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${input}&limit=5`
        );
        setSuggestions(response.data);
        setInCache("suggestions", input, response.data);
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
      }
    }, 1000), // Increased debounce time to 1000ms
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
