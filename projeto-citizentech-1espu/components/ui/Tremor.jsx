"use client";

import { useEffect, useRef } from "react";
import { useAnimate } from "motion/react";
import { useEfeitos } from "@/hooks/useEfeitos";
import { tremor } from "@/lib/presetsMovimento";

/*
  Tremor — o gesto de ERRO do padrão de movimento (seção 19.11): um
  tremor horizontal curto (±4 px, 0,3 s) no campo com problema.

  - Treme quando "gatilho" muda (cada envio do formulário com erro) e o
    campo tem erro ("ativo"). Uma vez por envio, sem repetir.
  - Sempre junto da mensagem de erro em texto, que já existe no campo
    (o tremor só reforça; nunca é a única pista). Nunca na tela inteira.
  - Só "transform" (o deslocamento x). O foco vai para o primeiro campo
    com erro como antes, e o contorno de foco treme junto.
  - Com os efeitos desligados, não treme.

  Props: gatilho (número), ativo (true se o campo tem erro), children.
*/
export default function Tremor({ gatilho, ativo, className = "", children }) {
  const { efeitosLigados } = useEfeitos();
  const [refBloco, animar] = useAnimate();
  // O último envio que já fez este campo tremer
  const refUltimo = useRef(gatilho);

  useEffect(() => {
    if (gatilho === refUltimo.current) return;
    refUltimo.current = gatilho;
    if (!ativo || !efeitosLigados) return;
    const animacao = animar(refBloco.current, { x: tremor.x }, tremor.transition);
    return () => animacao.stop();
  }, [gatilho, ativo, efeitosLigados, animar, refBloco]);

  return (
    <div ref={refBloco} className={className}>
      {children}
    </div>
  );
}
