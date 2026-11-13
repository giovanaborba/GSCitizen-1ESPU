"use client";

import { useEffect, useRef } from "react";
import LinkInterno from "@/components/ui/LinkInterno";
import EspacoIcone from "@/components/ui/EspacoIcone";
import InterruptorEfeitos from "@/components/layout/InterruptorEfeitos";
import BarraProgresso from "@/components/layout/BarraProgresso";
import { useDirecaoRolagem } from "@/hooks/useDirecaoRolagem";

/*
  Cabecalho — seções 9.1 e 18.9, e seção 10, item 2.
  Preso no topo (sticky), com pelo menos 64 px de altura:
  - à esquerda, o link "Pulse" para a Início, com o nome em Anton
    (seção 18.4) e o marcador do ícone;
  - à direita, o rótulo mono "GS 2026.2 · CitizenTech" (decisão da
    equipe na Fase 8) e, à direita dele, o botão "Efeitos" (Fase 9,
    seção 19.2). No celular, o rótulo desce para a linha de baixo, sem
    rolagem lateral.

  Em Início e Solução, no celular, sai da tela ao rolar para baixo
  (useDirecaoRolagem). Esconde só visualmente: continua acessível.

  O link passa pela guarda de saída e pela transição (LinkInterno): sair
  do formulário pelo logo também pergunta "Descartar as respostas?".
*/
export default function Cabecalho() {
  // Esta parte é lógica
  const escondido = useDirecaoRolagem();
  const refCabecalho = useRef(null);

  // Esta parte é lógica
  // Mede a altura real do cabeçalho e guarda em --altura-cabecalho. Ela
  // é usada no desconto das âncoras (scroll-padding-top): se o rótulo
  // quebrar linha, o cabeçalho fica mais alto, e o título de destino
  // continua aparecendo inteiro, logo abaixo dele.
  useEffect(() => {
    const cabecalho = refCabecalho.current;
    if (!cabecalho) return;
    const raiz = document.documentElement;

    const observador = new ResizeObserver(() => {
      raiz.style.setProperty("--altura-cabecalho", `${cabecalho.offsetHeight}px`);
    });
    observador.observe(cabecalho);

    return () => {
      observador.disconnect();
      raiz.style.removeProperty("--altura-cabecalho");
    };
  }, []);

  return (
    <header
      ref={refCabecalho}
      data-barra-rolagem
      className={`sticky top-0 z-30 border-b border-borda bg-superficie transition-transform duration-200 ${
        escondido ? "max-md:-translate-y-full" : ""
      }`}
    >
      {/* Ordem no HTML (e do leitor de tela): Pulse → rótulo → "Efeitos".
          No celular (abaixo de 640 px), o rótulo desce para a linha de
          baixo (order), e "Pulse" e "Efeitos" ficam na primeira. Só os
          dois links/botões recebem foco, e a ordem deles não muda. */}
      <div className="margem-lateral mx-auto flex min-h-16 w-full max-w-pagina flex-wrap items-center gap-x-4 gap-y-1 py-2">
        <LinkInterno
          href="/"
          className="inline-flex min-h-12 items-center gap-2 font-titulo text-logo text-marca"
        >
          {/* ICONE-Pulse-AQUI */}
          <EspacoIcone nome="Pulse" />
          <span>Pulse</span>
        </LinkInterno>
        <p className="rotulo-mono text-texto-2 max-sm:order-last max-sm:basis-full max-sm:pb-1 max-sm:text-right sm:ml-auto">
          GS 2026.2 · CitizenTech
        </p>
        {/* Botão "Efeitos" (seção 19.2), à direita do rótulo */}
        <div className="ml-auto sm:ml-0">
          <InterruptorEfeitos />
        </div>
      </div>
      {/* Progresso da leitura, embaixo do cabeçalho (seção 19.6) */}
      <BarraProgresso />
    </header>
  );
}
