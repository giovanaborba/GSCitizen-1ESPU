import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { gsap } from "gsap";
import { useEfeitos } from "@/hooks/useEfeitos";
import { useRolagemSuave } from "@/hooks/useRolagemSuave";

/*
  useCapaIntro — capa da primeira visita da sessão (seções 18.6 e 18.14).

  Quando aparece:
  - só na primeira visita de cada sessão: guardamos a chave
    "pulse-capa-vista" no sessionStorage (ele se apaga quando a aba
    fecha). Se o armazenamento falhar (modo privado de alguns
    navegadores), a capa aparece;
  - só no navegador, depois da hidratação (o momento em que o React
    "assume" a página que veio pronta do servidor). Sem JavaScript, a
    capa não existe;
  - só com os efeitos ligados (seção 19.1). Com os efeitos desligados, a
    capa não aparece e já conta como vista: se a pessoa ligar os efeitos
    no meio da visita, a capa não "pula" na frente da página.

  Como sai: com um clique ou toque na capa, a roda do mouse, o dedo
  arrastando, qualquer tecla ou qualquer foco (o primeiro Tab, no "Pular
  para o conteúdo", já abre o site). A saída é em "piso tátil": a capa
  vira uma peneira de domos que encolhem em 1 s.

  Preloader (seção 19.6): antes da capa, uma contagem de 0 a 100 em
  1,4 s (o padrão de movimento vence os 1,2 s da 19.6; decisão 3 da 9.0),
  que some em 0,35 s e revela a capa, já montada por baixo. Qualquer
  gesto, tecla ou foco durante a contagem pula direto para a saída da
  capa: assim o foco nunca fica escondido atrás do preloader.

  Fases: "preloader" → "ativa" → "saindo" → "fim". Devolve:
  - capaNaTela: a capa está na tela (com ou sem o preloader por cima);
  - preloaderNaTela: a contagem está na tela;
  - saindo: a animação de saída está acontecendo;
  - refCapa: vai no elemento da capa (o GSAP anima a máscara dele);
  - refPreloader e refContador: vão no preloader e no número dele;
  - sair(): pede a saída (usado no clique).
*/

const CHAVE = "pulse-capa-vista";
const RAIO_INICIAL = 22; // px: os domos cobrem a tela inteira
const DURACAO_DA_SAIDA = 1; // s
const DURACAO_DA_CONTAGEM = 1.4; // s (PADRAO_MOVIMENTO_PULSE, item 5c)
const DURACAO_DO_SUMICO = 0.35; // s (seção 19.6)

// Esta parte é lógica
function precisaDaCapa() {
  try {
    return !window.sessionStorage.getItem(CHAVE);
  } catch {
    return true;
  }
}

// Esta parte é lógica
function marcarCapaVista() {
  try {
    window.sessionStorage.setItem(CHAVE, "1");
  } catch {
    // Sem armazenamento: a capa volta na próxima visita, e tudo bem.
  }
}

// O sessionStorage não avisa mudanças; quem muda a chave é este hook.
const naoAssina = () => () => {};
// No servidor não há sessão: a página vem sem capa.
const noServidor = () => false;

// Esta parte é lógica
export function useCapaIntro() {
  const precisa = useSyncExternalStore(naoAssina, precisaDaCapa, noServidor);
  const [fase, setFase] = useState("preloader");
  const refCapa = useRef(null);
  const refPreloader = useRef(null);
  const refContador = useRef(null);
  const refAnimacao = useRef(null);
  const lenis = useRolagemSuave();
  const { efeitosLigados, efeitosConhecidos } = useEfeitos();

  const capaNaTela = precisa && efeitosLigados && fase !== "fim";
  const saindo = capaNaTela && fase === "saindo";
  const preloaderNaTela = capaNaTela && fase === "preloader";

  // Esta parte é lógica
  function terminar() {
    marcarCapaVista();
    setFase("fim");
  }

  // Esta parte é lógica
  function sair() {
    if (!capaNaTela || (fase !== "ativa" && fase !== "preloader")) return;
    setFase("saindo");
  }

  // Esta parte é lógica
  // Efeitos desligados (de verdade, não só "ainda não sei"): não há capa,
  // e ela conta como vista nesta sessão.
  useEffect(() => {
    if (efeitosConhecidos && !efeitosLigados && precisa) marcarCapaVista();
  }, [efeitosConhecidos, efeitosLigados, precisa]);

  // Esta parte é lógica
  // Tira a camada de espera do <head> quando ela já não é necessária: a
  // capa está montada (ela mesma cobre a tela) ou não vai aparecer.
  useEffect(() => {
    if (capaNaTela || !precisaDaCapa()) {
      document.documentElement.removeAttribute("data-capa-pendente");
    }
  }, [capaNaTela]);

  // Esta parte é lógica
  // Enquanto a capa está na tela, a rolagem suave fica parada (a roda do
  // mouse abre o site, em vez de rolar a página por baixo da capa).
  useEffect(() => {
    if (!capaNaTela || !lenis) return;
    lenis.stop();
    return () => lenis.start();
  }, [capaNaTela, lenis]);

  // Esta parte é lógica
  // Preloader: o número conta de 0 a 100 (desacelerando no fim), depois
  // a camada some e revela a capa. Escreve direto no texto do número, sem
  // redesenhar o componente a cada quadro.
  useEffect(() => {
    const preloader = refPreloader.current;
    const contador = refContador.current;
    if (!preloaderNaTela || !preloader || !contador) return;
    const valor = { n: 0 };
    const linhaDoTempo = gsap.timeline({ onComplete: () => setFase("ativa") });
    linhaDoTempo.to(valor, {
      n: 100,
      duration: DURACAO_DA_CONTAGEM,
      ease: "power1.out",
      onUpdate: () => {
        contador.textContent = String(Math.round(valor.n));
      },
    });
    linhaDoTempo.to(preloader, { opacity: 0, duration: DURACAO_DO_SUMICO, ease: "power1.out" });
    return () => linhaDoTempo.kill();
  }, [preloaderNaTela]);

  // Esta parte é lógica
  // Qualquer gesto, tecla ou foco abre o site (também durante o
  // preloader, que então some na hora).
  useEffect(() => {
    if (!capaNaTela || (fase !== "ativa" && fase !== "preloader")) return;
    const pedirSaida = () => setFase("saindo");
    const opcoes = { passive: true };
    window.addEventListener("wheel", pedirSaida, opcoes);
    window.addEventListener("touchmove", pedirSaida, opcoes);
    window.addEventListener("keydown", pedirSaida);
    window.addEventListener("focusin", pedirSaida);
    return () => {
      window.removeEventListener("wheel", pedirSaida, opcoes);
      window.removeEventListener("touchmove", pedirSaida, opcoes);
      window.removeEventListener("keydown", pedirSaida);
      window.removeEventListener("focusin", pedirSaida);
    };
  }, [capaNaTela, fase]);

  // Esta parte é lógica
  // Saída em piso tátil: os domos encolhem de 22 px para 0 em 1 s.
  useEffect(() => {
    const capa = refCapa.current;
    if (!saindo || !capa) return;
    refAnimacao.current = gsap.fromTo(
      capa,
      { "--d": `${RAIO_INICIAL}px` },
      {
        "--d": "0px",
        duration: DURACAO_DA_SAIDA,
        ease: "power3.inOut",
        onComplete: () => {
          marcarCapaVista();
          setFase("fim");
        },
      },
    );
    return () => refAnimacao.current?.kill();
  }, [saindo]);

  return { capaNaTela, preloaderNaTela, saindo, refCapa, refPreloader, refContador, sair };
}
