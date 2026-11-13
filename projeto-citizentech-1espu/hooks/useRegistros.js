import { useEffect, useState } from "react";
import {
  atualizar as atualizarNoServico,
  criar as criarNoServico,
  excluir as excluirNoServico,
  foiCancelado,
  listar,
} from "@/services/registrosService";
import { ordenarDoMaisRecente } from "@/lib/datas";

/*
  useRegistros — custom hook do CRUD do Diário (seção 14).
  Guarda o estado (lista, carregando, erro) e chama o serviço. As telas
  recebem os dados e as funções prontas, sem saber que existe uma API.

  Opção: { carregarAoIniciar: false } não busca a lista (ex.: na tela
  "Novo registro", que só precisa de criar).

  Devolve:
  - registros   lista do mais recente para o mais antigo
  - carregando  true enquanto a lista está sendo buscada
  - erro        o erro de domínio ({ codigo: "conexao" }) ou null
  - recarregar  busca a lista de novo (botão "Tentar de novo")
  - criar, atualizar, excluir, restaurar  (restaurar = "Desfazer")
*/
export function useRegistros({ carregarAoIniciar = true } = {}) {
  const [registros, setRegistros] = useState([]);
  const [carregando, setCarregando] = useState(carregarAoIniciar);
  const [erro, setErro] = useState(null);
  // Cada novo número faz o useEffect buscar a lista outra vez
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    if (!carregarAoIniciar) return;

    // Se a pessoa sair da tela antes da resposta, a busca é cancelada
    const controle = new AbortController();

    listar({ sinal: controle.signal })
      .then((lista) => {
        setRegistros(ordenarDoMaisRecente(lista));
        setErro(null);
        setCarregando(false);
      })
      .catch((erroDaBusca) => {
        if (foiCancelado(erroDaBusca)) return;
        setErro(erroDaBusca);
        setCarregando(false);
      });

    return () => controle.abort();
  }, [carregarAoIniciar, tentativa]);

  function recarregar() {
    setCarregando(true);
    setErro(null);
    setTentativa((anterior) => anterior + 1);
  }

  async function criar(dados) {
    const novo = await criarNoServico(dados);
    setRegistros((lista) => ordenarDoMaisRecente([...lista, novo]));
    return novo;
  }

  async function atualizar(id, dados) {
    const atualizado = await atualizarNoServico(id, dados);
    setRegistros((lista) =>
      ordenarDoMaisRecente(lista.map((registro) => (registro.id === id ? atualizado : registro))),
    );
    return atualizado;
  }

  async function excluir(id) {
    await excluirNoServico(id);
    setRegistros((lista) => lista.filter((registro) => registro.id !== id));
  }

  // "Desfazer" (seção 7.5): recria o registro com os mesmos dados (POST).
  // O serviço ignora o id antigo, e a API gera um novo.
  async function restaurar(registroExcluido) {
    return criar(registroExcluido);
  }

  return { registros, carregando, erro, recarregar, criar, atualizar, excluir, restaurar };
}
