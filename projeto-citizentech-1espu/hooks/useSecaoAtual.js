import { useEffect, useState } from "react";

/*
  useSecaoAtual — em qual seção da página a pessoa está (decisão 1 da
  equipe na Fase 8: a pílula da seção atual fica laranja no "Nesta
  página").

  Regra: a seção atual é a última cujo título (<h2 id>) já passou da
  linha de leitura, logo abaixo do cabeçalho e da faixa do índice (o
  mesmo desconto das âncoras, scroll-padding-top). No fim da página, vale
  a última seção. Antes da primeira, nenhuma.

  Seções fixas (Fase 9, ex.: "Um trajeto com a Pulse"): o título fica
  preso no meio da tela e nunca chega à linha. Nelas, a seção marcada com
  data-secao-fixa conta a partir do começo dela.

  Recalcula ao rolar e ao mudar o tamanho da tela, no máximo uma vez por
  quadro. Não anima nada: só troca a cor, então vale também com "reduzir
  movimento".

  Recebe a lista de itens { id, texto } e devolve o id da seção atual
  (ou null).
*/

function medirSecaoAtual(ids) {
  const raiz = document.documentElement;
  const linha = parseFloat(getComputedStyle(raiz).scrollPaddingTop) || 0;
  let atual = null;
  for (const id of ids) {
    const titulo = document.getElementById(id);
    if (!titulo) continue;
    const secaoFixa = titulo.closest("[data-secao-fixa]");
    // Títulos com rótulo param um pouco mais abaixo (scroll-margin-top),
    // para o rótulo aparecer: essa margem também conta.
    const margem = secaoFixa ? 0 : parseFloat(getComputedStyle(titulo).scrollMarginTop) || 0;
    const topo = (secaoFixa ?? titulo).getBoundingClientRect().top;
    if (topo - margem <= linha + 2) atual = id;
  }
  const noFim = window.innerHeight + window.scrollY >= raiz.scrollHeight - 2;
  if (noFim && ids.length) atual = ids[ids.length - 1];
  return atual;
}

export function useSecaoAtual(itens) {
  const [atual, setAtual] = useState(null);

  useEffect(() => {
    const ids = itens.map((item) => item.id);
    let quadro = 0;

    function medir() {
      quadro = 0;
      setAtual(medirSecaoAtual(ids));
    }
    function agendar() {
      if (!quadro) quadro = requestAnimationFrame(medir);
    }

    agendar();
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
    };
  }, [itens]);

  return atual;
}
