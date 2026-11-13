"use client";

import { useEffect, useSyncExternalStore } from "react";
import Lenis from "lenis";
import { MotionConfig } from "motion/react";
import { registrarPluginsGsap, sincronizarLenisComGsap } from "@/lib/movimento";
import { spring } from "@/lib/presetsMovimento";
import {
  DESCONHECIDO,
  LIGADOS,
  assinarEfeitos,
  definirEfeitos,
  lerEfeitos,
  lerEfeitosNoServidor,
  lerEscolhaSalva,
} from "@/lib/efeitos";
import { ContextoEfeitos } from "@/hooks/useEfeitos";
import { ContextoRolagemSuave } from "@/hooks/useRolagemSuave";
import { usePrefereMovimentoReduzido } from "@/hooks/usePrefereMovimentoReduzido";

/*
  ProvedorMovimento — seções 18.1, 18.9 e 19.2.
  Fica no layout, em volta de todas as páginas, e é a ÚNICA regra de
  movimento do site (Fase 9):

  1. Interruptor "Efeitos": guarda se os efeitos estão ligados e entrega
     isso a todos pelo hook useEfeitos(). O valor mora no atributo
     data-efeitos do <html> (lib/efeitos.js), gravado antes da pintura
     pelo script do <head>.
     - Valor inicial: a escolha salva (localStorage "pulse-efeitos") ou,
       sem escolha, o "reduzir movimento" do aparelho.
     - Mudança do aparelho: se a pessoa nunca mexeu no interruptor e
       muda o "reduzir movimento" com o site aberto, o estado acompanha.
       Este é o único lugar (fora do script do <head>) que consulta o
       aparelho.
  2. Lenis (rolagem suave com a roda do mouse): só existe com os efeitos
     ligados. Com os efeitos desligados, ele nem é criado, e a rolagem é a
     do navegador. Por que não usar lenis.stop(), como sugeria a 19.2: o
     stop() põe a classe "lenis-stopped" no <html>, que tem overflow: clip
     no CSS do próprio Lenis, e ainda cancela a roda do mouse. A página
     deixaria de rolar.
     - autoRaf: false → quem "dá corda" ao Lenis é o relógio do GSAP;
     - lerp: 0.09 → um pouco mais de inércia (seção 19.6);
     - anchors: true → links para "#algum-id" rolam suave, descontando o
       scroll-padding-top do <html>. O clique continua sendo um link
       normal: o foco vai para o destino;
     - no toque (celular), a rolagem continua a do aparelho.
     O Lenis é criado e destruído aqui, num efeito, e NÃO em volta das
     páginas: assim ligar e desligar não remonta o site (um formulário
     do Diário, por exemplo, não perde o que foi digitado).
  3. GSAP: registra o ScrollTrigger uma vez.
  4. Motion: MotionConfig com a mola padrão (PADRAO_MOVIMENTO_PULSE, item
     4). Com os efeitos desligados, reducedMotion="always" tira os
     movimentos de posição e escala e mantém só as trocas de opacidade.

  Não desenha nada na tela: só envolve o conteúdo.
*/

// Esta parte é lógica
registrarPluginsGsap();

// lerp (seção 19.6): a cada quadro, a rolagem anda 9% do caminho que
// falta até o destino. Quanto menor o número, mais "inércia" (a página
// continua deslizando um pouco depois da roda parar). O padrão do Lenis
// é 0,1; a Fase 9 pede um pouco mais de inércia (≈ 0,09).
const OPCOES_LENIS = {
  autoRaf: false,
  anchors: true,
  smoothWheel: true,
  lerp: 0.09,
};

// Esta parte é lógica
// O Lenis atual (ou null) fica guardado fora do React, como os efeitos
// em lib/efeitos.js. O efeito que cria o Lenis só "avisa" que ele mudou,
// e o React lê o valor novo por useSyncExternalStore. (Mudar o estado do
// React direto dentro do efeito faria a tela renderizar duas vezes.)
let lenisAtual = null;
const ouvintesDoLenis = new Set();

function definirLenis(instancia) {
  lenisAtual = instancia;
  for (const aoMudar of ouvintesDoLenis) aoMudar();
}

function assinarLenis(aoMudar) {
  ouvintesDoLenis.add(aoMudar);
  return () => ouvintesDoLenis.delete(aoMudar);
}

const lerLenis = () => lenisAtual;
const lerLenisNoServidor = () => null;

export default function ProvedorMovimento({ children }) {
  // Esta parte é lógica
  const valor = useSyncExternalStore(assinarEfeitos, lerEfeitos, lerEfeitosNoServidor);
  const efeitosConhecidos = valor !== DESCONHECIDO;
  const efeitosLigados = valor === LIGADOS;
  const aparelhoPedeReduzir = usePrefereMovimentoReduzido();
  const lenis = useSyncExternalStore(assinarLenis, lerLenis, lerLenisNoServidor);

  // Esta parte é lógica
  // O aparelho só manda enquanto a pessoa não escolheu no interruptor.
  useEffect(() => {
    if (!efeitosConhecidos || lerEscolhaSalva() !== null) return;
    definirEfeitos(!aparelhoPedeReduzir, { salvar: false });
  }, [aparelhoPedeReduzir, efeitosConhecidos]);

  // Esta parte é lógica
  // Cria o Lenis ao ligar os efeitos e o destrói ao desligar (ou ao sair).
  useEffect(() => {
    if (!efeitosLigados) return;
    const instancia = new Lenis(OPCOES_LENIS);
    const desfazerSincronia = sincronizarLenisComGsap(instancia);
    definirLenis(instancia);
    return () => {
      desfazerSincronia();
      instancia.destroy();
      definirLenis(null);
    };
  }, [efeitosLigados]);

  // Esta parte é lógica
  // Botão "Efeitos": inverte o estado atual e guarda a escolha.
  function alternarEfeitos() {
    definirEfeitos(lerEfeitos() !== LIGADOS, { salvar: true });
  }

  return (
    <ContextoEfeitos.Provider value={{ efeitosLigados, efeitosConhecidos, alternarEfeitos }}>
      <ContextoRolagemSuave.Provider value={lenis}>
        <MotionConfig transition={spring.padrao} reducedMotion={efeitosLigados ? "never" : "always"}>
          {children}
        </MotionConfig>
      </ContextoRolagemSuave.Provider>
    </ContextoEfeitos.Provider>
  );
}
