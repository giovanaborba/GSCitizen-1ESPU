import { ErroConexao, requisitar } from "@/services/apiClient";

// Os hooks usam isto para ignorar buscas canceladas, sem precisar
// importar o apiClient (só o serviço conversa com a API).
export { foiCancelado } from "@/services/apiClient";

/*
  registrosService — serviço único do Diário (seção 7.6).

  As 5 funções do CRUD: listar, obter, criar, atualizar e excluir.
  Quando a API chegar, SÓ este arquivo (e o apiClient) pode precisar de
  ajuste. Os hooks e as telas continuam iguais.

  Estado atual: a API ainda não existe. Sem mock e sem dados provisórios:
  como NEXT_PUBLIC_API_URL não está configurada, toda função lança o erro
  de conexão (codigo: "conexao"), e as telas mostram o estado de erro.

  Formato de um registro (seção 7.2):
  {
    id: "abc123",              // texto gerado pela API
    data: "2026-11-05",        // "AAAA-MM-DD"
    meio: "onibus",            // "pe" | "onibus" | "metro"
    chegouSemSePerder: true,   // true | false
    precisouDeAjuda: false,    // true | false
    travessias: "seguro",      // "seguro" | "medio" | "inseguro"
    orientacoes: "parte",      // "sim" | "parte" | "nao"
    observacoes: "",           // opcional, até 300 caracteres
    criadoEm: "...",           // opcional, se a API fornecer
    atualizadoEm: "..."        // opcional, se a API fornecer
  }

  Todas as funções aceitam { sinal } (AbortSignal) no último parâmetro,
  para o hook cancelar a requisição se a pessoa sair da tela.
*/

const CAMINHO = "/registros";

// Esta parte é lógica
/**
 * Garante que o resto do site receba sempre o mesmo formato, mesmo que a
 * API mande campos a mais ou o id como número.
 */
function paraRegistro(dados) {
  if (!dados || typeof dados !== "object") {
    throw new ErroConexao("a API devolveu um registro em formato inesperado");
  }
  return {
    id: String(dados.id),
    data: dados.data,
    meio: dados.meio,
    chegouSemSePerder: dados.chegouSemSePerder,
    precisouDeAjuda: dados.precisouDeAjuda,
    travessias: dados.travessias,
    orientacoes: dados.orientacoes,
    observacoes: dados.observacoes ?? "",
    criadoEm: dados.criadoEm,
    atualizadoEm: dados.atualizadoEm,
  };
}

// Esta parte é lógica
/**
 * Monta o corpo enviado à API: só os campos do formulário, sem id e sem
 * datas de controle (quem gera essas é a API).
 */
function paraCorpo(dados) {
  return {
    data: dados.data,
    meio: dados.meio,
    chegouSemSePerder: dados.chegouSemSePerder,
    precisouDeAjuda: dados.precisouDeAjuda,
    travessias: dados.travessias,
    orientacoes: dados.orientacoes,
    observacoes: dados.observacoes ?? "",
  };
}

// Esta parte é lógica
/**
 * Busca todos os registros.
 * @returns {Promise<object[]>} lista de registros
 */
export async function listar({ sinal } = {}) {
  /*
    ===================================================================
    API-EXTERNA-AQUI — listar()
    ===================================================================
    Chamada esperada:  GET {URL_BASE}/registros
    A API recebe:      nada (sem corpo).
    A API devolve:     200 + uma LISTA de registros no formato acima.
                       Lista vazia [] quando não houver registros.
    Se a API devolver a lista dentro de outro campo (ex.:
    { "itens": [...] }), ajuste a linha "const lista = ..." abaixo.
    A ordem (mais recente primeiro) é feita no site, não na API.
    ===================================================================
  */
  const resposta = await requisitar(CAMINHO, { sinal });
  const lista = resposta;

  if (!Array.isArray(lista)) {
    throw new ErroConexao("a API não devolveu uma lista de registros");
  }
  return lista.map(paraRegistro);
}

// Esta parte é lógica
/**
 * Busca um registro.
 * @param {string} id
 * @returns {Promise<object|null>} o registro, ou null se não existir
 */
export async function obter(id, { sinal } = {}) {
  /*
    ===================================================================
    API-EXTERNA-AQUI — obter(id)
    ===================================================================
    Chamada esperada:  GET {URL_BASE}/registros/:id
    A API recebe:      o id na URL (sem corpo).
    A API devolve:     200 + o registro no formato acima;
                       404 quando o registro não existe → esta função
                       devolve null, e a tela mostra
                       "Registro não encontrado" (seção 7.4).
    ===================================================================
  */
  const resposta = await requisitar(`${CAMINHO}/${encodeURIComponent(id)}`, { sinal });

  if (resposta?.naoEncontrado) return null;
  return paraRegistro(resposta);
}

// Esta parte é lógica
/**
 * Cria um registro. Também é usada pelo "Desfazer" depois de excluir
 * (recria o registro com os mesmos dados, seção 7.5).
 * @param {object} dados  campos do registro, sem id
 * @returns {Promise<object>} o registro criado, com o id gerado pela API
 */
export async function criar(dados, { sinal } = {}) {
  /*
    ===================================================================
    API-EXTERNA-AQUI — criar(dados)
    ===================================================================
    Chamada esperada:  POST {URL_BASE}/registros
    A API recebe:      JSON com data, meio, chegouSemSePerder,
                       precisouDeAjuda, travessias, orientacoes e
                       observacoes (SEM id).
    A API devolve:     201 (ou 200) + o registro criado, já COM o id.
    ===================================================================
  */
  const resposta = await requisitar(CAMINHO, {
    metodo: "POST",
    corpo: paraCorpo(dados),
    sinal,
  });

  if (resposta?.naoEncontrado) {
    throw new ErroConexao("o endereço /registros não existe na API");
  }
  return paraRegistro(resposta);
}

// Esta parte é lógica
/**
 * Altera um registro.
 * @param {string} id
 * @param {object} dados  campos do registro
 * @returns {Promise<object>} o registro atualizado
 */
export async function atualizar(id, dados, { sinal } = {}) {
  /*
    ===================================================================
    API-EXTERNA-AQUI — atualizar(id, dados)
    ===================================================================
    Chamada esperada:  PUT {URL_BASE}/registros/:id
    A API recebe:      o id na URL + JSON com TODOS os campos do
                       formulário (os mesmos de criar).
    A API devolve:     200 + o registro atualizado.
    Se a API usar PATCH em vez de PUT, troque o método abaixo.
    ===================================================================
  */
  const resposta = await requisitar(`${CAMINHO}/${encodeURIComponent(id)}`, {
    metodo: "PUT",
    corpo: paraCorpo(dados),
    sinal,
  });

  if (resposta?.naoEncontrado) {
    throw new ErroConexao("o registro não existe mais na API");
  }
  return paraRegistro(resposta);
}

// Esta parte é lógica
/**
 * Exclui um registro.
 * @param {string} id
 * @returns {Promise<void>} nada
 */
export async function excluir(id, { sinal } = {}) {
  /*
    ===================================================================
    API-EXTERNA-AQUI — excluir(id)
    ===================================================================
    Chamada esperada:  DELETE {URL_BASE}/registros/:id
    A API recebe:      o id na URL (sem corpo).
    A API devolve:     200 ou 204. O conteúdo da resposta é ignorado.
    ===================================================================
  */
  const resposta = await requisitar(`${CAMINHO}/${encodeURIComponent(id)}`, {
    metodo: "DELETE",
    sinal,
  });

  if (resposta?.naoEncontrado) {
    throw new ErroConexao("o registro não existe mais na API");
  }
}
