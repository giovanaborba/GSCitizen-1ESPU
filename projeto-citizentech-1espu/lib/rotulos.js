/*
  rotulos — textos de exibição dos campos do Diário (seções 7.1, 7.2, 7.3
  e 7.4). Fica tudo num lugar só, para o formulário, a lista e a página
  do registro falarem sempre igual.
*/

/* ------------------------------------------------------------------
   Perguntas (rótulo visível do formulário e <dt> do "Ver registro")
   ------------------------------------------------------------------ */
export const PERGUNTAS = {
  data: "Data do deslocamento",
  meio: "Meio de transporte",
  chegouSemSePerder: "Chegou ao destino sem se perder?",
  precisouDeAjuda: "Precisou de ajuda de outra pessoa?",
  travessias: "Como se sentiu nas travessias?",
  orientacoes: "As orientações da pulseira estavam certas?",
  observacoes: "Observações",
};

/* ------------------------------------------------------------------
   Opções de cada campo, NA ORDEM em que aparecem no formulário
   ------------------------------------------------------------------ */
export const OPCOES = {
  meio: [
    { valor: "pe", rotulo: "A pé" },
    { valor: "onibus", rotulo: "Ônibus" },
    { valor: "metro", rotulo: "Metrô ou trem" },
  ],
  chegouSemSePerder: [
    { valor: true, rotulo: "Sim" },
    { valor: false, rotulo: "Não" },
  ],
  precisouDeAjuda: [
    { valor: true, rotulo: "Sim" },
    { valor: false, rotulo: "Não" },
  ],
  travessias: [
    { valor: "seguro", rotulo: "Seguro" },
    { valor: "medio", rotulo: "Mais ou menos" },
    { valor: "inseguro", rotulo: "Inseguro" },
  ],
  orientacoes: [
    { valor: "sim", rotulo: "Sim" },
    { valor: "parte", rotulo: "Em parte" },
    { valor: "nao", rotulo: "Não" },
  ],
};

// Esta parte é lógica
/**
 * Rótulo de um valor. Ex.: rotuloDe("meio", "metro") → "Metrô ou trem".
 * Valor desconhecido → texto vazio (a tela não quebra).
 */
export function rotuloDe(campo, valor) {
  const opcao = OPCOES[campo]?.find((item) => item.valor === valor);
  return opcao ? opcao.rotulo : "";
}

/* ------------------------------------------------------------------
   Etiquetas do cartão de registro na lista (seção 7.1)
   ------------------------------------------------------------------ */
const ETIQUETAS = {
  chegouSemSePerder: { true: "Sem se perder", false: "Se perdeu" },
  precisouDeAjuda: { false: "Sem ajuda", true: "Precisou de ajuda" },
  travessias: {
    seguro: "Travessias seguras",
    medio: "Travessias mais ou menos",
    inseguro: "Travessias inseguras",
  },
};

// Esta parte é lógica
/** As 3 etiquetas de um registro, na ordem da seção 7.1. Ignora valores desconhecidos. */
export function etiquetasDoRegistro(registro) {
  return [
    ETIQUETAS.chegouSemSePerder[String(registro.chegouSemSePerder)],
    ETIQUETAS.precisouDeAjuda[String(registro.precisouDeAjuda)],
    ETIQUETAS.travessias[registro.travessias],
  ].filter(Boolean);
}

// Esta parte é lógica
/** Texto das observações no "Ver registro": o texto, ou "Nenhuma" (seção 7.4). */
export function textoObservacoes(observacoes) {
  const texto = (observacoes ?? "").trim();
  return texto || "Nenhuma";
}

/* ------------------------------------------------------------------
   Indicadores do resumo (seção 7.1)
   ------------------------------------------------------------------ */
// Esta parte é lógica
/** "1 deslocamento registrado" / "2 deslocamentos registrados". */
export function rotuloTotal(total) {
  return total === 1 ? "deslocamento registrado" : "deslocamentos registrados";
}

export const ROTULOS_INDICADORES = {
  semAjuda: "sem precisar de ajuda",
  semSePerder: "chegaram sem se perder",
  travessiasSeguras: "com travessias seguras",
};
