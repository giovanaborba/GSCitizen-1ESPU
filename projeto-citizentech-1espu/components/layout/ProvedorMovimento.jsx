"use client";

import { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { MotionConfig } from "motion/react";
import { registrarPluginsGsap, sincronizarLenisComGsap } from "@/lib/movimento";
import { usePrefereMovimentoReduzido } from "@/hooks/usePrefereMovimentoReduzido";

/*
  ProvedorMovimento — seções 18.1 e 18.9.
  Fica no layout, em volta de todas as páginas, e prepara o movimento:

  1. Lenis (rolagem suave com a roda do mouse), na raiz da página:
     - autoRaf: false → quem "dá corda" ao Lenis é o relógio do GSAP;
     - anchors: true → links para "#algum-id" (Pular para o conteúdo,
       Nesta página, links da abertura) também rolam suave. O Lenis já
       desconta o scroll-padding-top do <html> (altura do cabeçalho +
       16 px, definido no globals.css), então o título não fica escondido.
       O clique continua sendo um link normal: o navegador leva o foco
       para o destino, e o leitor de tela e o Tab continuam dali;
     - com "reduzir movimento", os saltos para âncoras são instantâneos
       (o Lenis já faz isso sozinho) e a roda do mouse deixa de ser
       suavizada (smoothWheel: false). Sem esse ajuste, o Lenis ainda
       "amortecia" a roda por cerca de 0,1 s, e a seção 18.2 pede que
       nada se mova;
     - no toque (celular), a rolagem continua a do aparelho.
  2. GSAP: registra o ScrollTrigger uma vez.
  3. Motion: MotionConfig reducedMotion="user" faz todas as animações do
     Motion respeitarem o "reduzir movimento" do aparelho.

  Não desenha nada na tela: só envolve o conteúdo.
*/

// Esta parte é lógica
registrarPluginsGsap();

// Opções fixas, fora do componente, para não recriar o Lenis a cada
// renderização. Uma para cada preferência de movimento.
const OPCOES_LENIS = {
  autoRaf: false,
  anchors: true,
  smoothWheel: true,
};
const OPCOES_LENIS_MOVIMENTO_REDUZIDO = {
  ...OPCOES_LENIS,
  smoothWheel: false,
};

// Esta parte é lógica
// Liga o Lenis ao relógio do GSAP assim que o Lenis existir. Fica num
// componente separado porque o useLenis só funciona dentro do ReactLenis.
function SincronizarComGsap() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    return sincronizarLenisComGsap(lenis);
  }, [lenis]);

  return null;
}

export default function ProvedorMovimento({ children }) {
  // Esta parte é lógica
  const movimentoReduzido = usePrefereMovimentoReduzido();

  return (
    <ReactLenis
      root
      options={movimentoReduzido ? OPCOES_LENIS_MOVIMENTO_REDUZIDO : OPCOES_LENIS}
    >
      <SincronizarComGsap />
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ReactLenis>
  );
}
