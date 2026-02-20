export const runtime = "nodejs";

type Place = {
  place_id: string;
  name: string;
  vicinity?: string;
  rating?: number;
  user_ratings_total?: number;
  open_now?: boolean;
};

function pickTopRestaurantsV1(places: any[]): Place[] {
  return (places || [])
    .map((p) => ({
      place_id: p.id, // v1 usa "id"
      name: p.displayName?.text ?? "Sem nome",
      vicinity: p.formattedAddress, // mais próximo do "vicinity"
      rating: p.rating,
      user_ratings_total: p.userRatingCount,
      open_now: p.currentOpeningHours?.openNow,
    }))
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 10);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const lat = Number(body?.lat);
    const lng = Number(body?.lng);

    const apiKey =
      process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      return Response.json(
        {
          error:
            "Faltou configurar GOOGLE_PLACES_API_KEY (ou GOOGLE_MAPS_API_KEY) na Vercel.",
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

    const radius = Number(body?.radius ?? 1500); // metros

    // Places API (New) - Nearby Search (v1)
    const url = "https://places.googleapis.com/v1/places:searchNearby";

    const payload = {
      includedTypes: ["restaurant"],
      maxResultCount: 10,
      locationRestriction: {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius,
        },
      },
    };

    const r = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        // FieldMask é obrigatório na v1
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.currentOpeningHours.openNow",
      },
      body: JSON.stringify(payload),
    });

    const data = await r.json();

    if (!r.ok) {
      return Response.json(
        {
          error: "Google Places (v1) falhou",
          details: data?.error?.message ?? data,
        },
        { status: 500 }
      );
    }

    const top = pickTopRestaurantsV1(data.places);

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