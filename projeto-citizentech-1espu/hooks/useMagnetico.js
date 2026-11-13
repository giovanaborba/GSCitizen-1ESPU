import { useEffect } from "react";
import { useSpring } from "motion/react";
import { useEfeitos } from "@/hooks/useEfeitos";
import { useConsultaMidia } from "@/hooks/useConsultaMidia";
import { spring } from "@/lib/presetsMovimento";

/*
  useMagnetico — o conteúdo do botão laranja "segue" o mouse um pouco
  (seção 19.6, "Botão magnético"; seção 19.15).

  - Só o CONTEÚDO (ícone e texto) se move, no máximo 8 px para cada lado.
    A área de clique (o próprio botão) fica parada, então o alvo nunca
    "foge" de quem está mirando.
  - O deslocamento é proporcional à distância do mouse até o centro do
    botão (20% na horizontal e 30% na vertical, como no protótipo).
  - Só com mouse de verdade ("pointer: fine") e com os efeitos ligados.
    No toque, com caneta imprecisa ou com os efeitos desligados, nada se
    move.
  - O movimento usa uma mola (useSpring com spring.rapida, padrão de
    movimento, item 3): o conteúdo acompanha o mouse e volta ao centro
    com a mesma mola quando o mouse sai.

  Devolve os valores x e y (para o style do conteúdo) e os eventos que vão
  no botão (aoMover e aoSair).
*/
const LIMITE = 8; // px
const CONSULTA_PONTEIRO_FINO = "(pointer: fine)";

function limitar(valor) {
  return Math.max(-LIMITE, Math.min(LIMITE, valor));
}

export function useMagnetico() {
  const { efeitosLigados } = useEfeitos();
  const ponteiroFino = useConsultaMidia(CONSULTA_PONTEIRO_FINO);
  const ligado = efeitosLigados && ponteiroFino;
  const x = useSpring(0, spring.rapida);
  const y = useSpring(0, spring.rapida);

  // Desligou os efeitos (ou trocou o mouse pelo toque) com o conteúdo
  // deslocado: ele volta ao centro na hora, sem animação.
  useEffect(() => {
    if (ligado) return;
    x.jump(0);
    y.jump(0);
  }, [ligado, x, y]);

  function aoMover(evento) {
    if (!ligado || evento.pointerType === "touch") return;
    const caixa = evento.currentTarget.getBoundingClientRect();
    x.set(limitar((evento.clientX - caixa.left - caixa.width / 2) * 0.2));
    y.set(limitar((evento.clientY - caixa.top - caixa.height / 2) * 0.3));
  }

  function aoSair() {
    x.set(0);
    y.set(0);
  }

  return { x, y, aoMover, aoSair };
}
