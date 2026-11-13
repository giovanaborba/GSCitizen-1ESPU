/*
  apiClient — a ÚNICA parte do site que faz fetch (seção 14.2).

  Responsabilidades:
  1. Saber a URL base da API externa.
  2. Fazer a requisição HTTP.
  3. Traduzir QUALQUER falha (sem URL, sem internet, servidor fora do ar,
     resposta inválida) para o erro de domínio { codigo: "conexao" }, que
     as telas transformam nas mensagens da seção 11.

  Quem usa: só o services/registrosService.js. Hooks e componentes nunca
  importam este arquivo.
*/

/*
  =====================================================================
  API-EXTERNA-AQUI — URL BASE
  =====================================================================
  A URL vem da variável de ambiente NEXT_PUBLIC_API_URL.

  Como configurar quando a API existir:
  1. Crie o arquivo .env.local na pasta projeto-citizentech-1espu
     (ele já é ignorado pelo Git, pelo .gitignore).
  2. Escreva uma linha, SEM barra no final:
       NEXT_PUBLIC_API_URL=https://endereco-da-api.com
  3. Pare e rode de novo o "npm run dev" (o Next só lê o .env ao iniciar).

  O prefixo NEXT_PUBLIC_ é obrigatório: sem ele, o Next não deixa o
  navegador ler a variável, e o Diário roda no navegador.

  Enquanto a variável não existir, toda chamada lança o erro de conexão e
  o Diário mostra "Não foi possível carregar os registros." (seção 7.6).
  =====================================================================
*/
const URL_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

/**
 * Erro de domínio usado em todo o Diário. A interface olha só para
 * "codigo" e escolhe a mensagem certa (seção 11).
 */
export class ErroConexao extends Error {
  constructor(detalhe, causa) {
    super(`Falha de conexão com a API: ${detalhe}`, { cause: causa });
    this.name = "ErroConexao";
    this.codigo = "conexao";
  }
}

/** true quando o erro veio de um cancelamento (ex.: a pessoa saiu da tela). */
export function foiCancelado(erro) {
  return erro?.name === "AbortError";
}

/**
 * Faz uma requisição à API e devolve:
 * - o corpo JSON da resposta, se houver;
 * - null, se a resposta não tiver corpo (ex.: 204 depois de excluir);
 * - { naoEncontrado: true }, se a API responder 404 (quem chama decide o
 *   que isso significa).
 *
 * @param {string} caminho  ex.: "/registros" ou "/registros/abc123"
 * @param {object} [opcoes]
 * @param {string} [opcoes.metodo]  "GET" (padrão), "POST", "PUT", "DELETE"
 * @param {object} [opcoes.corpo]   dados enviados como JSON
 * @param {AbortSignal} [opcoes.sinal]  permite cancelar a requisição
 */
export async function requisitar(caminho, { metodo = "GET", corpo, sinal } = {}) {
  if (!URL_BASE) {
    throw new ErroConexao("a variável NEXT_PUBLIC_API_URL não foi configurada");
  }

  let resposta;
  try {
    resposta = await fetch(`${URL_BASE}${caminho}`, {
      method: metodo,
      headers: corpo ? { "Content-Type": "application/json" } : undefined,
      body: corpo ? JSON.stringify(corpo) : undefined,
      signal: sinal,
    });
  } catch (erro) {
    // Cancelamento não é falha de conexão: devolve como veio.
    if (foiCancelado(erro)) throw erro;
    throw new ErroConexao("a requisição não chegou à API", erro);
  }

  if (resposta.status === 404) return { naoEncontrado: true };

  if (!resposta.ok) {
    throw new ErroConexao(`a API respondeu com o status ${resposta.status}`);
  }

  const texto = await resposta.text();
  if (!texto) return null;

  try {
    return JSON.parse(texto);
  } catch (erro) {
    throw new ErroConexao("a resposta da API não é um JSON válido", erro);
  }
}
