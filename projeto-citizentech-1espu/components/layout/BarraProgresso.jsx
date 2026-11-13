"use client";

import { useProgressoLeitura } from "@/hooks/useProgressoLeitura";

/*
  BarraProgresso — progresso da leitura (seções 19.6 e 19.15).

  Linha de 3 px em --cor-acao, embaixo do cabeçalho, que cresce da
  esquerda (scaleX, a partir de transform-origin: left) conforme a página
  rola. Decorativa (aria-hidden): o leitor de tela não a lê.

  Com os efeitos desligados (e sem JavaScript), não aparece: uma barra
  parada em 0 não diria nada.
*/
export default function BarraProgresso() {
  // Esta parte é lógica
  const refBarra = useProgressoLeitura();

  return (
    <div
      ref={refBarra}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 -bottom-px h-[3px] origin-left scale-x-0 bg-acao efeitos-desligados:hidden"
    />
  );
}
