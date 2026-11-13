import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { criarPulseira } from "@/lib/pulseira3d/modelo";

/*
  cena — monta a cena 3D da pulseira com Three.js (seções 18.7 e 19.12).

  Three.js desenha em 3D dentro de um <canvas>, usando o WebGL (a parte
  da placa de vídeo que o navegador libera para páginas). Uma cena 3D
  tem sempre:
  - cena (scene): o "palco" com todos os objetos;
  - câmera: de onde olhamos;
  - luzes: sem elas, tudo ficaria preto. Aqui, como no protótipo, há um
    "ambiente" (RoomEnvironment: o reflexo de uma sala clara, que dá
    brilho realista ao plástico e ao metal), uma luz principal branca e
    uma luz de contorno quente por trás;
  - renderizador: desenha a cena no <canvas> a cada quadro.

  A pulseira (o modelo) vem de lib/pulseira3d/modelo.js, o módulo único.
  Ela fica dentro de um "pivô": girar o pivô gira a pulseira inteira (o
  giro de 360°, o arrasto e as setas).

  Cada objeto é uma "malha" (mesh) = geometria (a forma) + material (a
  cor e o brilho). Geometrias, materiais e texturas ocupam memória da
  placa de vídeo e são liberados à mão quando a cena sai da tela.

  Este arquivo não sabe de React: só cria a cena e devolve as peças para
  o hook usePulseira3D animar.
*/

// Câmera de cada modo: posição e abertura (graus)
const CAMERA_POR_MODO = {
  abertura: { posicao: [0, 0.25, 6.6], abertura: 30 },
  explorar: { posicao: [0, 0.25, 7.2], abertura: 30 },
  sinal: { posicao: [0, 0.15, 5.6], abertura: 30 },
  parar: { posicao: [0, 0.2, 6.4], abertura: 30 },
};

// Esta parte é lógica
// Lê a cor da tira no CSS (--cor-faixa-3d).
export function lerCorDaFaixa() {
  const cor = getComputedStyle(document.documentElement).getPropertyValue("--cor-faixa-3d").trim();
  return cor || "#FC4C02";
}

// Esta parte é lógica
// Cria o renderizador. Primeiro pede o WebGL2 ao navegador: se ele não
// existir (aparelho antigo ou WebGL desligado), lança um erro nosso, sem
// mensagem no console, e quem chama mostra a descrição em texto. (Se o
// Three.js tentasse sozinho, ele escreveria um erro no console antes.)
function criarRenderizador(canvas) {
  const contexto = canvas.getContext("webgl2", { antialias: true, alpha: true });
  if (!contexto) throw new Error("sem-webgl");
  const renderizador = new THREE.WebGLRenderer({ canvas, context: contexto, antialias: true, alpha: true });
  // Densidade de pixels limitada a 1,75 (seção 19.1, item 9): em telas
  // muito densas, desenhar todos os pixels pesaria sem diferença visível.
  renderizador.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderizador.outputColorSpace = THREE.SRGBColorSpace;
  renderizador.toneMapping = THREE.ACESFilmicToneMapping;
  renderizador.toneMappingExposure = 1.05;
  renderizador.setClearColor(0x000000, 0); // fundo transparente
  // Conferência dos shaders (os pequenos programas que a placa de vídeo
  // roda) só no desenvolvimento. No site publicado, o Three.js recomenda
  // desligar (compila mais rápido), e ela também escrevia no console
  // avisos do compilador do Windows ("warning X4122"), que não são erros.
  renderizador.debug.checkShaderErrors = process.env.NODE_ENV !== "production";
  return renderizador;
}

// Esta parte é lógica
// Cria tudo e devolve as peças. "modo": "abertura" | "explorar" | "sinal" | "parar".
export function criarCena(canvas, modo) {
  const renderizador = criarRenderizador(canvas);
  const cena = new THREE.Scene();

  // Ambiente (reflexos) e luzes, como no protótipo
  const gerador = new THREE.PMREMGenerator(renderizador);
  const sala = new RoomEnvironment();
  const ambiente = gerador.fromScene(sala, 0.04).texture;
  cena.environment = ambiente;
  const principal = new THREE.DirectionalLight(0xffffff, 1.6);
  principal.position.set(3, 4, 5);
  const contorno = new THREE.DirectionalLight(0xffb088, 1.2);
  contorno.position.set(-4, 1, -3);
  cena.add(principal, contorno);

  const { posicao, abertura } = CAMERA_POR_MODO[modo] ?? CAMERA_POR_MODO.abertura;
  const camera = new THREE.PerspectiveCamera(abertura, 1, 0.1, 50);
  camera.position.set(...posicao);
  camera.lookAt(0, 0, 0);

  const modelo = criarPulseira(lerCorDaFaixa());
  const pivo = new THREE.Group();
  pivo.add(modelo.grupo);
  cena.add(pivo);

  const posicaoTemporaria = new THREE.Vector3();

  // Esta parte é lógica
  function redimensionar(largura, altura) {
    if (!largura || !altura) return;
    renderizador.setSize(largura, altura, false);
    camera.aspect = largura / altura;
    camera.updateProjectionMatrix();
  }

  // Esta parte é lógica
  // Posição de uma âncora na tela, em pixels da janela (como o
  // getBoundingClientRect), para ligar as linhas da abertura aos links.
  function projetar(nomeDaAncora) {
    const objeto = modelo.ancoras[nomeDaAncora];
    if (!objeto) return null;
    objeto.getWorldPosition(posicaoTemporaria);
    posicaoTemporaria.project(camera);
    const { left, top, width, height } = canvas.getBoundingClientRect();
    return {
      x: left + ((posicaoTemporaria.x + 1) / 2) * width,
      y: top + ((1 - posicaoTemporaria.y) / 2) * height,
    };
  }

  // Esta parte é lógica
  function desenhar() {
    renderizador.render(cena, camera);
  }

  // Esta parte é lógica
  // Libera tudo da memória da placa de vídeo (seção 19.1, item 9).
  function liberar() {
    const materiais = new Set();
    const geometrias = new Set();
    cena.traverse((objeto) => {
      if (objeto.geometry) geometrias.add(objeto.geometry);
      if (objeto.material) materiais.add(objeto.material);
    });
    for (const geometria of geometrias) geometria.dispose();
    for (const material of materiais) material.dispose();
    modelo.liberar(); // a textura do brilho das luzes
    ambiente.dispose();
    sala.dispose?.();
    gerador.dispose();
    renderizador.dispose();
    // Devolve o "contexto" do WebGL ao navegador na hora. Os navegadores
    // só deixam algumas dezenas abertos ao mesmo tempo.
    renderizador.forceContextLoss();
  }

  return { modelo, pivo, redimensionar, projetar, desenhar, liberar };
}
