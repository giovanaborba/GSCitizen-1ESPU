import { useEffect, useLayoutEffect, useRef } from "react";
import { criarCena } from "@/lib/pulseira3d/cena";
import { useEfeitos } from "@/hooks/useEfeitos";
import {
  DURACAO_DO_CICLO,
  MOVIMENTO_DO_SINAL,
  SINAIS_DA_ABERTURA,
  animarSinal,
  apagarPartes,
  destacarParte,
} from "@/lib/pulseira3d/sinais";

/*
  usePulseira3D — liga a cena 3D ao React (seções 18.2, 18.7 e 18.14).

  Recebe a "caixa" onde a pulseira vai aparecer (refCaixa) e as opções:
  - modo: "abertura" (os 5 sinais em sequência), "sinal" (um sinal
    repetido, em "Os sinais") ou "parar" (página 404, até 4,6 s);
  - sinal: no modo "sinal", qual ("continuar", "parar", "virar",
    "aguardar");
  - pausado: botão "Pausar animação" de quem usa;
  - parteAtiva: no modo "abertura", a parte que acende (link focado);
  - aguardarEntrada: no modo "abertura", espera a capa sair para entrar;
  - aoTrocarSinal(sinal), aoDesenhar(projetar), aoPronta(), aoFalhar().

  Regras de desempenho e de acessibilidade (seção 18.2):
  - só anima enquanto está visível na tela (IntersectionObserver);
  - com os efeitos desligados (interruptor "Efeitos", seção 19.2),
    desenha um quadro parado e não anima. Ligar ou desligar vale na hora;
  - pausa quando pedido; no modo "parar", para sozinha antes de 5 s;
  - a cor da tira segue o tema do aparelho;
  - ao sair da página, libera tudo da memória.

  Por que o <canvas> é criado aqui, e não no JSX: no modo de
  desenvolvimento, o React monta, desmonta e monta de novo cada
  componente, para achar erros. Um canvas cujo WebGL já foi liberado não
  pode ser usado de novo. Criando um canvas novo a cada montagem, tanto o
  desenvolvimento quanto o site publicado funcionam.
*/

const DURACAO_DA_ENTRADA = 1.6; // s: escala de 0,35 para 1 e uma volta
const LIMITE_DO_PARAR = 4.6; // s: a 404 para antes de 5 s (WCAG 2.2.2)
const ULTIMO_PULSO_DO_PARAR = 3.7; // s: os últimos anéis somem até 4,6 s

