"use client";

import { useTextoConstroi } from "@/hooks/useTextoConstroi";

/*
  TextoConstroi — bloco de texto que entra quando chega à tela (seções
  19.6 e 19.15), no Tema, em O problema e em "Quem vive o problema".

  Entra com o gesto GUIA (decisão 3 da 9.0), só na primeira vez. O texto
  está sempre no HTML e nasce visível; com o foco dentro, aparece na hora.
  Quem anima é o hook useTextoConstroi.

  Props: children (os parágrafos) e className.
*/
export default function TextoConstroi({ children, className = "" }) {
  // Esta parte é lógica
  const refBloco = useTextoConstroi();

  return (
    <div ref={refBloco} className={className}>
      {children}
    </div>
  );
}
