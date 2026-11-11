import { createContext, useContext, useEffect, useLayoutEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";

/*
  useTransicaoPagina — transição de piso tátil entre páginas (seção 18.9).

  Como funciona a cortina: é uma camada roxa vista por uma "peneira" de
  domos (CSS .cortina-piso). A variável --d é o raio de cada domo:
  0 px = invisível; 22 px = os domos se encostam e cobrem a tela.

  1. A pessoa toca num link interno. O <Link> do Next chama onNavigate.
     A guarda de saída decide primeiro ("Descartar as respostas?"). Se a
     saída estiver livre, ela chama navegar(evento, destino), daqui.
  2. navegar cancela a navegação normal (evento.preventDefault()), faz os
     domos crescerem (200 ms) e só então chama router.push(destino).
  3. Quando o endereço muda (usePathname), os domos encolhem (220 ms) e
     revelam a página nova. O foco continua indo para o <h1> (FocoNaTroca).

  Casos especiais:
  - Voltar e Avançar do navegador: não passam pelo <Link>, então só a
    saída anima (a cortina já começa cobrindo e encolhe).
  - Diário (decisão da equipe): a cortina só aparece ao ENTRAR e ao SAIR
    do Diário. Entre /diario, /diario/novo, /diario/[id] e
    /diario/[id]/editar, a troca é instantânea, inclusive depois de
    salvar ou excluir e no "Descartar respostas".
  - "Reduzir movimento" e alto contraste do Windows: troca instantânea.
  - Trava de segurança: se a página nova não chegar em 3 s, a cortina
    some mesmo assim, para nunca prender a pessoa atrás dela.
*/

const RAIO_COBRE_TELA = 22; // px, em células de 30 px
const DURACAO_ENTRADA = 0.2; // segundos
const DURACAO_SAIDA = 0.22; // segundos
const LIMITE_DE_ESPERA = 3000; // ms

// Contexto: deixa navegar e irPara disponíveis para a guarda de saída
export const ContextoTransicao = createContext(null);

// Esta parte é lógica
export function estaNoDiario(caminho) {
  return caminho === "/diario" || caminho.startsWith("/diario/");
}

// Esta parte é lógica
// A cortina só anima quando a página muda de verdade e quando a troca
// não acontece inteira dentro do Diário.
export function deveAnimarTroca(origem, destino) {
  if (origem === destino) return false;
  return !(estaNoDiario(origem) && estaNoDiario(destino));
}

// Esta parte é lógica
function semMovimento() {
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    window.matchMedia("(forced-colors: active)").matches
  );
}

// Esta parte é lógica
// "/solucao#os-sinais" → "/solucao"
function caminhoDe(destino) {
  return new URL(destino, window.location.href).pathname;
}

// Esta parte é lógica
function mostrarCortina(cortina, raio) {
  cortina.dataset.ativa = "";
  gsap.set(cortina, { "--d": `${raio}px` });
}

// Esta parte é lógica
// Encolhe os domos e esconde a cortina no fim.
function encolherCortina(cortina, estado) {
  clearTimeout(estado.limite);
  estado.animacao?.kill();
  estado.animacao = gsap.to(cortina, {
    "--d": "0px",
    duration: DURACAO_SAIDA,
    ease: "power2.out",
    onComplete: () => {
      delete cortina.dataset.ativa;
      estado.cobrindo = false;
    },
  });
}

// Esta parte é lógica
// Faz os domos crescerem até cobrir a tela e, no fim, troca de página.
function cobrirETrocar(cortina, estado, trocarDePagina) {
  estado.cobrindo = true;
  estado.animacao?.kill();
  mostrarCortina(cortina, 0);
  estado.animacao = gsap.to(cortina, {
    "--d": `${RAIO_COBRE_TELA}px`,
    duration: DURACAO_ENTRADA,
    ease: "power2.in",
    onComplete: () => {
      trocarDePagina();
      estado.limite = setTimeout(() => encolherCortina(cortina, estado), LIMITE_DE_ESPERA);
    },
  });
}

// Esta parte é lógica
export function useTransicaoPagina() {
  const router = useRouter();
  const caminho = usePathname();
  const refCortina = useRef(null);
  const caminhoAnterior = useRef(caminho);
  // cobrindo: a cortina está na tela esperando a página nova
  const estado = useRef({ cobrindo: false, animacao: null, limite: null });

  // Esta parte é lógica
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

  // Esta parte é lógica
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

  // Esta parte é lógica
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
    mostrarCortina(cortina, RAIO_COBRE_TELA);
    encolherCortina(cortina, estado.current);
  }, [caminho]);

  // Esta parte é lógica
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

// Esta parte é lógica
// Para a guarda de saída usar a transição.
export function useNavegacaoComTransicao() {
  const contexto = useContext(ContextoTransicao);
  if (!contexto) {
    throw new Error("useNavegacaoComTransicao precisa estar dentro de <TransicaoPagina>.");
  }
  return contexto;
}
