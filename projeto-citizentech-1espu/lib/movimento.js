import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/*
  movimento — base das animações da Fase 8 (seção 18.1).

  Três peças trabalham juntas:
  - GSAP: biblioteca de animação. O "relógio" dele (gsap.ticker) chama
    as animações a cada quadro da tela (cerca de 60 vezes por segundo).
  - ScrollTrigger: plugin do GSAP que liga uma animação à rolagem
    (ex.: "Os sinais" e a Galeria, nas próximas subfases).
  - Lenis: deixa a rolagem com a roda do mouse suave. No toque, a rolagem
    continua a do aparelho. Fase 9: o Lenis só existe com os efeitos
    ligados (quem o cria e destrói é o ProvedorMovimento, seção 19.2).

  Por que sincronizar: se cada um tivesse o seu relógio, o ScrollTrigger
  poderia ler a posição da rolagem um quadro atrasado e a animação
  "tremeria". Com um relógio só (o do GSAP), os dois andam juntos.
*/

// Esta parte é lógica
// Registra os plugins uma única vez, e só no navegador (no servidor não
// existe rolagem nem tela).
let registrado = false;

export function registrarPluginsGsap() {
  if (registrado || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  registrado = true;
}

// Esta parte é lógica
// Liga o Lenis ao relógio do GSAP e avisa o ScrollTrigger a cada passo
// da rolagem. Devolve a função que desfaz tudo (usada quando o
// componente sai da tela).
export function sincronizarLenisComGsap(lenis) {
  // O relógio do GSAP informa o tempo em segundos; o Lenis espera
  // milissegundos.
  function avancarQuadro(tempoEmSegundos) {
    lenis.raf(tempoEmSegundos * 1000);
  }

  gsap.ticker.add(avancarQuadro);
  // Sem "compensação de atraso": se o navegador travar um instante, a
  // rolagem não dá um salto para recuperar o tempo perdido.
  gsap.ticker.lagSmoothing(0);
  const pararDeAvisar = lenis.on("scroll", ScrollTrigger.update);

  return () => {
    pararDeAvisar();
    gsap.ticker.remove(avancarQuadro);
    // Volta ao valor padrão do GSAP
    gsap.ticker.lagSmoothing(500, 33);
  };
}
