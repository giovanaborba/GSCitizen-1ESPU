import { useEffect, useRef } from "react";
import { useEfeitos } from "@/hooks/useEfeitos";

/*
  useFraseAcende — a palavra acesa conforme a rolagem (seções 19.7 e
  19.15).

  Enquanto a frase sobe pela tela, as palavras vão de --cor-apagada para
  --cor-texto, uma a uma ("adivinhar." acende em --cor-destaque). A
  fração acesa vai de 0 (a frase a 85% da altura da tela) a 1 (a frase a
  35%). É ligado à rolagem: anda junto com a pessoa, para a frente e para
  trás.

  - Escreve direto nos atributos das palavras (data-acesa), uma vez por
    quadro no máximo, sem redesenhar o React.
  - O contêiner ganha data-frase-ligada, que é o que deixa as palavras
    não alcançadas apagadas (CSS). Sem JavaScript ou com os efeitos
    desligados, ele não tem o atributo, e a frase aparece toda acesa.

  Devolve a ref que vai no contêiner das palavras.
*/
// Esta parte é lógica
export function useFraseAcende() {
  const refFrase = useRef(null);
  const { efeitosLigados } = useEfeitos();

  // Esta parte é lógica
  useEffect(() => {
    const frase = refFrase.current;
    if (!frase || !efeitosLigados) return;
    const palavras = [...frase.querySelectorAll("[data-palavra]")];
    let quadro = 0;

    function atualizar() {
      quadro = 0;
      const altura = window.innerHeight;
      const topo = frase.getBoundingClientRect().top;
      const fracao = Math.max(0, Math.min(1, (altura * 0.85 - topo) / (altura * 0.5)));
      const acesas = Math.round(fracao * palavras.length);
      palavras.forEach((palavra, i) => palavra.toggleAttribute("data-acesa", i < acesas));
    }

    function pedirAtualizacao() {
      if (!quadro) quadro = requestAnimationFrame(atualizar);
    }

    frase.setAttribute("data-frase-ligada", "");
    atualizar();
    window.addEventListener("scroll", pedirAtualizacao, { passive: true });
    window.addEventListener("resize", pedirAtualizacao);

    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener("scroll", pedirAtualizacao);
      window.removeEventListener("resize", pedirAtualizacao);
      frase.removeAttribute("data-frase-ligada");
      palavras.forEach((palavra) => palavra.removeAttribute("data-acesa"));
    };
  }, [efeitosLigados]);

  return refFrase;
}
