export const runtime = "nodejs";

type Place = {
  place_id: string;
  name: string;
  vicinity?: string;
  rating?: number;
  user_ratings_total?: number;
  open_now?: boolean;
  lat?: number;
  lng?: number;
  maps_url?: string;
  photo_url?: string;
};

function transformPlaces(results: any[], apiKey: string): Place[] {
  return (results || [])
    .map((p) => {
      const lat = p.geometry?.location?.lat;
      const lng = p.geometry?.location?.lng;

      const photoReference = p.photos?.[0]?.photo_reference;

      return {
        place_id: p.place_id,
        name: p.name,
        vicinity: p.vicinity,
        rating: p.rating,
        user_ratings_total: p.user_ratings_total,
        open_now: p.opening_hours?.open_now,
        lat,
        lng,
        maps_url: lat && lng
          ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
          : undefined,
        photo_url: photoReference
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${apiKey}`
          : undefined,
      };
    })
    // Prioriza abertos + melhor nota
    .sort((a, b) => {
      if (a.open_now && !b.open_now) return -1;
      if (!a.open_now && b.open_now) return 1;
      return (b.rating ?? 0) - (a.rating ?? 0);
    })
    .slice(0, 10);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const lat = Number(body?.lat);
    const lng = Number(body?.lng);

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
        { error: "Envie { lat: number, lng: number } no body." },
        { status: 400 }
      );
    }

    const radius = Number(body?.radius ?? 1500);
    const type = String(body?.type ?? "restaurant");

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

    const top = transformPlaces(data.results, apiKey);

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