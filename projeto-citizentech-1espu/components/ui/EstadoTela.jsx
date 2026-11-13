"use client";

import { useEffect, useRef, useState } from "react";
import Botao from "@/components/ui/Botao";

/*
  EstadoTela — seção 10, item 12, e seção 11.2.
  tipo:
  - "carregando": "Carregando os registros…" + indicador simples, com
    role="status". Só aparece se demorar mais de 1 s (seção 11.1: abaixo de
    1 s, nenhum indicador). O indicador não gira com os efeitos desligados.
  - "vazio": H2 "Nenhum deslocamento registrado ainda" + "Novo registro".
  - "erro": role="alert" + "Tentar de novo".

  Props do "erro":
  - aoTentarDeNovo: função do botão
  - focarAoMontar: true depois de um "Tentar de novo" que falhou de novo.
    O foco volta para o botão, e a pessoa não se perde.
*/
export default function EstadoTela({ tipo, aoTentarDeNovo, focarAoMontar = false }) {
  if (tipo === "carregando") return <EstadoCarregando />;
  if (tipo === "vazio") return <EstadoVazio />;
  return <EstadoErro aoTentarDeNovo={aoTentarDeNovo} focarAoMontar={focarAoMontar} />;
}

const ESPERA_ANTES_DO_INDICADOR = 1000; // 1 s

function EstadoCarregando() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const espera = setTimeout(() => setVisivel(true), ESPERA_ANTES_DO_INDICADOR);
    return () => clearTimeout(espera);
  }, []);

  return (
    // A região de status existe desde o início; o texto entra depois de
    // 1 s, e é essa mudança que o leitor de tela anuncia.
    <div role="status" className="mt-8">
      {visivel && (
        <p className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className="inline-block size-6 shrink-0 animate-spin rounded-full border-4 border-borda border-t-marca"
          />
          <span>Carregando os registros…</span>
        </p>
      )}
    </div>
  );
}

function EstadoVazio() {
  return (
    <div className="mt-8">
      <h2>Nenhum deslocamento registrado ainda</h2>
      <p className="mt-4">Registre o primeiro para começar a medir o impacto da Pulse.</p>
      <p className="mt-6">
        {/* ICONE-Plus-AQUI */}
        <Botao href="/diario/novo" icone="Plus">
          Novo registro
        </Botao>
      </p>
    </div>
  );
}

function EstadoErro({ aoTentarDeNovo, focarAoMontar }) {
  const refBotao = useRef(null);

  useEffect(() => {
    if (focarAoMontar) refBotao.current?.focus();
  }, [focarAoMontar]);

  return (
    <div className="mt-8 rounded-cartao border-2 border-erro bg-erro-fundo p-6 text-erro">
      <div role="alert">
        <p className="font-bold">Não foi possível carregar os registros.</p>
        <p className="mt-2">Verifique a conexão e tente de novo.</p>
      </div>
      <p className="mt-4">
        {/* ICONE-ArrowClockwise-AQUI */}
        <Botao ref={refBotao} variante="secundario-sobre-cor" icone="ArrowClockwise" onClick={aoTentarDeNovo}>
          Tentar de novo
        </Botao>
      </p>
    </div>
  );
}
