export const runtime = "nodejs";

type Place = {
  place_id: string;
  name: string;
  vicinity?: string;
  rating?: number;
  user_ratings_total?: number;
  open_now?: boolean;
};

function pickTopRestaurants(results: any[]): Place[] {
  return (results || [])
    .map((p) => ({
      place_id: p.place_id,
      name: p.name,
      vicinity: p.vicinity,
      rating: p.rating,
      user_ratings_total: p.user_ratings_total,
      open_now: p.opening_hours?.open_now,
    }))
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 10);
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const lat = Number(searchParams.get("lat"));
    const lng = Number(searchParams.get("lng"));
    const radius = Number(searchParams.get("radius") ?? 1500); // metros
    const type = String(searchParams.get("type") ?? "restaurant");

    const apiKey =
      process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
      return Response.json(
        {
          error:
            "Faltou configurar GOOGLE_MAPS_API_KEY (ou GOOGLE_PLACES_API_KEY) na Vercel.",
        },
        { status: 500 }
      );
    }

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return Response.json(
        { error: "Envie lat e lng na query: /api/places?lat=...&lng=..." },
        { status: 400 }
      );
    }

    // Places API (antiga) - Nearby Search
    const url =
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json` +
      `?location=${lat},${lng}` +
      `&radius=${radius}` +
      `&type=${encodeURIComponent(type)}` +
      `&key=${encodeURIComponent(apiKey)}`;

    const r = await fetch(url, { method: "GET" });
    const data = await r.json();

    if (data.status && data.status !== "OK") {
      return Response.json(
        { error: `Google Places: ${data.status}`, details: data.error_message },
        { status: 500 }
      );
    }

    const top = pickTopRestaurants(data.results);

    return Response.json({
      ok: true,
      count: top.length,
      results: top,
    });
  } catch (err: any) {
    return Response.json(
      { error: err?.message ?? "Erro desconhecido" },
      { status: 500 }
    );
  }
}