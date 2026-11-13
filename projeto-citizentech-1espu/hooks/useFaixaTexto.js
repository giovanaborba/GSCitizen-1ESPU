import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useEfeitos } from "@/hooks/useEfeitos";

/*
  useFaixaTexto — move a faixa "Pulse · um guia no pulso" (seção 19.6).

  - Anda para a esquerda sem parar, a 60 px por segundo, e acelera um
    pouco com a rolagem (quanto mais rápido a pessoa rola, mais rápido
    ela anda), como no protótipo.
  - O trilho tem duas cópias iguais do texto. Quando a primeira sai
    inteira da tela, o trilho volta meia largura para trás: como a
    segunda cópia está exatamente onde a primeira estava, ninguém vê o
    "pulo".
  - Usa o relógio do GSAP (o mesmo do Lenis e do ScrollTrigger) e escreve
    direto no transform do trilho (sem redesenhar o React).
  - Só anda com os efeitos ligados e com a faixa na tela
    (IntersectionObserver): fora da tela, o relógio para de mexer nela.
  - Com os efeitos desligados (e sem JavaScript), fica parada. O botão
    "Efeitos" do cabeçalho, que fica sempre à vista no computador, é o
    controle de pausa dela (19.6, WCAG 2.2.2).

  Devolve a ref que vai no trilho.
*/
const VELOCIDADE = 60; // px por segundo
const PESO_DA_ROLAGEM = 0.6; // quanto a rolagem acelera a faixa
const SUAVIZACAO = 0.2; // a velocidade da rolagem muda aos poucos

// Esta parte é lógica
export function useFaixaTexto() {
  const refTrilho = useRef(null);
  const { efeitosLigados } = useEfeitos();

  // Esta parte é lógica
  useEffect(() => {
    const trilho = refTrilho.current;
    if (!trilho || !efeitosLigados) return;

    let x = 0;
    let velocidadeRolagem = 0;
    let rolagemAnterior = window.scrollY;
    let naTela = false;

    // Esta parte é lógica
    // Chamada a cada quadro pelo relógio do GSAP (deltaTime em ms)
    function quadro(_tempo, deltaTime) {
      const passo = window.scrollY - rolagemAnterior;
      rolagemAnterior = window.scrollY;
      velocidadeRolagem += (passo - velocidadeRolagem) * SUAVIZACAO;
      if (!naTela) return;

      const dt = Math.min(64, deltaTime);
      x -= (dt / 1000) * VELOCIDADE + Math.abs(velocidadeRolagem) * PESO_DA_ROLAGEM;
      const metade = trilho.scrollWidth / 2;
      if (metade && -x > metade) x += metade;
      trilho.style.transform = `translateX(${x.toFixed(1)}px)`;
    }

    const observador = new IntersectionObserver(([entrada]) => {
      naTela = entrada.isIntersecting;
    });
    observador.observe(trilho);
    gsap.ticker.add(quadro);

    return () => {
      gsap.ticker.remove(quadro);
      observador.disconnect();
      trilho.style.transform = ""; // desligou os efeitos: volta parada ao começo
    };
  }, [efeitosLigados]);

  return refTrilho;
}
