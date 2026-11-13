"use client";

import { useState } from "react";
import Pulseira3D from "@/components/pulseira/Pulseira3D";
import EspacoImagem from "@/components/ui/EspacoImagem";
import EspacoIcone from "@/components/ui/EspacoIcone";
import { useRolagemFixa } from "@/hooks/useRolagemFixa";

/*
  SinaisRolagemFixa — seção "Os sinais" da Solução (seções 18.8 e 18.14).

  Ordem no HTML (é a do leitor de tela, seção 18.15): rótulo, H2 e texto
  → navegação "Sinais" (4 links; o atual com aria-current="step") →
  pulseira pequena (decorativa) e "Pausar animação" → os 4 sinais, cada
  um num <article> com a foto, o H3 e os pares "Modo tátil:"…

  Modo fixo (computador e celular, com os efeitos ligados, janela com
  pelo menos 560 × 340 px — ver useRolagemFixa):
  - o palco fica parado enquanto a pessoa rola, e o sinal muda com a
    rolagem; a foto troca em "piso tátil" e o texto esmaece e sobe;
  - os sinais que não estão ativos ficam transparentes, mas o leitor de
    tela continua lendo os 4, em ordem. Eles não têm nada focável;
  - a pulseira pequena (Pulseira3D modo="sinal") fica junto do índice,
    nunca em cima da foto: 76 px no celular, ao lado do botão de pausa;
    132 px no computador, embaixo do índice, com o nome do movimento.
  Fora do modo fixo: os 4 sinais em lista comum, cada um com a sua foto;
  a pulseira pequena e o botão de pausa não aparecem.

  Textos dos sinais: os da seção 6.2.
*/

const SINAIS = [
  {
    chave: "continuar",
    id: "sinal-continuar",
    link: "Continuar",
    titulo: "Continuar",
    pares: [
      ["Modo tátil:", "pressão contínua no pulso até você andar."],
      ["Modo sonoro:", "som grave e curto."],
    ],
    // IMAGEM-sinal continuar-AQUI
    // alt sugerido (seção 18.13): "Pessoa cega com bengala atravessando a faixa de pedestres."
    imagem: "Foto do sinal continuar (a definir)",
  },
  {
    chave: "parar",
    id: "sinal-parar",
    link: "Parar",
    titulo: "Parar",
    pares: [
      ["Modo tátil:", "vibração contínua até você parar."],
      ["Modo sonoro:", "som agudo e contínuo."],
    ],
    // IMAGEM-sinal parar-AQUI
    // alt sugerido (seção 18.13): "Pessoa parada no meio-fio diante do semáforo fechado."
    imagem: "Foto do sinal parar (a definir)",
  },
  {
    chave: "virar",
    id: "sinal-virar",
    link: "Virar",
    titulo: "Virar à esquerda ou à direita",
    pares: [["Nos dois modos:", "vibração no lado correspondente."]],
    // IMAGEM-sinal virar-AQUI
    // alt sugerido (seção 18.13): "Esquina de calçada com piso tátil indicando a curva."
    imagem: "Foto do sinal virar (a definir)",
  },
  {
    chave: "aguardar",
    id: "sinal-aguardar",
    link: "Aguardar",
    titulo: "Aguardar",
    pares: [["Nos dois modos:", "três vibrações curtas, repetidas em intervalos."]],
    // IMAGEM-sinal aguardar-AQUI
    // alt sugerido (seção 18.13): "Pessoa esperando no ponto de ônibus."
    imagem: "Foto do sinal aguardar (a definir)",
  },
];

