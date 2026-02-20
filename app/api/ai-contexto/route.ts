import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type Place = {
  name: string;
  vicinity?: string;
  rating?: number;
  user_ratings_total?: number;
  open_now?: boolean;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "OPENAI_API_KEY não configurada" },
        { status: 500 }
      );
    }

    const pergunta = String(body?.pergunta ?? "");
    const lat = Number(body?.lat);
    const lng = Number(body?.lng);
    const agora = String(body?.agora ?? "");
    const lugares: Place[] = Array.isArray(body?.lugares) ? body.lugares : [];

    if (!pergunta) {
      return Response.json(
        { error: "Envie { pergunta }" },
        { status: 400 }
      );
    }

    const contexto = {
      localizacao: Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null,
      agora,
      top_lugares: lugares.slice(0, 10),
    };

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content:
            "Você é o Assistente de Viagem da COMTUR EXPERIENCE. Responda em português (Brasil), com foco em famílias. Use o contexto (localização, horário e lista de lugares) para recomendar opções objetivas. Sempre devolva: 1) Top 3 recomendações, 2) Por que agora faz sentido, 3) Uma sugestão rápida de roteiro (próxima 1-2 horas).",
        },
        {
          role: "user",
          content:
            `PERGUNTA: ${pergunta}\n\nCONTEXTO(JSON):\n${JSON.stringify(contexto, null, 2)}`,
        },
      ],
    });

    return Response.json({ resposta: response.output_text });
  } catch (err: any) {
    return Response.json(
      { error: err?.message ?? "Erro desconhecido" },
      { status: 500 }
    );
  }
}