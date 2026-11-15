"use client";

import { useEffect, useRef, useState } from "react";
import Botao from "@/components/ui/Botao";
import { useEsperaLonga } from "@/hooks/useEsperaLonga";

/*
  EstadoTela — seção 10, item 12, e seção 11.2.
  tipo:
  - "carregando": "Carregando os registros…" + indicador simples, com
    role="status". Só aparece se demorar mais de 1 s (seção 11.1: abaixo de
    1 s, nenhum indicador). O indicador não gira com os efeitos desligados.
    Depois de 10 s (seção 11.1), a mesma região de status ganha "Está
    demorando mais que o normal. Você pode esperar ou parar.", e abaixo
    dela, fora da região, aparece o botão "Parar de carregar".
  - "vazio": H2 "Nenhum deslocamento registrado ainda" + "Novo registro".
  - "erro": role="alert" + "Tentar de novo".

  Props do "carregando":
  - aoParar: função do "Parar de carregar" (interrompe a busca com o
    AbortSignal). Sem ela, o botão não aparece.

  Props do "erro":
  - aoTentarDeNovo: função do botão
  - focarAoMontar: true depois de um "Tentar de novo" que falhou de novo
    ou depois do "Parar de carregar". O foco vai para o botão, e a pessoa
    não se perde (o botão de parar sumiu).
  - interrompido: true depois do "Parar de carregar". O título passa a
    ser "Carregamento interrompido.".
*/
export default function EstadoTela({ tipo, aoTentarDeNovo, aoParar, focarAoMontar = false, interrompido = false }) {
  if (tipo === "carregando") return <EstadoCarregando aoParar={aoParar} />;
  if (tipo === "vazio") return <EstadoVazio />;
  return (
    <EstadoErro aoTentarDeNovo={aoTentarDeNovo} focarAoMontar={focarAoMontar} interrompido={interrompido} />
  );
}

const ESPERA_ANTES_DO_INDICADOR = 1000; // 1 s

function EstadoCarregando({ aoParar }) {
  const [visivel, setVisivel] = useState(false);
  // Este estado só existe enquanto carrega, então a contagem começa aqui
  const demorando = useEsperaLonga(true);

  useEffect(() => {
    const espera = setTimeout(() => setVisivel(true), ESPERA_ANTES_DO_INDICADOR);
    return () => clearTimeout(espera);
  }, []);

  return (
    <div className="mt-8">
      {/* A região de status existe desde o início; o texto entra depois de
          1 s (e o aviso, depois de 10 s), e é essa mudança que o leitor de
          tela anuncia. */}
      <div role="status">
        {visivel && (
          <p className="flex items-center gap-4">
            <span
              aria-hidden="true"
              className="inline-block size-6 shrink-0 animate-spin rounded-full border-4 border-borda border-t-marca"
            />
            <span>Carregando os registros…</span>
          </p>
        )}
        {demorando && <p className="mt-4">Está demorando mais que o normal. Você pode esperar ou parar.</p>}
      </div>
      {/* Fora da região de status: o botão não entra no anúncio */}
      {demorando && aoParar && (
        <p className="mt-4">
          <Botao variante="secundario" onClick={aoParar}>
            Parar de carregar
          </Botao>
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

function EstadoErro({ aoTentarDeNovo, focarAoMontar, interrompido }) {
  const refBotao = useRef(null);

  useEffect(() => {
    if (focarAoMontar) refBotao.current?.focus();
  }, [focarAoMontar]);

  return (
    <div className="mt-8 rounded-cartao border-2 border-erro bg-erro-fundo p-6 text-erro">
      <div role="alert">
        {interrompido ? (
          <p className="font-bold">Carregamento interrompido.</p>
        ) : (
          <>
            <p className="font-bold">Não foi possível carregar os registros.</p>
            <p className="mt-2">Verifique a conexão e tente de novo.</p>
          </>
        )}
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
