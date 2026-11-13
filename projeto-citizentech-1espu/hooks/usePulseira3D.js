import { useEffect, useLayoutEffect, useRef } from "react";
import { criarCena } from "@/lib/pulseira3d/cena";
import { PULSE_EM_BRAILLE } from "@/lib/pulseira3d/modelo";
import { useEfeitos } from "@/hooks/useEfeitos";
import { DURACAO_DO_CICLO, MOVIMENTO_DO_SINAL, SINAIS_DA_ABERTURA } from "@/lib/pulseira3d/sinais";

/*
  usePulseira3D — liga a cena 3D ao React (seções 18.7, 19.1 e 19.12).

  Recebe a "caixa" onde a pulseira vai aparecer (refCaixa) e as opções:
  - modo:
    - "abertura" (Início): gira sozinha devagar, passa pelos 5 sinais e
      escreve P-U-L-S-E na célula Braille;
    - "explorar" (Solução, "A pulseira"): gira sozinha até a pessoa
      girar, escolher uma parte ou um sinal;
    - "sinal" (Solução, "Os sinais"): repete um sinal;
    - "parar" (página 404): faz o sinal de parar até 4,6 s e para;
  - giro: a "conexão" do useGiroPulseira (abertura e explorar): o destino
    do giro e se o giro automático está ligado;
  - sinal e pausado: no modo "sinal";
  - parteAtiva: a parte que acende (link focado na abertura; parte
    escolhida no explorar);
  - sinalAtivo: no modo "explorar", o sinal escolhido;
  - aguardarEntrada: no modo "abertura", espera a capa sair;
  - aoTrocarSinal(sinal), aoDesenhar(projetar), aoPronta(), aoFalhar().

  Regras de desempenho e de acessibilidade (seção 19.1):
  - só anima enquanto está visível na tela (IntersectionObserver) e
    enquanto algo se move (parado, só redesenha quando algo muda);
  - com os efeitos desligados: quadro parado, sem giro automático; girar
    pelos botões e setas continua valendo, sem animação;
  - pausa ("Girar sozinha" desligado na abertura, botão de pausa no
    modo "sinal"); no modo "parar", para sozinha antes de 5 s;
  - ao sair da página, libera tudo da memória.

  Por que o <canvas> é criado aqui, e não no JSX: no modo de
  desenvolvimento, o React monta, desmonta e monta de novo cada
  componente, para achar erros. Um canvas cujo WebGL já foi liberado não
  pode ser usado de novo. Criando um canvas novo a cada montagem, tanto o
  desenvolvimento quanto o site publicado funcionam.
*/

