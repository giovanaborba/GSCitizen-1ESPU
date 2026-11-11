import { useEffect, useState } from "react";

/*
  useDigitandoNoCelular — true enquanto um campo de digitação (data ou
  observações) está em uso no celular (abaixo de 768 px). A barra
  flutuante usa isso para sair da frente do teclado (seção 7.3) e voltar
  quando o campo é deixado.
*/
const CONSULTA_CELULAR = "(max-width: 47.99rem)";
const TIPOS_QUE_NAO_ABREM_TECLADO = ["radio", "checkbox", "button", "submit", "reset"];

// Esta parte é lógica
function ehCampoDeDigitacao(elemento) {
  if (elemento instanceof HTMLTextAreaElement) return true;
  return elemento instanceof HTMLInputElement && !TIPOS_QUE_NAO_ABREM_TECLADO.includes(elemento.type);
}

// Esta parte é lógica
export function useDigitandoNoCelular() {
  const [digitando, setDigitando] = useState(false);

  // Esta parte é lógica
  useEffect(() => {
    const consultaCelular = window.matchMedia(CONSULTA_CELULAR);

    function aoFocar(evento) {
      setDigitando(consultaCelular.matches && ehCampoDeDigitacao(evento.target));
    }
    function aoSair() {
      setDigitando(false);
    }

    document.addEventListener("focusin", aoFocar);
    document.addEventListener("focusout", aoSair);
    return () => {
      document.removeEventListener("focusin", aoFocar);
      document.removeEventListener("focusout", aoSair);
    };
  }, []);

  return digitando;
}
