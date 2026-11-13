"use client";

import EspacoImagem from "@/components/ui/EspacoImagem";
import VideoPulse from "@/components/ui/VideoPulse";
import { useRolagemFixa } from "@/hooks/useRolagemFixa";
import RotuloSecao from "@/components/layout/RotuloSecao";

/*
  SinaisRolagemFixa — seção "Os sinais" da Solução (seções 18.8 e 18.14).

  Ordem no HTML (é a do leitor de tela, seção 18.15): rótulo, H2 e texto
  → navegação "Sinais" (4 links; o atual com aria-current="step") →
  vídeo do sinal atual (só no modo fixo) → os 4 sinais, cada um num
  <article> com a foto, o H3 e os pares "Modo tátil:"…

  Modo fixo (computador e celular, com os efeitos ligados, janela com
  pelo menos 560 × 340 px — ver useRolagemFixa):
  - o palco fica parado enquanto a pessoa rola, e o sinal muda com a
    rolagem; a foto troca em "piso tátil" e o texto esmaece e sobe;
  - os sinais que não estão ativos ficam transparentes, mas o leitor de
    tela continua lendo os 4, em ordem. Eles não têm nada focável;
  - Fase 9 (19.13, decisão da equipe): o vídeo do sinal atual (com som)
    substitui a pulseira 3D pequena junto do índice, nunca em cima da
    foto. No computador, ocupa a coluna do índice (15rem, 16:9), com
    "Pausar" e "Ativar som" embaixo; no celular, fica pequeno (8rem) ao
    lado dos dois botões empilhados (decisão da equipe na 9.8). Quando o
    sinal muda, o vídeo troca de arquivo; a pausa e o som escolhidos
    continuam. Isso tira uma cena 3D da página.
  Fora do modo fixo: os 4 sinais em lista comum, cada um com a sua foto e,
  depois do texto, o seu vídeo (decisão da equipe na 9.8).
  Cada vídeo tem o nome do H3 do sinal e a descrição dos pares (dl).

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

/*
  VIDEO-animacao-sinal-continuar-AQUI, VIDEO-animacao-sinal-parar-AQUI,
  VIDEO-animacao-sinal-virar-AQUI e VIDEO-animacao-sinal-aguardar-AQUI
  Vídeos: public/videos/animacao-sinal-(chave).mp4 (com som)
  Quadros parados: public/videos/animacao-sinal-(chave)-quadro-parado.jpg
  Legendas: public/videos/animacao-sinal-(chave)-legendas.vtt
*/
function videoDoSinal(sinal) {
  return `animacao-sinal-${sinal.chave}`;
}

export default function SinaisRolagemFixa() {
  const { podeFixar, ativo, refTrilho, refPalco, irPara } = useRolagemFixa(SINAIS.length);
  const sinalAtual = SINAIS[ativo];

  return (
    <section className={`mt-20 ${podeFixar ? "sinais-fixo" : ""}`}>
      <RotuloSecao>Linguagem da Pulse</RotuloSecao>
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
          {/* Índice "Sinais" + vídeo do sinal atual */}
          <div className={podeFixar ? "grid min-w-0 gap-3 min-[62.5rem]:content-center min-[62.5rem]:gap-5" : ""}>
            <nav aria-label="Sinais">
              <ol
                className={
                  podeFixar
                    ? "flex gap-1 overflow-x-auto min-[62.5rem]:grid min-[62.5rem]:overflow-visible"
                    : "flex flex-wrap gap-2"
                }
              >
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
                                atual ? "border-acao text-texto" : "border-borda/45 text-texto-2"
                              }`
                            : "rounded-full border border-borda bg-superficie text-texto"
                        }`}
                      >
                        {sinal.link}
                        {/* Ponto laranja do sinal atual (decorativo) */}
                        {atual && <span aria-hidden="true" className="size-2 rounded-full bg-acao" />}
                      </a>
                    </li>
                  );
                })}
              </ol>
            </nav>

            {podeFixar && (
              <VideoPulse
                nome={videoDoSinal(sinalAtual)}
                comSom
                idTitulo={`titulo-${sinalAtual.id}`}
                idDescricao={`descricao-${sinalAtual.id}`}
                className="grid-cols-[8rem_minmax(0,1fr)] items-center min-[62.5rem]:grid-cols-1"
                classeControles="flex-col items-start min-[62.5rem]:flex-row"
              />
            )}
          </div>

          {/* Os 4 sinais */}
          <div className={podeFixar ? "relative min-h-0" : "grid gap-12"}>
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
                    <h3
                      id={`titulo-${sinal.id}`}
                      className="font-titulo text-[clamp(2.2rem,10vw,3.5rem)] leading-none font-normal text-marca uppercase"
                    >
                      {sinal.titulo}
                    </h3>
                    <dl id={`descricao-${sinal.id}`} className="grid gap-2">
                      {sinal.pares.map(([termo, descricao]) => (
                        <div key={termo} className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                          <dt className="rotulo-mono text-destaque">{termo}</dt>
                          <dd>{descricao}</dd>
                        </div>
                      ))}
                    </dl>
                    {/* Lista comum: cada sinal com o seu vídeo (o marcador
                        e os caminhos estão no comentário acima de
                        videoDoSinal) */}
                    {!podeFixar && (
                      <VideoPulse
                        nome={videoDoSinal(sinal)}
                        comSom
                        idTitulo={`titulo-${sinal.id}`}
                        idDescricao={`descricao-${sinal.id}`}
                        className="mt-2"
                      />
                    )}
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
