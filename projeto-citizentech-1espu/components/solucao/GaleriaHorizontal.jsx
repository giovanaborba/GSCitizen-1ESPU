"use client";

import EspacoImagem from "@/components/ui/EspacoImagem";
import { useGaleriaHorizontal } from "@/hooks/useGaleriaHorizontal";

/*
  GaleriaHorizontal — seção "Galeria" da Solução (seções 18.8 e 18.14).

  - Rótulo "A cidade", H2 "Galeria", texto e uma lista de 6 <figure>, cada
    uma com a foto (marcador e alt) e a legenda (<figcaption>).
  - Computador (≥ 900 × 600 px, com os efeitos ligados): o palco fica
    parado e a lista anda para a esquerda conforme a rolagem (ver
    useGaleriaHorizontal). Fotos de 16 a 24rem; as pares, 64 px mais
    baixas. A galeria usa a tela inteira.
  - Celular, zoom alto ou efeitos desligados: grade comum.

  Quando as fotos entrarem: troque cada EspacoImagem por <Image> (ou
  <img>) com o alt da lista abaixo (seção 13.2).
*/

const FOTOS = [
  {
    // IMAGEM-galeria faixa de pedestres-AQUI
    // alt sugerido: "Faixa de pedestres numa avenida movimentada."
    reserva: "Foto: faixa de pedestres (a definir)",
    legenda: "Travessias sem sinal sonoro",
  },
  {
    // IMAGEM-galeria calçada com obstáculo-AQUI
    // alt sugerido: "Calçada com piso tátil interrompido por um poste."
    reserva: "Foto: calçada com obstáculo (a definir)",
    legenda: "Calçadas com obstáculos",
  },
  {
    // IMAGEM-galeria semáforo de pedestres-AQUI
    // alt sugerido: "Semáforo de pedestres com botão de acionamento."
    reserva: "Foto: semáforo de pedestres (a definir)",
    legenda: "Semáforos de pedestres",
  },
  {
    // IMAGEM-galeria ponto de ônibus-AQUI
    // alt sugerido: "Pessoa esperando o ônibus no ponto."
    reserva: "Foto: ponto de ônibus (a definir)",
    legenda: "Embarque no transporte",
  },
  {
    // IMAGEM-galeria plataforma do metrô-AQUI
    // alt sugerido: "Plataforma do metrô com piso tátil na borda."
    reserva: "Foto: plataforma do metrô (a definir)",
    legenda: "Plataformas de metrô e trem",
  },
  {
    // IMAGEM-galeria esquina com rampa-AQUI
    // alt sugerido: "Esquina com rampa de acesso e piso tátil."
    reserva: "Foto: esquina com rampa (a definir)",
    legenda: "Esquinas e rampas",
  },
];

export default function GaleriaHorizontal() {
  // Esta parte é lógica
  const { horizontal, refTrilho, refPalco, refLista } = useGaleriaHorizontal();

  return (
    <section className="mt-20">
      <p className="rotulo-mono text-destaque">A cidade</p>
      <h2 id="galeria" tabIndex={-1} className="mt-3 scroll-mt-10">
        Galeria
      </h2>
      <p className="mt-6 max-w-texto">
        Onde a Pulse faz diferença: calçadas, travessias e transporte público.
      </p>

      {/* No modo horizontal, o trilho usa a tela inteira (de borda a borda) */}
      <div ref={refTrilho} className={horizontal ? "relative left-1/2 mt-8 w-screen -translate-x-1/2" : "mt-8"}>
        <div
          ref={refPalco}
          className={
            horizontal
              ? "sticky top-[calc(var(--altura-cabecalho)+var(--altura-indice,0px))] grid h-[calc(100svh-var(--altura-cabecalho)-var(--altura-indice,0px))] content-center overflow-hidden pb-[var(--espaco-fim)]"
              : ""
          }
        >
          <ul
            ref={refLista}
            className={
              horizontal
                ? "flex w-max gap-6 px-[max(1rem,calc((100vw-76rem)/2+1rem))] [&>li]:w-[clamp(16rem,26vw,24rem)] [&>li:nth-child(even)]:mt-16"
                : "grid grid-cols-[repeat(auto-fill,minmax(min(100%,16rem),1fr))] gap-4"
            }
          >
            {/* Esta parte é lógica */}
            {FOTOS.map((foto) => (
              <li key={foto.legenda}>
                <figure className="grid gap-2">
                  {/* O marcador e o alt de cada foto estão na lista FOTOS, acima */}
                  <EspacoImagem texto={foto.reserva} formato="retrato" />
                  <figcaption className="text-auxiliar text-texto-2">{foto.legenda}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
