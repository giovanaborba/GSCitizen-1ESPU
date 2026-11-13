"use client";

import { useFaixaTexto } from "@/hooks/useFaixaTexto";

/*
  FaixaTexto — faixa contínua "Pulse · um guia no pulso" (seções 19.6 e
  19.15), entre a abertura e o Tema, na Início.

  - Em Anton, maiúscula (só pelo CSS), com fundo laranja da marca e letras
    na cor do fundo da página (4,8:1 no claro; 5,1:1 no escuro).
  - Decorativa: aria-hidden. O leitor de tela não a lê (19.16).
  - Quem move é o hook useFaixaTexto. Com os efeitos desligados e sem
    JavaScript, fica parada.
*/
const TEXTO = "Pulse · um guia no pulso · Pulse · um guia no pulso ·";

export default function FaixaTexto() {
  const refTrilho = useFaixaTexto();

  return (
    <div aria-hidden="true" className="faixa-texto">
      <div ref={refTrilho} className="faixa-texto-trilho">
        <span>{TEXTO}</span>
        <span>{TEXTO}</span>
      </div>
    </div>
  );
}
