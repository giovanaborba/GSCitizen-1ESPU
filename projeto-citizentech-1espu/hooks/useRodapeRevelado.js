import { useEffect, useRef } from "react";
import { useEfeitos } from "@/hooks/useEfeitos";

/*
  useRodapeRevelado — liga o "rodapé revelado" (seção 19.6).

  Com o efeito, o conteúdo da página (<main>) é uma folha opaca que sobe e
  revela o rodapé, preso embaixo (position: sticky). Quem desenha isso é o
  CSS (globals.css, html[data-rodape-revela]); este hook só decide se o
  efeito vale e marca a tag <html>.

  O efeito vale quando:
  - os efeitos estão ligados; e
  - o rodapé tem menos de 80% da altura da tela. Um rodapé mais alto que
    isso (ex.: tela deitada no celular, zoom alto, ou a faixa dos ODS na
    Solução numa tela baixa) não caberia inteiro preso embaixo, e parte
    dele nunca apareceria. Nesse caso, o rodapé é normal.

  Recalcula quando o rodapé ou a janela mudam de tamanho. Devolve a ref
  que vai no <footer>.
*/
const LIMITE = 0.8; // fração da altura da tela

export function useRodapeRevelado() {
  const refRodape = useRef(null);
  const { efeitosLigados } = useEfeitos();

  useEffect(() => {
    const rodape = refRodape.current;
    const raiz = document.documentElement;
    if (!rodape || !efeitosLigados) {
      raiz.removeAttribute("data-rodape-revela");
      return;
    }

    function decidir() {
      const cabe = rodape.offsetHeight < window.innerHeight * LIMITE;
      raiz.toggleAttribute("data-rodape-revela", cabe);
    }

    decidir();
    const observador = new ResizeObserver(decidir);
    observador.observe(rodape);
    window.addEventListener("resize", decidir);

    return () => {
      observador.disconnect();
      window.removeEventListener("resize", decidir);
      raiz.removeAttribute("data-rodape-revela");
    };
  }, [efeitosLigados]);

  return refRodape;
}
