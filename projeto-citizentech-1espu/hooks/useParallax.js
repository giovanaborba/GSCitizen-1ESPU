import { useEffect, useRef } from "react";
import { useEfeitos } from "@/hooks/useEfeitos";

/*
  useParallax — a imagem anda numa velocidade um pouco diferente da página
  ao rolar (seção 19.6, "Parallax"), dando profundidade.

  - "velocidade": quanto a imagem se desloca por pixel de distância entre
    o centro da moldura e o centro da tela (±0,06, como no protótipo).
  - A MOLDURA não se move (o texto ao redor nunca é coberto, e "o texto
    nunca se move"): só a imagem anda dentro dela. A imagem fica 12% maior
    que a moldura (CSS, [data-paralaxe]), e o deslocamento é limitado à
    folga que isso cria (6% da altura de cada lado) e a 60 px, para nunca
    aparecer um vão.
  - Só liga quando há uma imagem de verdade (<img>); o marcador fica
    parado.
  - Só anima "transform" (pela variável --paralaxe), uma vez por quadro
    no máximo, e só com a moldura perto da tela.
  - Com os efeitos desligados, nada se move.

  Devolve a ref que vai na moldura.
*/
const LIMITE = 60; // px
const FOLGA = 0.06; // fração da altura (a imagem tem 112%)
const MARGEM = 200; // px além da tela em que ainda calcula

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
