export const runtime = "nodejs";

type Place = {
  place_id: string;
  name: string;
  vicinity?: string;
  rating?: number;
  user_ratings_total?: number;
  open_now?: boolean;
};

function pickTop(results: any[]): Place[] {
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
    .slice(0, 20);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const lat = Number(body?.lat);
    const lng = Number(body?.lng);
    const radius = Number(body?.radius ?? 2500);
    const type = String(body?.type ?? "tourist_attraction");

    const apiKey =
      process.env.GOOGLE_MAPS_API_KEY ||
      process.env.GOOGLE_PLACES_API_KEY;

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
        { error: "Envie { lat: number, lng: number } no body." },
        { status: 400 }
      );
    }

    const url =
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json` +
      `?location=${lat},${lng}` +
      `&radius=${radius}` +
      `&type=${encodeURIComponent(type)}` +
      `&key=${encodeURIComponent(apiKey)}`;

    const r = await fetch(url);
    const data = await r.json();

    if (data.status && data.status !== "OK") {
      return Response.json(
        { error: `Google Places: ${data.status}`, details: data.error_message },
        { status: 500 }
      );
    }

    const results = pickTop(data.results);

    return Response.json({
      ok: true,
      count: results.length,
      results,
    });
  } catch (err: any) {
    return Response.json(
      { error: err?.message ?? "Erro desconhecido" },
      { status: 500 }
    );
  }
}