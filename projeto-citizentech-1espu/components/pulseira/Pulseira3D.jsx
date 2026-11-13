"use client";

import dynamic from "next/dynamic";
import { useId, useState } from "react";

/*
  Pulseira3D — a pulseira Pulse em 3D (seções 18.7, 19.12 e 19.15). A
  pulseira é código (Three.js), não imagem.

  Props:
  - modo: "abertura" (Início), "explorar" (Solução, "A pulseira"),
    "sinal" (Solução, "Os sinais": repete um sinal) ou "parar" (404);
  - giro: o retorno do useGiroPulseira (abertura e explorar): o palco
    recebe o arrasto e as setas do teclado;
  - sinal e pausado: no modo "sinal";
  - parteAtiva: parte que acende; sinalAtivo: sinal escolhido (explorar);
  - aguardarEntrada: a abertura espera a capa sair;
  - adiar: não monta a cena ainda (a abertura adia durante o preloader:
    montar a cena compila os "shaders" da placa de vídeo e trava a página
    por um instante, o que faria a contagem do preloader pular);
  - aoTrocarSinal(sinal), aoDesenhar(projetar), aoPronta(), aoFalhar();
  - className: tamanho e posição da caixa (quem usa decide).

  Palco (abertura e explorar, 19.12): quando a cena está pronta, a caixa
  é um grupo com foco (role="group", aria-roledescription="modelo 3D"),
  com o nome "Pulseira Pulse em 3D. Use as setas do teclado para girar." e
  a descrição em texto ligada por aria-describedby. O leitor de tela diz
  algo como "Pulseira Pulse em 3D, modelo 3D".

  Carregamento e reserva:
  - A cena é carregada com next/dynamic e ssr: false. Enquanto carrega, e
    se o WebGL falhar, aparece a descrição em texto. Sem JavaScript, a
    descrição fica no lugar da pulseira (seção 19.1, item 4).
  - Com a cena pronta, a descrição continua no HTML, só para o leitor de
    tela (sr-only), porque o palco aponta para ela.
  - No modo "sinal" (pulseira pequena), não cabe texto: a reserva fica
    vazia e quem usa esconde a caixa se ela falhar.
*/

// Descrição em texto (reserva e aria-describedby), a do protótipo (19.12)
export const DESCRICAO_DA_PULSEIRA =
  "Pulseira Pulse: tira esportiva laranja de silicone, com fecho embaixo do pulso. Na frente, um módulo com face grafite e, de cima para baixo: os furos do microfone, o botão grande do destino (côncavo, com anéis em relevo), a célula Braille com 6 pinos que sobem e descem e o botão pequeno de modo (com um ponto em relevo). Por dentro da tira ficam as zonas de vibração, nos dois lados do pulso, e o atuador de pressão, embaixo do módulo. Nas laterais da face, cinco pontos de luz de cada lado acendem junto com a vibração. Os contatos de carga ficam na ponta de baixo do módulo.";

// Esta parte é lógica
const CenaPulseira = dynamic(() => import("@/components/pulseira/CenaPulseira"), {
  ssr: false,
  loading: () => null,
});

export default function Pulseira3D({
  modo = "abertura",
  giro,
  sinal,
  pausado = false,
  parteAtiva = null,
  sinalAtivo = null,
  aguardarEntrada = false,
  adiar = false,
  aoTrocarSinal,
  aoDesenhar,
  aoPronta,
  aoFalhar,
  className = "",
}) {
  const [pronta, setPronta] = useState(false);
  const [falhou, setFalhou] = useState(false);
  const idDescricao = useId();
  const interativo = modo === "abertura" || modo === "explorar";

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
      {!falhou && !adiar && (
        <CenaPulseira
          modo={modo}
          interativo={interativo}
          pronta={pronta}
          idDescricao={idDescricao}
          giro={giro}
          sinal={sinal}
          pausado={pausado}
          parteAtiva={parteAtiva}
          sinalAtivo={sinalAtivo}
          aguardarEntrada={aguardarEntrada}
          aoTrocarSinal={aoTrocarSinal}
          aoDesenhar={aoDesenhar}
          aoPronta={aoFicarPronta}
          aoFalhar={aoFalharCena}
        />
      )}
      {/* Esta parte é lógica */}
      {/* A descrição: visível como reserva; com a cena pronta, só para o
          leitor de tela (nos modos com palco). No fluxo normal (não
          sobreposta): com texto ampliado, a caixa cresce junto. */}
      {(mostrarReserva || interativo) && (
        <p
          id={idDescricao}
          aria-hidden={interativo ? undefined : "true"}
          className={
            mostrarReserva
              ? "grid h-full place-items-center p-6 text-center text-auxiliar text-texto-2"
              : "sr-only"
          }
        >
          {DESCRICAO_DA_PULSEIRA}
        </p>
      )}
    </div>
  );
}
