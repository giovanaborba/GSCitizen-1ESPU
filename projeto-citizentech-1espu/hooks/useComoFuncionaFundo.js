import { useEffect, useRef, useState } from "react";
import { useEfeitos } from "@/hooks/useEfeitos";
import { useConsultaMidia } from "@/hooks/useConsultaMidia";

/*
  useComoFuncionaFundo — qual dos 4 itens de "Como funciona" está ativo,
  para o fundo da seção trocar junto (seções 19.6 e 19.13).

  - Modo fixo: só no computador (a partir de 64rem e 600 px de altura,
    como as outras seções fixas da 19.6) e com os efeitos ligados. Fora
    dele (celular, zoom alto, efeitos desligados), a seção é uma lista
    comum, cada item com a sua miniatura, e o hook não observa nada
    (decisão da equipe na 9.7, como o protótipo).
  - O item ativo muda:
    - com o mouse em cima do item (só mouse; o toque não conta);
    - com o foco dentro do item (ex.: os links da abertura levam o foco
      aos títulos "Semáforos em tempo real", "Dois modos" e "Transporte
      público");
    - com a rolagem: o item que passa pela faixa do meio da tela (10% da
      altura, entre 45% e 55%). Enquanto o mouse está em cima de um item,
      a rolagem não troca o ativo, como no protótipo.

  Devolve: modoFixo, ativo (índice), a ref da lista (<ul>) e
  propsDoItem(indice), com os eventos de cada <li>.
*/
const CONSULTA_FIXA = "(min-width: 64rem) and (min-height: 37.5rem)";

export function useComoFuncionaFundo() {
  const { efeitosLigados } = useEfeitos();
  const telaFixa = useConsultaMidia(CONSULTA_FIXA);
  const modoFixo = efeitosLigados && telaFixa;
  const [ativo, setAtivo] = useState(0);
  const refLista = useRef(null);
  // Índice do item com o mouse em cima (null = nenhum)
  const refItemMouse = useRef(null);

  // Rolagem: o item que cruza a faixa do meio da tela fica ativo.
  useEffect(() => {
    const lista = refLista.current;
    if (!lista || !modoFixo) return;
    const itens = [...lista.children];
    const observador = new IntersectionObserver(
      (registros) => {
        if (refItemMouse.current !== null) return;
        for (const registro of registros) {
          if (registro.isIntersecting) setAtivo(itens.indexOf(registro.target));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    itens.forEach((item) => observador.observe(item));
    return () => observador.disconnect();
  }, [modoFixo]);

  function propsDoItem(indice) {
    return {
      onPointerEnter: (evento) => {
        if (evento.pointerType === "touch") return;
        refItemMouse.current = indice;
        setAtivo(indice);
      },
      onPointerLeave: () => {
        refItemMouse.current = null;
      },
      // No React, onFocus "sobe" dos filhos (como o focusin do navegador)
      onFocus: () => setAtivo(indice),
    };
  }

  return { modoFixo, ativo, refLista, propsDoItem };
}
