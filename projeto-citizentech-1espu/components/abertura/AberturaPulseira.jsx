"use client";

import { useState } from "react";
import Pulseira3D from "@/components/pulseira/Pulseira3D";
import EspacoIcone from "@/components/ui/EspacoIcone";
import { usePrefereMovimentoReduzido } from "@/hooks/usePrefereMovimentoReduzido";
import { SINAIS_DA_ABERTURA } from "@/lib/pulseira3d/sinais";

/*
  AberturaPulseira — abertura do Início (seções 18.6 e 18.14).

  Subfase 8.4: rótulo, H1, resumo, a pulseira 3D no centro, o sinal atual
  e o botão de pausa. A capa, a palavra de fundo e os links "Partes da
  solução" entram na subfase 8.5.

  Leitor de tela: H1 → resumo → pulseira (descrição) → "Pausar animação".
  O nome e a descrição do sinal mudam sozinhos a cada 2,8 s, por isso
  ficam escondidos do leitor de tela (aria-hidden): ele não é
  interrompido, e a descrição da pulseira já explica os sinais.

  Com "reduzir movimento": a pulseira fica parada, o texto do sinal vira
  "Sinais da Pulse" / "Veja cada sinal explicado na página Solução."
  (decisão da equipe) e o botão de pausa some, porque nada se move.

  A mesma legenda parada aparece enquanto a cena 3D não fica pronta, sem
  JavaScript e se o WebGL falhar: nesses casos nada se move, e um botão
  "Pausar animação" sem efeito confundiria.
*/
export default function AberturaPulseira() {
  // Esta parte é lógica
  const [pausado, setPausado] = useState(false);
  const [sinalAtual, setSinalAtual] = useState(SINAIS_DA_ABERTURA[0]);
  const [cenaAnimando, setCenaAnimando] = useState(false);
  const movimentoReduzido = usePrefereMovimentoReduzido();
  const parada = movimentoReduzido || !cenaAnimando;

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

  return (
    <section aria-labelledby="titulo-inicio" className="margem-lateral pt-8 pb-8">
      <div className="mx-auto grid max-w-pagina gap-2">
        <div className="grid justify-items-center gap-3 text-center">
          <p className="rotulo-mono text-destaque">Pulseira de navegação</p>
          <h1 id="titulo-inicio" tabIndex={-1} className="max-w-[18ch] text-h1-abertura">
            Inovação que chega a quem precisa
          </h1>
          <p className="max-w-[46ch] text-texto-2">
            A Pulse é uma pulseira que guia pessoas cegas e com baixa visão pela cidade.
            Conheça o problema que ela resolve.
          </p>
        </div>

        <Pulseira3D
          modo="abertura"
          pausado={pausado}
          aoTrocarSinal={setSinalAtual}
          aoPronta={aoCenaPronta}
          aoFalhar={aoCenaFalhar}
          className="mx-auto aspect-[1/0.92] w-full max-w-[30rem]"
        />

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center">
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
        </div>
      </div>
    </section>
  );
}
