/*
  presetsMovimento — molas e gestos da Pulse (PADRAO_MOVIMENTO_PULSE,
  item 3; seção 19.15 da especificação).

  Todas as animações de interface feitas com o Motion usam estes valores,
  em vez de números soltos em cada componente. Assim o site inteiro "se
  move do mesmo jeito".

  - Mola (spring): uma animação que se comporta como uma mola de verdade:
    acelera, chega ao alvo e assenta, às vezes com um quique pequeno.
    Aqui cada mola é descrita pela duração visual (visualDuration, em
    segundos: quanto tempo ela PARECE durar) e pelo quique (bounce: 0 =
    sem quique). Isso garante o limite de 0,5 s do padrão.
  - Gestos da marca: PULSO (confirmar), GUIA (navegar e entrar) e o
    tremor do erro. O PISO TÁTIL (máscara de domos) é feito em CSS.
*/

// Esta parte é lógica
// Springs descritas pela duração visual (visualDuration, em segundos) e pelo quique (bounce):
// assim dá para garantir o limite de 0,5 s. Entre parênteses, a referência em rigidez/amortecimento.
export const spring = {
  rapida: { type: "spring", visualDuration: 0.18, bounce: 0.15 }, // toque, interruptor, ícones (≈ stiffness 500, damping 30, mass 0.6)
  padrao: { type: "spring", visualDuration: 0.3, bounce: 0.12 }, // maior parte da interface (≈ 350 / 28 / 0.8)
  suave: { type: "spring", visualDuration: 0.42, bounce: 0.06 }, // diálogos, painéis, cartões que viram (≈ 220 / 26 / 1)
};
export const saida = { type: "spring", visualDuration: 0.16, bounce: 0 }; // saídas: mais rápidas que as entradas
export const cascata = { staggerChildren: 0.045, delayChildren: 0.03 };

// Esta parte é lógica
// Gestos da marca
export const pulso = {
  scale: [1, 1.035, 1, 1.02, 1],
  transition: { duration: 0.42, times: [0, 0.2, 0.45, 0.7, 1], ease: "easeOut" },
};
export const guia = (direcao = 1) => ({
  initial: { opacity: 0, x: 14 * direcao },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -8 * direcao, transition: saida },
});
export const tremor = { x: [0, -4, 4, -3, 3, 0], transition: { duration: 0.3 } };

// Observação (padrão, item 3): "pulso" e "tremor" têm vários quadros-chave,
// e o Motion não usa spring nesses casos. Por isso eles têm duração fixa e
// curta. É a única exceção à regra "spring sempre" na interface.
