import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useEfeitos } from "@/hooks/useEfeitos";

/*
  useProgressoLeitura — a fração lida da página (seções 19.6 e 19.15).

  Fração lida = quanto já rolou ÷ quanto dá para rolar (0 no topo, 1 no
  fim). O hook não guarda isso no estado do React (o que redesenharia o
  componente a cada passo da rolagem): ele escreve direto no estilo da
  barra, com transform: scaleX(fração), uma vez por quadro da tela no
  máximo (requestAnimationFrame).

  - Só com os efeitos ligados. Desligados, a barra nem aparece (classe
    efeitos-desligados:hidden no componente), e nada é calculado.
  - Recalcula ao rolar, ao mudar o tamanho da janela ou da página (ex.:
    o Diário que carrega a lista) e ao trocar de página.

  Devolve a ref que vai na barra.
*/
// Esta parte é lógica
export function useProgressoLeitura() {
  const refBarra = useRef(null);
  const { efeitosLigados } = useEfeitos();
  const caminho = usePathname();

  // Esta parte é lógica
  useEffect(() => {
    const barra = refBarra.current;
    if (!barra || !efeitosLigados) return;
    let quadro = 0;

    function atualizar() {
      quadro = 0;
      const raiz = document.documentElement;
      const maximo = raiz.scrollHeight - window.innerHeight;
      const fracao = maximo > 0 ? Math.min(1, Math.max(0, window.scrollY / maximo)) : 0;
      barra.style.transform = `scaleX(${fracao.toFixed(4)})`;
    }

    function pedirAtualizacao() {
      if (!quadro) quadro = requestAnimationFrame(atualizar);
    }

    atualizar();
    window.addEventListener("scroll", pedirAtualizacao, { passive: true });
    window.addEventListener("resize", pedirAtualizacao);
    const observador = new ResizeObserver(pedirAtualizacao);
    observador.observe(document.body);

    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener("scroll", pedirAtualizacao);
      window.removeEventListener("resize", pedirAtualizacao);
      observador.disconnect();
    };
  }, [efeitosLigados, caminho]);

  return refBarra;
}
