import * as THREE from "three";

/*
  cena — monta a pulseira 3D com Three.js (seção 18.7).

  Three.js desenha em 3D dentro de um <canvas>, usando o WebGL (a parte
  da placa de vídeo que o navegador libera para páginas). Uma cena 3D
  tem sempre:
  - cena (scene): o "palco" com todos os objetos;
  - câmera: de onde olhamos (aqui, 32° de abertura, vista de 3/4);
  - luzes: sem elas, tudo ficaria preto;
  - renderizador: desenha a cena no <canvas> a cada quadro.

  Cada objeto é uma "malha" (mesh) = geometria (a forma) + material (a
  cor e o brilho). Geometrias e materiais ocupam memória da placa de
  vídeo e precisam ser liberados à mão quando a cena sai da tela.

  Este arquivo não sabe de React: só cria a cena e devolve as peças para
  o hook usePulseira3D animar.
*/

const OURO = new THREE.Color("#D4A24A");
const LILAS = new THREE.Color("#C4B5FD");
const ESCURO = 0x0b0716;

// Laço oval da tira: alto (y) e estreito (z)
const RAIO_Y = 1.12;
const RAIO_Z = 0.72;

// Distância da câmera: a abertura é mais larga que alta; a pulseira
// pequena e a da 404 ficam em caixas quadradas.
const CAMERA_POR_MODO = {
  abertura: { posicao: [0, 0.45, 5.7], alvo: [0, -0.02, 0] },
  sinal: { posicao: [0, 0.4, 6.4], alvo: [0, -0.05, 0] },
  parar: { posicao: [0, 0.4, 6.2], alvo: [0, -0.05, 0] },
};

// Esta parte é lógica
// Lê a cor da tira no CSS (--cor-faixa-3d), que muda com o tema.
export function lerCorDaFaixa() {
  const cor = getComputedStyle(document.documentElement).getPropertyValue("--cor-faixa-3d").trim();
  return cor || "#4F2BAB";
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
  // Densidade de pixels limitada a 1,75 (seção 18.2): em telas muito
  // densas, desenhar todos os pixels pesaria sem diferença visível.
  renderizador.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderizador.outputColorSpace = THREE.SRGBColorSpace;
  renderizador.setClearColor(0x000000, 0); // fundo transparente
  return renderizador;
}

// Esta parte é lógica
function adicionarLuzes(cena) {
  cena.add(new THREE.HemisphereLight(0xffffff, 0x3b1d8b, 1.6)); // luz do "céu" e do "chão"
  const principal = new THREE.DirectionalLight(0xffffff, 2.4);
  principal.position.set(2.5, 4, 3);
  const contorno = new THREE.DirectionalLight(LILAS, 2.0); // contorno lilás, por trás
  contorno.position.set(-3, 1, -3);
  const dourada = new THREE.PointLight(OURO, 6, 6); // dourada suave, por cima
  dourada.position.set(0, 2.2, 1.5);
  cena.add(principal, contorno, dourada);
}

