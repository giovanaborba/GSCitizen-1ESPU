"use client";

import { motion } from "motion/react";
import EspacoIcone from "@/components/ui/EspacoIcone";
import FotoFiltro from "@/components/ui/FotoFiltro";
import { useEfeitos } from "@/hooks/useEfeitos";
import { spring } from "@/lib/presetsMovimento";

/*
  CartaoIntegrante — polaroide de um integrante da Equipe, pendurado no
  varal (seções 6.2, 18.8 e 19.10). Item de uma <ul>.

  - O varal: cada item desenha o seu trecho de fio (.varal-trecho, no
    globals.css), com uma leve curva para baixo, como um fio que cede com
    o peso da foto. Os trechos lado a lado se emendam numa linha. O
    prendedor laranja fica no alto do polaroide. Os dois são decoração
    (pseudo-elementos do CSS, que o leitor de tela não lê).
  - Polaroide: cartão branco com sombra, foto quadrada e só o primeiro
    nome em <h3> (Anton maiúsculo, maiúsculas só por CSS). Cores fixas nos
    dois temas, como uma foto de verdade: grafite #242428 sobre branco
    (15,5:1).
  - "inclinacao": a inclinação fixa, em graus (−3°, 2°, −1,5°, 3°, −2°).
    O polaroide gira em volta do prendedor (transform-origin no alto).
  - Com o mouse (e os efeitos ligados): ele se endireita e sobe 6 px com
    a mola spring.padrao, que dá o "balanço leve" (decisão da equipe na
    9.7: sem acompanhar o mouse); a foto ganha cor (FotoFiltro) e o nome
    ganha um traço laranja que se desenha (background-size, exceção
    aprovada no padrão de movimento). No celular, o traço aparece quando
    a foto ganha cor ao entrar na tela. Nada depende do mouse.
  - Parallax leve da foto dentro da moldura (19.6, "polaroides"): só
    quando a foto entrar.
  - Com os efeitos desligados: parado, só com a inclinação fixa.

  Foto: enquanto não existe, fica o espaço tracejado. O marcador
  IMAGEM-foto de (nome)-AQUI está na página Solução, ao lado de cada
  integrante. Quando a foto entrar, o alt é "Foto de (nome)" (seção 13.2).

  Props: nome, src e alt (a foto; sem src, fica o espaço), inclinacao, velocidade (parallax, ±0,06) e className
  (largura do item, definida pela lista na página Solução).
*/
export default function CartaoIntegrante({ nome, src, alt, inclinacao = 0, velocidade = 0, className = "" }) {
  const { efeitosLigados } = useEfeitos();

  return (
    <li className={`varal-trecho relative pt-[18px] ${className}`}>
      <motion.div
        initial={false}
        animate={{ rotate: inclinacao, y: 0 }}
        whileHover={efeitosLigados ? { rotate: 0, y: -6 } : undefined}
        transition={spring.padrao}
        className="polaroide relative grid origin-top gap-2 rounded-[4px] bg-[#FFFFFF] p-2 pb-3 text-[#242428] shadow-[0_8px_18px_rgba(26,26,29,0.2)] forced-colors:border"
      >
        <FotoFiltro velocidade={velocidade} className="aspect-square rounded-[2px]">
          {src ? (
            <img src={src} alt={alt} className="size-full object-cover" />
          ) : (
            /* Espaço da foto (cores fixas, como o polaroide) */
            <div className="grid size-full place-items-center border-2 border-dashed border-[#6E6E78] bg-[#FAFAFA]">
              {/* ICONE-Image-AQUI */}
              <EspacoIcone nome="Image" />
            </div>
          )}
        </FotoFiltro>
        <h3 className="text-center font-titulo text-[1.15rem] leading-[1.1] font-normal tracking-[0.02em] uppercase">
          <span className="polaroide-nome px-1">{nome}</span>
        </h3>
      </motion.div>
    </li>
  );
}
