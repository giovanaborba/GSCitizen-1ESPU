"use client";

import EspacoIcone from "@/components/ui/EspacoIcone";
import VideoPulse from "@/components/ui/VideoPulse";
import { useConsultaMidia } from "@/hooks/useConsultaMidia";

/*
  CapaIntro — capa da primeira visita da sessão (seções 18.6 e 18.14).
  Quem decide se ela aparece e quando sai é o hook useCapaIntro (usado
  pela AberturaPulseira, que mostra este componente).

  - A capa inteira tem aria-hidden="true" e nenhum elemento focável: o
    leitor de tela e o teclado vão direto para o site. O primeiro Tab
    (no "Pular para o conteúdo") já tira a capa da frente.
  - Cores fixas, porque a capa é escura nos dois temas (seção 19.3):
    texto #FFFFFF sobre #1A1A1D (17,4:1); laranja #FC4C02 sobre #1A1A1D
    (5,1:1); texto grafite #242428 sobre o laranja (4,55:1).
  - A frase fica sobre uma faixa sólida (seção 18.6).
  - Fundo (19.13): o vídeo da capa, sem som, em loop contínuo, no lugar
    das imagens. Com a tela "em pé" (retrato), o vertical; deitada, o
    horizontal. A escolha é feita só no navegador (a capa nunca vem do
    servidor). Sem o arquivo, fica o fundo escuro. Com os efeitos
    desligados, não há capa (useCapaIntro).
  - Contraste sobre o vídeo (decisão da equipe na 9.8): um véu grafite
    #1A1A1D a 60% cobre o vídeo, e "PULSE" fica com 7,8:1 ou mais (pior
    ponto em 8 momentos do loop, de 375 a 1440 px). O rótulo laranja
    nunca passaria de 4,5:1 sobre o vídeo, então fica numa faixa sólida
    #1A1A1D, como a frase (5,1:1).

  Props: refCapa e saindo (do hook) e aoTocar (clique ou toque: sair).
*/
export default function CapaIntro({ refCapa, saindo, aoTocar }) {
  // Esta parte é lógica
  const retrato = useConsultaMidia("(orientation: portrait)");

  return (
    // O clique só pede a saída; a mesma ação existe pelo teclado (qualquer
    // tecla) e pelo foco, então nada depende só do mouse (seção 18.2).
    <div
      ref={refCapa}
      aria-hidden="true"
      data-saindo={saindo ? "" : undefined}
      onClick={aoTocar}
      className="capa-intro"
    >
      {/* VIDEO-animacao-capa-AQUI e VIDEO-animacao-capa-vertical-AQUI
          (substituem as imagens da capa, 19.14)
          Vídeos: public/videos/animacao-capa.mp4 (1280 × 720) e
                  public/videos/animacao-capa-vertical.mp4 (720 × 1280), sem som
          Quadros parados: public/videos/animacao-capa-quadro-parado.jpg e
                           public/videos/animacao-capa-vertical-quadro-parado.jpg */}
      <VideoPulse
        nome={retrato ? "animacao-capa-vertical" : "animacao-capa"}
        fundo
        className="absolute inset-0"
      />
      {/* Véu sobre o vídeo, para o texto da capa ter contraste */}
      <div className="absolute inset-0 bg-[rgba(26,26,29,0.6)]" />

      {/* O logo "pulsa" uma vez (até 1 s). É código, não imagem (18.13). */}
      <div className="capa-logo absolute inset-0 grid place-items-center efeitos-desligados:hidden">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          stroke="#FC4C02"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-22"
        >
          <circle className="capa-logo-onda" cx="50" cy="50" r="34" strokeWidth="3" />
          <circle cx="50" cy="50" r="34" />
          <path d="M24 52h14l6-14 10 26 6-12h16" />
        </svg>
      </div>

      <div className="capa-conteudo absolute inset-0 grid content-center justify-items-center gap-4 overflow-hidden px-[max(1rem,env(safe-area-inset-left))] py-6 text-center">
        <span className="rotulo-mono rounded-[0.625rem] bg-[#1A1A1D] px-3 py-1.5 text-[#FC4C02]">GS 2026.2 · CitizenTech</span>
        <span className="font-titulo text-[clamp(5.5rem,24vw,17rem)] leading-[0.85] tracking-[0.01em] uppercase">
          Pulse
        </span>
        <span className="max-w-[26ch] rounded-[0.625rem] bg-[#1A1A1D] px-4 py-1.5 text-xl">
          Um guia no pulso para atravessar a cidade.
        </span>
        <span className="mt-4 inline-flex min-h-12 items-center gap-2.5 rounded-full bg-[#FC4C02] px-6 font-bold text-[#242428]">
          {/* ICONE-ArrowDown-AQUI */}
          <EspacoIcone nome="ArrowDown" />
          Toque, role ou aperte uma tecla
        </span>
      </div>
    </div>
  );
}
