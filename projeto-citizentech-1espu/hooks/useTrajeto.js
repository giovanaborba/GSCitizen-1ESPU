import { useEffect, useRef } from "react";
import { useEfeitos } from "@/hooks/useEfeitos";

/*
  useTrajeto — desenha a rota e acende a parada atual conforme a rolagem
  (seções 19.7 e 19.15), em "Um trajeto com a Pulse".

  - A rota é um caminho SVG. "stroke-dashoffset" esconde o fim do traço:
    diminuindo o valor, o traço "se desenha" do começo ao fim. O ponto
    laranja anda junto, e cada parada acende quando a rota chega nela.
    Na lista, a parada atual ganha destaque.
  - Modo fixo (como no protótipo): no computador (a partir de 64rem e 600
    px de altura), com os efeitos ligados e se o palco couber inteiro na
    tela, o mapa e a lista ficam presos enquanto um "trilho" mais alto
    rola por trás, e a rota anda com ele. Fora disso, a rota anda enquanto
    o palco passa pela tela.
  - Escreve direto no SVG e nos atributos da lista (data-chegou,
    data-atual), uma vez por quadro no máximo.
  - Sem JavaScript ou com os efeitos desligados: a rota aparece inteira,
    com o ponto no destino, e a lista sem destaque (o contêiner não tem
    data-trajeto-ligado).

  Recebe as frações das paradas ao longo da rota. Devolve as refs da
  seção, do trilho, do palco, do caminho, do ponto e da lista.
*/
const CONSULTA_FIXA = "(min-width: 64rem) and (min-height: 37.5rem)";

function alturaDoTopo() {
  const estilo = getComputedStyle(document.documentElement);
  return (parseFloat(estilo.getPropertyValue("--altura-cabecalho")) || 0) + (parseFloat(estilo.getPropertyValue("--altura-indice")) || 0);
}

export function useTrajeto(fracoes) {
  const refSecao = useRef(null);
  const refTrilho = useRef(null);
  const refPalco = useRef(null);
  const refCaminho = useRef(null);
  const refPonto = useRef(null);
  const refLista = useRef(null);
  const { efeitosLigados } = useEfeitos();

  useEffect(() => {
    const secao = refSecao.current;
    const trilho = refTrilho.current;
    const palco = refPalco.current;
    const caminho = refCaminho.current;
    const ponto = refPonto.current;
    const lista = refLista.current;
    if (!secao || !trilho || !palco || !caminho || !ponto || !lista || !efeitosLigados) return;

    const comprimento = caminho.getTotalLength();
    const paradasNoMapa = [...secao.querySelectorAll("[data-parada-mapa]")];
    const paradasNaLista = [...lista.children];
    const consulta = window.matchMedia(CONSULTA_FIXA);
    let quadro = 0;

    // Modo fixo só se o palco couber inteiro abaixo do cabeçalho.
    function decidirModo() {
      secao.removeAttribute("data-trajeto-fixo");
      const cabe = palco.scrollHeight <= window.innerHeight - alturaDoTopo();
      secao.toggleAttribute("data-trajeto-fixo", consulta.matches && cabe);
    }

    function desenhar(fracao) {
      const feito = fracao * comprimento;
      caminho.style.strokeDasharray = `${comprimento}`;
      caminho.style.strokeDashoffset = `${comprimento - feito}`;
      const posicao = caminho.getPointAtLength(feito);
      ponto.setAttribute("cx", posicao.x.toFixed(1));
      ponto.setAttribute("cy", posicao.y.toFixed(1));
      let atual = 0;
      fracoes.forEach((alvo, i) => {
        const chegou = fracao >= alvo - 0.001;
        if (chegou) atual = i;
        paradasNoMapa[i]?.toggleAttribute("data-chegou", chegou);
        paradasNaLista[i]?.toggleAttribute("data-chegou", chegou);
      });
      paradasNaLista.forEach((item, i) => item.toggleAttribute("data-atual", i === atual));
    }

    function atualizar() {
      quadro = 0;
      const altura = window.innerHeight;
      let fracao;
      if (secao.hasAttribute("data-trajeto-fixo")) {
        const topo = alturaDoTopo();
        const caixa = trilho.getBoundingClientRect();
        fracao = (topo - caixa.top) / (caixa.height - altura + topo);
      } else {
        const caixa = palco.getBoundingClientRect();
        fracao = (altura * 0.75 - caixa.top) / caixa.height;
      }
      desenhar(Math.max(0, Math.min(1, fracao)));
    }

    function pedirAtualizacao() {
      if (!quadro) quadro = requestAnimationFrame(atualizar);
    }

    function aoMudarTamanho() {
      decidirModo();
      pedirAtualizacao();
    }

    secao.setAttribute("data-trajeto-ligado", "");
    decidirModo();
    atualizar();
    window.addEventListener("scroll", pedirAtualizacao, { passive: true });
    window.addEventListener("resize", aoMudarTamanho);
    consulta.addEventListener("change", aoMudarTamanho);

    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener("scroll", pedirAtualizacao);
      window.removeEventListener("resize", aoMudarTamanho);
      consulta.removeEventListener("change", aoMudarTamanho);
      // Volta ao quadro parado: rota inteira, ponto no destino, sem destaque
      secao.removeAttribute("data-trajeto-ligado");
      secao.removeAttribute("data-trajeto-fixo");
      caminho.style.strokeDasharray = "";
      caminho.style.strokeDashoffset = "";
      const fim = caminho.getPointAtLength(comprimento);
      ponto.setAttribute("cx", fim.x.toFixed(1));
      ponto.setAttribute("cy", fim.y.toFixed(1));
      paradasNoMapa.forEach((parada) => parada.setAttribute("data-chegou", ""));
      paradasNaLista.forEach((item) => {
        item.removeAttribute("data-chegou");
        item.removeAttribute("data-atual");
      });
    };
  }, [efeitosLigados, fracoes]);

  return { refSecao, refTrilho, refPalco, refCaminho, refPonto, refLista };
}
