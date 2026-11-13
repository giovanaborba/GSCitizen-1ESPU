"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import Pulseira3D from "@/components/pulseira/Pulseira3D";
import CapaIntro from "@/components/abertura/CapaIntro";
import Preloader from "@/components/abertura/Preloader";
import PartesSolucao, { PARTES_DA_SOLUCAO } from "@/components/abertura/PartesSolucao";
import PalavraFundo from "@/components/ui/PalavraFundo";
import EspacoIcone from "@/components/ui/EspacoIcone";
import { useEfeitos } from "@/hooks/useEfeitos";
import { useCapaIntro } from "@/hooks/useCapaIntro";
import { useEncaixe } from "@/hooks/useEncaixe";
import { useLinhasPartes } from "@/hooks/useLinhasPartes";
import { SINAIS_DA_ABERTURA } from "@/lib/pulseira3d/sinais";
import { spring } from "@/lib/presetsMovimento";

/*
  AberturaPulseira — abertura do Início (seções 18.6 e 18.14).

  Ordem no HTML (é a ordem do leitor de tela, seção 18.15):
  H1 → resumo → pulseira (descrição) → "Pausar animação" → "Partes da
  solução, lista, 6 links". A capa e a palavra de fundo são decorativas
  (aria-hidden).

  - Capa (primeira visita da sessão, só com os efeitos ligados):
    enquanto ela está na tela, os títulos e os links ficam escondidos e a
    pulseira espera. Quando a capa sai, eles aparecem com o gesto GUIA
    (opacidade e subida de 12 px, mola padrão, na ordem de leitura) e a
    pulseira entra.
  - Palavra de fundo: acompanha o sinal (Esquerda, Direita, Aguardar,
    Parar, Continuar). Com a pulseira parada, fica "Pulse".
  - Textura de piso tátil só atrás da pulseira, apagando-se nas bordas
    (decisão da equipe, opção B): nenhum texto fica sobre os domos.
  - Computador (≥ 1000 px): pulseira no centro, 3 links de cada lado e
    linhas tracejadas ligando cada link à sua parte.

  Com os efeitos desligados (interruptor "Efeitos", seção 19.2): pulseira
  parada, legenda "Sinais da Pulse" / "Veja cada sinal explicado na
  página Solução." (decisão da equipe), sem botão de pausa, sem capa,
  linhas paradas. Ligar ou desligar vale na hora. A mesma
  legenda parada aparece enquanto a cena 3D não fica pronta, sem
  JavaScript e se o WebGL falhar: nesses casos nada se move, e um botão
  "Pausar animação" sem efeito confundiria.
*/
export default function AberturaPulseira() {
  // Esta parte é lógica
  const [pausado, setPausado] = useState(false);
  const [sinalAtual, setSinalAtual] = useState(SINAIS_DA_ABERTURA[0]);
  const [cenaAnimando, setCenaAnimando] = useState(false);
  const [parteAtiva, setParteAtiva] = useState(null);
  const { efeitosLigados } = useEfeitos();
  const capa = useCapaIntro();
  const { refPalco, refSvg, registrarNo, aoDesenhar } = useLinhasPartes(parteAtiva);
  const parada = !efeitosLigados || !cenaAnimando;
  // Rolagem com encaixe na Início (seção 19.6): a abertura, o Tema e
  // "Quem vive o problema" têm data-encaixe.
  useEncaixe();

  // Esta parte é lógica
  function alternarPausa() {
    setPausado((valor) => !valor);
  }

  // Esta parte é lógica
  function aoCenaPronta() {
    setCenaAnimando(true);
  }

  // Esta parte é lógica
  function aoCenaFalhar() {
    setCenaAnimando(false);
  }

  // Esta parte é lógica
  // Revelação depois da capa (Motion, gesto GUIA do padrão de movimento):
  // escondido enquanto a capa está na tela; ao sair, aparece com
  // opacidade e subida de 12 px, com a mola padrão. Os 3 grupos entram na
  // ordem de leitura, com 60 ms entre eles.
  // "initial: false": na primeira pintura (e sem JavaScript), o texto já
  // aparece no lugar, sem animação.
  function revelacao(atraso = 0) {
    if (capa.capaNaTela) {
      return { initial: false, animate: { opacity: 0, y: 12 }, transition: { duration: 0 } };
    }
    return {
      initial: false,
      animate: { opacity: 1, y: 0 },
      transition: { ...spring.padrao, delay: atraso },
    };
  }

  // Esta parte é lógica
  const palavra = parada || capa.capaNaTela ? "Pulse" : sinalAtual.palavra;

  return (
    // overflow-x-clip: a palavra de fundo tem a largura da tela; o que
    // passar é cortado, sem criar rolagem lateral.
    <section
      aria-labelledby="titulo-inicio"
      data-encaixe=""
      className="relative overflow-x-clip margem-lateral pt-8 pb-10"
    >
      {/* Esta parte é lógica */}
      {/* Capa e preloader são desenhados direto no <body> (portal): com o
          rodapé revelado (19.6), o <main> ganha uma camada própria, e
          eles ficariam atrás do cabeçalho. Só existem no navegador, depois
          da hidratação, então o document.body já existe. */}
      {capa.capaNaTela &&
        createPortal(
          <>
            <CapaIntro refCapa={capa.refCapa} saindo={capa.saindo} aoTocar={capa.sair} />
            {capa.preloaderNaTela && (
              <Preloader
                refPreloader={capa.refPreloader}
                refContador={capa.refContador}
                aoTocar={capa.sair}
              />
            )}
          </>,
          document.body,
        )}

      <div className="relative mx-auto grid max-w-pagina gap-2">
        <motion.div {...revelacao()} className="grid justify-items-center gap-3 text-center">
          <p className="rotulo-mono text-destaque">Pulseira de navegação</p>
          <h1 id="titulo-inicio" tabIndex={-1} className="max-w-[18ch] text-h1-abertura">
            Inovação que chega a quem precisa
          </h1>
          <p className="max-w-[46ch] text-texto-2">
            A Pulse é uma pulseira que guia pessoas cegas e com baixa visão pela cidade.
            Conheça o problema que ela resolve.
          </p>
        </motion.div>

        {/* Palco: pulseira, sinal atual, links e linhas */}
        <div
          ref={refPalco}
          className="relative mt-2 abertura-larga:grid abertura-larga:grid-cols-[minmax(0,1fr)_minmax(0,32rem)_minmax(0,1fr)] abertura-larga:grid-rows-[auto_auto_auto_auto] abertura-larga:items-center abertura-larga:gap-x-6 abertura-larga:gap-y-8"
        >
          {/* Linhas tracejadas (só no computador). O hook escreve os
              caminhos a cada quadro. */}
          <svg
            ref={refSvg}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden size-full overflow-visible abertura-larga:block"
          >
            {/* Esta parte é lógica */}
            {PARTES_DA_SOLUCAO.map((item) => (
              <g key={item.parte}>
                <path
                  data-linha={item.parte}
                  className="fill-none stroke-destaque opacity-55 [stroke-dasharray:3_7] [stroke-width:1.6] [&.ativa]:opacity-100 [&.ativa]:[stroke-width:2.4]"
                />
                <circle data-ponto={item.parte} r="4" className="fill-destaque" />
              </g>
            ))}
          </svg>

          <div className="relative abertura-larga:col-start-2 abertura-larga:row-span-3 abertura-larga:row-start-1">
            {/* Camadas, de trás para a frente (seção 19.5): textura →
                palavra de fundo → pulseira. A palavra fica na frente da
                textura, nunca atrás dela (a textura tem fundo e a
                cobriria). */}
            {/* Textura de piso tátil só atrás da pulseira (decorativa) */}
            <div aria-hidden="true" className="textura-piso textura-centro absolute -inset-6" />
            {/* Palavra de fundo: com a altura da pulseira (nunca desce até
                a linha do sinal, que fica abaixo) e a largura da tela.
                Contraste dos textos dos links que passam por cima dela
                recalculado na 9.3 (registro de desenvolvimento). */}
            <PalavraFundo
              texto={palavra}
              animarTroca
              className="inset-y-0 left-1/2 w-screen -translate-x-1/2"
            />
            <Pulseira3D
              modo="abertura"
              pausado={pausado}
              parteAtiva={parteAtiva}
              aguardarEntrada={capa.capaNaTela}
              aoTrocarSinal={setSinalAtual}
              aoDesenhar={aoDesenhar}
              aoPronta={aoCenaPronta}
              aoFalhar={aoCenaFalhar}
              className="mx-auto aspect-[1/0.92] w-full max-w-[30rem]"
            />
          </div>

          <motion.div
            {...revelacao(0.06)}
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center abertura-larga:col-start-2 abertura-larga:row-start-4"
          >
            {/* Esta parte é lógica */}
            <span aria-hidden="true" className="rotulo-mono text-destaque">
              {parada ? "Sinais da Pulse" : `Sinal · ${sinalAtual.nome}`}
            </span>
            <span aria-hidden="true" className="text-auxiliar text-texto-2">
              {parada ? "Veja cada sinal explicado na página Solução." : sinalAtual.descricao}
            </span>
            {/* Esta parte é lógica */}
            {!parada && (
              <button
                type="button"
                aria-pressed={pausado}
                onClick={alternarPausa}
                className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-borda bg-superficie px-5 font-bold text-texto hover:border-marca"
              >
                {/* Esta parte é lógica */}
                {pausado ? (
                  // ICONE-Play-AQUI
                  <EspacoIcone nome="Play" />
                ) : (
                  // ICONE-Pause-AQUI
                  <EspacoIcone nome="Pause" />
                )}
                <span>{pausado ? "Retomar animação" : "Pausar animação"}</span>
              </button>
            )}
          </motion.div>

          <PartesSolucao
            parteAtiva={parteAtiva}
            aoMudarParte={setParteAtiva}
            registrarNo={registrarNo}
            animacao={revelacao(0.12)}
          />
        </div>
      </div>
    </section>
  );
}
