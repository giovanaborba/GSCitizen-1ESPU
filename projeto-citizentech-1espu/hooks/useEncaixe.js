import { useEffect } from "react";
import { useEfeitos } from "@/hooks/useEfeitos";
import { useRolagemSuave } from "@/hooks/useRolagemSuave";

/*
  useEncaixe — rolagem com encaixe por "proximidade" (seções 19.6 e 19.15).

  Na Início, a abertura, o Tema e "Quem vive o problema" têm o atributo
  data-encaixe. Quando a rolagem com a roda do mouse para (160 ms sem
  andar), se uma dessas seções estiver perto do topo (a menos de 30% da
  altura da tela, para cima ou para baixo), a página "assenta" nela,
  devagar, pela rolagem suave (Lenis).

  Nunca é obrigatório: é só um empurrãozinho quando a pessoa já parou
  quase no lugar. Fica desligado:
  - com os efeitos desligados (sem Lenis, o hook nem começa);
  - com zoom alto ou tela baixa: só vale a partir de 64rem de largura e
    600 px de altura (o mesmo limite das seções fixas, 19.6). Com zoom de
    400%, a largura "vira" 320 px e o encaixe some;
  - durante o arrasto (barra de rolagem, dedo) e o teclado: só encaixa se
    o último movimento foi da roda do mouse;
  - com o foco num campo de formulário.

  "Topo" = logo abaixo do cabeçalho e do "Nesta página" fixo (as mesmas
  medidas que as âncoras usam: --altura-cabecalho e --altura-indice).
*/
const ESPERA = 160; // ms depois de a rolagem parar
const LIMITE = 0.3; // fração da altura da tela
const CONSULTA = "(min-width: 64rem) and (min-height: 37.5rem)";

function alturaDoTopo() {
  const estilo = getComputedStyle(document.documentElement);
  const cabecalho = parseFloat(estilo.getPropertyValue("--altura-cabecalho")) || 0;
  const indice = parseFloat(estilo.getPropertyValue("--altura-indice")) || 0;
  return cabecalho + indice;
}

export function useEncaixe() {
  const { efeitosLigados } = useEfeitos();
  const lenis = useRolagemSuave();

  useEffect(() => {
    if (!efeitosLigados || !lenis) return;
    const consulta = window.matchMedia(CONSULTA);
    let ultimaEntrada = "nenhuma";
    let espera = 0;

    function tentarEncaixe() {
      if (!consulta.matches || ultimaEntrada !== "roda") return;
      const ativo = document.activeElement;
      if (ativo?.matches("input, textarea, select")) return;

      const topo = alturaDoTopo();
      let melhor = null;
      for (const secao of document.querySelectorAll("[data-encaixe]")) {
        const distancia = secao.getBoundingClientRect().top - topo;
        if (melhor === null || Math.abs(distancia) < Math.abs(melhor)) melhor = distancia;
      }
      if (melhor === null) return;
      if (Math.abs(melhor) > 2 && Math.abs(melhor) < window.innerHeight * LIMITE) {
        ultimaEntrada = "encaixe"; // o próprio encaixe não chama outro
        lenis.scrollTo(window.scrollY + melhor);
      }
    }

    function aoRolar() {
      clearTimeout(espera);
      espera = setTimeout(tentarEncaixe, ESPERA);
    }

    const marcarRoda = () => (ultimaEntrada = "roda");
    const marcarOutra = () => (ultimaEntrada = "outra");
    const opcoes = { capture: true, passive: true };

    window.addEventListener("wheel", marcarRoda, opcoes);
    window.addEventListener("keydown", marcarOutra, true);
    window.addEventListener("pointerdown", marcarOutra, true);
    window.addEventListener("touchstart", marcarOutra, opcoes);
    const pararDeOuvir = lenis.on("scroll", aoRolar);

    return () => {
      clearTimeout(espera);
      pararDeOuvir();
      window.removeEventListener("wheel", marcarRoda, opcoes);
      window.removeEventListener("keydown", marcarOutra, true);
      window.removeEventListener("pointerdown", marcarOutra, true);
      window.removeEventListener("touchstart", marcarOutra, opcoes);
    };
  }, [efeitosLigados, lenis]);
}
