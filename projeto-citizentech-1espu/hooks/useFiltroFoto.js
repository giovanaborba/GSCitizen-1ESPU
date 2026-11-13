import { useEffect } from "react";
import { useEfeitos } from "@/hooks/useEfeitos";

/*
  useFiltroFoto — no celular (sem mouse), a foto ganha cor quando entra
  na tela (seção 19.6, "Filtro nas fotos").

  No computador, a foto ganha cor ao passar o mouse ou com o foco (só
  CSS, classe .foto-filtro). No toque não existe "passar o mouse"; por
  isso, quando 60% da foto está na tela, ela ganha o atributo
  data-colorida, e o CSS tira o filtro.

  Com os efeitos desligados, o filtro nem existe (CSS), e este hook não
  faz nada.

  Recebe a ref da foto (a mesma do parallax).
*/
const CONSULTA_COM_MOUSE = "(hover: hover) and (pointer: fine)";

// Esta parte é lógica
export function useFiltroFoto(refFoto) {
  const { efeitosLigados } = useEfeitos();

  // Esta parte é lógica
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