// Esta parte é lógica
// Monta a pulseira: tira, furos, módulo, botões, microfone, alto-falante,
// motores e atuador de pressão. Devolve as partes que animam.
function montarPulseira(corFaixa) {
  const pulseira = new THREE.Group();
  pulseira.rotation.y = -0.55; // vista de 3/4

  // Tira: um toro (anel) girado para o eixo x e achatado, vira um laço
  // de silicone alto e estreito. Fosca, com brilho lilás (sheen).
  const materialFaixa = new THREE.MeshPhysicalMaterial({
    color: corFaixa,
    roughness: 0.62,
    sheen: 0.6,
    sheenRoughness: 0.5,
    sheenColor: LILAS,
  });
  const geometriaFaixa = new THREE.TorusGeometry(1, 0.075, 28, 200);
  geometriaFaixa.rotateY(Math.PI / 2);
  const faixa = new THREE.Mesh(geometriaFaixa, materialFaixa);
  faixa.scale.set(3.3, RAIO_Y, RAIO_Z);
  pulseira.add(faixa);

  // Seis furos escuros na parte de trás da tira
  const materialEscuro = new THREE.MeshBasicMaterial({ color: ESCURO });
  const geometriaFuro = new THREE.CircleGeometry(0.035, 20);
  for (let i = 0; i < 6; i++) {
    const angulo = ((118 + i * 9.5) * Math.PI) / 180;
    const y = RAIO_Y * Math.sin(angulo);
    const z = RAIO_Z * Math.cos(angulo);
    // Direção "para fora" da tira naquele ponto, para o furo ficar colado nela
    const normal = new THREE.Vector3(0, y / (RAIO_Y * RAIO_Y), z / (RAIO_Z * RAIO_Z)).normalize();
    const furo = new THREE.Mesh(geometriaFuro, materialEscuro);
    furo.position.set(0, y, z).addScaledVector(normal, 0.085);
    furo.lookAt(furo.position.clone().add(normal));
    pulseira.add(furo);
  }

  // Módulo em forma de pílula na frente, brilhante (clearcoat), mesma cor
  const materialModulo = new THREE.MeshPhysicalMaterial({
    color: corFaixa,
    roughness: 0.22,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
  });
  const modulo = new THREE.Mesh(new THREE.CapsuleGeometry(0.3, 0.56, 12, 40), materialModulo);
  modulo.scale.set(1, 1, 0.36);
  modulo.position.set(0, 0, RAIO_Z + 0.05);
  pulseira.add(modulo);
  const frenteDoModulo = RAIO_Z + 0.05 + 0.3 * 0.36;

  // Botões dourados: grande (informar o destino) e pequeno (trocar o modo).
  // Cada um tem o próprio material, para poder "acender" sozinho.
  function criarBotao(raio, y) {
    const geometria = new THREE.CylinderGeometry(raio, raio * 1.04, 0.05, 48);
    geometria.rotateX(Math.PI / 2);
    const botao = new THREE.Mesh(
      geometria,
      new THREE.MeshStandardMaterial({ color: OURO, metalness: 0.85, roughness: 0.28, emissive: OURO, emissiveIntensity: 0 }),
    );
    botao.position.set(0, y, frenteDoModulo + 0.005);
    pulseira.add(botao);
    return botao;
  }
  const botaoDestino = criarBotao(0.12, 0.02);
  const botaoModo = criarBotao(0.055, -0.3);

  // Microfone (um furo em cima) e alto-falante (três furos embaixo)
  const geometriaPonto = new THREE.CircleGeometry(0.018, 16);
  for (const [x, y] of [[0, 0.42], [-0.06, -0.46], [0, -0.46], [0.06, -0.46]]) {
    const ponto = new THREE.Mesh(geometriaPonto, materialEscuro);
    ponto.position.set(x, y, frenteDoModulo - 0.012);
    pulseira.add(ponto);
  }

  // Motores de vibração: cápsulas douradas finas, uma de cada lado
  function criarMotor(x) {
    const motor = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.035, 0.34, 6, 16),
      new THREE.MeshStandardMaterial({ color: OURO, metalness: 0.6, roughness: 0.35, emissive: OURO, emissiveIntensity: 0 }),
    );
    motor.position.set(x, 0, RAIO_Z + 0.07);
    pulseira.add(motor);
    return motor;
  }
  const motorEsquerdo = criarMotor(-0.315);
  const motorDireito = criarMotor(0.315);

  // Atuador de pressão: disco dourado atrás do módulo, do lado de dentro
  const geometriaAtuador = new THREE.CylinderGeometry(0.13, 0.13, 0.03, 36);
  geometriaAtuador.rotateX(Math.PI / 2);
  const atuador = new THREE.Mesh(
    geometriaAtuador,
    new THREE.MeshStandardMaterial({ color: OURO, metalness: 0.5, roughness: 0.4, emissive: OURO, emissiveIntensity: 0 }),
  );
  atuador.position.set(0, 0, RAIO_Z - 0.1);
  pulseira.add(atuador);

  // Ponto invisível na parte de baixo da tira (link "Transporte público")
  const parteDeBaixo = new THREE.Object3D();
  parteDeBaixo.position.set(-0.12, -1.12, 0.05);
  pulseira.add(parteDeBaixo);

  return {
    pulseira,
    materiaisDaFaixa: [materialFaixa, materialModulo],
    modulo,
    botaoDestino,
    botaoModo,
    motorEsquerdo,
    motorDireito,
    atuador,
    // Pontos onde as linhas da abertura se ligam (nomes dos links da 18.6)
    ancoras: {
      destino: botaoDestino,
      esquerdo: motorEsquerdo,
      faixa: parteDeBaixo,
      modo: botaoModo,
      direito: motorDireito,
      pressao: atuador,
    },
    // Partes que "acendem" quando o link é focado (a tira não acende)
    destacaveis: {
      destino: botaoDestino,
      esquerdo: motorEsquerdo,
      modo: botaoModo,
      direito: motorDireito,
      pressao: atuador,
    },
  };
}

