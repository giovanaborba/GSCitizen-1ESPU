"use client";

import { useRef } from "react";
import { usePulseira3D } from "@/hooks/usePulseira3D";

/*
  CenaPulseira — a parte da pulseira 3D que só existe no navegador.
  É carregada pelo Pulseira3D com next/dynamic e ssr: false: o código do
  Three.js (pesado) só é baixado nas páginas que mostram a pulseira, e só
  depois de a página aparecer.

  Esta "caixa" recebe o <canvas> criado pelo hook usePulseira3D.
  - No modo "abertura", a caixa é uma imagem para o leitor de tela
    (role="img" + aria-label com a descrição da 18.7). Ela só ganha esse
    papel quando o primeiro quadro estiver pronto; antes disso, quem
    descreve é o texto de reserva do Pulseira3D.
  - Nos modos "sinal" e "parar", é decoração (aria-hidden): o texto do
    sinal está ao lado.
*/
export default function CenaPulseira({ modo, descricao, pronta, ...opcoes }) {
  const refCaixa = useRef(null);
  // Esta parte é lógica
  usePulseira3D(refCaixa, { modo, ...opcoes });

  const ehImagem = modo === "abertura" && pronta;

  return (
    <div
      ref={refCaixa}
      className="absolute inset-0"
      role={ehImagem ? "img" : undefined}
      aria-label={ehImagem ? descricao : undefined}
      aria-hidden={modo !== "abertura" ? "true" : undefined}
    />
  );
}
