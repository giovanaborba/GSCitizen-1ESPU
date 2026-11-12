import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useConsultaMidia } from "@/hooks/useConsultaMidia";
import { registrarPluginsGsap } from "@/lib/movimento";

/*
  useGaleriaHorizontal — a galeria que corre na horizontal com a rolagem
  (seções 18.8 e 18.14).

  Modo horizontal (computador: largura ≥ 900 px, altura ≥ 600 px e sem
  "reduzir movimento"):
  - o "trilho" ganha a altura da área visível + a largura que sobra da
    lista (o quanto ela é maior que a tela);
  - o "palco" fica parado (position: sticky) e a lista anda para a
    esquerda conforme a pessoa rola (ScrollTrigger, ligado à rolagem);
  - se o foco do teclado cair em algo dentro de uma foto, a página rola
    até ela, para ela aparecer.
  Fora disso (celular, zoom alto, "reduzir movimento" e sem
  JavaScript): grade comum de fotos.

  Devolve horizontal, refTrilho, refPalco e refLista.
*/

const CONSULTA_HORIZONTAL =
  "(prefers-reduced-motion: no-preference) and (min-width: 900px) and (min-height: 600px)";

// Esta parte é lógica
function topoDoPalco(palco) {
  return palco ? parseFloat(getComputedStyle(palco).top) || 0 : 0;
}

// Esta parte é lógica
function sobraDaLista(lista) {
  return Math.max(0, lista.scrollWidth - window.innerWidth);
}

// Esta parte é lógica
export function useGaleriaHorizontal() {
  const horizontal = useConsultaMidia(CONSULTA_HORIZONTAL);
  const refTrilho = useRef(null);
  const refPalco = useRef(null);
  const refLista = useRef(null);
  const refGatilho = useRef(null);

  // Esta parte é lógica
  useGSAP(
    () => {
      const trilho = refTrilho.current;
      const palco = refPalco.current;
      const lista = refLista.current;
      if (!horizontal || !trilho || !palco || !lista) return;
      registrarPluginsGsap();

      // Altura do trilho = área visível abaixo do cabeçalho + sobra da lista
      const ajustarAltura = () => {
        trilho.style.height = `${window.innerHeight - topoDoPalco(palco) + sobraDaLista(lista)}px`;
      };
      ajustarAltura();
      ScrollTrigger.addEventListener("refreshInit", ajustarAltura);

      const animacao = gsap.to(lista, {
        x: () => -sobraDaLista(lista),
        ease: "none",
        scrollTrigger: {
          trigger: trilho,
          start: () => `top ${topoDoPalco(palco)}px`,
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
      refGatilho.current = animacao.scrollTrigger;

      // Esta parte é lógica
      // Se o foco do teclado cair em algo dentro de uma foto, a página rola
      // até a lista mostrar aquela foto (o foco nunca fica fora da tela).
      const aoFocarDentro = (evento) => {
        const gatilho = refGatilho.current;
        const item = evento.target.closest("li");
        const sobra = sobraDaLista(lista);
        if (!gatilho || !item || !sobra) return;
        const alvoNaLista = Math.min(sobra, Math.max(0, item.offsetLeft - window.innerWidth / 2 + item.offsetWidth / 2));
        window.scrollTo({ top: gatilho.start + (gatilho.end - gatilho.start) * (alvoNaLista / sobra) });
      };
      lista.addEventListener("focusin", aoFocarDentro);

      return () => {
        lista.removeEventListener("focusin", aoFocarDentro);
        ScrollTrigger.removeEventListener("refreshInit", ajustarAltura);
        trilho.style.height = "";
        refGatilho.current = null;
      };
    },
    { dependencies: [horizontal] },
  );

  return { horizontal, refTrilho, refPalco, refLista };
}
