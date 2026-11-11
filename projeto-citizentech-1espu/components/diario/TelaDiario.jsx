"use client";

import { useState } from "react";
import TituloPagina from "@/components/layout/TituloPagina";
import Botao from "@/components/ui/Botao";
import Cartao from "@/components/ui/Cartao";
import ErroCampo from "@/components/ui/ErroCampo";
import EstadoTela from "@/components/ui/EstadoTela";
import MensagemStatus from "@/components/ui/MensagemStatus";
import ResumoIndicadores from "@/components/diario/ResumoIndicadores";
import ListaRegistros from "@/components/diario/ListaRegistros";
import { useMensagemDiario } from "@/hooks/useMensagemDiario";
import { useRegistros } from "@/hooks/useRegistros";
import { useResumoIndicadores } from "@/hooks/useResumoIndicadores";

/*
  TelaDiario — a tela /diario (seção 7.1).
  Liga os hooks aos componentes de apresentação: os dados vêm do
  useRegistros, os números do useResumoIndicadores e a mensagem
  ("Registro salvo.", "Registro excluído." + Desfazer) do contexto
  useMensagemDiario.

  Estados (seção 11.2): carregando, erro, vazio ou com registros.
  Sem a API, a lista mostra o erro de conexão.
*/
export default function TelaDiario() {
  const { registros, carregando, erro, recarregar, restaurar } = useRegistros();
  const indicadores = useResumoIndicadores(registros);
  const { mensagem, definirMensagem, limparMensagem } = useMensagemDiario();
  const [restaurando, setRestaurando] = useState(false);
  const [falhasAoDesfazer, setFalhasAoDesfazer] = useState(0);
  const [tentativas, setTentativas] = useState(0);

  // Esta parte é lógica
  function aoTentarDeNovo() {
    setTentativas((anterior) => anterior + 1);
    recarregar();
  }

  // Esta parte é lógica
  // "Desfazer" (seção 7.5): recria o registro e anuncia "Registro restaurado."
  async function aoDesfazer() {
    if (restaurando || !mensagem?.registroExcluido) return;
    setRestaurando(true);
    try {
      await restaurar(mensagem.registroExcluido);
      setFalhasAoDesfazer(0);
      definirMensagem({ tipo: "sucesso", texto: "Registro restaurado." });
    } catch {
      setFalhasAoDesfazer((anterior) => anterior + 1);
    } finally {
      setRestaurando(false);
    }
  }

  // Esta parte é lógica
  function aoFecharMensagem() {
    setFalhasAoDesfazer(0);
    limparMensagem();
  }

  // Esta parte é lógica
  const situacao = carregando
    ? "carregando"
    : erro
      ? "erro"
      : registros.length === 0
        ? "vazio"
        : "lista";

  return (
    <div className="margem-lateral mx-auto max-w-texto py-8">
      <TituloPagina
        titulo="Diário de deslocamentos"
        resumo="Registre como foi cada trajeto. Os registros ajudam a medir o impacto da Pulse."
      />

      <Cartao className="mt-8 text-auxiliar">
        <p>
          Os registros são anônimos e compartilhados por todas as pessoas que
          usam o site. Não escreva nomes ou endereços.
        </p>
      </Cartao>

      {/* Esta parte é lógica */}
      {mensagem && (
        <div className="mt-8">
          <MensagemStatus
            tipo={mensagem.tipo}
            texto={mensagem.texto}
            aoFechar={aoFecharMensagem}
            acao={
              mensagem.registroExcluido
                ? {
                    texto: "Desfazer",
                    icone: "ArrowCounterClockwise", // ICONE-ArrowCounterClockwise-AQUI
                    aoClicar: aoDesfazer,
                    ocupada: restaurando,
                  }
                : undefined
            }
          />
          {falhasAoDesfazer > 0 && (
            <ErroCampo key={falhasAoDesfazer} papel="alert" className="mt-4">
              Não foi possível salvar. Verifique a conexão e tente de novo.
            </ErroCampo>
          )}
        </div>
      )}

      {/* Esta parte é lógica */}
      {situacao === "carregando" && <EstadoTela tipo="carregando" />}
      {situacao === "erro" && (
        <EstadoTela
          key={tentativas}
          tipo="erro"
          aoTentarDeNovo={aoTentarDeNovo}
          focarAoMontar={tentativas > 0}
        />
      )}
      {situacao === "vazio" && <EstadoTela tipo="vazio" />}
      {situacao === "lista" && (
        <>
          <ResumoIndicadores indicadores={indicadores} />
          <p className="mt-8">
            {/* ICONE-Plus-AQUI */}
            <Botao href="/diario/novo" icone="Plus">
              Novo registro
            </Botao>
          </p>
          <ListaRegistros registros={registros} />
        </>
      )}
    </div>
  );
}
