import { useEffect, useRef, useState } from "react";
import { useEfeitos } from "@/hooks/useEfeitos";

/*
  useVideoPulse — quando os vídeos da Pulse tocam, pausam e têm som
  (seções 19.1, 19.13 e 19.15). Usado pelo VideoPulse e pelo "Antes e
  depois" (os dois vídeos gêmeos).

  Regras:
  - Começam sempre mudos. O som só liga pelo botão "Ativar som" (WCAG
    1.4.2), e as legendas aparecem junto (WCAG 1.2.2).
  - Só tocam na tela: um IntersectionObserver (avisa quando um elemento
    entra ou sai da área visível) pausa o vídeo quando menos de 25% dele
    aparece, e o retoma quando ele volta, se a pessoa não tiver pausado.
  - Efeitos ligados: tocam em loop, sozinhos, até a pessoa apertar
    "Pausar".
  - Efeitos desligados: ficam no quadro parado (o "poster"). "Reproduzir"
    toca UMA vez e para. Desligar os efeitos com o vídeo tocando pausa e
    volta ao quadro parado.
  - "ativo": para quem tem vários vídeos e só um deve tocar (o fundo de
    "Como funciona" toca só o do item ativo).
  - "chave": quando o arquivo muda no mesmo lugar (o vídeo do sinal em
    "Os sinais"), o pedido de "tocar uma vez" e a falha começam de novo.
    A pausa e o som escolhidos pela pessoa continuam.
  - Gêmeos (quantidade: 2): os dois tocam e pausam juntos, com o mesmo
    tempo (currentTime) do primeiro. Se um se afastar mais de 0,15 s,
    volta para junto.
  - Sem o arquivo (erro ao carregar): "falhou" vira true, e quem usa
    mostra o marcador no lugar, sem erro na página.
  - Memória (19.1): ao sair da página, cada vídeo pausa, perde o arquivo
    (src) e é recarregado vazio, o que libera o decodificador.

  Devolve: refContainer (o elemento observado), propsVideo(indice) (ref
  e eventos de cada <video>), tocando, somLigado, falhou,
  alternarPausa() e alternarSom().
*/

const LIMIAR_VISIVEL = 0.25;
const TOLERANCIA_GEMEOS = 0.15; // s

// Mostra ou esconde as legendas (faixas de texto) de um vídeo
function mostrarLegendas(video, mostrar) {
  for (const faixa of video.textTracks) faixa.mode = mostrar ? "showing" : "disabled";
}

