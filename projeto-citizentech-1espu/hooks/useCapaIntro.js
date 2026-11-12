import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useLenis } from "lenis/react";
import { gsap } from "gsap";

/*
  useCapaIntro — capa da primeira visita da sessão (seções 18.6 e 18.14).

  Quando aparece:
  - só na primeira visita de cada sessão: guardamos a chave
    "pulse-capa-vista" no sessionStorage (ele se apaga quando a aba
    fecha). Se o armazenamento falhar (modo privado de alguns
    navegadores), a capa aparece;
  - só no navegador, depois da hidratação (o momento em que o React
    "assume" a página que veio pronta do servidor). Sem JavaScript, a
    capa não existe.

  Como sai: com um clique ou toque na capa, a roda do mouse, o dedo
  arrastando, qualquer tecla ou qualquer foco (o primeiro Tab, no "Pular
  para o conteúdo", já abre o site). A saída é em "piso tátil": a capa
  vira uma peneira de domos que encolhem em 1 s. Com "reduzir movimento",
  a saída é instantânea.

  Fases: "ativa" → "saindo" → "fim". Devolve:
  - capaNaTela: a capa está na tela (ativa ou saindo);
  - saindo: a animação de saída está acontecendo;
  - refCapa: vai no elemento da capa (o GSAP anima a máscara dele);
  - sair(): pede a saída (usado no clique).
*/

const CHAVE = "pulse-capa-vista";
const RAIO_INICIAL = 22; // px: os domos cobrem a tela inteira
const DURACAO_DA_SAIDA = 1; // s

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
  const [fase, setFase] = useState("ativa");
  const refCapa = useRef(null);
  const refAnimacao = useRef(null);
  const lenis = useLenis();

  const capaNaTela = precisa && fase !== "fim";
  const saindo = capaNaTela && fase === "saindo";

  // Esta parte é lógica
  function terminar() {
    marcarCapaVista();
    setFase("fim");
  }

  // Esta parte é lógica
  function sair() {
    if (!capaNaTela || fase !== "ativa") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      terminar();
      return;
    }
    setFase("saindo");
  }

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
  // Qualquer gesto, tecla ou foco abre o site.
  useEffect(() => {
    if (!capaNaTela || fase !== "ativa") return;
    const pedirSaida = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        marcarCapaVista();
        setFase("fim");
      } else {
        setFase("saindo");
      }
    };
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

  return { capaNaTela, saindo, refCapa, sair };
}
