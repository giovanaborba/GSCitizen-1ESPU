// Medidas e consultas de tela usadas por mais de um hook.

// Abaixo de 768 px (o "md" do Tailwind).
export const CONSULTA_CELULAR = "(max-width: 47.99rem)";
// Tela grande o bastante para seções fixas, galeria em canvas e encaixe
// (a mesma do @custom-variant secao-fixa, em globals.css).
export const CONSULTA_TELA_GRANDE = "(min-width: 64rem) and (min-height: 37.5rem)";

// Altura do que fica preso no topo: cabeçalho + índice "Nesta página".
export function alturaDoTopo() {
  const estilo = getComputedStyle(document.documentElement);
  const cabecalho = parseFloat(estilo.getPropertyValue("--altura-cabecalho")) || 0;
  const indice = parseFloat(estilo.getPropertyValue("--altura-indice")) || 0;
  return cabecalho + indice;
}

// Chama `atualizar` no máximo uma vez por quadro, ao rolar e ao mudar o tamanho
// da janela. `aoMudarTamanho` (opcional) roda antes, a cada resize.
// Devolve { pedir, parar }: `pedir` agenda uma atualização; `parar` desliga tudo.
export function ouvirRolagem(atualizar, aoMudarTamanho) {
  let quadro = 0;

  function aCadaQuadro() {
    quadro = 0;
    atualizar();
  }
  function pedir() {
    if (!quadro) quadro = requestAnimationFrame(aCadaQuadro);
  }
  function aoRedimensionar() {
    aoMudarTamanho?.();
    pedir();
  }

  window.addEventListener("scroll", pedir, { passive: true });
  window.addEventListener("resize", aoRedimensionar);

  return {
    pedir,
    parar() {
      cancelAnimationFrame(quadro);
      window.removeEventListener("scroll", pedir);
      window.removeEventListener("resize", aoRedimensionar);
    },
  };
}