// Esta parte é lógica
// Cria tudo e devolve as peças. "modo": "abertura" | "sinal" | "parar".
export function criarCena(canvas, modo) {
  const renderizador = criarRenderizador(canvas);
  const cena = new THREE.Scene();

  const { posicao, alvo } = CAMERA_POR_MODO[modo] ?? CAMERA_POR_MODO.abertura;
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
  camera.position.set(...posicao);
  camera.lookAt(...alvo);

  adicionarLuzes(cena);

  const partes = montarPulseira(lerCorDaFaixa());
  // "balanco" envolve a pulseira: ele balança, segue o mouse e treme no
  // sinal de parar, sem mexer na vista de 3/4 da pulseira.
  const balanco = new THREE.Group();
  balanco.add(partes.pulseira);
  cena.add(balanco);

  // Anéis dourados de "pulso", que saem da parte que vibra e somem em 0,9 s
  const geometriaAnel = new THREE.RingGeometry(0.16, 0.19, 64);
  const aneis = [];
  const posicaoTemporaria = new THREE.Vector3();

  // Esta parte é lógica
  function soltarPulso(parte, forca = 1) {
    const material = new THREE.MeshBasicMaterial({
      color: OURO,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      depthWrite: false,
      depthTest: false,
    });
    const anel = new THREE.Mesh(geometriaAnel, material);
    parte.getWorldPosition(anel.position);
    cena.add(anel);
    aneis.push({ anel, tempo: 0, forca });
  }

  // Esta parte é lógica
  // Avança os anéis: crescem, ficam transparentes e saem da cena.
  function avancarAneis(dt) {
    for (let i = aneis.length - 1; i >= 0; i--) {
      const item = aneis[i];
      item.tempo += dt;
      const progresso = item.tempo / 0.9;
      item.anel.scale.setScalar(1 + progresso * 4.5 * item.forca);
      item.anel.material.opacity = Math.max(0, 0.85 * (1 - progresso));
      item.anel.quaternion.copy(camera.quaternion); // sempre de frente para a câmera
      if (progresso >= 1) {
        cena.remove(item.anel);
        item.anel.material.dispose();
        aneis.splice(i, 1);
      }
    }
  }

  // Esta parte é lógica
  function limparAneis() {
    for (const item of aneis) {
      cena.remove(item.anel);
      item.anel.material.dispose();
    }
    aneis.length = 0;
  }

  // Esta parte é lógica
  function redimensionar(largura, altura) {
    if (!largura || !altura) return;
    renderizador.setSize(largura, altura, false);
    camera.aspect = largura / altura;
    camera.updateProjectionMatrix();
  }

  // Esta parte é lógica
  // Posição de uma âncora na tela, em pixels, a partir do canto do canvas.
  function projetar(nomeDaAncora) {
    const objeto = partes.ancoras[nomeDaAncora];
    if (!objeto) return null;
    objeto.getWorldPosition(posicaoTemporaria);
    posicaoTemporaria.project(camera);
    const { width, height } = canvas.getBoundingClientRect();
    return {
      x: ((posicaoTemporaria.x + 1) / 2) * width,
      y: ((1 - posicaoTemporaria.y) / 2) * height,
    };
  }

  // Esta parte é lógica
  function aplicarCorDaFaixa() {
    const cor = lerCorDaFaixa();
    for (const material of partes.materiaisDaFaixa) material.color.set(cor);
  }

  // Esta parte é lógica
  function desenhar() {
    renderizador.render(cena, camera);
  }

  // Esta parte é lógica
  // Libera tudo da memória da placa de vídeo (seção 18.2, item 9).
  function liberar() {
    limparAneis();
    geometriaAnel.dispose();
    cena.traverse((objeto) => {
      if (objeto.geometry) objeto.geometry.dispose();
      if (objeto.material) objeto.material.dispose();
    });
    renderizador.dispose();
    // Devolve o "contexto" do WebGL ao navegador na hora. Os navegadores
    // só deixam algumas dezenas abertos ao mesmo tempo.
    renderizador.forceContextLoss();
  }

  return {
    partes,
    balanco,
    soltarPulso,
    avancarAneis,
    limparAneis,
    redimensionar,
    projetar,
    aplicarCorDaFaixa,
    desenhar,
    liberar,
  };
}
