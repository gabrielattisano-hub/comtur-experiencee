import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { pergunta } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "OPENAI_API_KEY não configurada" },
        { status: 500 }
      );
    }

    if (!pergunta || typeof pergunta !== "string") {
      return Response.json(
        { error: "Campo 'pergunta' é obrigatório" },
        { status: 400 }
      );
    }

    // Responses API (recomendado pela OpenAI)
    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content:
            "Você é o assistente de viagem da COMTUR EXPERIENCE. Responda em português, com sugestões objetivas, foco em famílias, e inclua roteiro por horários quando fizer sentido.",
        },
        { role: "user", content: pergunta },
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