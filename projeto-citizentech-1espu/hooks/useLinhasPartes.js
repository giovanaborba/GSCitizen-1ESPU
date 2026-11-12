import { useEffect, useLayoutEffect, useRef } from "react";

/*
  useLinhasPartes — as linhas tracejadas que ligam os links "Partes da
  solução" às partes da pulseira 3D, no computador (seção 18.6).

  - A pulseira chama aoDesenhar(projetar) a cada quadro. "projetar(nome)"
    diz onde aquela parte (motor, botão...) está na tela agora.
  - Para cada link, a linha vai da parte da pulseira até o "nó" dourado
    do link, numa curva suave. As linhas são SVG decorativo (aria-hidden)
    e só aparecem a partir de 1000 px.
  - O tracejado anda devagar. Com "reduzir movimento", fica parado.
  - Ao passar o mouse ou focar um link, a linha dele engrossa (classe
    "ativa"), e a pulseira acende a parte (parteAtiva).

  Por desempenho, as linhas são escritas direto no SVG (sem passar pelo
  estado do React), porque mudam até 60 vezes por segundo.

  Devolve refPalco, refSvg, registrarNo(nome) e aoDesenhar(projetar).
*/

const CONSULTA_TELA_LARGA = "(min-width: 62.5rem)"; // 1000 px
const VELOCIDADE_DO_TRACEJADO = 18; // px por segundo

// Esta parte é lógica
// Curva suave da parte (a) até o nó do link (l): sai na horizontal e
// chega na horizontal.
export function caminhoDaLinha(ax, ay, lx, ly) {
  const meio = (ax + lx) / 2;
  const n = (valor) => valor.toFixed(1);
  return `M${n(ax)},${n(ay)} C${n(meio)},${n(ay)} ${n(meio)},${n(ly)} ${n(lx)},${n(ly)}`;
}

// Esta parte é lógica
// Escreve as linhas no SVG. "nos": os nós dos links, por nome.
function desenharLinhas({ svg, palco, nos, parteAtiva, projetar }) {
  if (!svg || !palco || !window.matchMedia(CONSULTA_TELA_LARGA).matches) return;

  const origem = palco.getBoundingClientRect();
  const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const deslocamento = reduzido ? 0 : -((performance.now() / 1000) * VELOCIDADE_DO_TRACEJADO) % 10;

  for (const linha of svg.querySelectorAll("[data-linha]")) {
    const nome = linha.dataset.linha;
    const ponto = projetar(nome);
    const no = nos[nome];
    const marcaDaParte = svg.querySelector(`[data-ponto="${nome}"]`);
    if (!ponto || !no) continue;

    const caixaDoNo = no.getBoundingClientRect();
    const ax = ponto.x - origem.left;
    const ay = ponto.y - origem.top;
    const lx = caixaDoNo.left + caixaDoNo.width / 2 - origem.left;
    const ly = caixaDoNo.top + caixaDoNo.height / 2 - origem.top;

    linha.setAttribute("d", caminhoDaLinha(ax, ay, lx, ly));
    linha.style.strokeDashoffset = String(deslocamento);
    linha.classList.toggle("ativa", parteAtiva === nome);
    if (marcaDaParte) {
      marcaDaParte.setAttribute("cx", ax.toFixed(1));
      marcaDaParte.setAttribute("cy", ay.toFixed(1));
    }
  }
}

// Esta parte é lógica
export function useLinhasPartes(parteAtiva) {
  const refPalco = useRef(null);
  const refSvg = useRef(null);
  const refNos = useRef({});
  const refUltimaProjecao = useRef(null);
  const refParteAtiva = useRef(parteAtiva);

  // Esta parte é lógica
  useLayoutEffect(() => {
    refParteAtiva.current = parteAtiva;
  });

  // Esta parte é lógica
  // Guarda o elemento do "nó" de cada link (chamada pelo ref do <span>).
  function registrarNo(nome) {
    return (elemento) => {
      if (elemento) refNos.current[nome] = elemento;
      else delete refNos.current[nome];
    };
  }

  // Esta parte é lógica
  // Chamada pela pulseira a cada quadro desenhado.
  function aoDesenhar(projetar) {
    refUltimaProjecao.current = projetar;
    desenharLinhas({
      svg: refSvg.current,
      palco: refPalco.current,
      nos: refNos.current,
      parteAtiva: refParteAtiva.current,
      projetar,
    });
  }

  // Esta parte é lógica
  // Se o palco mudar de tamanho com a pulseira parada (pausa, "reduzir
  // movimento", janela redimensionada), redesenha com a última posição.
  useEffect(() => {
    const palco = refPalco.current;
    if (!palco) return;
    const observador = new ResizeObserver(() => {
      const projetar = refUltimaProjecao.current;
      if (!projetar) return;
      desenharLinhas({
        svg: refSvg.current,
        palco,
        nos: refNos.current,
        parteAtiva: refParteAtiva.current,
        projetar,
      });
    });
    observador.observe(palco);
    return () => observador.disconnect();
  }, []);

  return { refPalco, refSvg, registrarNo, aoDesenhar };
}
