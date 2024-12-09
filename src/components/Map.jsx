import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

function CenterMap({ latitude, longitude }) {
  const map = useMap();

  // OpenStreetMap Attribution
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  useEffect(() => {
    if (latitude && longitude) {
      map.setView([latitude, longitude], 13); // Move map center to the new location
    }
  }, [latitude, longitude, map]);

  return null;
}

export default function Map({ userLocation, results }) {
  const defaultLat = 51.505;
  const defaultLon = -0.09;

  const lat = userLocation?.lat ?? defaultLat;
  const lon = userLocation?.lon ?? defaultLon;

  return (
    <MapContainer
      center={[lat, lon]}
      zoom={13}
      style={{ width: "100%", height: "400px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <CenterMap latitude={lat} longitude={lon} />

      {/* Render markers */}
      {results.map((cafe, index) => {
        // Ensure each cafe has valid lat and lon
        if (cafe.lat && cafe.lon) {
          return (
            <Marker
              key={index}
              position={[cafe.lat, cafe.lon]}
              icon={
                new L.Icon({
                  iconUrl:
                    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowSize: [41, 41],
                })
              }
            >
              <Popup>
                <strong>{cafe.tags?.name || "Unnamed Cafe"}</strong>
              </Popup>
            </Marker>
          );
        }
        return null; // Skip invalid markers
      })}
    </MapContainer>
  );
}
