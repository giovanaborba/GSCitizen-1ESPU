import { useEffect, useRef, useState } from "react";
import { animate, useMotionValue } from "motion/react";
import { useEfeitos } from "@/hooks/useEfeitos";
import { useConsultaMidia } from "@/hooks/useConsultaMidia";
import { spring } from "@/lib/presetsMovimento";

/*
  useGaleriaCanvas — a Galeria como um plano maior que a janela, que se
  arrasta em qualquer direção (seções 19.9 e 19.15).

  - Modo canvas: só no computador (a partir de 64rem e 600 px de altura,
    o mesmo limite das seções fixas da 19.6) e com os efeitos ligados.
    Fora dele (celular, zoom alto, efeitos desligados), a Galeria é uma
    grade comum, e este hook não faz nada.
  - O plano (2400 × 1500 px, como no protótipo) anda por "transform"
    (valores x e y do Motion). Ele nunca sai da janela: a posição fica
    sempre entre 0 e (janela − plano), nos dois eixos.
  - Jeitos de mover (WCAG 2.5.7: arrastar sempre tem alternativa):
    1. arrastar com o mouse ou o dedo. Ao soltar, o plano ainda desliza
       um pouco na direção do arrasto e para devagar (inércia leve). No
       toque, a janela deixa a rolagem vertical da página passar
       (touch-action: pan-y), para o dedo não ficar "preso" na galeria;
    2. setas do teclado, com o foco na janela (200 px por toque);
    3. botões "Esquerda", "Cima", "Baixo", "Direita" (320 × 260 px) e
       "Centralizar";
    4. foco numa foto (Tab): o plano a leva para o meio da janela.
  - Tudo, menos o arrasto, anda com a mola spring.suave (padrão de
    movimento, "spring sempre"), inclusive a inércia: a mola parte com a
    velocidade do arrasto e para onde o plano chegaria em 0,25 s. O
    arrasto segue o ponteiro, sem mola.
  - "Esquerda" mostra o que está à esquerda: o plano anda para a direita.
  - Foco numa foto fora da vista, sem a página pular. Quando uma foto
    recebe o foco, o navegador rola o que for preciso para mostrá-la onde
    ela estava (a página, se ela estava acima da janela). Por isso:
    1. Tab e Shift+Tab entre as fotos são tratados aqui: a próxima foto
       recebe o foco com preventScroll (nada rola) e a mola a leva ao
       meio. O Shift+Tab no botão "Esquerda" volta para a última foto do
       mesmo jeito. O Tab na última foto e o Shift+Tab na primeira seguem
       o caminho normal (botão "Esquerda" e a própria janela).
    2. Foco que chega de outro jeito (leitor de tela): o navegador pode
       rolar a página para mostrar a foto, e depois a mola a leva ao meio
       da janela. A janela é um contêiner de rolagem escondido (overflow:
       hidden, sem barra e sem roda do mouse): se o navegador a rolar, a
       rolagem vira deslocamento do plano, e a janela volta ao 0.

  Devolve: modoCanvas, x, y, arrastando, refJanela, os eventos da janela,
  mover(dx, dy) e centralizar() para os botões e aoFocarFoto para as
  fotos.
*/
const CONSULTA_CANVAS = "(min-width: 64rem) and (min-height: 37.5rem)";
export const TAMANHO_PLANO = { largura: 2400, altura: 1500 };
const PASSO_TECLA = 200;
const PASSO_BOTAO = { x: 320, y: 260 };
const JANELA_VELOCIDADE = 100; // ms de arrasto usados para medir a velocidade
const ALCANCE_INERCIA = 0.25; // s: ao soltar, o plano vai até onde chegaria nesse tempo
// Ponto do plano que fica no meio da janela ao centralizar (protótipo)
const CENTRO_FOTOS = { x: 900, y: 550 };
// Setas: para onde o plano anda (o contrário de para onde se "olha")
const SETAS = {
  ArrowLeft: [1, 0],
  ArrowRight: [-1, 0],
  ArrowUp: [0, 1],
  ArrowDown: [0, -1],
};

// Esta parte é lógica
// Mantém o plano dentro da janela: de 0 até (janela − plano).
function limitar(janela, valorX, valorY) {
  const minimoX = Math.min(0, janela.clientWidth - TAMANHO_PLANO.largura);
  const minimoY = Math.min(0, janela.clientHeight - TAMANHO_PLANO.altura);
  return [Math.max(minimoX, Math.min(0, valorX)), Math.max(minimoY, Math.min(0, valorY))];
}