const DURACAO_DA_ENTRADA = 1.6; // s: a abertura cresce de 0,35 para 1 e dá uma volta
const LIMITE_DO_PARAR = 4.6; // s: a 404 para antes de 5 s (WCAG 2.2.2)
const VELOCIDADE_DO_GIRO = 0.45; // radianos por segundo (protótipo)
const INTERVALO_DA_LETRA = 1.1; // s entre as letras do Braille
const VISTA_DA_FRENTE = { y: -0.35, x: 0.12 };

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

  const { modo, pausado, parteAtiva, aguardarEntrada, sinal, sinalAtivo } = opcoes;

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

    const { modelo, pivo } = cena;
    const interativo = modo === "abertura" || modo === "explorar";
    const giro = () => refOpcoes.current.giro;
    const inicio = interativo ? giro()?.refAlvo.current ?? VISTA_DA_FRENTE : VISTA_DA_FRENTE;

    const estado = {
      rodando: false,
      idQuadro: 0,
      ultimoInstante: 0,
      tempo: 0, // relógio da animação
      visivel: false,
      rotY: inicio.y,
      rotX: inicio.x,
      indiceDoSinal: -1,
      tempoDoSinal: 0,
      ciclo: 0,
      sinalFixo: null,
      letra: 0,
      tempoDaLetra: 0,
      entrada: refOpcoes.current.aguardarEntrada ? -1 : DURACAO_DA_ENTRADA,
      terminou: false,
      inicioDoParar: null, // instante real (ms) do primeiro quadro do modo "parar"
      primeiroQuadro: true,
    };

    // Esta parte é lógica
    const girandoSozinha = () => interativo && !!giro()?.refGirando.current;

    // Esta parte é lógica
    // A pulseira ainda não chegou ao destino do giro?
    function aCaminho() {
      const alvo = giro()?.refAlvo.current;
      if (!interativo || !alvo) return false;
      return Math.abs(alvo.y - estado.rotY) > 0.001 || Math.abs(alvo.x - estado.rotX) > 0.001;
    }

    // Esta parte é lógica
    // Avisa quem usa qual sinal está passando (legenda e palavra de fundo)
    function avisarSinal(chave) {
      if (modo === "abertura") refOpcoes.current.aoTrocarSinal?.(SINAIS_DA_ABERTURA[estado.indiceDoSinal]);
      else refOpcoes.current.aoTrocarSinal?.({ chave, movimento: MOVIMENTO_DO_SINAL[chave] });
    }

    // Esta parte é lógica
    // Modo "sinal": repete um sinal. No "virar", alterna esquerda e direita.
    function chaveDoSinalFixo() {
      const pedido = refOpcoes.current.sinal ?? "continuar";
      if (pedido !== "virar") return pedido;
      return estado.ciclo % 2 === 0 ? "esquerda" : "direita";
    }

    // Esta parte é lógica
    // Qual sinal e qual parte aparecem neste quadro.
    function sinalEParte() {
      const op = refOpcoes.current;
      if (modo === "abertura") {
        const atual = estado.indiceDoSinal >= 0 ? SINAIS_DA_ABERTURA[estado.indiceDoSinal].chave : null;
        return { sinal: op.efeitosLigados ? atual : null, parte: modelo.parteDoLink[op.parteAtiva] ?? null };
      }
      if (modo === "explorar") {
        const sinalEscolhido = op.sinalAtivo ?? (op.parteAtiva === "luzes" ? "continuar" : null);
        return { sinal: sinalEscolhido, parte: op.parteAtiva ?? null };
      }
      if (modo === "sinal") return { sinal: chaveDoSinalFixo(), parte: null };
      return { sinal: estado.terminou || !op.efeitosLigados ? null : "parar", parte: null };
    }

    // Esta parte é lógica
    // Um passo da animação (efeitos ligados).
    function passo(dt) {
      const op = refOpcoes.current;
      estado.tempo += dt;

      if (interativo) {
        const alvo = giro()?.refAlvo.current;
        if (alvo) {
          if (girandoSozinha() && !(modo === "abertura" && op.aguardarEntrada)) alvo.y += dt * VELOCIDADE_DO_GIRO;
          const suave = Math.min(1, dt * 6);
          estado.rotY += (alvo.y - estado.rotY) * suave;
          estado.rotX += (alvo.x - estado.rotX) * suave;
        }
      } else {
        // "sinal" e "parar": de frente, balançando de leve
        estado.rotY = VISTA_DA_FRENTE.y + Math.sin(estado.tempo * 0.5) * 0.25;
        estado.rotX = VISTA_DA_FRENTE.x;
      }

      // Abertura: entrada depois da capa e a passagem pelos sinais
      if (modo === "abertura") {
        if (op.aguardarEntrada) {
          pivo.scale.setScalar(0.35);
        } else {
          if (estado.entrada < 0) estado.entrada = 0;
          estado.entrada = Math.min(DURACAO_DA_ENTRADA, estado.entrada + dt);
          const progresso = 1 - Math.pow(1 - estado.entrada / DURACAO_DA_ENTRADA, 3);
          pivo.scale.setScalar(0.35 + 0.65 * progresso);
          if (girandoSozinha()) {
            estado.tempoDoSinal += dt;
            if (estado.indiceDoSinal < 0 || estado.tempoDoSinal > DURACAO_DO_CICLO) {
              estado.indiceDoSinal = (estado.indiceDoSinal + 1) % SINAIS_DA_ABERTURA.length;
              estado.tempoDoSinal = 0;
              avisarSinal();
            }
          }
        }
      }

      // Pulseira pequena: o sinal escolhido, em ciclos
      if (modo === "sinal") {
        const pedido = op.sinal ?? "continuar";
        if (pedido !== estado.sinalFixo) {
          estado.sinalFixo = pedido;
          estado.ciclo = 0;
          estado.tempoDoSinal = 0;
          avisarSinal(chaveDoSinalFixo());
        }
        estado.tempoDoSinal += dt;
        if (estado.tempoDoSinal > DURACAO_DO_CICLO) {
          estado.ciclo += 1;
          estado.tempoDoSinal = 0;
          avisarSinal(chaveDoSinalFixo());
        }
      }

      // 404: até 4,6 s de tempo REAL (relógio do navegador), e não do tempo
      // da animação: num aparelho lento, cada passo é limitado a 0,05 s, e
      // o tempo da animação andaria mais devagar que o real.
      if (modo === "parar") {
        const agora = performance.now();
        if (estado.inicioDoParar === null) estado.inicioDoParar = agora;
        if ((agora - estado.inicioDoParar) / 1000 >= LIMITE_DO_PARAR) estado.terminou = true;
      }

      // Braille: P-U-L-S-E, uma letra a cada 1,1 s, enquanto a pulseira
      // se move sozinha (ou com a célula Braille escolhida no explorar)
      const escrevendo = modo === "abertura" ? girandoSozinha() : modo === "explorar" ? girandoSozinha() || op.parteAtiva === "braille" : false;
      if (escrevendo) {
        estado.tempoDaLetra += dt;
        if (estado.tempoDaLetra > INTERVALO_DA_LETRA) {
          estado.tempoDaLetra = 0;
          estado.letra = (estado.letra + 1) % PULSE_EM_BRAILLE.length;
          modelo.escreverBraille(PULSE_EM_BRAILLE[estado.letra]);
        }
      }

      // Na abertura com o giro pausado, o sinal atual fica aceso e parado
      const congelado = modo === "abertura" && !girandoSozinha();
      modelo.atualizar({ t: estado.tempo, dt, ...sinalEParte(), semMovimento: congelado });
      pivo.rotation.set(estado.rotX, estado.rotY, 0);
    }

    // Esta parte é lógica
    // Quadro parado (efeitos desligados): pulseira de frente (ou no destino
    // escolhido pelos botões), Braille no "P" e o sinal escolhido aceso,
    // sem tremor nem piscada.
    function quadroParado() {
      const alvo = interativo ? giro()?.refAlvo.current : null;
      estado.rotY = alvo?.y ?? VISTA_DA_FRENTE.y;
      estado.rotX = alvo?.x ?? VISTA_DA_FRENTE.x;
      pivo.scale.setScalar(1);
      pivo.rotation.set(estado.rotX, estado.rotY, 0);
      modelo.escreverBraille("p");
      modelo.atualizar({ t: 0, dt: 0, ...sinalEParte(), semMovimento: true });
    }

    // Esta parte é lógica
    // Desenha e avisa quem usa (linhas da abertura).
    function desenhar() {
      cena.desenhar();
      refOpcoes.current.aoDesenhar?.(cena.projetar);
      if (estado.primeiroQuadro) {
        estado.primeiroQuadro = false;
        refOpcoes.current.aoPronta?.();
      }
    }

    // Esta parte é lógica
    // Algo precisa se mover neste momento?
    function deveAnimar() {
      const op = refOpcoes.current;
      if (!estado.visivel || !op.efeitosLigados || estado.terminou) return false;
      if (modo === "abertura") {
        if (op.aguardarEntrada) return false;
        return girandoSozinha() || aCaminho() || estado.entrada < DURACAO_DA_ENTRADA || !!op.parteAtiva;
      }
      if (modo === "explorar") return girandoSozinha() || aCaminho() || !!op.sinalAtivo || !!op.parteAtiva;
      if (modo === "sinal") return !op.pausado;
      return true; // "parar", até terminar
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
        estado.rodando = false; // parou, saiu da tela ou terminou
        if (estado.terminou) {
          modelo.atualizar({ t: estado.tempo, dt: 0, sinal: null, parte: null, semMovimento: true });
          desenhar();
        }
      }
    }

    // Esta parte é lógica
    // Chamada sempre que algo muda (visibilidade, giro, pausa, efeitos,
    // tamanho, parte ou sinal): liga, desliga ou só redesenha.
    function atualizar() {
      if (!refOpcoes.current.efeitosLigados) {
        cancelAnimationFrame(estado.idQuadro);
        estado.rodando = false;
        quadroParado();
        desenhar();
        return;
      }
      if (modo === "abertura" && refOpcoes.current.aguardarEntrada) pivo.scale.setScalar(0.35);
      if (deveAnimar()) {
        if (!estado.rodando) {
          estado.rodando = true;
          estado.ultimoInstante = performance.now();
          estado.idQuadro = requestAnimationFrame(quadro);
        }
      } else if (!estado.rodando) {
        // Parado (pausado ou fora da tela): mostra o estado atual
        modelo.atualizar({ t: estado.tempo, dt: 0, ...sinalEParte(), semMovimento: true });
        pivo.rotation.set(estado.rotX, estado.rotY, 0);
        desenhar();
      }
    }
    refControle.current = atualizar;

    // O giro (botões, setas, arrasto, giro automático) avisa quando muda
    const pararDeOuvirGiro = interativo ? giro()?.assinar(atualizar) : null;

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

    // Se a placa de vídeo "perder" o WebGL no meio do caminho
    const aoPerderContexto = (evento) => {
      evento.preventDefault();
      cancelAnimationFrame(estado.idQuadro);
      refOpcoes.current.aoFalhar?.();
    };
    canvas.addEventListener("webglcontextlost", aoPerderContexto);

    // Primeiro desenho (também é o quadro parado, se for o caso)
    if (!refOpcoes.current.efeitosLigados) quadroParado();
    else {
      if (modo === "abertura" && refOpcoes.current.aguardarEntrada) pivo.scale.setScalar(0.35);
      modelo.atualizar({ t: 0, dt: 0, ...sinalEParte(), semMovimento: true });
      pivo.rotation.set(estado.rotX, estado.rotY, 0);
    }
    desenhar();

    // Esta parte é lógica
    // Limpeza ao sair da página
    return () => {
      refControle.current = null;
      cancelAnimationFrame(estado.idQuadro);
      pararDeOuvirGiro?.();
      observadorTamanho.disconnect();
      observadorVisibilidade.disconnect();
      canvas.removeEventListener("webglcontextlost", aoPerderContexto);
      cena.liberar();
      canvas.remove();
    };
  }, [refCaixa, modo]);

  // Esta parte é lógica
  // Quando a pausa, a parte, o sinal, a entrada ou o interruptor "Efeitos"
  // mudam, a cena decide se volta a animar ou só redesenha.
  useEffect(() => {
    refControle.current?.();
  }, [pausado, parteAtiva, aguardarEntrada, sinal, sinalAtivo, efeitosLigados]);
}
