import { createContext, useContext } from "react";

/*
  useRolagemSuave — devolve a rolagem suave do site (o Lenis), ou null
  quando ela não existe (seção 19.2).

  O Lenis só existe com os efeitos ligados. Com os efeitos desligados, a
  rolagem é a do navegador, sem nenhuma suavização. Por isso quem usa
  precisa sempre ter um plano B:

    const lenis = useRolagemSuave();
    if (lenis) lenis.scrollTo(destino);
    else window.scrollTo({ top: destino });

  Quem cria e destrói o Lenis é o ProvedorMovimento.
*/

// O ProvedorMovimento preenche este contexto com a instância do Lenis.
export const ContextoRolagemSuave = createContext(null);

// Esta parte é lógica
export function useRolagemSuave() {
  return useContext(ContextoRolagemSuave);
}
