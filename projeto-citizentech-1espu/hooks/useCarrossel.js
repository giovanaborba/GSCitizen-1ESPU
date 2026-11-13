import { useEffect, useRef, useState } from "react";
import { efeitosLigadosAgora } from "@/lib/efeitos";

/*
  useCarrossel — estado do carrossel de Tecnologias (seções 18.8 e 18.14).

  A lista rola na horizontal (com scroll-snap: cada cartão "encaixa" no
  começo). Este hook acompanha a rolagem e calcula:
  - quais cartões aparecem inteiros (para a contagem "1 a 3 de 8");
  - se está no começo ou no fim (os botões "Anterior" e "Próximo" ficam
    com aria-disabled nas pontas);
  - passo(direcao): rola um cartão para trás (-1) ou para a frente (+1),
    suave com os efeitos ligados e instantâneo com eles desligados.
  Sem avanço automático.

  "medida" começa null: até o JavaScript medir, os botões e a contagem
  não aparecem (sem JavaScript, a lista continua rolando com o dedo ou
  com o teclado).
*/

const FOLGA = 2; // px de tolerância nas medidas

// Esta parte é lógica
function medir(lista) {
  const caixa = lista.getBoundingClientRect();
  const itens = [...lista.children];
  const inteiros = itens
    .map((item, indice) => {
      const r = item.getBoundingClientRect();
      return r.left >= caixa.left - FOLGA && r.right <= caixa.right + FOLGA ? indice : -1;
    })
    .filter((indice) => indice >= 0);
  return {
    primeiro: inteiros.length ? inteiros[0] + 1 : 1,
    ultimo: inteiros.length ? inteiros[inteiros.length - 1] + 1 : 1,
    total: itens.length,
    noInicio: lista.scrollLeft <= FOLGA,
    noFim: lista.scrollLeft + lista.clientWidth >= lista.scrollWidth - FOLGA,
  };
}

// Esta parte é lógica
export function useCarrossel() {
  const refLista = useRef(null);
  const [medida, setMedida] = useState(null);

  useEffect(() => {
    const lista = refLista.current;
    if (!lista) return;
    let quadro = 0;
    const agendar = () => {
      if (!quadro) {
        quadro = requestAnimationFrame(() => {
          quadro = 0;
          setMedida(medir(lista));
        });
      }
    };
    agendar();
    lista.addEventListener("scroll", agendar, { passive: true });
    const observador = new ResizeObserver(agendar);
    observador.observe(lista);
    return () => {
      cancelAnimationFrame(quadro);
      lista.removeEventListener("scroll", agendar);
      observador.disconnect();
    };
  }, []);

  // Esta parte é lógica
  function passo(direcao) {
    const lista = refLista.current;
    if (!lista || !medida) return;
    if ((direcao < 0 && medida.noInicio) || (direcao > 0 && medida.noFim)) return;
    const primeiro = lista.children[0];
    const espaco = parseFloat(getComputedStyle(lista).columnGap) || 0;
    lista.scrollBy({
      left: direcao * (primeiro.getBoundingClientRect().width + espaco),
      behavior: efeitosLigadosAgora() ? "smooth" : "auto",
    });
  }

  return { refLista, medida, passo };
}
