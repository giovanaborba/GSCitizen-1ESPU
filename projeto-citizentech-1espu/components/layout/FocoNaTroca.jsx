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
*/
export default function FocoNaTroca() {
  const caminho = usePathname();
  const caminhoAnterior = useRef(caminho);

  // Esta parte é lógica
  useEffect(() => {
    // Mesmo caminho = primeiro carregamento (ou o React rodando o efeito
    // duas vezes no modo de desenvolvimento): não faz nada.
    if (caminhoAnterior.current === caminho) return;
    caminhoAnterior.current = caminho;

    const titulo = document.querySelector("#conteudo h1");
    if (!titulo) return;
    // Garante que o <h1> aceite foco, mesmo se a página esquecer o tabIndex
    if (!titulo.hasAttribute("tabindex")) titulo.setAttribute("tabindex", "-1");
    titulo.focus();
  }, [caminho]);

  return null;
}
