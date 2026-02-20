import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type ContextoApp = {
  horaLocal: string;
  periodo: string;
  saudacao: string;
  foco: string;
};

type Preferencias = {
  modoFamilia: boolean;
  orcamento: "baixo" | "medio" | "alto";
  idioma: "pt" | "en" | "es";
};

type Lugar = {
  name: string;
  rating?: number;
  user_ratings_total?: number;
  vicinity?: string;
};

function textoOrcamento(o: Preferencias["orcamento"]) {
  if (o === "baixo") return "baixo custo / economia";
  if (o === "alto") return "premium / melhor experiência";
  return "custo-benefício";
}

function textoIdioma(i: Preferencias["idioma"]) {
  if (i === "en") return "Responda em inglês (English).";
  if (i === "es") return "Responda em espanhol (Español).";
  return "Responda em português.";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const pergunta: string = body?.pergunta ?? "";
    const contexto: ContextoApp | undefined = body?.contexto;
    const preferencias: Preferencias | undefined = body?.preferencias;

    const lugares: Lugar[] = Array.isArray(body?.lugares) ? body.lugares : [];

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "OPENAI_API_KEY não configurada." },
        { status: 500 }
      );
    }

    if (!pergunta) {
      return Response.json(
        { error: "Campo 'pergunta' é obrigatório." },
        { status: 400 }
      );
    }

    const resumoLugares =
      lugares.length > 0
        ? lugares
            .slice(0, 6)
            .map(
              (l) =>
                `- ${l.name} (nota ${l.rating ?? "-"}, ${
                  l.user_ratings_total ?? 0
                } avaliações)`
            )
            .join("\n")
        : "Nenhum restaurante próximo disponível.";

    const contextoTexto = contexto
      ? `Horário local: ${contexto.horaLocal}
Período do dia: ${contexto.periodo}
Foco do app: ${contexto.foco}`
      : "Sem contexto de horário.";

    const modoFamiliaTexto =
      preferencias?.modoFamilia === false
        ? "O usuário desativou o modo família. Ainda assim, mantenha linguagem respeitosa e segura."
        : "Modo família ATIVADO: priorize opções adequadas para crianças e ambientes tranquilos.";

    const preferenciaTexto = preferencias
      ? `Preferências do usuário:
- Modo família: ${preferencias.modoFamilia ? "ativado" : "desativado"}
- Orçamento: ${textoOrcamento(preferencias.orcamento)}
- Idioma: ${preferencias.idioma}`
      : "Sem preferências do usuário.";

    const idiomaInstrucao = preferencias
      ? textoIdioma(preferencias.idioma)
      : "Responda em português.";

    const prompt = `
Você é o assistente inteligente de viagens da COMTUR EXPERIENCE.

Regras obrigatórias:
- ${idiomaInstrucao}
- Foco em famílias quando Modo Família estiver ativado.
- Sugira roteiro por horários quando fizer sentido (manhã / almoço / tarde / noite).
- Nunca mencione crimes, violência, tragédias ou notícias negativas.
- Seja objetivo, prático e com linguagem de app.
- Se faltar dado, faça suposições razoáveis e deixe claro.

${contextoTexto}

${preferenciaTexto}

${modoFamiliaTexto}

Lugares próximos disponíveis (ranking por avaliação):
${resumoLugares}

Pergunta do usuário:
${pergunta}
`.trim();

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
    });

    return Response.json({
      resposta: response.output_text,
    });
  } catch (err: any) {
    return Response.json(
      { error: err?.message ?? "Erro desconhecido." },
      { status: 500 }
    );
  }
}