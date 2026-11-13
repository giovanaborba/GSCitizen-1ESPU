"use client";

import { useFraseAcende } from "@/hooks/useFraseAcende";

/*
  FraseAcende — "Atravessar a rua não deveria depender de adivinhar."
  (seções 19.7 e 19.15), no Início, entre o Tema e O problema.

  - Seção com aria-label="Frase de abertura" (sem título: é uma frase de
    destaque, como no protótipo).
  - O leitor de tela lê a frase inteira de uma vez: ela está num texto
    escondido (sr-only). As palavras visíveis, separadas para acender uma
    a uma, ficam com aria-hidden.
  - Atkinson em negrito, grande (texto grande: as palavras apagadas,
    --cor-apagada, têm 5,0:1 no claro e 6,2:1 no escuro).
  - Cada palavra acende conforme a rolagem (useFraseAcende). Sem
    JavaScript ou com os efeitos desligados, a frase aparece toda acesa,
    com "adivinhar." em --cor-destaque.
*/
const PALAVRAS = ["Atravessar", "a", "rua", "não", "deveria", "depender", "de"];
const DESTAQUE = "adivinhar.";

export default function FraseAcende() {
  const refFrase = useFraseAcende();

  return (
    <section aria-label="Frase de abertura" className="mt-20 py-12">
      <p className="frase-acende max-w-[20ch] text-[clamp(1.9rem,5.6vw,3.6rem)] leading-[1.18] font-bold tracking-[-0.01em]">
        <span className="sr-only">Atravessar a rua não deveria depender de adivinhar.</span>
        <span ref={refFrase} aria-hidden="true">
          {PALAVRAS.map((palavra, i) => (
            <span key={i}>
              <span data-palavra="">{palavra}</span>{" "}
            </span>
          ))}
          <span data-palavra="" data-destaque="">
            {DESTAQUE}
          </span>
        </span>
      </p>
    </section>
  );
}
