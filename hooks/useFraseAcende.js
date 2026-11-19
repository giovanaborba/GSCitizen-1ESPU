import { useEffect, useRef } from "react";
import { useEfeitos } from "@/hooks/useEfeitos";
import { ouvirRolagem } from "@/lib/tela";

// Sem data-frase-ligada (sem JavaScript ou sem efeitos), a frase aparece toda acesa.
// Escreve direto nos atributos, uma vez por quadro, sem redesenhar o React.
export function useFraseAcende() {
  const refFrase = useRef(null);
  const { efeitosLigados } = useEfeitos();

  useEffect(() => {
    const frase = refFrase.current;
    if (!frase || !efeitosLigados) return;
    const palavras = [...frase.querySelectorAll("[data-palavra]")];

    function atualizar() {
      const altura = window.innerHeight;
      const topo = frase.getBoundingClientRect().top;
      const fracao = Math.max(0, Math.min(1, (altura * 0.85 - topo) / (altura * 0.5)));
      const acesas = Math.round(fracao * palavras.length);
      palavras.forEach((palavra, i) => palavra.toggleAttribute("data-acesa", i < acesas));
    }

    frase.setAttribute("data-frase-ligada", "");
    atualizar();
    const rolagem = ouvirRolagem(atualizar);

    return () => {
      rolagem.parar();
      frase.removeAttribute("data-frase-ligada");
      palavras.forEach((palavra) => palavra.removeAttribute("data-acesa"));
    };
  }, [efeitosLigados]);

  return refFrase;
}
