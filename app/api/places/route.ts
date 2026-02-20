import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { lat, lng } = await req.json();

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "API key não configurada" }, { status: 500 });
  }

  const response = await fetch(
    "https://places.googleapis.com/v1/places:searchNearby",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "places.displayName,places.formattedAddress,places.rating",
      },
      body: JSON.stringify({
        includedTypes: ["restaurant"],
        maxResultCount: 5,
        locationRestriction: {
          circle: {
            center: {
              latitude: lat,
              longitude: lng,
            },
            radius: 1500.0,
          },
        },
      }),
    }
  );

  const data = await response.json();

  return NextResponse.json(data);
}