// import { useState } from "react";
// import axios from "axios";
// import { Input, Button, Stack } from "@chakra-ui/react";

// export default function SearchBar({ setUserLocation, setSearchResults }) {
//   const [location, setLocation] = useState("");

//   const handleSearch = async () => {
//     if (location) {
//       // Geocode the location to get latitude and longitude
//       try {
//         const response = await axios.get(
//           `https://nominatim.openstreetmap.org/search?format=json&q=${location}`
//         );
//         const { lat, lon } = response.data[0];
//         setUserLocation({ lat, lon }); // Update the user location with the new lat/lon
//         fetchCafes(lat, lon); // Search for cafes based on the new location
//       } catch (error) {
//         console.error("Error fetching location data:", error);
//       }
//     }
//   };

//   const fetchCafes = async (latitude, longitude) => {
//     const query = `
//       [out:json];
//       (
//         node["amenity"="cafe"](around:1000, ${latitude}, ${longitude});
//         way["amenity"="cafe"](around:1000, ${latitude}, ${longitude});
//         relation["amenity"="cafe"](around:1000, ${latitude}, ${longitude});
//       );
//       out center;
//     `;
//     const url = "https://overpass-api.de/api/interpreter";
//     try {
//       const response = await axios.post(url, query);
//       const cafes = response.data.elements.filter(
//         (cafe) => cafe.lat && cafe.lon
//       ); // Filter out invalid cafes
//       setSearchResults(cafes); // Set the search results with valid cafes
//     } catch (error) {
//       console.error("Error fetching cafes:", error);
//     }
//   };

//   return (
//     <Stack spacing={4} direction="row" align="center">
//       <Input
//         value={location}
//         onChange={(e) => setLocation(e.target.value)}
//         placeholder="Enter location (city, address)"
//         size="md"
//       />
//       <Button onClick={handleSearch} colorScheme="teal" size="md">
//         Search Cafes
//       </Button>
//     </Stack>
//   );
// }
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
