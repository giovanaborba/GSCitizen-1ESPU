"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

/*
  Pulseira3D — a pulseira Pulse em 3D (seções 18.7 e 18.14). A pulseira é
  código (Three.js), não imagem.

  Props:
  - modo: "abertura" (Início: os 5 sinais em sequência), "sinal" (Solução,
    "Os sinais": repete um sinal) ou "parar" (404: vibra até 4,6 s e para);
  - sinal: no modo "sinal", "continuar" | "parar" | "virar" | "aguardar";
  - pausado: vem do botão "Pausar animação" de quem usa;
  - parteAtiva: parte que acende (links da abertura);
  - aguardarEntrada: a abertura espera a capa sair;
  - aoTrocarSinal(sinal): avisa qual sinal está passando;
  - aoDesenhar(projetar): a cada quadro, para as linhas da abertura;
  - aoPronta(): o primeiro quadro foi desenhado;
  - aoFalhar(): o WebGL não existe ou falhou (aparece a descrição);
  - className: tamanho e posição da caixa (quem usa decide).

  Carregamento e reserva:
  - A cena é carregada com next/dynamic e ssr: false. Enquanto carrega, e
    se o WebGL falhar, aparece a descrição em texto. Sem JavaScript, a
    descrição fica no lugar da pulseira (seção 18.2, item 4).
  - No modo "sinal" (pulseira pequena, de 76 ou 132 px), não cabe texto:
    a reserva fica vazia e quem usa esconde a caixa se ela falhar.
*/

export const DESCRICAO_DA_PULSEIRA =
  "Pulseira Pulse em 3D: uma tira laranja de silicone com um módulo laranja-escuro em forma de pílula na frente. No módulo há um botão grafite grande, para dizer o destino, e um menor, para trocar o modo. Dos lados do módulo ficam os motores que vibram para indicar o lado da conversão.";

// Esta parte é lógica
const CenaPulseira = dynamic(() => import("@/components/pulseira/CenaPulseira"), {
  ssr: false,
  loading: () => null,
});

export default function Pulseira3D({
  modo = "abertura",
  sinal,
  pausado = false,
  parteAtiva = null,
  aguardarEntrada = false,
  aoTrocarSinal,
  aoDesenhar,
  aoPronta,
  aoFalhar,
  className = "",
}) {
  const [pronta, setPronta] = useState(false);
  const [falhou, setFalhou] = useState(false);

  // Esta parte é lógica
  function aoFicarPronta() {
    setPronta(true);
    aoPronta?.();
  }

  // Esta parte é lógica
  function aoFalharCena() {
    setFalhou(true);
    aoFalhar?.();
  }

  const mostrarReserva = (!pronta || falhou) && modo !== "sinal";

  return (
    <div className={`relative ${className}`}>
      {/* Esta parte é lógica */}
      {!falhou && (
        <CenaPulseira
          modo={modo}
          descricao={DESCRICAO_DA_PULSEIRA}
          pronta={pronta}
          sinal={sinal}
          pausado={pausado}
          parteAtiva={parteAtiva}
          aguardarEntrada={aguardarEntrada}
          aoTrocarSinal={aoTrocarSinal}
          aoDesenhar={aoDesenhar}
          aoPronta={aoFicarPronta}
          aoFalhar={aoFalharCena}
        />
      )}
      {/* Esta parte é lógica */}
      {mostrarReserva && (
        // No fluxo normal (não sobreposto): com texto ampliado, a caixa
        // cresce junto, em vez de cortar o texto.
        <p
          aria-hidden={modo === "abertura" ? undefined : "true"}
          className="grid h-full place-items-center p-6 text-center text-auxiliar text-texto-2"
        >
          {DESCRICAO_DA_PULSEIRA}
        </p>
      )}
    </div>
  );
}
