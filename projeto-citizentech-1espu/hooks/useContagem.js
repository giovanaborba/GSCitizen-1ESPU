import { useEffect, useRef } from "react";
import { animate, inView } from "motion";
import { useEfeitos } from "@/hooks/useEfeitos";

/*
  useContagem — o número que conta de 0 até o valor (seções 19.6 e 19.15),
  nos cartões de dados de "O problema".

  - Conta em 1,2 s (19.6), desacelerando no fim, quando o cartão entra na
    tela. Só na primeira vez.
  - O número que conta é decorativo (aria-hidden, no componente). O leitor
    de tela lê um texto escondido com o valor real ("Cerca de 90%",
    "7,9 milhões"), que nunca muda.
  - O valor final já vem do servidor: sem JavaScript, com os efeitos
    desligados ou com o cartão já à vista ao carregar, aparece o número
    final, parado.
  - Escreve direto no texto do elemento (sem redesenhar o React a cada
    quadro).

  Recebe { valor, casas, antes, depois } (o texto ao redor do número) e
  devolve a ref que vai no número. formatarNumero (exportada) escreve o
  número com vírgula decimal e o texto ao redor.
*/
const DURACAO = 1.2; // segundos (19.6)

// Esta parte é lógica
// 7.9 → "7,9"; com o texto ao redor: "Cerca de " + "90" + "%"
export function formatarNumero(numero, casas, antes = "", depois = "") {
  return `${antes}${numero.toFixed(casas).replace(".", ",")}${depois}`;
}

// Esta parte é lógica
export function useContagem({ valor, casas = 0, antes = "", depois = "" }) {
  const refNumero = useRef(null);
  const { efeitosLigados } = useEfeitos();

  // Esta parte é lógica
  useEffect(() => {
    const numero = refNumero.current;
    if (!numero || !efeitosLigados) return;
    const formatar = (valorAtual) => formatarNumero(valorAtual, casas, antes, depois);
    const textoFinal = formatar(valor);
    if (numero.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    numero.textContent = formatar(0);
    let animacao = null;
    const pararDeObservar = inView(
      numero,
      () => {
        animacao = animate(0, valor, {
          duration: DURACAO,
          ease: [0.33, 1, 0.68, 1], // desacelera no fim
          onUpdate: (atual) => {
            numero.textContent = formatar(atual);
          },
        });
        pararDeObservar();
      },
      { amount: 0.6 },
    );

    return () => {
      pararDeObservar();
      animacao?.stop();
      numero.textContent = textoFinal;
    };
  }, [efeitosLigados, valor, casas, antes, depois]);

  return refNumero;
}
