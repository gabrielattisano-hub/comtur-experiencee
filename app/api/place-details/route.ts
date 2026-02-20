export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const placeId = String(body?.placeId ?? "");

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

    if (!placeId) {
      return Response.json(
        { error: "Envie { placeId: string } no body." },
        { status: 400 }
      );
    }

    // Place Details (legacy)
    const url =
      `https://maps.googleapis.com/maps/api/place/details/json` +
      `?place_id=${encodeURIComponent(placeId)}` +
      `&fields=${encodeURIComponent(
        "place_id,name,formatted_address,formatted_phone_number,website,opening_hours,geometry,rating,user_ratings_total,url"
      )}` +
      `&key=${encodeURIComponent(apiKey)}`;

    const r = await fetch(url, { method: "GET" });
    const data = await r.json();

    if (data.status && data.status !== "OK") {
      return Response.json(
        { error: `Google Place Details: ${data.status}`, details: data.error_message },
        { status: 500 }
      );
    }

    const result = data?.result ?? {};

    return Response.json({
      ok: true,
      result: {
        place_id: result.place_id,
        name: result.name,
        formatted_address: result.formatted_address,
        formatted_phone_number: result.formatted_phone_number,
        website: result.website,
        opening_hours: result.opening_hours,
        geometry: result.geometry,
        rating: result.rating,
        user_ratings_total: result.user_ratings_total,
        url: result.url,
      },
    });
  } catch (err: any) {
    return Response.json(
      { error: err?.message ?? "Erro desconhecido." },
      { status: 500 }
    );
  }
}