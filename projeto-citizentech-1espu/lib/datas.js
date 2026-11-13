/*
  datas — funções puras de data (seção 7.2).

  "Função pura" = recebe valores, devolve um resultado e não mexe em mais
  nada (não chama API, não muda a tela). Com a mesma entrada, devolve
  sempre a mesma saída. Isso facilita testar e reaproveitar.

  As datas do Diário são textos "AAAA-MM-DD" (ex.: "2026-11-05"), sem
  hora. Por isso as funções trabalham com o TEXTO e evitam new Date("..."):
  esse comando lê a data como meia-noite em UTC, e no Brasil (UTC−3) ela
  viraria o dia anterior.
*/

const FORMATO_ISO = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Completa com zero à esquerda: 5 → "05". */
function doisDigitos(numero) {
  return String(numero).padStart(2, "0");
}

/**
 * Hoje no fuso do aparelho, em "AAAA-MM-DD".
 * Usado no max={hoje} do campo de data e na validação de data no futuro.
 */
export function hojeISO(agora = new Date()) {
  return `${agora.getFullYear()}-${doisDigitos(agora.getMonth() + 1)}-${doisDigitos(agora.getDate())}`;
}

/** true se o texto é uma data real no formato "AAAA-MM-DD" (ex.: recusa 2026-02-30). */
export function ehDataValida(textoISO) {
  const partes = FORMATO_ISO.exec(textoISO ?? "");
  if (!partes) return false;

  const ano = Number(partes[1]);
  const mes = Number(partes[2]);
  const dia = Number(partes[3]);
  const data = new Date(ano, mes - 1, dia);

  return data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia;
}

/**
 * true se a data é depois de hoje.
 * Datas "AAAA-MM-DD" podem ser comparadas como texto: "2026-11-06" > "2026-11-05".
 */
export function ehDataFutura(textoISO, hoje = hojeISO()) {
  return textoISO > hoje;
}

/** "2026-11-05" → "05/11/2026". Devolve o texto original se não for uma data válida. */
export function formatarData(textoISO) {
  const partes = FORMATO_ISO.exec(textoISO ?? "");
  if (!partes) return textoISO ?? "";
  return `${partes[3]}/${partes[2]}/${partes[1]}`;
}

/**
 * Ordena do mais recente para o mais antigo (seção 7.1).
 * Desempate: no mesmo dia, o criado por último vem primeiro (se a API
 * enviar criadoEm). Devolve uma lista NOVA, sem alterar a original.
 */
export function ordenarDoMaisRecente(registros) {
  return [...registros].sort((a, b) => {
    if (a.data !== b.data) return a.data < b.data ? 1 : -1;
    const criadoA = a.criadoEm ?? "";
    const criadoB = b.criadoEm ?? "";
    if (criadoA === criadoB) return 0;
    return criadoA < criadoB ? 1 : -1;
  });
}
