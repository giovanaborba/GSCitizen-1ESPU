/*
  useInclinacaoMouse — o cartão inclina acompanhando o mouse (seções
  18.8, 18.9 e 18.14). Usado nos polaroides da Equipe.

  Só funciona com mouse ("hover: hover" e "pointer: fine") e sem "reduzir
  movimento". No toque, no teclado e com "reduzir movimento", o cartão
  fica parado na inclinação dele. Nunca troca o cursor.

  Com o mouse em cima: o cartão se endireita, sobe 6 px e inclina até 10°
  para o lado do mouse. Ao sair, volta à inclinação de antes.

  Devolve os dois eventos para pôr no cartão: aoMover e aoSair.
*/

const CONSULTA_COM_MOUSE = "(hover: hover) and (pointer: fine)";
const INCLINACAO_MAXIMA = 10; // graus

// Esta parte é lógica
function podeInclinar() {
  return (
    window.matchMedia(CONSULTA_COM_MOUSE).matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

// Esta parte é lógica
export function useInclinacaoMouse() {
  // Esta parte é lógica
  function aoMover(evento) {
    if (!podeInclinar()) return;
    const cartao = evento.currentTarget;
    const caixa = cartao.getBoundingClientRect();
    // De -0,5 (borda esquerda/de cima) a +0,5 (borda direita/de baixo)
    const x = (evento.clientX - caixa.left) / caixa.width - 0.5;
    const y = (evento.clientY - caixa.top) / caixa.height - 0.5;
    cartao.style.transform = `perspective(700px) rotateY(${(x * INCLINACAO_MAXIMA * 2).toFixed(1)}deg) rotateX(${(-y * INCLINACAO_MAXIMA * 2).toFixed(1)}deg) translateY(-6px)`;
  }

  // Esta parte é lógica
  function aoSair(evento) {
    evento.currentTarget.style.transform = "";
  }

  return { aoMover, aoSair };
}
