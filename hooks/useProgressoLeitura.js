import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useEfeitos } from "@/hooks/useEfeitos";
import { ouvirRolagem } from "@/lib/tela";

// Escreve direto no estilo da barra, uma vez por quadro, sem redesenhar o componente.
export function useProgressoLeitura() {
  const refBarra = useRef(null);
  const { efeitosLigados } = useEfeitos();
  const caminho = usePathname();

  useEffect(() => {
    const barra = refBarra.current;
    if (!barra || !efeitosLigados) return;

    function atualizar() {
      const raiz = document.documentElement;
      const maximo = raiz.scrollHeight - window.innerHeight;
      const fracao = maximo > 0 ? Math.min(1, Math.max(0, window.scrollY / maximo)) : 0;
      barra.style.transform = `scaleX(${fracao.toFixed(4)})`;
    }

    atualizar();
    const rolagem = ouvirRolagem(atualizar);
    const observador = new ResizeObserver(rolagem.pedir);
    observador.observe(document.body);

    return () => {
      rolagem.parar();
      observador.disconnect();
    };
  }, [efeitosLigados, caminho]);

  return refBarra;
}
