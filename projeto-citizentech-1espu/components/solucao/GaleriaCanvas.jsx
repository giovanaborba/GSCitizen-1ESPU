"use client";

import { motion } from "motion/react";
import RotuloSecao from "@/components/layout/RotuloSecao";
import EspacoIcone from "@/components/ui/EspacoIcone";
import EspacoImagem from "@/components/ui/EspacoImagem";
import FotoFiltro from "@/components/ui/FotoFiltro";
import { useGaleriaCanvas } from "@/hooks/useGaleriaCanvas";

/*
  GaleriaCanvas — seção "Galeria" da Solução (seções 18.8, 19.9 e 19.15).
  Substitui a GaleriaHorizontal.

  - Rótulo "A cidade", H2 "Galeria", texto e as 6 fotos, cada uma numa
    <figure> com a foto (marcador e alt) e a legenda (<figcaption>, 18.13).
  - Computador (≥ 64rem e 600 px de altura, efeitos ligados): as fotos
    ficam espalhadas num plano maior que a janela (useGaleriaCanvas).
    - A janela é uma região ("Galeria para explorar") que recebe o foco
      pelo Tab, com a instrução visível ligada por aria-describedby.
    - O grupo "Mover a galeria" tem 5 botões com ícone e texto (WCAG 2.5.7).
    - Cada foto recebe o foco pelo Tab; com o foco, o plano a leva para o
      meio da janela (nada invisível fica com o foco).
  - Celular, zoom alto ou efeitos desligados: grade comum de fotos, sem
    os botões e sem foco nas fotos.
  - Filtro nas fotos (19.6): FotoFiltro (cinza com pontilhado de domos;
    cor e zoom com o mouse ou o foco). Só vale quando a foto entrar.

  Fotos: 4:3, como no protótipo. Quando entrarem, troque cada
  EspacoImagem por <Image> (next/image) ou <img> com o alt da lista FOTOS.
*/

// x e y: onde cada foto fica no plano de 2400 × 1500 px (protótipo)
const FOTOS = [
  {
    // IMAGEM-galeria faixa de pedestres-AQUI
    // alt sugerido: "Faixa de pedestres numa avenida movimentada."
    reserva: "Foto: faixa de pedestres (a definir)",
    legenda: "Travessias sem sinal sonoro",
    x: 140,
    y: 120,
  },
  {
    // IMAGEM-galeria calçada com obstáculo-AQUI
    // alt sugerido: "Calçada com piso tátil interrompido por um poste."
    reserva: "Foto: calçada com obstáculo (a definir)",
    legenda: "Calçadas com obstáculos",
    x: 620,
    y: 330,
  },
  {
    // IMAGEM-galeria semáforo de pedestres-AQUI
    // alt sugerido: "Semáforo de pedestres com botão de acionamento."
    reserva: "Foto: semáforo de pedestres (a definir)",
    legenda: "Semáforos de pedestres",
    x: 1080,
    y: 90,
  },
  {
    // IMAGEM-galeria ponto de ônibus-AQUI
    // alt sugerido: "Pessoa esperando o ônibus no ponto."
    reserva: "Foto: ponto de ônibus (a definir)",
    legenda: "Embarque no transporte",
    x: 1540,
    y: 380,
  },
  {
    // IMAGEM-galeria plataforma do metrô-AQUI
    // alt sugerido: "Plataforma do metrô com piso tátil na borda."
    reserva: "Foto: plataforma do metrô (a definir)",
    legenda: "Plataformas de metrô e trem",
    x: 360,
    y: 800,
  },
  {
    // IMAGEM-galeria esquina com rampa-AQUI
    // alt sugerido: "Esquina com rampa de acesso e piso tátil."
    reserva: "Foto: esquina com rampa (a definir)",
    legenda: "Esquinas e rampas",
    x: 1220,
    y: 860,
  },
];

// Botões da Fase 9 (como os da pulseira): pílula, 48 px, contorno de 2 px
const ESTILO_BOTAO =
  "inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-borda bg-superficie px-4 text-center font-bold text-texto hover:border-marca";

