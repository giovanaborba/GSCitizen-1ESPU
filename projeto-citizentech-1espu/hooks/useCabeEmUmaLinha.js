import { useEffect, useState } from "react";

/*
  useCabeEmUmaLinha — decide se os itens da barra cabem em UMA linha no
  celular (decisão da Fase 2: cada item com a largura do seu texto; 2 × 2
  quando não couber).

  Por que medir no navegador, em vez de usar um número fixo: a largura
  dos textos depende da fonte (Verdana agora, Atkinson depois) e do
  tamanho de texto escolhido pela pessoa. Medindo, a barra acerta em
  qualquer caso.

  Como mede: soma a largura do conteúdo de cada item (o texto já reserva
  o espaço do negrito) + espaço interno + bordas + espaço entre itens, e
  compara com a largura disponível. Mede de novo quando a tela muda de
  tamanho, quando uma fonte termina de carregar e quando os próprios
  textos mudam de largura (ex.: a pessoa aumenta o espaço entre letras
  numa extensão do navegador — WCAG 1.4.12).

  Devolve: null (ainda não mediu), true (cabe) ou false (não cabe).
  A partir de 768 px a barra tem outro layout, e a medição não é usada.
*/
const px = (valor) => parseFloat(valor) || 0;

function larguraNecessaria(lista) {
  const estiloLista = getComputedStyle(lista);
  const links = [...lista.querySelectorAll("a")];

  let total =
    px(estiloLista.paddingLeft) +
    px(estiloLista.paddingRight) +
    px(estiloLista.borderLeftWidth) +
    px(estiloLista.borderRightWidth) +
    px(estiloLista.columnGap) * (links.length - 1);

  for (const link of links) {
    const estilo = getComputedStyle(link);
    // No celular o ícone fica em cima do texto: vale o mais largo dos dois
    const conteudo = Math.max(...[...link.children].map((filho) => filho.getBoundingClientRect().width));
    total +=
      conteudo +
      px(estilo.paddingLeft) +
      px(estilo.paddingRight) +
      px(estilo.borderLeftWidth) +
      px(estilo.borderRightWidth);
  }
  return total;
}

export function useCabeEmUmaLinha(refLista) {
  const [cabe, setCabe] = useState(null);

  useEffect(() => {
    const lista = refLista.current;
    const espacoDisponivel = lista?.parentElement;
    if (!lista || !espacoDisponivel) return;

    function medir() {
      // Arredonda para cima: evita "caber por meio pixel" e transbordar
      setCabe(Math.ceil(larguraNecessaria(lista)) <= espacoDisponivel.clientWidth);
    }

    const observador = new ResizeObserver(medir);
    observador.observe(espacoDisponivel);
    // O conteúdo de cada item (ícone e texto) tem a largura natural do
    // texto: se o texto muda de largura, a medição é refeita.
    lista.querySelectorAll("a > *").forEach((conteudo) => observador.observe(conteudo));
    document.fonts?.addEventListener("loadingdone", medir);

    return () => {
      observador.disconnect();
      document.fonts?.removeEventListener("loadingdone", medir);
    };
  }, [refLista]);

  return cabe;
}
