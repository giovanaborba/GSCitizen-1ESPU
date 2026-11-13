/*
  sinais — o que cada sinal da Pulse faz na pulseira 3D (seção 18.7).

  Cada sinal dura um ciclo de 2,8 s. Dentro do ciclo, "t" é o tempo em
  segundos desde o começo. Os anéis dourados de "pulso" saem da parte que
  vibra (motor ou atuador) e somem em 0,9 s.

  WCAG 2.3.1 (nada pisca mais de 3 vezes por segundo): em nenhum sinal
  saem mais de 3 anéis dentro de 1 segundo. No "Parar", um anel sai a
  cada 0,35 s (o protótipo usava 0,32 s, que daria 3,1 por segundo).
*/

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

const INTERVALO_DO_PARAR = 0.35; // s entre os anéis do "Parar"

// Esta parte é lógica
// Anima um sinal num quadro.
// - chave: "esquerda" | "direita" | "aguardar" | "parar" | "continuar"
// - t: tempo dentro do ciclo; dt: tempo desde o quadro anterior
// - cena: o que criarCena devolve
// - umaVez(nome, acao): faz a "acao" só uma vez por ciclo (cada anel
//   sai uma vez só, mesmo com dezenas de quadros depois do horário dele)
// - podeSoltarPulso: falso no fim do modo "parar", para os últimos anéis
//   sumirem antes de a animação acabar
export function animarSinal(chave, t, dt, cena, umaVez, podeSoltarPulso = true) {
  const { motorEsquerdo, motorDireito, atuador } = cena.partes;
  const soltar = (nome, parte, forca) => {
    if (podeSoltarPulso) umaVez(nome, () => cena.soltarPulso(parte, forca));
  };

  // As partes vão apagando aos poucos (o mesmo ritmo em 60 ou 120 Hz)
  const apagar = Math.pow(0.9, dt * 60);
  for (const parte of [motorEsquerdo, motorDireito, atuador]) {
    parte.material.emissiveIntensity *= apagar;
  }
  cena.balanco.position.x = 0;

  if (chave === "esquerda" || chave === "direita") {
    // Três pulsos no motor do lado (0,1, 0,45 e 0,8 s); o motor acende
    const motor = chave === "esquerda" ? motorEsquerdo : motorDireito;
    [0.1, 0.45, 0.8].forEach((horario, i) => {
      if (t > horario) soltar(`virar-${i}`, motor, 1);
    });
    if (t < 1.2) motor.material.emissiveIntensity = 1.4;
  } else if (chave === "aguardar") {
    // Três vibrações curtas nos dois motores, duas vezes no ciclo
    [0.1, 0.32, 0.54, 1.5, 1.72, 1.94].forEach((horario, i) => {
      if (t > horario) {
        umaVez(`aguardar-luz-${i}`, () => {
          motorEsquerdo.material.emissiveIntensity = 1.5;
          motorDireito.material.emissiveIntensity = 1.5;
        });
        soltar(`aguardar-esq-${i}`, motorEsquerdo, 0.7);
        soltar(`aguardar-dir-${i}`, motorDireito, 0.7);
      }
    });
  } else if (chave === "parar") {
    // Vibração contínua nos dois motores por cerca de 2 s, com um tremor
    // leve da pulseira inteira
    if (t < 2.3) {
      motorEsquerdo.material.emissiveIntensity = 1.3;
      motorDireito.material.emissiveIntensity = 1.3;
      cena.balanco.position.x = Math.sin(t * 95) * 0.012;
      const passo = Math.floor(t / INTERVALO_DO_PARAR);
      soltar(`parar-esq-${passo}`, motorEsquerdo, 0.8);
      soltar(`parar-dir-${passo}`, motorDireito, 0.8);
    }
  } else if (chave === "continuar") {
    // O atuador acende e pulsa devagar; dois pulsos grandes
    if (t < 2.3) atuador.material.emissiveIntensity = 0.6 + Math.sin(t * 3) * 0.4;
    [0.2, 1.2].forEach((horario, i) => {
      if (t > horario) soltar(`continuar-${i}`, atuador, 1.6);
    });
  }
}

// Esta parte é lógica
// Apaga tudo: usado no quadro parado (efeitos desligados) e no fim da 404.
export function apagarPartes(cena) {
  const { motorEsquerdo, motorDireito, atuador, botaoDestino, botaoModo } = cena.partes;
  for (const parte of [motorEsquerdo, motorDireito, atuador, botaoDestino, botaoModo]) {
    parte.material.emissiveIntensity = 0;
  }
  cena.balanco.position.x = 0;
}

// Esta parte é lógica
// Acende a parte ligada ao link focado ou com o mouse em cima (abertura).
export function destacarParte(cena, nomeDaParte, tempo) {
  const { botaoDestino, botaoModo } = cena.partes;
  botaoDestino.material.emissiveIntensity = 0;
  botaoModo.material.emissiveIntensity = 0;
  const parte = cena.partes.destacaveis[nomeDaParte];
  if (parte) {
    parte.material.emissiveIntensity = Math.max(
      parte.material.emissiveIntensity,
      0.8 + Math.sin(tempo * 6) * 0.3,
    );
  }
}
