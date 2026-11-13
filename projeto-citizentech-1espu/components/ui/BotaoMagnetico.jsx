"use client";

import { motion } from "motion/react";
import LinkInterno from "@/components/ui/LinkInterno";
import EspacoIcone from "@/components/ui/EspacoIcone";
import { useMagnetico } from "@/hooks/useMagnetico";

/*
  BotaoMagnetico — a variante "principal" (laranja) do Botao, com o
  conteúdo magnético (seções 19.6 e 19.15).

  Quem usa continua escrevendo <Botao> (ou <Botao variante="principal">):
  o Botao chama este componente sozinho quando a variante é a principal.
  Assim, TODOS os botões laranja principais do site são magnéticos, e só
  eles (19.6: "Só os botões laranja principais").

  - Recebe do Botao as classes já prontas (className), o href (vira link)
    ou o type (vira <button>), o ícone e o texto.
  - O ícone e o texto ficam juntos num <span> que se move (useMagnetico).
    O botão em si, e a área de clique, não se movem.
  - Os eventos de quem usa (onPointerMove e onPointerLeave) continuam
    funcionando.
*/
export default function BotaoMagnetico({
  href,
  icone,
  className,
  type = "button",
  onPointerMove,
  onPointerLeave,
  children,
  ...resto
}) {
  const { x, y, aoMover, aoSair } = useMagnetico();

  const eventos = {
    onPointerMove: (evento) => {
      aoMover(evento);
      onPointerMove?.(evento);
    },
    onPointerLeave: (evento) => {
      aoSair();
      onPointerLeave?.(evento);
    },
  };

  const conteudo = (
    <motion.span style={{ x, y }} className="inline-flex items-center justify-center gap-2">
      {icone && <EspacoIcone nome={icone} />}
      <span>{children}</span>
    </motion.span>
  );

  if (href) {
    return (
      <LinkInterno href={href} className={className} {...eventos} {...resto}>
        {conteudo}
      </LinkInterno>
    );
  }

  return (
    <button type={type} className={className} {...eventos} {...resto}>
      {conteudo}
    </button>
  );
}
