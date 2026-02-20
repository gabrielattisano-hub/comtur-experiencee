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

    // 1) Busca detalhes incluindo photos
    const detailsUrl =
      `https://maps.googleapis.com/maps/api/place/details/json` +
      `?place_id=${encodeURIComponent(placeId)}` +
      `&fields=${encodeURIComponent("photos")}` +
      `&key=${encodeURIComponent(apiKey)}`;

    const r = await fetch(detailsUrl, { method: "GET" });
    const data = await r.json();

    if (data.status && data.status !== "OK") {
      return Response.json(
        { error: `Google Place Details: ${data.status}`, details: data.error_message },
        { status: 500 }
      );
    }

    const photos = data?.result?.photos ?? [];
    const first = photos?.[0];

    if (!first?.photo_reference) {
      return Response.json(
        { ok: true, hasPhoto: false },
        { status: 200 }
      );
    }

    const photoRef = String(first.photo_reference);
    const maxwidth = Number(body?.maxwidth ?? 1200);

    // 2) Monta a URL da foto (legacy Photo API)
    const photoUrl =
      `https://maps.googleapis.com/maps/api/place/photo` +
      `?maxwidth=${encodeURIComponent(String(maxwidth))}` +
      `&photo_reference=${encodeURIComponent(photoRef)}` +
      `&key=${encodeURIComponent(apiKey)}`;

    return Response.json({
      ok: true,
      hasPhoto: true,
      photoUrl,
    });
  } catch (err: any) {
    return Response.json(
      { error: err?.message ?? "Erro desconhecido." },
      { status: 500 }
    );
  }
}