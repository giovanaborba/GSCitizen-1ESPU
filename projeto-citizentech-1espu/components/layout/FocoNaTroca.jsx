"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/*
  FocoNaTroca — seção 4.1.
  Quando a pessoa vai para outra página, o foco é levado para o <h1> da
  página nova. Assim o leitor de tela começa a ler do título, e quem usa
  teclado continua dali, sem voltar ao topo do cabeçalho.

  No primeiro carregamento NÃO move o foco, para o "Pular para o conteúdo"
  continuar sendo o primeiro elemento focável.
  Não desenha nada na tela (devolve null).

  Fase 8: se o endereço novo tiver uma âncora (ex.: /solucao#os-sinais,
  pelos links da abertura do Início), o foco vai para o título daquela
  âncora, e não para o <h1>. Sem isso, focar o <h1> rolaria a página de
  volta ao topo. O preventScroll deixa a rolagem com o Next, que já leva
  a página até a âncora.
*/

// Devolve o elemento que deve receber o foco e se ele veio de uma âncora.
function destinoDoFoco() {
  const ancora = window.location.hash.slice(1);
  if (ancora) {
    const alvo = document.getElementById(decodeURIComponent(ancora));
    if (alvo) return { elemento: alvo, veioDaAncora: true };
  }
  return { elemento: document.querySelector("#conteudo h1"), veioDaAncora: false };
}
export default function FocoNaTroca() {
  const caminho = usePathname();
  const caminhoAnterior = useRef(caminho);

  useEffect(() => {
    // Mesmo caminho = primeiro carregamento (ou o React rodando o efeito
    // duas vezes no modo de desenvolvimento): não faz nada.
    if (caminhoAnterior.current === caminho) return;
    caminhoAnterior.current = caminho;

    const { elemento, veioDaAncora } = destinoDoFoco();
    if (!elemento) return;
    // Garante que o destino aceite foco, mesmo se a página esquecer o tabIndex
    if (!elemento.hasAttribute("tabindex")) elemento.setAttribute("tabindex", "-1");
    elemento.focus(veioDaAncora ? { preventScroll: true } : undefined);
  }, [caminho]);

  return null;
}
