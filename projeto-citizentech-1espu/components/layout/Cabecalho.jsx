"use client";

import { useEffect, useRef } from "react";
import LinkInterno from "@/components/ui/LinkInterno";
import EspacoIcone from "@/components/ui/EspacoIcone";
import { useDirecaoRolagem } from "@/hooks/useDirecaoRolagem";

/*
  Cabecalho — seções 9.1 e 18.9, e seção 10, item 2.
  Preso no topo (sticky), com pelo menos 64 px de altura:
  - à esquerda, o link "Pulse" para a Início, com o nome em Anton
    (seção 18.4) e o marcador do ícone;
  - à direita, o rótulo mono "GS 2026.2 · CitizenTech" (decisão da
    equipe na Fase 8). No celular estreito ou com texto ampliado, o
    rótulo desce para a linha de baixo, sem rolagem lateral.

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
      <div className="margem-lateral mx-auto flex min-h-16 w-full max-w-pagina flex-wrap items-center justify-between gap-x-4 py-2">
        <LinkInterno
          href="/"
          className="inline-flex min-h-12 items-center gap-2 font-titulo text-logo text-marca"
        >
          {/* ICONE-Pulse-AQUI */}
          <EspacoIcone nome="Pulse" />
          <span>Pulse</span>
        </LinkInterno>
        <p className="rotulo-mono text-texto-2">GS 2026.2 · CitizenTech</p>
      </div>
    </header>
  );
}