// Foto (o marcador e o alt estão na lista FOTOS) e legenda
function ConteudoFoto({ foto }) {
  return (
    <>
      <FotoFiltro className="aspect-[4/3]">
        <EspacoImagem texto={foto.reserva} formato="livre" />
      </FotoFiltro>
      <figcaption className="mx-1 text-auxiliar text-texto-2">{foto.legenda}</figcaption>
    </>
  );
}

export default function GaleriaCanvas() {
  // Esta parte é lógica
  const { modoCanvas, x, y, arrastando, refJanela, eventosJanela, mover, centralizar, aoFocarFoto } =
    useGaleriaCanvas();

  return (
    <section className="mt-20">
      <RotuloSecao>A cidade</RotuloSecao>
      <h2 id="galeria" tabIndex={-1} className="mt-3 scroll-mt-10">
        Galeria
      </h2>
      <p className="mt-6 max-w-texto">
        Onde a Pulse faz diferença: calçadas, travessias e transporte público.
      </p>

      {/* Esta parte é lógica */}
      {modoCanvas ? (
        <div className="mt-8 grid gap-3">
          <p id="instrucao-galeria" className="text-auxiliar text-texto-2">
            Arraste a área para explorar as fotos. Pelo teclado, entre na área
            com Tab e use as setas.
          </p>

          {/* A janela: área que recebe o foco (as setas movem o plano) */}
          <div
            ref={refJanela}
            role="region"
            aria-label="Galeria para explorar"
            aria-describedby="instrucao-galeria"
            tabIndex={0}
            {...eventosJanela}
            className={`textura-piso relative h-[min(72svh,44rem)] touch-pan-y overflow-hidden rounded-[1.5rem] border-2 border-borda select-none ${
              arrastando ? "cursor-grabbing" : "cursor-grab"
            }`}
          >
            <motion.ul
              style={{ x, y }}
              className="absolute top-0 left-0 h-[1500px] w-[2400px]"
            >
              {/* Esta parte é lógica */}
              {FOTOS.map((foto) => (
                <li key={foto.legenda} style={{ left: foto.x, top: foto.y }} className="absolute w-[300px]">
                  {/* Recebe o foco pelo Tab: o plano a leva para o meio */}
                  <figure
                    tabIndex={0}
                    onFocus={aoFocarFoto}
                    className="grid gap-2 rounded-cartao border border-borda bg-superficie p-2.5 shadow-cartao"
                  >
                    <ConteudoFoto foto={foto} />
                  </figure>
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Alternativas ao arrasto (WCAG 2.5.7) */}
          <div role="group" aria-label="Mover a galeria" className="flex flex-wrap gap-2">
            <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={() => mover(-1, 0)} className={ESTILO_BOTAO}>
              {/* ICONE-ArrowLeft-AQUI */}
              <EspacoIcone nome="ArrowLeft" />
              Esquerda
            </motion.button>
            <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={() => mover(0, -1)} className={ESTILO_BOTAO}>
              {/* ICONE-ArrowUp-AQUI */}
              <EspacoIcone nome="ArrowUp" />
              Cima
            </motion.button>
            <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={() => mover(0, 1)} className={ESTILO_BOTAO}>
              {/* ICONE-ArrowDown-AQUI */}
              <EspacoIcone nome="ArrowDown" />
              Baixo
            </motion.button>
            <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={() => mover(1, 0)} className={ESTILO_BOTAO}>
              {/* ICONE-ArrowRight-AQUI */}
              <EspacoIcone nome="ArrowRight" />
              Direita
            </motion.button>
            <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={centralizar} className={ESTILO_BOTAO}>
              {/* ICONE-ArrowsOutCardinal-AQUI */}
              <EspacoIcone nome="ArrowsOutCardinal" />
              Centralizar
            </motion.button>
          </div>
        </div>
      ) : (
        <ul className="mt-8 grid grid-cols-[repeat(auto-fill,minmax(min(100%,15rem),1fr))] gap-4">
          {/* Esta parte é lógica */}
          {FOTOS.map((foto) => (
            <li key={foto.legenda}>
              <figure className="grid gap-2">
                <ConteudoFoto foto={foto} />
              </figure>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
