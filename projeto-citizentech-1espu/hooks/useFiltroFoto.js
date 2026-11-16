import { useEffect } from "react";
import { useEfeitos } from "@/hooks/useEfeitos";

// No toque não existe "passar o mouse": por isso, no celular, a foto ganha cor
// quando 60% dela está na tela.
const CONSULTA_COM_MOUSE = "(hover: hover) and (pointer: fine)";

export function useFiltroFoto(refFoto) {
  const { efeitosLigados } = useEfeitos();

  useEffect(() => {
    const foto = refFoto.current;
    if (!foto || !efeitosLigados || window.matchMedia(CONSULTA_COM_MOUSE).matches) return;
    const observador = new IntersectionObserver(
      ([registro]) => foto.toggleAttribute("data-colorida", registro.isIntersecting),
      { threshold: 0.6 },
    );
    observador.observe(foto);
    return () => {
      observador.disconnect();
      foto.removeAttribute("data-colorida");
    };
  }, [efeitosLigados, refFoto]);
}
