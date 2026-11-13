"use client";

import EspacoIcone from "@/components/ui/EspacoIcone";
import { useInclinacaoMouse } from "@/hooks/useInclinacaoMouse";

/*
  CartaoIntegrante — polaroide de um integrante da Equipe (seções 6.2,
  10 item 14, e 18.8).

  - Item de uma <ul>: cartão branco com sombra, foto quadrada e o nome em
    <h3>, em Anton maiúsculo (maiúsculas só por CSS).
  - Cores fixas nos dois temas, como uma foto de verdade: texto #1E0F4A
    sobre branco (17,2:1).
  - "inclinacao": a inclinação fixa do polaroide, em graus (−3°, 2°,
    −1,5°, 3°, −2°, na ordem da lista).
  - Com mouse e com os efeitos ligados, ele se endireita, sobe e inclina
    acompanhando o mouse (useInclinacaoMouse).
  - A largura de cada cartão (2, 3 ou 5 por linha) é definida pela lista
    na página Solução.

  Foto: enquanto não existe, fica o espaço tracejado. O marcador
  IMAGEM-foto de (nome)-AQUI está na página Solução, ao lado de cada
  integrante. Quando a foto entrar, o alt é "Foto de (nome)" (seção 13.2).
*/
export default function CartaoIntegrante({ nome, inclinacao = 0, className = "" }) {
  // Esta parte é lógica
  const { aoMover, aoSair } = useInclinacaoMouse();

  return (
    <li
      onPointerMove={aoMover}
      onPointerLeave={aoSair}
      style={{ "--inclinacao": `${inclinacao}deg` }}
      className={`grid rotate-(--inclinacao) gap-2.5 rounded-polaroide bg-[#FFFFFF] p-2.5 pb-4 text-[#1E0F4A] shadow-[0_10px_26px_rgba(18,11,36,0.22)] transition-transform duration-300 forced-colors:border efeitos-ligados:hover:rotate-0 ${className}`}
    >
      {/* Espaço da foto (quadrado) */}
      <div className="grid aspect-square place-items-center rounded-[4px] border-2 border-dashed border-[#6B5F94] bg-[#EDE8FC]">
        {/* ICONE-Image-AQUI */}
        <EspacoIcone nome="Image" />
      </div>
      <h3 className="text-center font-titulo text-[1.6rem] leading-none font-normal tracking-[0.02em] uppercase">
        {nome}
      </h3>
    </li>
  );
}
