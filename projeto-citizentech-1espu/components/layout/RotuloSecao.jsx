"use client";

import { useLinhaRotulo } from "@/hooks/useLinhaRotulo";

/*
  RotuloSecao — rótulo mono das cabeças de seção (eyebrow, seção 18.5),
  com a linha laranja antes dele (seção 19.6).

  - A linha tem 24 × 3 px, em --cor-acao, e é decorativa (aria-hidden):
    o leitor de tela lê só o texto do rótulo.
  - Ela se desenha quando a seção chega (useLinhaRotulo). O rótulo e o
    título não se mexem (19.6: "os títulos ficam sem efeito").
  - "className": classes extras do parágrafo (ex.: posição na grade de
    duas colunas).
*/
export default function RotuloSecao({ children, className = "" }) {
  const refLinha = useLinhaRotulo();

  return (
    <p className={`rotulo-mono flex items-center gap-3 text-destaque ${className}`}>
      <span
        ref={refLinha}
        aria-hidden="true"
        className="h-[3px] w-6 shrink-0 origin-left rounded-full bg-acao"
      />
      {children}
    </p>
  );
}
