const OVERPASS_URL = "https://overpass-api.de/api/interpreter";
const USER_AGENT =
  "CafeQuest/1.0 (+https://cafequest.vercel.app; cafe discovery app)";

function buildCafeQuery(lat, lon) {
  return `
    [out:json][timeout:25];
    (
      node["amenity"="cafe"](around:5000,${lat},${lon});
      way["amenity"="cafe"](around:5000,${lat},${lon});
    );
    out body;
    >;
    out skel qt;
    out meta;
  `;
}

function parseCoordinates(body) {
  const lat = Number(body?.lat);
  const lon = Number(body?.lon);
  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lon) ||
    lat < -90 ||
    lat > 90 ||
    lon < -180 ||
    lon > 180
  ) {
    return null;
  }
  return { lat, lon };
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const coords = parseCoordinates(body);
  if (!coords) {
    return Response.json({ error: "Invalid lat/lon" }, { status: 400 });
  }

  const { lat, lon } = coords;
  const formData = new URLSearchParams();
  formData.append("data", buildCafeQuery(lat, lon));

  try {
    const overpassResponse = await fetch(OVERPASS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": USER_AGENT,
      },
      body: formData.toString(),
    });

    if (overpassResponse.status === 429) {
      const retryAfter = overpassResponse.headers.get("Retry-After");
      return Response.json(
        { error: "Overpass rate limit exceeded. Please try again shortly." },
        {
          status: 429,
          headers: retryAfter ? { "Retry-After": retryAfter } : undefined,
        }
      );
    }

    if (!overpassResponse.ok) {
      const detail = await overpassResponse.text();
      console.error("Overpass error:", overpassResponse.status, detail);
      return Response.json(
        { error: "Failed to fetch cafe data" },
        { status: 502 }
      );
    }

    const data = await overpassResponse.json();
    if (!data?.elements) {
      return Response.json({ error: "No cafe data received" }, { status: 502 });
    }

    return Response.json(data);
  } catch (error) {
    console.error("Overpass proxy error:", error);
    return Response.json({ error: "Failed to fetch cafe data" }, { status: 502 });
  }
}
