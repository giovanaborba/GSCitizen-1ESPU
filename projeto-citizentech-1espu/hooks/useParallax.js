import { useEffect, useRef } from "react";
import { useEfeitos } from "@/hooks/useEfeitos";

// Regra: só a imagem anda; a moldura e o texto não se movem. A imagem é 12% maior,
// e o deslocamento fica dentro dessa folga, para nunca aparecer um vão.
const LIMITE = 60; // px
const FOLGA = 0.06; // fração da altura (a imagem tem 112%)
const MARGEM = 200; // px

export function useParallax(velocidade) {
  const refMoldura = useRef(null);
  const { efeitosLigados } = useEfeitos();

  useEffect(() => {
    const moldura = refMoldura.current;
    if (!moldura || !efeitosLigados || !velocidade || !moldura.querySelector("img")) return;
    let quadro = 0;

    function atualizar() {
      quadro = 0;
      const caixa = moldura.getBoundingClientRect();
      const altura = window.innerHeight;
      if (caixa.bottom < -MARGEM || caixa.top > altura + MARGEM) return;
      const limite = Math.min(LIMITE, caixa.height * FOLGA);
      const distancia = caixa.top + caixa.height / 2 - altura / 2;
      const deslocamento = Math.max(-limite, Math.min(limite, distancia * velocidade));
      moldura.style.setProperty("--paralaxe", `${deslocamento.toFixed(1)}px`);
    }

    function pedirAtualizacao() {
      if (!quadro) quadro = requestAnimationFrame(atualizar);
    }

    moldura.setAttribute("data-paralaxe", "");
    atualizar();
    window.addEventListener("scroll", pedirAtualizacao, { passive: true });
    window.addEventListener("resize", pedirAtualizacao);

    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener("scroll", pedirAtualizacao);
      window.removeEventListener("resize", pedirAtualizacao);
      moldura.removeAttribute("data-paralaxe");
      moldura.style.removeProperty("--paralaxe");
    };
  }, [efeitosLigados, velocidade]);

  return refMoldura;
}
