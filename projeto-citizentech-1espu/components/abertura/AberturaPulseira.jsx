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
import IconeAlternado from "@/components/ui/IconeAlternado";
import { useEfeitos } from "@/hooks/useEfeitos";
import { useCapaIntro } from "@/hooks/useCapaIntro";
import { useEncaixe } from "@/hooks/useEncaixe";
import { useGiroPulseira } from "@/hooks/useGiroPulseira";
import { useLinhasPartes } from "@/hooks/useLinhasPartes";
import { SINAIS_DA_ABERTURA } from "@/lib/pulseira3d/sinais";
import { spring } from "@/lib/presetsMovimento";

/*
  AberturaPulseira — abertura do Início (seções 18.6 e 18.14).

  Ordem no HTML (é a ordem do leitor de tela, seções 18.15 e 19.16):
  H1 → resumo → "Pulseira Pulse em 3D" (palco com a descrição) → grupo
  "Girar a pulseira" → "Partes da solução, lista, 6 links". A capa e a
  palavra de fundo são decorativas (aria-hidden).

  Pulseira nova (seção 19.12, modo "abertura"): gira sozinha devagar,
  passa pelos 5 sinais e escreve P-U-L-S-E na célula Braille. Ela também
  gira arrastando, pelas setas do teclado (com o foco no palco) e pelos
  botões "Girar para a esquerda" e "Girar para a direita". O botão
  "Girar sozinha" (aria-pressed; texto fixo, só o ícone troca) para o
  giro E a passagem dos sinais e do Braille (WCAG 2.2.2; decisão da 9.0):
  o sinal da vez fica aceso e parado. Os 6 links continuam ligados às
  partes equivalentes do modelo novo (zonas de vibração e fecho).

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
  parada na vista da frente, legenda "Sinais da Pulse" / "Veja cada sinal
  explicado na página Solução." (decisão da equipe), sem "Girar sozinha",
  sem capa, linhas paradas. "Girar para a esquerda/direita" e as setas
  continuam girando, sem animação. Ligar ou desligar vale na hora.
  Enquanto a cena 3D não fica pronta, sem JavaScript e se o WebGL falhar:
  a mesma legenda parada e nenhum botão de giro (não há o que girar).
*/

// Botões de giro (protótipo): pílula de 48 px, contorno de 2 px
const ESTILO_BOTAO_GIRO =
  "inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-borda bg-superficie px-4 font-bold text-texto hover:border-marca";
export default function AberturaPulseira() {
  const [sinalAtual, setSinalAtual] = useState(SINAIS_DA_ABERTURA[0]);
  const [cenaPronta, setCenaPronta] = useState(false);
  const [parteAtiva, setParteAtiva] = useState(null);
  const { efeitosLigados } = useEfeitos();
  const capa = useCapaIntro();
  const giro = useGiroPulseira();
  const { refPalco, refSvg, registrarNo, aoDesenhar } = useLinhasPartes(parteAtiva);
  const parada = !efeitosLigados || !cenaPronta;
  // Rolagem com encaixe na Início (seção 19.6): a abertura, o Tema e
  // "Quem vive o problema" têm data-encaixe.
  useEncaixe();

  function aoCenaPronta() {
    setCenaPronta(true);
  }

  function aoCenaFalhar() {
    setCenaPronta(false);
  }

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

  const palavra = parada || capa.capaNaTela ? "Pulse" : sinalAtual.palavra;

  return (
    // overflow-x-clip: a palavra de fundo tem a largura da tela; o que
    // passar é cortado, sem criar rolagem lateral.
    <section
      aria-labelledby="titulo-inicio"
      data-encaixe=""
      className="relative overflow-x-clip margem-lateral pt-8 pb-10"
    >
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
              giro={giro}
              parteAtiva={parteAtiva}
              aguardarEntrada={capa.capaNaTela}
              adiar={capa.preloaderNaTela}
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
            <span aria-hidden="true" className="rotulo-mono text-destaque">
              {parada ? "Sinais da Pulse" : `Sinal · ${sinalAtual.nome}`}
            </span>
            <span aria-hidden="true" className="text-auxiliar text-texto-2">
              {parada ? "Veja cada sinal explicado na página Solução." : sinalAtual.descricao}
            </span>
            {/* Botões de giro: só com a cena pronta (sem cena, não há o
                que girar). Com os efeitos desligados, giram sem animação,
                e "Girar sozinha" some (nada se move sozinho). */}
            {cenaPronta && (
              <div role="group" aria-label="Girar a pulseira" className="flex flex-wrap justify-center gap-2">
                <button type="button" onClick={() => giro.girar(-45)} className={ESTILO_BOTAO_GIRO}>
                  {/* ICONE-ArrowCounterClockwise-AQUI */}
                  <EspacoIcone nome="ArrowCounterClockwise" />
                  Girar para a esquerda
                </button>
                <button type="button" onClick={() => giro.girar(45)} className={ESTILO_BOTAO_GIRO}>
                  {/* ICONE-ArrowClockwise-AQUI */}
                  <EspacoIcone nome="ArrowClockwise" />
                  Girar para a direita
                </button>
                {efeitosLigados && (
                  <button
                    type="button"
                    aria-pressed={giro.girando}
                    onClick={giro.alternarGiro}
                    className={ESTILO_BOTAO_GIRO}
                  >
                    <IconeAlternado chave={giro.girando ? "pausar" : "girar"}>
                      {giro.girando ? (
                        // ICONE-Pause-AQUI
                        <EspacoIcone nome="Pause" />
                      ) : (
                        // ICONE-Play-AQUI
                        <EspacoIcone nome="Play" />
                      )}
                    </IconeAlternado>
                    Girar sozinha
                  </button>
                )}
              </div>
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
