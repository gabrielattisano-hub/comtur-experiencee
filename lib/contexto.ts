export type ContextoApp = {
  horaLocal: string;      // "11:35"
  periodo: "manha" | "almoco" | "tarde" | "noite";
  saudacao: string;       // "Bom dia", "Boa tarde", ...
  foco: "familias";
};

export function montarContextoFamilias(): ContextoApp {
  const agora = new Date();

  const hora = agora.getHours();
  const min = agora.getMinutes();
  const horaLocal = `${String(hora).padStart(2, "0")}:${String(min).padStart(
    2,
    "0"
  )}`;

  let periodo: ContextoApp["periodo"] = "manha";
  if (hora >= 11 && hora <= 14) periodo = "almoco";
  else if (hora >= 15 && hora <= 18) periodo = "tarde";
  else if (hora >= 19 || hora <= 4) periodo = "noite";
  else periodo = "manha";

  const saudacao =
    periodo === "manha"
      ? "Bom dia"
      : periodo === "almoco" || periodo === "tarde"
      ? "Boa tarde"
      : "Boa noite";

  return {
    horaLocal,
    periodo,
    saudacao,
    foco: "familias",
  };
}