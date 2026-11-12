"use client";

import EspacoIcone from "@/components/ui/EspacoIcone";
import { useCarrossel } from "@/hooks/useCarrossel";

/*
  Carrossel — lista que rola na horizontal, com botões e contagem
  (seções 18.8 e 18.14). Usado em Tecnologias.

  Acessibilidade:
  - Região com aria-roledescription="carrossel" e aria-label (o leitor de
    tela anuncia "Tecnologias, carrossel").
  - A lista recebe o foco pelo Tab (tabIndex={0}) e rola com as setas do
    teclado; também dá para deslizar com o dedo.
  - Botões "Anterior" e "Próximo" com ícone E texto (seção 18.2, item 8)
    e aria-controls. Nas pontas, aria-disabled (continuam focáveis). O
    estado desabilitado aparece pela borda tracejada, sem perder
    contraste no texto.
  - Contagem visível "1 a 3 de 8", anunciada com educação (aria-live
    polite) quando muda.
  - Sem avanço automático.

  Props: rotulo (nome da região), idLista e children (os <li>).
*/
export default function Carrossel({ rotulo, idLista, children }) {
  // Esta parte é lógica
  const { refLista, medida, passo } = useCarrossel();

  const classesBotao =
    "inline-flex min-h-12 items-center gap-2 rounded-full border-2 bg-superficie px-5 font-bold text-texto";

  return (
    <div role="region" aria-roledescription="carrossel" aria-label={rotulo} className="grid gap-4">
      <ul
        id={idLista}
        ref={refLista}
        tabIndex={0}
        className="grid snap-x snap-mandatory scroll-px-1 auto-cols-[min(78%,20rem)] grid-flow-col gap-4 overflow-x-auto p-1 pb-3 [&>li]:snap-start"
      >
        {children}
      </ul>

      {/* Esta parte é lógica */}
      {medida && (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            aria-controls={idLista}
            aria-disabled={medida.noInicio ? "true" : undefined}
            onClick={() => passo(-1)}
            className={`${classesBotao} ${
              medida.noInicio ? "border-dashed border-borda" : "border-borda hover:border-marca"
            }`}
          >
            {/* ICONE-CaretLeft-AQUI */}
            <EspacoIcone nome="CaretLeft" />
            Anterior
          </button>
          <button
            type="button"
            aria-controls={idLista}
            aria-disabled={medida.noFim ? "true" : undefined}
            onClick={() => passo(1)}
            className={`${classesBotao} ${
              medida.noFim ? "border-dashed border-borda" : "border-borda hover:border-marca"
            }`}
          >
            Próximo
            {/* ICONE-CaretRight-AQUI */}
            <EspacoIcone nome="CaretRight" />
          </button>
          <p aria-live="polite" className="rotulo-mono text-[0.9rem] tracking-[0.08em] text-texto-2 tabular-nums">
            {medida.primeiro === medida.ultimo
              ? `${medida.primeiro} de ${medida.total}`
              : `${medida.primeiro} a ${medida.ultimo} de ${medida.total}`}
          </p>
        </div>
      )}
    </div>
  );
}
