"use client";

import { useEffect, useRef } from "react";
import { useSecaoAtual } from "@/hooks/useSecaoAtual";

/*
  IndiceNestaPagina — "Nesta página" (seções 9.4 e 10, item 5), no visual
  da Fase 8 (decisão 1 da equipe).

  - <nav aria-label="Nesta página"> com <h2> visualmente oculto e links
    em pílula para os "id" das seções, logo depois do resumo (Solução)
    ou da abertura (Início).
  - Computador (≥ 1024 px de largura e ≥ 700 px de altura): o índice
    gruda embaixo do cabeçalho ao rolar, como uma faixa fina com fundo
    sólido. Celular, pouca altura e zoom alto: fica parado, para não
    tirar espaço da tela.
  - A pílula da seção atual fica dourada, com aria-current="true" (o
    leitor de tela diz "atual"). É só troca de cor: vale também com
    os efeitos desligados.
  - A altura da faixa fixa fica em --altura-indice, para os saltos às
    âncoras pararem abaixo dela (scroll-padding-top).
  - A rolagem até a seção é suave pelo Lenis, e instantânea com "reduzir
    movimento".

  "itens": lista de { id, texto }, na ordem das seções.
*/
const CONSULTA_FAIXA_FIXA = "(min-width: 64rem) and (min-height: 43.75rem)";

export default function IndiceNestaPagina({ itens }) {
  // Esta parte é lógica
  const atual = useSecaoAtual(itens);
  const refIndice = useRef(null);

  // Esta parte é lógica
  // Guarda a altura da faixa quando ela gruda (e 0 quando não gruda).
  useEffect(() => {
    const indice = refIndice.current;
    if (!indice) return;
    const raiz = document.documentElement;
    const consulta = window.matchMedia(CONSULTA_FAIXA_FIXA);

    function atualizar() {
      const altura = consulta.matches ? indice.offsetHeight : 0;
      raiz.style.setProperty("--altura-indice", `${altura}px`);
    }

    const observador = new ResizeObserver(atualizar);
    observador.observe(indice);
    consulta.addEventListener("change", atualizar);
    atualizar();

    return () => {
      observador.disconnect();
      consulta.removeEventListener("change", atualizar);
      raiz.style.removeProperty("--altura-indice");
    };
  }, []);

  return (
    <nav
      ref={refIndice}
      aria-labelledby="titulo-nesta-pagina"
      className="margem-lateral z-20 bg-fundo py-3 faixa-fixa:sticky faixa-fixa:top-[var(--altura-cabecalho)] faixa-fixa:border-b faixa-fixa:border-borda"
    >
      <div className="mx-auto max-w-pagina">
        <h2 id="titulo-nesta-pagina" className="sr-only">
          Nesta página
        </h2>
        <ul className="flex flex-wrap gap-2">
          {/* Esta parte é lógica */}
          {itens.map((item) => {
            const ehAtual = atual === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={ehAtual ? "true" : undefined}
                  className={`inline-flex min-h-12 items-center rounded-full border px-4 text-auxiliar font-bold no-underline transicao-fundo ${
                    ehAtual
                      ? "border-ouro bg-ouro text-sobre-ouro"
                      : "border-borda bg-superficie text-texto hover:bg-hover"
                  }`}
                >
                  {item.texto}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
