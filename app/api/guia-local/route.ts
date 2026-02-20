import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const lat = body?.lat;
    const lng = body?.lng;
    const cidade = body?.cidade ?? "Londrina PR";

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "OPENAI_API_KEY não configurada" },
        { status: 500 }
      );
    }

    const contextoLocal = lat && lng
      ? `O usuário está aproximadamente na latitude ${lat} e longitude ${lng}.`
      : `Cidade informada: ${cidade}.`;

    const prompt = `
Você é o Guia Oficial da COMTUR EXPERIENCE.

${contextoLocal}

Sua missão:
- Explicar brevemente onde o usuário está.
- Contar curiosidades históricas ou culturais positivas.
- Sugerir experiências familiares próximas.
- Evitar qualquer menção a crimes, violência ou notícias negativas.
- Estruturar resposta em tópicos claros.
- Ser envolvente e amigável.
`;

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: [
        { role: "system", content: prompt },
        { role: "user", content: "Me explique onde estou e o que posso fazer aqui com minha família." }
      ],
    });

    return Response.json({
      resposta: response.output_text,
    });
  } catch (err: any) {
    return Response.json(
      { error: err?.message ?? "Erro desconhecido" },
      { status: 500 }
    );
  }
}