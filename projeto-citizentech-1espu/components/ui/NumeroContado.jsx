"use client";

import { formatarNumero, useContagem } from "@/hooks/useContagem";

/*
  NumeroContado — número grande que conta até o valor (seções 19.6 e
  19.15), nos cartões de dados de "O problema".

  - O número visível é decorativo (aria-hidden) e conta de 0 até o valor
    quando o cartão chega (useContagem).
  - O leitor de tela lê só o texto escondido "textoReal", o valor de
    verdade ("Cerca de 90%", "7,9 milhões"), que nunca muda.
  - "antes" e "depois": o texto ao redor do número (ex.: "Cerca de " e
    "%"). O número usa vírgula como separador decimal.

  Props: valor, casas (decimais), antes, depois, textoReal, className.
*/
export default function NumeroContado({ valor, casas = 0, antes = "", depois = "", textoReal, className = "" }) {
  // Esta parte é lógica
  const refNumero = useContagem({ valor, casas, antes, depois });

  return (
    <strong className={className}>
      <span ref={refNumero} aria-hidden="true">
        {formatarNumero(valor, casas, antes, depois)}
      </span>
      <span className="sr-only">{textoReal}</span>
    </strong>
  );
}
