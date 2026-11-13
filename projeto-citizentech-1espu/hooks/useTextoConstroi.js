import { useEffect, useRef } from "react";
import { animate, inView } from "motion";
import { useEfeitos } from "@/hooks/useEfeitos";
import { guia, spring } from "@/lib/presetsMovimento";

/*
  useTextoConstroi — o bloco de texto que "se constrói" quando entra na
  tela (seções 19.6 e 19.15).

  Decisão 3 da equipe (subfase 9.0): o padrão de movimento vence a 19.6, e
  o texto entra com o gesto GUIA (deslocamento curto, de 14 px, da direita
  para a esquerda, com a opacidade de 0 a 1 e a mola padrão), e não pela
  máscara de domos (os domos ficam só na capa, na cortina e na troca de
  foto).

  Regras (19.1 e 19.6):
  - o texto está no HTML desde o início e já nasce visível (no servidor e
    sem JavaScript). Ele só é escondido, para depois entrar, se estiver
    abaixo da tela quando a página carrega;
  - com o foco dentro do bloco, ele aparece na hora (nada invisível
    recebe foco);
  - só na primeira vez; com os efeitos desligados, não se move.

  Devolve a ref que vai no bloco.
*/
const MARGEM_DE_CHEGADA = "0px 0px -12% 0px";

export function useTextoConstroi() {
  const refBloco = useRef(null);
  const { efeitosLigados } = useEfeitos();

  useEffect(() => {
    const bloco = refBloco.current;
    if (!bloco || !efeitosLigados) return;
    if (bloco.getBoundingClientRect().top < window.innerHeight * 0.88) return;

    const { initial } = guia(1);
    let animacao = null;
    bloco.style.opacity = String(initial.opacity);
    bloco.style.transform = `translateX(${initial.x}px)`;

    function mostrarNaHora() {
      pararDeObservar();
      animacao?.stop();
      bloco.style.opacity = "";
      bloco.style.transform = "";
    }

    const pararDeObservar = inView(
      bloco,
      () => {
        animacao = animate(bloco, { opacity: [initial.opacity, 1], x: [initial.x, 0] }, spring.padrao);
        pararDeObservar();
        bloco.removeEventListener("focusin", mostrarNaHora);
      },
      { margin: MARGEM_DE_CHEGADA },
    );
    bloco.addEventListener("focusin", mostrarNaHora);

    return () => {
      bloco.removeEventListener("focusin", mostrarNaHora);
      mostrarNaHora();
    };
  }, [efeitosLigados]);

  return refBloco;
}
