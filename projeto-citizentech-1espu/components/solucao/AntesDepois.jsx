"use client";

import { useState } from "react";
import Image from "next/image";
import Cartao from "@/components/ui/Cartao";
import EspacoIcone from "@/components/ui/EspacoIcone";

/*
  AntesDepois — comparação "Sem a Pulse" × "Com a Pulse" (seções 19.7 e
  19.15), dentro da seção "Antes e depois" da Solução. Textos do
  protótipo pulse-efeitos.html.

  Como funciona:
  - As duas animações ficam uma em cima da outra. A de cima ("Com a
    Pulse") é recortada por clip-path a partir da posição da divisória:
    à esquerda da divisória aparece "Sem a Pulse"; à direita, "Com a
    Pulse". (clip-path é uma exceção aprovada no padrão de movimento.)
  - Quem move a divisória é um <input type="range"> de verdade (0 a 100),
    esticado por cima de toda a área e transparente. Assim valem o mouse,
    o dedo e as setas do teclado (PageUp e PageDown pulam 10), sem
    nenhum código de arrasto, e o leitor de tela o reconhece como
    "controle deslizante".
  - A divisória e a alça são o desenho do controle. Com o foco no
    controle, a moldura inteira ganha o contorno de foco de 3 px.
  - Nada se move sozinho: a divisória só anda quando a pessoa mexe. Com os
    efeitos desligados, funciona igual.

  Acessibilidade (19.7):
  - aria-label "Comparar sem a Pulse e com a Pulse";
  - aria-describedby nos dois textos (H3 "Sem a Pulse" e "Com a Pulse");
  - aria-valuetext diz a posição em palavras (texto do protótipo), em vez
    de só "50";
  - as animações são aria-hidden: os textos dizem o mesmo.

  Vídeos: nesta subfase (9.7), cada lado mostra o quadro parado que já
  está em public/videos/. Na 9.8, entram os dois vídeos gêmeos (VideoPulse),
  mudos, que tocam e pausam juntos, com o mesmo currentTime.
*/

// Esta parte é lógica
function textoDaPosicao(posicao) {
  if (posicao <= 5) return "Só com a Pulse";
  if (posicao >= 95) return "Só sem a Pulse";
  return `${posicao}% sem a Pulse, ${100 - posicao}% com a Pulse`;
}

// Etiqueta sobre a animação (cores fixas, porque ficam sobre a imagem nos
// dois temas): grafite #1A1A1D sobre branco (17,4:1) e sobre o laranja
// #FC4C02 (5,1:1).
const ESTILO_ETIQUETA = "rotulo-mono absolute top-3 rounded-full px-2.5 py-1.5 text-[#1A1A1D]";

export default function AntesDepois() {
  // Esta parte é lógica
  const [posicao, setPosicao] = useState(50);

  return (
    <>
      <p className="max-w-texto">
        Arraste a barra, ou use as setas do teclado, para comparar a mesma
        travessia sem e com a Pulse.
      </p>

      <div
        style={{ "--posicao": `${posicao}%` }}
        className="relative aspect-[4/5] w-full max-w-[56rem] touch-pan-y overflow-hidden rounded-[1.5rem] border-2 border-borda bg-[var(--cor-cortina)] min-[32.5rem]:aspect-[16/10] has-[input:focus-visible]:outline-3 has-[input:focus-visible]:outline-offset-3 has-[input:focus-visible]:outline-marca"
      >
        {/* Sem a Pulse (embaixo, inteiro)
            VIDEO-animacao-antes-sem-AQUI
            Vídeo: public/videos/animacao-antes-sem.mp4 (sem som, gêmeo do "com")
            Quadro parado: public/videos/animacao-antes-sem-quadro-parado.jpg */}
        <div aria-hidden="true" className="absolute inset-0">
          <Image
            src="/videos/animacao-antes-sem-quadro-parado.jpg"
            alt=""
            fill
            sizes="(min-width: 56rem) 56rem, 100vw"
            className="object-cover"
          />
          <span className={`${ESTILO_ETIQUETA} left-3 bg-[#FFFFFF]`}>Sem a Pulse</span>
        </div>

        {/* Com a Pulse (em cima, recortado a partir da divisória)
            VIDEO-animacao-antes-com-AQUI
            Vídeo: public/videos/animacao-antes-com.mp4 (sem som, gêmeo do "sem")
            Quadro parado: public/videos/animacao-antes-com-quadro-parado.jpg */}
        <div aria-hidden="true" className="absolute inset-0 [clip-path:inset(0_0_0_var(--posicao))]">
          <Image
            src="/videos/animacao-antes-com-quadro-parado.jpg"
            alt=""
            fill
            sizes="(min-width: 56rem) 56rem, 100vw"
            className="object-cover"
          />
          <span className={`${ESTILO_ETIQUETA} right-3 bg-[#FC4C02]`}>Com a Pulse</span>
        </div>

        {/* Divisória e alça: o desenho do controle (decorativo) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-(--posicao) -ml-0.5 w-1 bg-[#FFFFFF]"
        >
          <span className="absolute top-1/2 left-1/2 grid size-12 -translate-1/2 place-items-center rounded-full border-3 border-[#1A1A1D] bg-[#FFFFFF] text-[#1A1A1D]">
            <span className="flex items-center">
              {/* ICONE-CaretLeft-AQUI */}
              <EspacoIcone nome="CaretLeft" />
              {/* ICONE-CaretRight-AQUI */}
              <EspacoIcone nome="CaretRight" />
            </span>
          </span>
        </div>

        {/* Esta parte é lógica */}
        <input
          type="range"
          min="0"
          max="100"
          value={posicao}
          onChange={(evento) => setPosicao(Number(evento.target.value))}
          aria-label="Comparar sem a Pulse e com a Pulse"
          aria-describedby="antes-depois-textos"
          aria-valuetext={textoDaPosicao(posicao)}
          className="absolute inset-0 m-0 size-full cursor-ew-resize opacity-0"
        />
      </div>

      <div id="antes-depois-textos" className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Cartao compacto className="grid content-start gap-1.5">
          <h3>Sem a Pulse</h3>
          <p className="text-texto-2">
            A pessoa espera o barulho dos carros parar para adivinhar se pode
            atravessar. Muitos semáforos não têm sinal sonoro.
          </p>
        </Cartao>
        <Cartao compacto className="grid content-start gap-1.5">
          <h3>Com a Pulse</h3>
          <p className="text-texto-2">
            A pulseira usa os dados do semáforo: “Aguardar” com três
            vibrações curtas e “Continuar” quando é seguro atravessar.
          </p>
        </Cartao>
      </div>
    </>
  );
}