export default function SinaisRolagemFixa() {
  // Esta parte é lógica
  const { podeFixar, ativo, refTrilho, refPalco, irPara } = useRolagemFixa(SINAIS.length);
  const [pausado, setPausado] = useState(false);
  const [movimento, setMovimento] = useState("");
  const [pulseiraFalhou, setPulseiraFalhou] = useState(false);
  const comPulseira = podeFixar && !pulseiraFalhou;

  // Esta parte é lógica
  function alternarPausa() {
    setPausado((valor) => !valor);
  }

  // Esta parte é lógica
  function aoTrocarSinal(sinal) {
    setMovimento(sinal.movimento);
  }

  // Esta parte é lógica
  function aoFalharPulseira() {
    setPulseiraFalhou(true);
  }

  return (
    <section className={`mt-20 ${podeFixar ? "sinais-fixo" : ""}`}>
      <p className="rotulo-mono text-destaque">Linguagem da Pulse</p>
      <h2 id="os-sinais" tabIndex={-1} className="mt-3 scroll-mt-10">
        Os sinais
      </h2>
      <p className="mt-6 max-w-texto">
        Cada comando tem um sinal próprio. Role a página para passar de um sinal para o outro.
      </p>

      {/* Trilho: no modo fixo, é alto, e o palco fica parado dentro dele */}
      <div
        ref={refTrilho}
        className="mt-8"
        style={podeFixar ? { height: "calc(4 * 85svh + 100svh)" } : undefined}
      >
        <div
          ref={refPalco}
          className={
            podeFixar
              ? "sticky top-[calc(var(--altura-cabecalho)+var(--altura-indice,0px))] grid h-[calc(100svh-var(--altura-cabecalho)-var(--altura-indice,0px))] grid-rows-[auto_minmax(0,1fr)] gap-4 pt-4 pb-[var(--espaco-fim)] min-[62.5rem]:grid-cols-[15rem_minmax(0,1fr)] min-[62.5rem]:grid-rows-1 min-[62.5rem]:gap-10"
              : "grid gap-6"
          }
        >
          {/* Índice "Sinais" + pulseira pequena + pausar */}
          <div
            className={
              podeFixar
                ? "grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2 min-[62.5rem]:grid-cols-1 min-[62.5rem]:content-center min-[62.5rem]:gap-5"
                : ""
            }
          >
            <nav aria-label="Sinais" className={podeFixar ? "col-span-full min-[62.5rem]:col-auto" : ""}>
              <ol
                className={
                  podeFixar
                    ? "flex gap-1 overflow-x-auto min-[62.5rem]:grid min-[62.5rem]:overflow-visible"
                    : "flex flex-wrap gap-2"
                }
              >
                {/* Esta parte é lógica */}
                {SINAIS.map((sinal, indice) => {
                  const atual = podeFixar && indice === ativo;
                  return (
                    <li key={sinal.id} className="shrink-0">
                      <a
                        href={`#${sinal.id}`}
                        aria-current={atual ? "step" : undefined}
                        onClick={(evento) => irPara(indice, evento)}
                        className={`rotulo-mono flex min-h-12 items-center gap-3 px-3 text-[0.9rem] whitespace-nowrap no-underline ${
                          podeFixar
                            ? `border-b-[3px] min-[62.5rem]:border-b-0 min-[62.5rem]:border-l-[3px] ${
                                atual ? "border-ouro text-texto" : "border-borda/45 text-texto-2"
                              }`
                            : "rounded-full border border-borda bg-superficie text-texto"
                        }`}
                      >
                        {sinal.link}
                        {/* Ponto dourado do sinal atual (decorativo) */}
                        {atual && <span aria-hidden="true" className="size-2 rounded-full bg-ouro" />}
                      </a>
                    </li>
                  );
                })}
              </ol>
            </nav>

            {/* Esta parte é lógica */}
            {comPulseira && (
              <>
                <div
                  aria-hidden="true"
                  className="relative size-[76px] rounded-[0.875rem] border border-borda bg-superficie min-[62.5rem]:size-[132px]"
                >
                  <Pulseira3D
                    modo="sinal"
                    sinal={SINAIS[ativo].chave}
                    pausado={pausado}
                    aoTrocarSinal={aoTrocarSinal}
                    aoFalhar={aoFalharPulseira}
                    className="size-full"
                  />
                  {/* Nome do movimento, só no computador (decorativo) */}
                  <span className="rotulo-mono absolute inset-x-0 bottom-1.5 hidden text-center text-[0.62rem] tracking-[0.06em] text-texto-2 min-[62.5rem]:block">
                    {movimento}
                  </span>
                </div>
                <button
                  type="button"
                  aria-pressed={pausado}
                  onClick={alternarPausa}
                  className="inline-flex min-h-12 items-center gap-2 justify-self-start rounded-full border-2 border-borda bg-superficie px-4 font-bold text-texto hover:border-marca"
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
              </>
            )}
          </div>

          {/* Os 4 sinais */}
          <div className={podeFixar ? "relative min-h-0" : "grid gap-12"}>
            {/* Esta parte é lógica */}
            {SINAIS.map((sinal, indice) => {
              const atual = podeFixar && indice === ativo;
              return (
                <article
                  key={sinal.id}
                  id={sinal.id}
                  data-ativo={atual ? "" : undefined}
                  className={
                    podeFixar
                      ? `absolute inset-0 grid grid-rows-[minmax(0,1fr)_auto] gap-4 min-[62.5rem]:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] min-[62.5rem]:grid-rows-1 min-[62.5rem]:items-center min-[62.5rem]:gap-8 ${
                          atual ? "" : "pointer-events-none"
                        }`
                      : "grid gap-4 scroll-mt-4 min-[62.5rem]:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] min-[62.5rem]:items-center min-[62.5rem]:gap-8"
                  }
                >
                  {/* No modo fixo, a foto ocupa a altura toda do palco
                      (no computador, o texto fica centralizado ao lado) */}
                  <div className={`foto-sinal min-h-0 ${podeFixar ? "min-[62.5rem]:self-stretch" : ""}`}>
                    {/* O marcador e o alt de cada foto estão na lista SINAIS, acima */}
                    <EspacoImagem texto={sinal.imagem} formato={podeFixar ? "livre" : "paisagem"} />
                  </div>
                  <div className="texto-sinal grid gap-3">
                    <h3 className="font-titulo text-[clamp(2.2rem,10vw,3.5rem)] leading-none font-normal text-marca uppercase">
                      {sinal.titulo}
                    </h3>
                    <dl className="grid gap-2">
                      {/* Esta parte é lógica */}
                      {sinal.pares.map(([termo, descricao]) => (
                        <div key={termo} className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                          <dt className="rotulo-mono text-destaque">{termo}</dt>
                          <dd>{descricao}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
