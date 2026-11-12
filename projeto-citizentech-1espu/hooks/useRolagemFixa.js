import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import { useConsultaMidia } from "@/hooks/useConsultaMidia";
import { registrarPluginsGsap } from "@/lib/movimento";

/*
  useRolagemFixa — "Os sinais" em rolagem fixa (seções 18.8 e 18.14).

  Como funciona o modo fixo:
  - um "trilho" alto (4 × 85svh + 100svh) e, dentro dele, um "palco" com
    position: sticky, que fica parado na tela enquanto a pessoa rola;
  - o ScrollTrigger (GSAP) lê quanto do trilho já passou (o "progresso",
    de 0 a 1) e escolhe o sinal ativo: 0–25% Continuar, 25–50% Parar,
    50–75% Virar, 75–100% Aguardar. Ele só LÊ a rolagem; quem prende o
    palco é o CSS (sem "pin" do GSAP).

  O modo fixo só liga sem "reduzir movimento", com a janela de pelo menos
  560 px de altura e 340 px de largura (seção 18.8). Fora disso (e sem
  JavaScript), os 4 sinais aparecem em lista comum.

  Devolve:
  - podeFixar: o modo fixo está ligado;
  - ativo: índice do sinal atual (0 a 3);
  - refTrilho e refPalco: vão nos elementos do trilho e do palco;
  - irPara(indice, evento): clique num link do índice "Sinais".
*/

const CONSULTA_MODO_FIXO =
  "(prefers-reduced-motion: no-preference) and (min-height: 560px) and (min-width: 340px)";

// Esta parte é lógica
// Onde o palco gruda (abaixo do cabeçalho e da faixa do índice), em px.
function topoDoPalco(palco) {
  return palco ? parseFloat(getComputedStyle(palco).top) || 0 : 0;
}

// Esta parte é lógica
export function useRolagemFixa(quantidade) {
  const podeFixar = useConsultaMidia(CONSULTA_MODO_FIXO);
  const [ativo, setAtivo] = useState(0);
  const refTrilho = useRef(null);
  const refPalco = useRef(null);
  const lenis = useLenis();

  // Esta parte é lógica
  // Liga o ScrollTrigger só no modo fixo. O useGSAP desfaz tudo sozinho
  // quando o modo desliga ou a pessoa sai da página.
  useGSAP(
    () => {
      if (!podeFixar || !refTrilho.current) return;
      registrarPluginsGsap();
      ScrollTrigger.create({
        trigger: refTrilho.current,
        start: () => `top ${topoDoPalco(refPalco.current)}px`,
        end: "bottom bottom",
        invalidateOnRefresh: true,
        onUpdate: (gatilho) => {
          setAtivo(Math.min(quantidade - 1, Math.floor(gatilho.progress * quantidade)));
        },
      });
    },
    { dependencies: [podeFixar, quantidade] },
  );

  // Esta parte é lógica
  // No modo fixo, o clique num sinal rola até o meio do trecho dele.
  // Fora do modo fixo, o link funciona normal (vai até o artigo).
  function irPara(indice, evento) {
    const trilho = refTrilho.current;
    if (!podeFixar || !trilho) return;
    evento.preventDefault();
    const topo = topoDoPalco(refPalco.current);
    const inicio = trilho.getBoundingClientRect().top + window.scrollY - topo;
    const percurso = trilho.offsetHeight - (window.innerHeight - topo);
    const destino = inicio + (percurso * (indice + 0.5)) / quantidade;
    if (lenis) lenis.scrollTo(destino);
    else window.scrollTo({ top: destino });
    setAtivo(indice);
  }

  return { podeFixar, ativo, refTrilho, refPalco, irPara };
}
