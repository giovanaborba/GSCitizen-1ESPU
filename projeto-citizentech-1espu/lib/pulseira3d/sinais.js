/*
  sinais — os sinais da Pulse na pulseira 3D (seções 18.7 e 19.12).

  Como cada sinal aparece (vibração e luzes) está no modelo
  (lib/pulseira3d/modelo.js, função atualizar). Aqui ficam só os dados:
  a ordem e os textos dos sinais da abertura, o nome do movimento da
  pulseira pequena e a duração do ciclo.

  WCAG 2.3.1 (nada pisca mais de 3 vezes por segundo): o único sinal que
  pisca é o "Aguardar", com 3 piscadas no primeiro segundo de cada ciclo
  de 1,6 s (modelo.js).
*/

// Cada sinal fica 2,8 s na tela antes do próximo (abertura) ou antes de
// recomeçar (pulseira pequena; no "Virar", troca de lado).
export const DURACAO_DO_CICLO = 2.8; // segundos

// Os 5 sinais da abertura do Início, na ordem em que aparecem (18.6).
// "palavra": a palavra gigante de fundo que acompanha o sinal.
export const SINAIS_DA_ABERTURA = [
  { chave: "esquerda", nome: "Virar à esquerda", descricao: "Vibração no lado esquerdo do pulso", palavra: "Esquerda" },
  { chave: "direita", nome: "Virar à direita", descricao: "Vibração no lado direito do pulso", palavra: "Direita" },
  { chave: "aguardar", nome: "Aguardar", descricao: "Três vibrações curtas, repetidas", palavra: "Aguardar" },
  { chave: "parar", nome: "Parar", descricao: "Vibração contínua até você parar", palavra: "Parar" },
  { chave: "continuar", nome: "Continuar", descricao: "Pressão contínua no pulso até você andar", palavra: "Continuar" },
];

// Nome do movimento mostrado junto da pulseira pequena de "Os sinais"
// (modo "sinal"). No "Virar", a pulseira alterna os dois lados.
export const MOVIMENTO_DO_SINAL = {
  continuar: "Pressão contínua",
  parar: "Vibração contínua",
  esquerda: "Vira à esquerda",
  direita: "Vira à direita",
  aguardar: "Três vibrações curtas",
};