export function useVideoPulse({ quantidade = 1, ativo = true, chave = "" } = {}) {
  const { efeitosLigados } = useEfeitos();
  const refContainer = useRef(null);
  const refVideos = useRef([]);
  const refEfeitosAntes = useRef(efeitosLigados);
  const [visivel, setVisivel] = useState(false);
  const [pausadoPelaPessoa, setPausadoPelaPessoa] = useState(false);
  const [pedidoUmaVez, setPedidoUmaVez] = useState(false);
  const [somLigado, setSomLigado] = useState(false);
  const [falhou, setFalhou] = useState(false);

  // Ajuste durante a renderização (padrão do React para "resetar estado
  // quando uma prop muda"): trocar os efeitos ou o arquivo desfaz o
  // pedido de "tocar uma vez"; trocar o arquivo também desfaz a falha.
  const [referencia, setReferencia] = useState({ efeitosLigados, chave });
  if (referencia.efeitosLigados !== efeitosLigados || referencia.chave !== chave) {
    setReferencia({ efeitosLigados, chave });
    setPedidoUmaVez(false);
    if (referencia.chave !== chave) setFalhou(false);
  }

  const tocando = !falhou && visivel && ativo && (efeitosLigados ? !pausadoPelaPessoa : pedidoUmaVez);

  // Uma função de ref por vídeo, criada uma vez só (o React 19 chama a
  // função devolvida quando o vídeo sai da página).
  const [registradores] = useState(() =>
    Array.from({ length: quantidade }, (_, indice) => (video) => {
      if (!video) return undefined;
      // No modo de desenvolvimento, o React liga, desliga e liga de novo
      // a ref; se o arquivo foi tirado no "desliga", ele volta aqui.
      if (!video.getAttribute("src") && video.dataset.src) {
        video.setAttribute("src", video.dataset.src);
      }
      refVideos.current[indice] = video;
      // O arquivo pode ter falhado antes de o React assumir a página
      // (hidratação): aí o evento "error" já passou, e só sobra video.error.
      if (video.error) queueMicrotask(() => setFalhou(true));
      return () => {
        video.pause();
        video.removeAttribute("src");
        video.load();
        refVideos.current[indice] = null;
      };
    }),
  );

  // Só toca na tela
  useEffect(() => {
    const container = refContainer.current;
    if (!container) return;
    const observador = new IntersectionObserver(
      ([registro]) => setVisivel(registro.isIntersecting),
      { threshold: LIMIAR_VISIVEL },
    );
    observador.observe(container);
    return () => observador.disconnect();
  }, []);

  // Toca ou pausa todos juntos; os gêmeos partem do tempo do primeiro.
  useEffect(() => {
    const videos = refVideos.current.filter(Boolean);
    if (!videos.length) return;
    const [primeiro, ...outros] = videos;
    for (const video of videos) {
      video.loop = efeitosLigados;
      video.muted = !somLigado;
    }
    if (tocando) {
      for (const video of outros) video.currentTime = primeiro.currentTime;
      // play() devolve uma promessa que pode ser recusada (ex.: o arquivo
      // ainda não existe); não é um erro da página.
      videos.forEach((video) => video.play().catch(() => {}));
    } else {
      videos.forEach((video) => video.pause());
    }
  }, [tocando, efeitosLigados, somLigado, chave]);

  // Efeitos desligados com o vídeo andando: volta ao quadro parado
  // (load() recarrega o vídeo e mostra o poster de novo).
  useEffect(() => {
    if (refEfeitosAntes.current && !efeitosLigados) {
      for (const video of refVideos.current) {
        if (video && video.currentTime > 0) video.load();
      }
    }
    refEfeitosAntes.current = efeitosLigados;
  }, [efeitosLigados]);

  // Legendas: aparecem com o som ligado
  useEffect(() => {
    for (const video of refVideos.current) {
      if (!video) continue;
      mostrarLegendas(video, somLigado);
    }
  }, [somLigado, chave]);

  // Gêmeos: o segundo acompanha o tempo do primeiro
  useEffect(() => {
    const [primeiro, ...outros] = refVideos.current;
    if (!primeiro || !outros.length) return;
    function sincronizar() {
      for (const video of outros) {
        if (video && Math.abs(video.currentTime - primeiro.currentTime) > TOLERANCIA_GEMEOS) {
          video.currentTime = primeiro.currentTime;
        }
      }
    }
    primeiro.addEventListener("timeupdate", sincronizar);
    primeiro.addEventListener("seeked", sincronizar);
    return () => {
      primeiro.removeEventListener("timeupdate", sincronizar);
      primeiro.removeEventListener("seeked", sincronizar);
    };
  }, [chave]);

  function alternarPausa() {
    if (efeitosLigados) {
      setPausadoPelaPessoa(tocando);
    } else {
      setPedidoUmaVez(!tocando);
    }
  }

  function alternarSom() {
    setSomLigado((ligado) => !ligado);
  }

  function propsVideo(indice) {
    return {
      ref: registradores[indice],
      onError: () => setFalhou(true),
      // Efeitos desligados: depois da única vez, volta a "Reproduzir"
      onEnded: indice === 0 ? () => setPedidoUmaVez(false) : undefined,
    };
  }

  return { refContainer, propsVideo, tocando, somLigado, falhou, alternarPausa, alternarSom };
}
