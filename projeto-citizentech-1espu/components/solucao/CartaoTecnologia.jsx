"use client";

import { useState } from "react";
import { motion } from "motion/react";
import EspacoIcone from "@/components/ui/EspacoIcone";
import EspacoImagem from "@/components/ui/EspacoImagem";
import { useEfeitos } from "@/hooks/useEfeitos";
import { spring } from "@/lib/presetsMovimento";

/*
  CartaoTecnologia — cartão de Tecnologias que vira para mostrar a peça
  (seções 19.8 e 19.15). Item de uma <ul>.

  - Frente: rótulo mono, H3 e descrição (textos da 6.2, rótulos da 18.8).
  - Verso: a foto da peça (marcador IMAGEM-peça (nome)-AQUI, 19.14).
  - Botão no pé do cartão: texto fixo "Ver a peça", com ícone e
    aria-pressed="true" enquanto o cartão está virado (decisão da equipe
    na 9.7, como o "Girar sozinha" da 9.5: assim o leitor de tela diz
    "Ver a peça, botão de alternância, pressionado", sem contradição).
  - O cartão gira 180° em volta do eixo vertical (rotateY) com a mola
    spring.suave (0,42 s; decisão 3 da equipe na 9.0: o padrão de
    movimento vence os 0,55 s da 19.8). As duas faces têm
    backface-visibility: hidden, então cada uma só aparece de frente.
  - O verso escondido tem "inert": não recebe foco e não é lido. Ao
    virar, o foco continua no botão.
  - Com os efeitos desligados, a troca é instantânea (duração 0). O
    MotionConfig do ProvedorMovimento só tira as animações de posição e
    de escala, e não a rotação; por isso o cartão confere o interruptor.
  - As duas faces ficam na MESMA célula de uma grade (grid-area 1 / 1):
    o cartão tem a altura da face mais alta. Com o texto ampliado, ele
    cresce em vez de cortar o texto.

  A foto da peça aparece colorida, como no protótipo: ela só aparece
  quando a pessoa pede para ver.

  Props: rotulo, nome, descricao, src e alt (a foto; sem src, fica o espaço).
*/

// Faces: mesma célula da grade, viradas para lados opostos
const ESTILO_FACE =
  "[grid-area:1/1] rounded-t-cartao border border-b-0 backface-hidden";

export default function CartaoTecnologia({ rotulo, nome, descricao, src, alt }) {
  const [virado, setVirado] = useState(false);
  const { efeitosLigados } = useEfeitos();

  return (
    <li className="grid min-h-56 grid-cols-1 grid-rows-[1fr_auto] perspective-distant">
      <motion.div
        initial={false}
        animate={{ rotateY: virado ? 180 : 0 }}
        transition={efeitosLigados ? spring.suave : { duration: 0 }}
        className="grid grid-cols-1 transform-3d"
      >
        {/* Frente */}
        <div className={`${ESTILO_FACE} grid content-start gap-1.5 border-borda bg-superficie p-4`}>
          <span className="rotulo-mono text-destaque">{rotulo}</span>
          <h3 className="text-[1.15rem] leading-tight">{nome}</h3>
          <p className="text-auxiliar text-texto-2">{descricao}</p>
        </div>

        {/* Verso: a foto da peça. Escondido = inert (sem foco e sem leitura). */}
        <div
          inert={!virado}
          className={`${ESTILO_FACE} overflow-hidden border-acao bg-superficie rotate-y-180`}
        >
          {/* O marcador IMAGEM-peça (nome)-AQUI e o alt ficam na lista
              TECNOLOGIAS da página Solução (alt: "Foto da peça: (nome).") */}
          {src ? (
            <img src={src} alt={alt} className="size-full object-cover" />
          ) : (
            <EspacoImagem texto={`Foto da peça: ${nome} (a definir)`} formato="livre" className="rounded-none border-0" />
          )}
        </div>
      </motion.div>

      <motion.button
        type="button"
        aria-pressed={virado}
        onClick={() => setVirado((atual) => !atual)}
        whileTap={{ scale: 0.97 }}
        className={`flex min-h-15 items-center gap-2 rounded-b-cartao border bg-superficie px-4 font-bold text-marca [border-top-style:dashed] focus-visible:-outline-offset-4 ${
          virado ? "border-acao" : "border-borda hover:border-marca"
        }`}
      >
        {/* ICONE-ArrowsClockwise-AQUI */}
        <EspacoIcone nome="ArrowsClockwise" />
        Ver a peça
      </motion.button>
    </li>
  );
}
