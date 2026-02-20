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

    // NOVO: parâmetros opcionais para "modo família"
    const modoFamilia = Boolean(body?.modoFamilia ?? false);
    const comCrianca = Boolean(body?.comCrianca ?? false);
    const comIdoso = Boolean(body?.comIdoso ?? false);

    if (!pergunta) {
      return Response.json({ error: "Envie { pergunta }" }, { status: 400 });
    }

    const contexto = {
      localizacao:
        Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null,
      agora,
      modoFamilia,
      comCrianca,
      comIdoso,
      top_lugares: lugares.slice(0, 10),
    };

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content: `
Você é o Assistente Inteligente da COMTUR EXPERIENCE.

Regras:
- Responda sempre em português (Brasil)
- Foque em famílias (crianças e idosos quando informado)
- Use o contexto recebido: localização, horário atual e lista de lugares
- Se for horário de almoço (11h–14h), priorize restaurantes.
- Se for jantar (18h–22h), priorize ambiente confortável.
- Se for tarde (14h–18h), sugira cafés ou passeios leves.
- Se for manhã (07h–11h), sugira café da manhã, parques e passeios tranquilos.
- Se for noite (após 22h), priorize opções seguras e leves.

Formato obrigatório da resposta:
1️⃣ Top 3 recomendações (com nome e motivo)
2️⃣ Por que agora faz sentido (usando horário + família)
3️⃣ Sugestão rápida de roteiro (próximas 1–2 horas)
          `.trim(),
        },
        {
          role: "user",
          content:
            `PERGUNTA: ${pergunta}\n\nCONTEXTO(JSON):\n${JSON.stringify(
              contexto,
              null,
              2
            )}`,
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