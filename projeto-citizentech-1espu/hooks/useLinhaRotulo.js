import { useEffect, useRef } from "react";
import { animate, inView } from "motion";
import { useEfeitos } from "@/hooks/useEfeitos";
import { spring } from "@/lib/presetsMovimento";

/*
  useLinhaRotulo — a linha laranja de 24 px que se desenha antes do rótulo
  mono quando a seção chega (seção 19.6, "Linha antes do rótulo").

  - "Se desenhar" = crescer da esquerda para a direita. Pelo padrão de
    movimento, só transform e opacity animam: por isso a linha cresce com
    scaleX (0 → 1), e não com a largura. Mola padrão (spring.padrao).
  - Só na primeira vez (PADRAO_MOVIMENTO_PULSE, item 5): depois de
    desenhada, fica.
  - A linha já nasce desenhada (no servidor e sem JavaScript). Ela só é
    "apagada" para depois se desenhar quando a seção ainda está abaixo da
    tela; se a pessoa já está vendo a seção ao carregar, nada se mexe.
  - Com os efeitos desligados, a linha fica sempre desenhada, parada.

  Devolve a ref que vai na linha.
*/
const MARGEM_DE_CHEGADA = "0px 0px -15% 0px"; // a seção "chegou" quando passa de 85% da altura da tela

export function useLinhaRotulo() {
  const refLinha = useRef(null);
  const { efeitosLigados } = useEfeitos();

  useEffect(() => {
    const linha = refLinha.current;
    if (!linha || !efeitosLigados) return;
    const jaNaTela = linha.getBoundingClientRect().top < window.innerHeight * 0.85;
    if (jaNaTela) return;

    linha.style.transform = "scaleX(0)";
    let animacao = null;
    const pararDeObservar = inView(
      linha,
      () => {
        animacao = animate(linha, { scaleX: [0, 1] }, spring.padrao);
        pararDeObservar();
      },
      { margin: MARGEM_DE_CHEGADA },
    );

    return () => {
      pararDeObservar();
      animacao?.stop();
      // Ao desligar os efeitos (ou sair da página), a linha volta inteira
      linha.style.transform = "";
    };
  }, [efeitosLigados]);

  return refLinha;
}
