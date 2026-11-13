"use client";

import { motion } from "motion/react";
import EspacoIcone from "@/components/ui/EspacoIcone";
import EspacoImagem from "@/components/ui/EspacoImagem";
import { useVideoPulse } from "@/hooks/useVideoPulse";

/*
  VideoPulse — as animações em vídeo da Pulse (seções 19.13 e 19.15).
  A lógica (quando toca, pausa, som, legendas, memória) está no hook
  useVideoPulse; aqui fica só a aparência.

  Arquivos (em public/videos/, colocados pela equipe), a partir de "nome":
  - vídeo: /videos/(nome).mp4
  - quadro parado: /videos/(nome)-quadro-parado.jpg (o "poster", que
    aparece antes de tocar e com os efeitos desligados)
  - legendas (só nos vídeos com som): /videos/(nome)-legendas.vtt

  Dois tipos:
  1. Conteúdo (padrão): caixa 16:9 com o vídeo e, logo abaixo, os botões
     "Pausar"/"Reproduzir" (sempre visível, WCAG 2.2.2) e, nos vídeos com
     som, "Ativar som"/"Desativar som". O texto do botão diz a ação, e o
     ícone troca junto (decisão da equipe na 9.8: sem aria-pressed). O
     vídeo tem nome (aria-labelledby, o título da seção) e descrição
     (aria-describedby, o texto que diz o mesmo que o vídeo, WCAG 1.2.1).
  2. Fundo ("fundo"): só o vídeo, sem botões, com aria-hidden e sem
     foco (capa e "Como funciona"). Quem pausa é o botão "Efeitos" do
     cabeçalho, como na faixa de texto da 9.4.

  Sem o arquivo: no conteúdo, a caixa continua 16:9 e mostra o marcador;
  no fundo, não aparece nada (fica a cor de fundo de quem usa).

  Props: nome, comSom, fundo, ativo, idTitulo, idDescricao, className
  (do contêiner), classeCaixa (da caixa 16:9) e classeControles (da
  linha dos botões).
*/

// Botões da Fase 9: pílula, 48 px, contorno de 2 px
const ESTILO_BOTAO =
  "inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-borda bg-superficie px-4 text-center font-bold text-texto hover:border-marca";

export function caminhosDoVideo(nome) {
  return {
    video: `/videos/${nome}.mp4`,
    quadroParado: `/videos/${nome}-quadro-parado.jpg`,
    legendas: `/videos/${nome}-legendas.vtt`,
  };
}

/*
  ControlesVideo — os botões de um vídeo (ou de um par de gêmeos).
  Texto e ícone mudam com o estado; o leitor de tela ouve a ação
  ("Pausar, botão").
*/
export function ControlesVideo({ tocando, aoAlternarPausa, comSom = false, somLigado = false, aoAlternarSom, className = "" }) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={aoAlternarPausa} className={ESTILO_BOTAO}>
        {tocando ? (
          // ICONE-Pause-AQUI
          <EspacoIcone nome="Pause" />
        ) : (
          // ICONE-Play-AQUI
          <EspacoIcone nome="Play" />
        )}
        {tocando ? "Pausar" : "Reproduzir"}
      </motion.button>
      {comSom && (
        <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={aoAlternarSom} className={ESTILO_BOTAO}>
          {somLigado ? (
            // ICONE-SpeakerSlash-AQUI
            <EspacoIcone nome="SpeakerSlash" />
          ) : (
            // ICONE-SpeakerHigh-AQUI
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

  const elementoVideo = (
    <video
      {...propsVideo(0)}
      src={caminhos.video}
      data-src={caminhos.video}
      poster={caminhos.quadroParado}
      muted
      playsInline
      preload="metadata"
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
          <EspacoImagem texto={`Vídeo ${nome} (a definir)`} formato="livre" className="absolute inset-0" />
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
