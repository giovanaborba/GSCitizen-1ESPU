"use client";

import { useState } from "react";
import { motion } from "motion/react";
import EspacoIcone from "@/components/ui/EspacoIcone";
import IconeAlternado from "@/components/ui/IconeAlternado";
import { useVideoPulse } from "@/hooks/useVideoPulse";
import { ESTILO_BOTAO_CONTROLE } from "@/lib/estilos";

// Regra: "Pausar" sempre visível (WCAG 2.2.2); o texto do botão diz a ação, sem
// aria-pressed (decisão da 9.8).

export function caminhosDoVideo(nome) {
  return {
    video: `/videos/${nome}.mp4`,
    quadroParado: `/videos/${nome}-quadro-parado.jpg`,
    legendas: `/videos/${nome}-legendas.vtt`,
  };
}

// Se o vídeo falhar, fica o quadro parado; sem ele, "Vídeo indisponível.". aria-hidden:
// o texto da seção já descreve o vídeo (WCAG 1.2.1).
export function ReservaVideo({ quadroParado, className = "" }) {
  const [semQuadro, setSemQuadro] = useState(false);

  return (
    <div aria-hidden="true" className={`size-full ${className}`}>
      {semQuadro ? (
        <p className="grid size-full place-items-center bg-superficie p-6 text-center text-auxiliar text-texto-2">
          Vídeo indisponível.
        </p>
      ) : (
        <img
          src={quadroParado}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setSemQuadro(true)}
          className="size-full object-cover"
        />
      )}
    </div>
  );
}

export function ControlesVideo({ tocando, aoAlternarPausa, comSom = false, somLigado = false, aoAlternarSom, className = "" }) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={aoAlternarPausa} className={ESTILO_BOTAO_CONTROLE}>
        <IconeAlternado chave={tocando ? "pausar" : "reproduzir"}>
          {tocando ? (
            <EspacoIcone nome="Pause" />
          ) : (
            <EspacoIcone nome="Play" />
          )}
        </IconeAlternado>
        {tocando ? "Pausar" : "Reproduzir"}
      </motion.button>
      {comSom && (
        <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={aoAlternarSom} className={ESTILO_BOTAO_CONTROLE}>
          {somLigado ? (
            <EspacoIcone nome="SpeakerSlash" />
          ) : (
            <EspacoIcone nome="SpeakerHigh" />
          )}
          {somLigado ? "Desativar som" : "Ativar som"}
        </motion.button>
      )}
    </div>
  );
}

export default function VideoPulse({
  nome,
  comSom = false,
  fundo = false,
  ativo = true,
  idTitulo,
  idDescricao,
  className = "",
  classeCaixa = "",
  classeControles = "",
}) {
  const { refContainer, propsVideo, tocando, somLigado, falhou, alternarPausa, alternarSom } = useVideoPulse({
    ativo,
    chave: nome,
  });
  const caminhos = caminhosDoVideo(nome);

  // preload="none": a Solução tem 12 vídeos, e só os metadados já somavam cerca de
  // 0,9 MB ao abrir. O quadro parado (poster) aparece até o vídeo tocar.
  const elementoVideo = (
    <video
      {...propsVideo(0)}
      src={caminhos.video}
      data-src={caminhos.video}
      poster={caminhos.quadroParado}
      muted
      playsInline
      preload="none"
      aria-labelledby={fundo ? undefined : idTitulo}
      aria-describedby={fundo ? undefined : idDescricao}
      className="size-full object-cover"
    >
      {comSom && <track kind="captions" srcLang="pt-BR" label="Português" src={caminhos.legendas} />}
    </video>
  );

  if (fundo) {
    return (
      <div ref={refContainer} aria-hidden="true" className={className}>
        {!falhou && elementoVideo}
      </div>
    );
  }

  return (
    <div ref={refContainer} className={`grid gap-3 ${className}`}>
      <div className={`relative aspect-video overflow-hidden rounded-cartao bg-[var(--cor-cortina)] ${classeCaixa}`}>
        {falhou ? (
          <ReservaVideo quadroParado={caminhos.quadroParado} className="absolute inset-0" />
        ) : (
          elementoVideo
        )}
      </div>
      {!falhou && (
        <ControlesVideo
          tocando={tocando}
          aoAlternarPausa={alternarPausa}
          comSom={comSom}
          somLigado={somLigado}
          aoAlternarSom={alternarSom}
          className={classeControles}
        />
      )}
    </div>
  );
}