// Esta parte é lógica
export function usePulseira3D(refCaixa, opcoes) {
  // As opções mudam a cada renderização, mas a cena é montada uma vez só.
  // Por isso elas ficam numa ref, lida a cada quadro da animação.
  const { efeitosLigados } = useEfeitos();
  const refOpcoes = useRef({ ...opcoes, efeitosLigados });
  const refControle = useRef(null);

  // Esta parte é lógica
  useLayoutEffect(() => {
    refOpcoes.current = { ...opcoes, efeitosLigados };
  });

  const { modo, pausado, parteAtiva, aguardarEntrada, sinal } = opcoes;

  // Esta parte é lógica
  // Monta a cena quando o componente aparece e desmonta quando ele sai.
  useEffect(() => {
    const caixa = refCaixa.current;
    if (!caixa) return;

    const canvas = document.createElement("canvas");
    canvas.className = "block size-full";
    canvas.setAttribute("aria-hidden", "true"); // quem descreve é a caixa
    caixa.appendChild(canvas);

    let cena;
    try {
      cena = criarCena(canvas, modo);
    } catch {
      // Sem WebGL: some o canvas e aparece a descrição em texto
      canvas.remove();
      refOpcoes.current.aoFalhar?.();
      return;
    }

    const { pulseira } = cena.partes;
    const estado = {
      rodando: false,
      idQuadro: 0,
      ultimoInstante: 0,
      tempo: 0, // relógio da animação (para quando pausa)
      visivel: false,
      indiceDoSinal: -1,
      tempoDoSinal: 0,
      ciclo: 0,
      sinalFixo: null,
      disparos: new Set(),
      entrada: refOpcoes.current.aguardarEntrada ? -1 : 0,
      terminou: false,
      inicioDoParar: null, // instante real (ms) do primeiro quadro do modo "parar"
      mouse: { x: 0, y: 0 },
      primeiroQuadro: true,
    };

    // Esta parte é lógica
    const umaVez = (nome, acao) => {
      if (!estado.disparos.has(nome)) {
        estado.disparos.add(nome);
        acao();
      }
    };

    // Esta parte é lógica
    function novoCiclo() {
      estado.tempoDoSinal = 0;
      estado.disparos.clear();
    }

    // Esta parte é lógica
    // Modo "abertura": percorre os 5 sinais em sequência.
    function avancarAbertura(dt) {
      estado.tempoDoSinal += dt;
      if (estado.indiceDoSinal < 0 || estado.tempoDoSinal > DURACAO_DO_CICLO) {
        estado.indiceDoSinal = (estado.indiceDoSinal + 1) % SINAIS_DA_ABERTURA.length;
        novoCiclo();
        refOpcoes.current.aoTrocarSinal?.(SINAIS_DA_ABERTURA[estado.indiceDoSinal]);
      }
      const atual = SINAIS_DA_ABERTURA[estado.indiceDoSinal];
      animarSinal(atual.chave, estado.tempoDoSinal, dt, cena, umaVez);
    }

    // Esta parte é lógica
    // Modo "sinal": repete um sinal. No "virar", alterna esquerda e direita.
    function chaveDoSinalFixo() {
      const pedido = refOpcoes.current.sinal ?? "continuar";
      if (pedido !== "virar") return pedido;
      return estado.ciclo % 2 === 0 ? "esquerda" : "direita";
    }

    // Esta parte é lógica
    function avancarSinalFixo(dt) {
      const pedido = refOpcoes.current.sinal ?? "continuar";
      if (pedido !== estado.sinalFixo) {
        // O sinal mudou (a pessoa rolou para outro): recomeça do zero
        estado.sinalFixo = pedido;
        estado.ciclo = 0;
        novoCiclo();
        cena.limparAneis();
        refOpcoes.current.aoTrocarSinal?.({ chave: chaveDoSinalFixo(), movimento: MOVIMENTO_DO_SINAL[chaveDoSinalFixo()] });
      }
      estado.tempoDoSinal += dt;
      if (estado.tempoDoSinal > DURACAO_DO_CICLO) {
        estado.ciclo += 1;
        novoCiclo();
        refOpcoes.current.aoTrocarSinal?.({ chave: chaveDoSinalFixo(), movimento: MOVIMENTO_DO_SINAL[chaveDoSinalFixo()] });
      }
      animarSinal(chaveDoSinalFixo(), estado.tempoDoSinal, dt, cena, umaVez);
    }

    // Esta parte é lógica
    // Modo "parar" (404): vibra até 4,6 s e para de vez. O limite conta o
    // tempo REAL (relógio do navegador), e não o tempo da animação: num
    // aparelho lento, cada passo da animação é limitado a 0,05 s, e o
    // tempo da animação andaria mais devagar que o real. A WCAG 2.2.2
    // fala de segundos de verdade.
    function avancarParar(dt) {
      const agora = performance.now();
      if (estado.inicioDoParar === null) estado.inicioDoParar = agora;
      const decorrido = (agora - estado.inicioDoParar) / 1000;
      estado.tempoDoSinal += dt;
      if (decorrido >= LIMITE_DO_PARAR) {
        estado.terminou = true;
        cena.limparAneis();
        apagarPartes(cena);
        return;
      }
      const dentroDoCiclo = estado.tempoDoSinal % DURACAO_DO_CICLO;
      if (dentroDoCiclo < dt) estado.disparos.clear(); // começou outro ciclo
      animarSinal("parar", dentroDoCiclo, dt, cena, umaVez, decorrido < ULTIMO_PULSO_DO_PARAR);
    }

    // Esta parte é lógica
    // Entrada da abertura: a pulseira cresce de 0,35 para 1 e dá uma
    // volta completa em 1,6 s (depois da capa).
    function avancarEntrada(dt) {
      estado.entrada = Math.min(DURACAO_DA_ENTRADA, estado.entrada + dt);
      const progresso = estado.entrada / DURACAO_DA_ENTRADA;
      const suave = 1 - Math.pow(1 - progresso, 3);
      cena.balanco.scale.setScalar(0.35 + 0.65 * suave);
      pulseira.rotation.y = -0.55 - (1 - suave) * Math.PI * 2;
    }

    // Esta parte é lógica
    // Um quadro da animação.
    function passo(dt) {
      const op = refOpcoes.current;
      estado.tempo += dt;
      if (modo === "abertura") {
        if (op.aguardarEntrada) {
          cena.balanco.scale.setScalar(0.35);
        } else if (estado.entrada < DURACAO_DA_ENTRADA) {
          if (estado.entrada < 0) estado.entrada = 0;
          avancarEntrada(dt);
        } else {
          cena.balanco.scale.setScalar(1);
          avancarAbertura(dt);
        }
        // Balança devagar e acompanha o mouse (só em telas com mouse)
        const alvoY = Math.sin(estado.tempo * 0.35) * 0.42 + estado.mouse.x * 0.35;
        cena.balanco.rotation.y += (alvoY - cena.balanco.rotation.y) * 0.05;
        cena.balanco.rotation.x += (estado.mouse.y * 0.12 - cena.balanco.rotation.x) * 0.05;
      } else if (modo === "sinal") {
        avancarSinalFixo(dt);
        cena.balanco.rotation.y = Math.sin(estado.tempo * 0.5) * 0.3;
      } else {
        avancarParar(dt);
        if (!estado.terminou) cena.balanco.rotation.y = Math.sin(estado.tempo * 0.5) * 0.25;
      }
      cena.avancarAneis(dt);
    }

    // Esta parte é lógica
    // Desenha o que está na cena e avisa quem usa (linhas da abertura).
    function desenhar() {
      destacarParte(cena, refOpcoes.current.parteAtiva, estado.tempo);
      cena.desenhar();
      refOpcoes.current.aoDesenhar?.(cena.projetar);
      if (estado.primeiroQuadro) {
        estado.primeiroQuadro = false;
        refOpcoes.current.aoPronta?.();
      }
    }

    // Esta parte é lógica
    // Quadro parado dos efeitos desligados: pulseira inteira, de 3/4,
    // sem anéis e sem nada aceso (só a parte do link focado).
    function poseParada() {
      cena.limparAneis();
      apagarPartes(cena);
      cena.balanco.scale.setScalar(1);
      pulseira.rotation.y = -0.55;
      cena.balanco.rotation.set(0, -0.18, 0);
    }

    // Esta parte é lógica
    function deveAnimar() {
      const op = refOpcoes.current;
      if (!estado.visivel || op.pausado || estado.terminou) return false;
      if (!op.efeitosLigados) return false;
      if (modo === "abertura" && op.aguardarEntrada) return false;
      return true;
    }

    // Esta parte é lógica
    function quadro(instante) {
      const dt = Math.min((instante - estado.ultimoInstante) / 1000, 0.05);
      estado.ultimoInstante = instante;
      passo(dt);
      desenhar();
      if (deveAnimar()) {
        estado.idQuadro = requestAnimationFrame(quadro);
      } else {
        estado.rodando = false; // pausou, saiu da tela ou terminou
      }
    }

    // Esta parte é lógica
    // Chamada sempre que algo muda (visibilidade, pausa, preferências,
    // tamanho, tema, parte ativa): liga, desliga ou só redesenha.
    function atualizar() {
      if (!refOpcoes.current.efeitosLigados) {
        cancelAnimationFrame(estado.idQuadro);
        estado.rodando = false;
        poseParada();
        desenhar();
        return;
      }
      if (modo === "abertura" && refOpcoes.current.aguardarEntrada) {
        cena.balanco.scale.setScalar(0.35);
      }
      if (deveAnimar()) {
        if (!estado.rodando) {
          estado.rodando = true;
          estado.ultimoInstante = performance.now();
          estado.idQuadro = requestAnimationFrame(quadro);
        }
      } else if (!estado.rodando) {
        desenhar();
      }
    }
    refControle.current = atualizar;

    // Tamanho: acompanha a caixa (girar o celular, zoom)
    const observadorTamanho = new ResizeObserver(() => {
      cena.redimensionar(canvas.clientWidth, canvas.clientHeight);
      if (!estado.rodando) desenhar();
    });
    observadorTamanho.observe(canvas);
    cena.redimensionar(canvas.clientWidth, canvas.clientHeight);

    // Só anima enquanto aparece na tela
    const observadorVisibilidade = new IntersectionObserver(([registro]) => {
      estado.visivel = registro.isIntersecting;
      atualizar();
    });
    observadorVisibilidade.observe(canvas);

    // Tema do aparelho (o interruptor "Efeitos" chega pelo efeito de baixo)
    const consultaTema = window.matchMedia("(prefers-color-scheme: dark)");
    const aoMudarTema = () => {
      cena.aplicarCorDaFaixa();
      if (!estado.rodando) desenhar();
    };
    consultaTema.addEventListener("change", aoMudarTema);

    // Mouse: só na abertura, em telas com mouse (seção 18.9)
    const temMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const aoMoverMouse = (evento) => {
      estado.mouse.x = (evento.clientX / window.innerWidth) * 2 - 1;
      estado.mouse.y = (evento.clientY / window.innerHeight) * 2 - 1;
    };
    if (modo === "abertura" && temMouse) window.addEventListener("pointermove", aoMoverMouse);

    // Se a placa de vídeo "perder" o WebGL no meio do caminho
    const aoPerderContexto = (evento) => {
      evento.preventDefault();
      cancelAnimationFrame(estado.idQuadro);
      refOpcoes.current.aoFalhar?.();
    };
    canvas.addEventListener("webglcontextlost", aoPerderContexto);

    // Primeiro desenho (também é o quadro parado, se for o caso)
    if (!refOpcoes.current.efeitosLigados) poseParada();
    else if (modo === "abertura" && refOpcoes.current.aguardarEntrada) cena.balanco.scale.setScalar(0.35);
    desenhar();

    // Esta parte é lógica
    // Limpeza ao sair da página
    return () => {
      refControle.current = null;
      cancelAnimationFrame(estado.idQuadro);
      observadorTamanho.disconnect();
      observadorVisibilidade.disconnect();
      consultaTema.removeEventListener("change", aoMudarTema);
      window.removeEventListener("pointermove", aoMoverMouse);
      canvas.removeEventListener("webglcontextlost", aoPerderContexto);
      cena.liberar();
      canvas.remove();
    };
  }, [refCaixa, modo]);

  // Esta parte é lógica
  // Quando a pausa, a parte acesa, a entrada, o sinal ou o interruptor
  // "Efeitos" mudam, a cena decide se volta a animar ou só redesenha.
  useEffect(() => {
    refControle.current?.();
  }, [pausado, parteAtiva, aguardarEntrada, sinal, efeitosLigados]);
}
