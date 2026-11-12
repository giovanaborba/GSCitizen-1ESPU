import { useRef, useState } from "react";

/*
  useFaixaODS — estado da faixa contínua dos ODS (seções 18.10 e 18.14).

  Guarda:
  - pausada: a pessoa apertou "Pausar" (WCAG 2.2.2). O mouse em cima e o
    foco dentro também param a faixa, mas isso é feito só com CSS.
  - qual ODS está em destaque na área da frase, logo abaixo da faixa:
    o que está com o mouse em cima vence; sem mouse, vale o que está com
    o foco (o toque também foca ou seleciona o botão).

  Devolve o estado e as funções que tratam os eventos dos botões.
*/

// Esta parte é lógica
export function useFaixaODS() {
  const [pausada, setPausada] = useState(false);
  const [odsComMouse, setOdsComMouse] = useState(null);
  const [odsComFoco, setOdsComFoco] = useState(null);
  const refFaixa = useRef(null);

  // Esta parte é lógica
  function alternarPausa() {
    setPausada((valor) => !valor);
  }

  // Esta parte é lógica
  // Quando o foco sai de um botão para fora da faixa, ela volta ao começo
  // da rolagem interna. (Com o foco dentro, a faixa rola por dentro até o
  // botão focado; ao sair, a animação recomeça do ponto certo.)
  function aoSairDoBotao(evento) {
    setOdsComFoco(null);
    const faixa = refFaixa.current;
    if (faixa && !faixa.contains(evento.relatedTarget)) {
      faixa.scrollLeft = 0;
    }
  }

  // Esta parte é lógica
  // Eventos de cada botão de ODS (numero = "10", "9" ou "11")
  function eventosDoOds(numero) {
    return {
      onMouseEnter: () => setOdsComMouse(numero),
      onMouseLeave: () => setOdsComMouse(null),
      onFocus: (evento) => {
        setOdsComFoco(numero);
        // Com o foco dentro, a faixa para e volta ao começo (CSS). No
        // quadro seguinte, já parada, a faixa rola por dentro até o
        // botão aparecer inteiro: nada invisível recebe foco (18.2).
        const botao = evento.currentTarget;
        requestAnimationFrame(() => botao.scrollIntoView({ block: "nearest", inline: "nearest" }));
      },
      onBlur: aoSairDoBotao,
      // No toque, alguns navegadores (Safari no iPhone) não focam o
      // botão. O clique garante que a frase apareça.
      onClick: () => setOdsComFoco(numero),
    };
  }

  return {
    pausada,
    alternarPausa,
    odsEmDestaque: odsComMouse ?? odsComFoco,
    eventosDoOds,
    refFaixa,
  };
}
