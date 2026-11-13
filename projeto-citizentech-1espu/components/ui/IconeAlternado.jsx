"use client";

import { AnimatePresence, motion } from "motion/react";
import { saida, spring } from "@/lib/presetsMovimento";

/*
  IconeAlternado — o ícone de um botão que alterna entre dois estados,
  como Pausar ↔ Retomar (seção 19.11, "em todo o site"; padrão de
  movimento, item 6: "ícones que se transformam").

  Quando a "chave" muda, o ícone antigo sai girando um pouco e o novo
  entra girando (rotação curta de 90°, mola spring.rapida; a saída usa o
  preset "saida", mais rápida que a entrada). AnimatePresence
  mode="wait": o novo só entra depois que o antigo saiu.

  Com os efeitos desligados, o MotionConfig do ProvedorMovimento tira a
  rotação, e fica só a troca de opacidade (19.11).

  Enquanto o ícone ainda é o espaço vazio (EspacoIcone), o invólucro
  também não ocupa lugar (decisão 4 da 9.0): o texto do botão continua
  centralizado. Quando a equipe colocar o ícone, ele aparece.

  Uso (os marcadores ICONE-…-AQUI ficam em quem usa):
    <IconeAlternado chave={tocando ? "pausar" : "reproduzir"}>
      {tocando ? <EspacoIcone nome="Pause" /> : <EspacoIcone nome="Play" />}
    </IconeAlternado>
*/
export default function IconeAlternado({ chave, children }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={chave}
        aria-hidden="true"
        initial={{ opacity: 0, rotate: -90 }}
        animate={{ opacity: 1, rotate: 0, transition: spring.rapida }}
        exit={{ opacity: 0, rotate: 90, transition: saida }}
        className="inline-flex shrink-0 has-[>[data-icone]]:hidden"
      >
        {children}
      </motion.span>
    </AnimatePresence>
  );
}
