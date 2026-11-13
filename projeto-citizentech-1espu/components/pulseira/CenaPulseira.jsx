"use client";

import { useRef } from "react";
import { usePulseira3D } from "@/hooks/usePulseira3D";

/*
  CenaPulseira — a parte da pulseira 3D que só existe no navegador.
  É carregada pelo Pulseira3D com next/dynamic e ssr: false: o código do
  Three.js (pesado) só é baixado nas páginas que mostram a pulseira, e só
  depois de a página aparecer.

  Esta "caixa" recebe o <canvas> criado pelo hook usePulseira3D.
  - Nos modos "abertura" e "explorar", quando o primeiro quadro está
    pronto, ela é o palco (seção 19.12): role="group",
    aria-roledescription="modelo 3D", nome "Pulseira Pulse em 3D. Use as
    setas do teclado para girar.", aria-describedby na descrição em texto
    e tabIndex={0} (recebe o foco para as setas). Arrastar gira; no toque,
    só o arrasto na horizontal (touch-action: pan-y), para a página
    continuar rolando. Antes de ficar pronta, quem descreve é o texto de
    reserva do Pulseira3D, e a caixa não recebe foco.
  - Nos modos "sinal" e "parar", é decoração (aria-hidden): o texto do
    sinal está ao lado.
  - O cursor é o do sistema ("mão" para arrastar), nunca substituído.
*/
export default function CenaPulseira({ modo, interativo, pronta, idDescricao, giro, ...opcoes }) {
  const refCaixa = useRef(null);
  usePulseira3D(refCaixa, { modo, giro: giro?.conexao, ...opcoes });

  // Uma <div> só, sempre a mesma: o canvas criado pelo hook fica dentro
  // dela. Só os atributos mudam quando a cena fica pronta.
  const ehPalco = interativo && pronta;
  const propsPalco = ehPalco
    ? {
        role: "group",
        "aria-roledescription": "modelo 3D",
        "aria-label": "Pulseira Pulse em 3D. Use as setas do teclado para girar.",
        "aria-describedby": idDescricao,
        tabIndex: 0,
        ...giro?.propsPalco,
      }
    : {};

  return (
    <div
      ref={refCaixa}
      aria-hidden={interativo ? undefined : "true"}
      {...propsPalco}
      className={`absolute inset-0 ${
        ehPalco ? `touch-pan-y rounded-cartao ${giro?.arrastando ? "cursor-grabbing" : "cursor-grab"}` : ""
      }`}
    />
  );
}