// Esta parte é lógica
// Se o navegador rolou a janela (para mostrar uma foto com foco), a
// rolagem vira deslocamento do plano, e a janela volta ao 0. Devolve true
// se havia rolagem.
function absorverRolagemDaJanela(janela, x, y) {
  const { scrollLeft, scrollTop } = janela;
  if (!scrollLeft && !scrollTop) return false;
  janela.scrollLeft = 0;
  janela.scrollTop = 0;
  // jump: muda sem animar (e para a mola em andamento)
  x.jump(x.get() - scrollLeft);
  y.jump(y.get() - scrollTop);
  return true;
}

// Esta parte é lógica
export function useGaleriaCanvas() {
  const { efeitosLigados } = useEfeitos();
  const telaGrande = useConsultaMidia(CONSULTA_CANVAS);
  const modoCanvas = efeitosLigados && telaGrande;
  const refJanela = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [arrastando, setArrastando] = useState(false);
  // Molas em andamento, para parar ao mexer de novo
  const refAnimacoes = useRef([]);
  // Arrasto em andamento: de onde o ponteiro e o plano partiram, e as
  // últimas posições (para medir a velocidade ao soltar)
  const refArrasto = useRef(null);
  // Para onde a mola está levando o plano ([x, y]), ou null
  const refDestino = useRef(null);

  // Esta parte é lógica
  function pararAnimacoes() {
    refAnimacoes.current.forEach((animacao) => animacao.stop());
    refAnimacoes.current = [];
    refDestino.current = null;
  }

  // Esta parte é lógica
  // Leva o plano até (alvoX, alvoY), dentro dos limites, com a mola.
  // "velocidade" (px/s): a mola parte já em movimento (inércia).
  function moverPara(alvoX, alvoY, velocidade = [0, 0]) {
    const janela = refJanela.current;
    if (!janela) return;
    pararAnimacoes();
    const [destinoX, destinoY] = limitar(janela, alvoX, alvoY);
    refDestino.current = [destinoX, destinoY];
    refAnimacoes.current = [
      animate(x, destinoX, { ...spring.suave, velocity: velocidade[0] }),
      animate(y, destinoY, { ...spring.suave, velocity: velocidade[1] }),
    ];
  }

  // Esta parte é lógica
  // Ao entrar no modo canvas: plano centralizado nas fotos, sem animação.
  // Se a janela mudar de tamanho, o plano continua dentro dela. Também
  // acompanha a rolagem da janela (ver o comentário do topo).
  useEffect(() => {
    const janela = refJanela.current;
    if (!janela || !modoCanvas) return;
    const animacoes = refAnimacoes;
    const destino = refDestino;

    function aoRolarJanela() {
      if (!absorverRolagemDaJanela(janela, x, y) || !destino.current) return;
      // A mola continua para o mesmo destino, do lugar em que a foto está
      const [destinoX, destinoY] = destino.current;
      animacoes.current = [animate(x, destinoX, spring.suave), animate(y, destinoY, spring.suave)];
    }
    janela.addEventListener("scroll", aoRolarJanela);

    const [inicioX, inicioY] = limitar(
      janela,
      janela.clientWidth / 2 - CENTRO_FOTOS.x,
      janela.clientHeight / 2 - CENTRO_FOTOS.y,
    );
    x.jump(inicioX);
    y.jump(inicioY);

    const observador = new ResizeObserver(() => {
      const [dentroX, dentroY] = limitar(janela, x.get(), y.get());
      x.jump(dentroX);
      y.jump(dentroY);
    });
    observador.observe(janela);

    return () => {
      observador.disconnect();
      janela.removeEventListener("scroll", aoRolarJanela);
      animacoes.current.forEach((animacao) => animacao.stop());
      animacoes.current = [];
    };
  }, [modoCanvas, x, y]);

  // Esta parte é lógica
  function aoApertar(evento) {
    if (evento.button !== 0) return;
    pararAnimacoes();
    refArrasto.current = {
      ponteiro: evento.pointerId,
      inicioX: evento.clientX,
      inicioY: evento.clientY,
      planoX: x.get(),
      planoY: y.get(),
      amostras: [{ t: evento.timeStamp, x: evento.clientX, y: evento.clientY }],
    };
    evento.currentTarget.setPointerCapture(evento.pointerId);
    setArrastando(true);
  }

  // Esta parte é lógica
  function aoMover(evento) {
    const arrasto = refArrasto.current;
    if (!arrasto || arrasto.ponteiro !== evento.pointerId) return;
    const [novoX, novoY] = limitar(
      evento.currentTarget,
      arrasto.planoX + evento.clientX - arrasto.inicioX,
      arrasto.planoY + evento.clientY - arrasto.inicioY,
    );
    x.set(novoX);
    y.set(novoY);
    // Guarda só os últimos 100 ms de movimento (pelo menos 2 posições)
    arrasto.amostras.push({ t: evento.timeStamp, x: evento.clientX, y: evento.clientY });
    while (arrasto.amostras.length > 2 && evento.timeStamp - arrasto.amostras[0].t > JANELA_VELOCIDADE) {
      arrasto.amostras.shift();
    }
  }

  // Esta parte é lógica
  // Ao soltar: inércia leve. A velocidade é a dos últimos 100 ms do
  // arrasto; se o ponteiro já estava parado antes de soltar, não há
  // inércia.
  function aoSoltar(evento) {
    const arrasto = refArrasto.current;
    if (!arrasto || arrasto.ponteiro !== evento.pointerId) return;
    refArrasto.current = null;
    setArrastando(false);
    const primeira = arrasto.amostras[0];
    const ultima = arrasto.amostras[arrasto.amostras.length - 1];
    const tempo = ultima.t - primeira.t;
    if (evento.timeStamp - ultima.t > JANELA_VELOCIDADE || tempo <= 0) return;
    const velocidadeX = ((ultima.x - primeira.x) / tempo) * 1000;
    const velocidadeY = ((ultima.y - primeira.y) / tempo) * 1000;
    moverPara(
      x.get() + velocidadeX * ALCANCE_INERCIA,
      y.get() + velocidadeY * ALCANCE_INERCIA,
      [velocidadeX, velocidadeY],
    );
  }

  // Esta parte é lógica
  function aoTeclar(evento) {
    if (evento.key === "Tab") {
      tabularEntreFotos(evento);
      return;
    }
    const direcao = SETAS[evento.key];
    if (!direcao) return;
    evento.preventDefault();
    moverPara(x.get() + direcao[0] * PASSO_TECLA, y.get() + direcao[1] * PASSO_TECLA);
  }

  // Esta parte é lógica
  // Tab (ou Shift+Tab) de uma foto para a vizinha, ou da janela para a
  // primeira foto: foco sem rolar a página; o onFocus da foto chama
  // aoFocarFoto, que leva o plano até ela.
  function tabularEntreFotos(evento) {
    const fotos = [...evento.currentTarget.querySelectorAll("figure")];
    const atual = fotos.indexOf(document.activeElement); // −1 = a janela
    const destino = atual + (evento.shiftKey ? -1 : 1);
    if (atual === -1 && evento.shiftKey) return; // sai da galeria para trás
    if (destino < 0 || destino >= fotos.length) return; // caminho normal
    evento.preventDefault();
    fotos[destino].focus({ preventScroll: true });
  }

  // Esta parte é lógica
  // Shift+Tab no primeiro botão de "Mover a galeria" volta para a última
  // foto, também sem rolar a página.
  function aoTeclarControles(evento) {
    const janela = refJanela.current;
    const primeiroBotao = evento.currentTarget.querySelector("button");
    if (evento.key !== "Tab" || !evento.shiftKey || !janela || document.activeElement !== primeiroBotao) return;
    const fotos = janela.querySelectorAll("figure");
    if (!fotos.length) return;
    evento.preventDefault();
    fotos[fotos.length - 1].focus({ preventScroll: true });
  }

  // Esta parte é lógica
  // Botões: dx e dy dizem para onde se quer olhar (−1 = esquerda/cima).
  function mover(dx, dy) {
    moverPara(x.get() - dx * PASSO_BOTAO.x, y.get() - dy * PASSO_BOTAO.y);
  }

  // Esta parte é lógica
  function centralizar() {
    const janela = refJanela.current;
    if (!janela) return;
    moverPara(janela.clientWidth / 2 - CENTRO_FOTOS.x, janela.clientHeight / 2 - CENTRO_FOTOS.y);
  }

  // Esta parte é lógica
  // Foco numa foto (teclado ou leitor de tela): o plano a leva para o
  // meio da janela. Um clique para arrastar também pode focar a foto, mas
  // aí o plano segue o arrasto, e não o foco.
  function aoFocarFoto(evento) {
    const janela = refJanela.current;
    const item = evento.currentTarget.closest("li");
    if (!janela || !item || refArrasto.current) return;
    // Se o navegador rolou a janela para mostrar a foto, essa rolagem vira
    // posição do plano
    absorverRolagemDaJanela(janela, x, y);
    moverPara(
      janela.clientWidth / 2 - (item.offsetLeft + item.offsetWidth / 2),
      janela.clientHeight / 2 - (item.offsetTop + item.offsetHeight / 2),
    );
  }

  return {
    modoCanvas,
    x,
    y,
    arrastando,
    refJanela,
    eventosJanela: {
      onPointerDown: aoApertar,
      onPointerMove: aoMover,
      onPointerUp: aoSoltar,
      onPointerCancel: aoSoltar,
      onKeyDown: aoTeclar,
    },
    aoTeclarControles,
    mover,
    centralizar,
    aoFocarFoto,
  };
}
