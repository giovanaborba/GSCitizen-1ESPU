import { createContext, useContext, useEffect, useLayoutEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { efeitosLigadosAgora } from "@/lib/efeitos";
import { desenharDomos, limparDomos } from "@/lib/cortinaDomos";

/*
  useTransicaoPagina — transição de piso tátil entre páginas (seções 18.9
  e 19.6).

  Como funciona a cortina (Fase 9): é um <canvas> em tela cheia onde os
  domos grafite (--cor-cortina) entram numa varredura diagonal, como
  pixels, do canto de cima à esquerda ao de baixo à direita, e depois
  saem na mesma ordem (desenho em lib/cortinaDomos.js). Sem "glitch":
  cada domo só cresce ou só encolhe uma vez.

  1. A pessoa toca num link interno. O <Link> do Next chama onNavigate.
     A guarda de saída decide primeiro ("Descartar as respostas?"). Se a
     saída estiver livre, ela chama navegar(evento, destino), daqui.
  2. navegar cancela a navegação normal (evento.preventDefault()), faz a
     varredura cobrir a tela (0,42 s) e só então chama
     router.push(destino).
  3. Quando o endereço muda (usePathname), a varredura revela a página
     nova (0,42 s). O foco continua indo para o <h1> (FocoNaTroca).
  Duração: a da cortina no PADRAO_MOVIMENTO_PULSE (item 5c, 0,42 s), em
  cada sentido, como no protótipo.

  Casos especiais:
  - Voltar e Avançar do navegador: não passam pelo <Link>, então só a
    saída anima (a cortina já começa cobrindo e encolhe).
  - Diário (decisão da equipe): a cortina só aparece ao ENTRAR e ao SAIR
    do Diário. Entre /diario, /diario/novo, /diario/[id] e
    /diario/[id]/editar, a troca é instantânea, inclusive depois de
    salvar ou excluir e no "Descartar respostas".
  - Efeitos desligados (interruptor "Efeitos", seção 19.2) e alto
    contraste do Windows: troca instantânea.
  - Trava de segurança: se a página nova não chegar em 3 s, a cortina
    some mesmo assim, para nunca prender a pessoa atrás dela.
*/

const DURACAO_ENTRADA = 0.42; // segundos (PADRAO_MOVIMENTO_PULSE, item 5c)
const DURACAO_SAIDA = 0.42; // segundos
const LIMITE_DE_ESPERA = 3000; // ms

// Contexto: deixa navegar e irPara disponíveis para a guarda de saída
export const ContextoTransicao = createContext(null);

export function estaNoDiario(caminho) {
  return caminho === "/diario" || caminho.startsWith("/diario/");
}

// A cortina só anima quando a página muda de verdade e quando a troca
// não acontece inteira dentro do Diário.
export function deveAnimarTroca(origem, destino) {
  if (origem === destino) return false;
  return !(estaNoDiario(origem) && estaNoDiario(destino));
}

function semMovimento() {
  return (
    !efeitosLigadosAgora() || window.matchMedia("(forced-colors: active)").matches
  );
}

// "/solucao#os-sinais" → "/solucao"
function caminhoDe(destino) {
  return new URL(destino, window.location.href).pathname;
}

function corDaCortina() {
  return getComputedStyle(document.documentElement).getPropertyValue("--cor-cortina").trim() || "#242428";
}

// Mostra a cortina já num ponto da varredura (0 = vazia; 1 = cobrindo).
function mostrarCortina(cortina, cobrindo) {
  cortina.dataset.ativa = "";
  desenharDomos(cortina, cobrindo ? 1 : 0, true, corDaCortina());
}

// Anima a varredura: o GSAP leva "progresso" de 0 a 1, e cada passo
// redesenha o canvas.
function varrer(cortina, entrando, duracao, aoTerminar) {
  const cor = corDaCortina();
  const valor = { progresso: 0 };
  return gsap.to(valor, {
    progresso: 1,
    duration: duracao,
    ease: "none", // cada domo já cresce aos poucos; o conjunto anda reto
    onUpdate: () => desenharDomos(cortina, valor.progresso, entrando, cor),
    onComplete: aoTerminar,
  });
}

// Revela a página nova e esconde a cortina no fim.
function encolherCortina(cortina, estado) {
  clearTimeout(estado.limite);
  estado.animacao?.kill();
  estado.animacao = varrer(cortina, false, DURACAO_SAIDA, () => {
    delete cortina.dataset.ativa;
    limparDomos(cortina);
    estado.cobrindo = false;
  });
}

// Cobre a tela com a varredura e, no fim, troca de página.
function cobrirETrocar(cortina, estado, trocarDePagina) {
  estado.cobrindo = true;
  estado.animacao?.kill();
  mostrarCortina(cortina, false);
  estado.animacao = varrer(cortina, true, DURACAO_ENTRADA, () => {
    trocarDePagina();
    estado.limite = setTimeout(() => encolherCortina(cortina, estado), LIMITE_DE_ESPERA);
  });
}

export function useTransicaoPagina() {
  const router = useRouter();
  const caminho = usePathname();
  const refCortina = useRef(null);
  const caminhoAnterior = useRef(caminho);
  // cobrindo: a cortina está na tela esperando a página nova
  const estado = useRef({ cobrindo: false, animacao: null, limite: null });

  // Chamada pelo onNavigate dos links (através da guarda de saída).
  function navegar(evento, destino) {
    const cortina = refCortina.current;
    if (!cortina || semMovimento() || !deveAnimarTroca(caminho, caminhoDe(destino))) {
      return; // o <Link> segue a navegação normal, instantânea
    }
    evento.preventDefault();
    if (estado.current.cobrindo) return; // já está trocando de página
    cobrirETrocar(cortina, estado.current, () => router.push(destino));
  }

  // Navegação feita por código (ex.: "Descartar respostas").
  function irPara(destino) {
    const cortina = refCortina.current;
    if (
      !cortina ||
      semMovimento() ||
      estado.current.cobrindo ||
      !deveAnimarTroca(caminho, caminhoDe(destino))
    ) {
      router.push(destino);
      return;
    }
    cobrirETrocar(cortina, estado.current, () => router.push(destino));
  }

  // O endereço mudou. useLayoutEffect roda ANTES de a tela ser pintada:
  // assim, no Voltar do navegador, a cortina já aparece cobrindo, sem a
  // página nova "piscar" antes.
  useLayoutEffect(() => {
    const origem = caminhoAnterior.current;
    if (origem === caminho) return; // primeiro carregamento
    caminhoAnterior.current = caminho;

    const cortina = refCortina.current;
    if (!cortina) return;

    if (estado.current.cobrindo) {
      encolherCortina(cortina, estado.current);
      return;
    }
    // Troca que não passou por um link (Voltar/Avançar): só a saída
    if (semMovimento() || !deveAnimarTroca(origem, caminho)) return;
    estado.current.cobrindo = true;
    mostrarCortina(cortina, true);
    encolherCortina(cortina, estado.current);
  }, [caminho]);

  // Ao desmontar, para a animação e o relógio de segurança.
  useEffect(() => {
    const atual = estado.current;
    return () => {
      atual.animacao?.kill();
      clearTimeout(atual.limite);
    };
  }, []);

  return { refCortina, navegar, irPara };
}

// Para a guarda de saída usar a transição.
export function useNavegacaoComTransicao() {
  const contexto = useContext(ContextoTransicao);
  if (!contexto) {
    throw new Error("useNavegacaoComTransicao precisa estar dentro de <TransicaoPagina>.");
  }
  return contexto;
}
