/*
  cortinaDomos — desenho da cortina entre páginas (seções 18.9 e 19.6).

  A cortina é uma grade de domos (círculos) de --cor-cortina, de 30 em
  30 px, desenhada num <canvas>. Na "varredura diagonal", cada domo cresce
  um pouco depois do vizinho de cima e da esquerda: a tela vai sendo
  coberta do canto de cima à esquerda até o de baixo à direita, como
  pixels. Na saída, os domos encolhem na mesma ordem.

  Por que um <canvas>: numa máscara de CSS todos os domos têm o mesmo
  raio. Aqui cada domo tem o seu tamanho em cada quadro.

  - progresso: de 0 a 1 (quem anima é o useTransicaoPagina, com o GSAP).
  - Cada domo cresce durante 45% do tempo; o atraso dele vai de 0 (canto
    de cima à esquerda) a 55% (canto de baixo à direita). Raio de 0 a
    22 px: com 22 px, os domos de células de 30 px se encostam e cobrem
    tudo.
  - Nada pisca: cada domo só cresce (ou só encolhe) uma vez.
  - Densidade de pixels limitada a 1,75 (seção 19.1, item 9).

  Este arquivo não sabe de React: só desenha.
*/
const PASSO = 30; // px entre os centros dos domos
const RAIO_MAXIMO = 22; // px: cobre a tela inteira
const ATRASO_MAXIMO = 0.55;
const DURACAO_DO_DOMO = 0.45;

// Ajusta o tamanho do canvas à janela (em pixels reais da tela).
function ajustarTamanho(canvas) {
  const densidade = Math.min(1.75, window.devicePixelRatio || 1);
  const largura = window.innerWidth;
  const altura = window.innerHeight;
  const larguraReal = Math.round(largura * densidade);
  const alturaReal = Math.round(altura * densidade);
  if (canvas.width !== larguraReal || canvas.height !== alturaReal) {
    canvas.width = larguraReal;
    canvas.height = alturaReal;
  }
  return { densidade, largura, altura };
}

// Desenha um quadro. "entrando": true = cobrindo a tela; false = revelando.
export function desenharDomos(canvas, progresso, entrando, cor) {
  const contexto = canvas.getContext("2d");
  if (!contexto) return;
  const { densidade, largura, altura } = ajustarTamanho(canvas);
  contexto.setTransform(densidade, 0, 0, densidade, 0, 0);
  contexto.clearRect(0, 0, largura, altura);
  contexto.fillStyle = cor;

  // Tela toda coberta: um retângulo só (mais leve que centenas de domos).
  if ((entrando && progresso >= 1) || (!entrando && progresso <= 0)) {
    contexto.fillRect(0, 0, largura, altura);
    return;
  }

  const colunas = Math.ceil(largura / PASSO) + 1;
  const linhas = Math.ceil(altura / PASSO) + 1;
  const total = colunas + linhas;
  contexto.beginPath();
  for (let i = 0; i < colunas; i++) {
    for (let j = 0; j < linhas; j++) {
      const atraso = ((i + j) / total) * ATRASO_MAXIMO;
      let crescimento = Math.max(0, Math.min(1, (progresso - atraso) / DURACAO_DO_DOMO));
      if (!entrando) crescimento = 1 - crescimento;
      const raio = crescimento * RAIO_MAXIMO;
      if (raio > 0.3) {
        contexto.moveTo(i * PASSO + raio, j * PASSO);
        contexto.arc(i * PASSO, j * PASSO, raio, 0, Math.PI * 2);
      }
    }
  }
  contexto.fill();
}

export function limparDomos(canvas) {
  canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
}
