"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEfeitos } from "@/hooks/useEfeitos";

/*
  PalavraFundo — palavra gigante decorativa (seções 18.5 e 18.14).
  Ex.: o sinal atual atrás da pulseira na abertura, "Parar" na página 404.

  - É só decoração: aria-hidden="true", então o leitor de tela não lê.
  - Fica atrás do objeto principal, ocupando a área do componente pai
    (que precisa ter position: relative). O que passar da área é cortado
    aqui dentro, então a palavra nunca cria rolagem lateral.
  - Nunca vai atrás de texto pequeno: o contraste do texto que fica perto
    dela foi recalculado (registro de desenvolvimento, subfase 8.5).
  - Tamanho: min(21rem, 150vw ÷ número de letras), seção 18.6. Assim a
    palavra cabe na tela, seja "Parar" ou "Continuar". Palavras com menos
    de 5 letras contam como 5, para não ficarem enormes (como no
    protótipo).
  - "animarTroca": quando a palavra muda, a antiga esmaece e a nova
    aparece (0,35 s cada, seção 18.6). Com os efeitos desligados, a troca
    é instantânea.
  - "className": a área que a palavra ocupa (padrão: a área toda do pai,
    "inset-0"). Ex.: a abertura usa a altura da pulseira e a largura da
    tela inteira.
  - "tamanho": troca a fórmula do tamanho, quando a palavra precisa caber
    numa área menor que a tela (ex.: a coluna da pulseira na 404, com
    "cqw", a largura do componente pai em vez da tela).
*/

function tamanhoDaPalavra(texto) {
  const letras = Math.max(5, texto.length);
  return `min(21rem, ${(150 / letras).toFixed(1)}vw)`;
}

export default function PalavraFundo({ texto, animarTroca = false, className = "inset-0", tamanho }) {
  const { efeitosLigados } = useEfeitos();
  const duracao = animarTroca && efeitosLigados ? 0.35 : 0;

  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute flex items-center justify-center overflow-hidden ${className}`}
    >
      {/* mode="wait": a palavra antiga sai antes de a nova entrar */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={texto}
          className="palavra-fundo"
          style={{ fontSize: tamanho ?? tamanhoDaPalavra(texto) }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duracao }}
        >
          {texto}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
