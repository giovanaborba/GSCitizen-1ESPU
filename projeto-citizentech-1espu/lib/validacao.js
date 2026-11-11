import { ehDataFutura, ehDataValida, hojeISO } from "@/lib/datas";
import { OPCOES } from "@/lib/rotulos";

/*
  validacao — regras e mensagens do formulário do Diário (seção 7.3).
  Funções puras: recebem os valores e devolvem os erros. Quem decide
  QUANDO validar (só ao enviar) é o hook useFormularioRegistro (Fase 5).

  Formato dos valores do formulário:
  {
    data: "",                  // "AAAA-MM-DD" ou "" (vazio)
    meio: "",                  // "pe" | "onibus" | "metro" | ""
    chegouSemSePerder: null,   // true | false | null (sem resposta)
    precisouDeAjuda: null,     // true | false | null
    travessias: "",            // "seguro" | "medio" | "inseguro" | ""
    orientacoes: "",           // "sim" | "parte" | "nao" | ""
    observacoes: "",           // texto livre, opcional
  }
*/

export const LIMITE_OBSERVACOES = 300;

/** Ordem dos campos na tela. Define qual é o "primeiro campo com erro". */
export const ORDEM_DOS_CAMPOS = [
  "data",
  "meio",
  "chegouSemSePerder",
  "precisouDeAjuda",
  "travessias",
  "orientacoes",
  "observacoes",
];

/** Mensagens exatas da seção 7.3. */
export const MENSAGENS_DE_ERRO = {
  dataVazia: "Escolha a data do deslocamento.",
  dataFutura:
    "Escolha uma data de hoje ou de antes. O Diário registra deslocamentos que já aconteceram.",
  meio: "Escolha o meio de transporte.",
  chegouSemSePerder: "Responda se chegou ao destino sem se perder.",
  precisouDeAjuda: "Responda se precisou de ajuda de outra pessoa.",
  travessias: "Responda como se sentiu nas travessias.",
  orientacoes: "Responda se as orientações da pulseira estavam certas.",
  observacoes: "Use no máximo 300 caracteres nas observações.",
};

// Esta parte é lógica
/** Valores de um formulário novo, todo vazio. */
export function valoresIniciais() {
  return {
    data: "",
    meio: "",
    chegouSemSePerder: null,
    precisouDeAjuda: null,
    travessias: "",
    orientacoes: "",
    observacoes: "",
  };
}

// Esta parte é lógica
/** Valores do formulário a partir de um registro existente (tela "Editar"). */
export function valoresDoRegistro(registro) {
  return {
    data: registro.data ?? "",
    meio: registro.meio ?? "",
    chegouSemSePerder: registro.chegouSemSePerder ?? null,
    precisouDeAjuda: registro.precisouDeAjuda ?? null,
    travessias: registro.travessias ?? "",
    orientacoes: registro.orientacoes ?? "",
    observacoes: registro.observacoes ?? "",
  };
}

// Esta parte é lógica
/**
 * Conta caracteres como a pessoa vê (um acento ou um emoji conta como 1).
 */
export function contarCaracteres(texto) {
  return Array.from(texto ?? "").length;
}

// Esta parte é lógica
/** true se o valor é uma das opções permitidas do campo (rotulos.js). */
function ehOpcaoValida(campo, valor) {
  return OPCOES[campo].some((opcao) => opcao.valor === valor);
}

// Esta parte é lógica
/**
 * Valida todos os campos de uma vez.
 * @param {object} valores  formato descrito no topo do arquivo
 * @param {string} [hoje]   "AAAA-MM-DD" (pode ser passado nos testes)
 * @returns {object} { nomeDoCampo: "mensagem" } só dos campos com erro.
 *                   Objeto vazio {} quando está tudo certo.
 */
export function validarRegistro(valores, hoje = hojeISO()) {
  const erros = {};

  if (!valores.data || !ehDataValida(valores.data)) {
    erros.data = MENSAGENS_DE_ERRO.dataVazia;
  } else if (ehDataFutura(valores.data, hoje)) {
    erros.data = MENSAGENS_DE_ERRO.dataFutura;
  }

  for (const campo of ["meio", "chegouSemSePerder", "precisouDeAjuda", "travessias", "orientacoes"]) {
    if (!ehOpcaoValida(campo, valores[campo])) {
      erros[campo] = MENSAGENS_DE_ERRO[campo];
    }
  }

  if (contarCaracteres(valores.observacoes) > LIMITE_OBSERVACOES) {
    erros.observacoes = MENSAGENS_DE_ERRO.observacoes;
  }

  return erros;
}

// Esta parte é lógica
/** true quando não há nenhum erro. */
export function estaValido(erros) {
  return Object.keys(erros).length === 0;
}

// Esta parte é lógica
/** Nome do primeiro campo com erro, na ordem da tela (para mover o foco). */
export function primeiroCampoComErro(erros) {
  return ORDEM_DOS_CAMPOS.find((campo) => campo in erros) ?? null;
}

// Esta parte é lógica
/**
 * true se a pessoa já preencheu ou mudou alguma resposta. Usado no aviso
 * "Descartar as respostas?" (seção 7.3).
 * @param {object} valores     valores atuais
 * @param {object} referencia  valores do início (vazios no "Novo"; os do
 *                             registro no "Editar")
 */
export function foiAlterado(valores, referencia) {
  return ORDEM_DOS_CAMPOS.some((campo) => valores[campo] !== referencia[campo]);
}

// Esta parte é lógica
/** Dados enviados ao serviço: os valores com as observações sem espaços nas pontas. */
export function dadosParaSalvar(valores) {
  return { ...valores, observacoes: (valores.observacoes ?? "").trim() };
}
