PADRÃO DE MOVIMENTO DA PULSE (interface do site)

A partir de agora, use este padrão em todas as animações de interface que você criar ou alterar neste projeto (Next.js + React + Tailwind + Motion). Só fuja dele se eu pedir. Se algum componente precisar fugir destas regras, me diga qual é e por quê, antes de mudar.

1. ESCOPO: QUEM ANIMA O QUÊ
- Motion (pacote "motion", importado de "motion/react"; é o sucessor do Framer Motion, com a mesma API): microinterações e componentes (botões, interruptor, cartões, diálogos, mensagens, listas, abas, indicadores).
- GSAP + ScrollTrigger: só o que é ligado à rolagem (rota que se desenha, "Os sinais", galeria, frase que acende). Segue a rolagem da pessoa, então não usa spring.
- CSS: hover simples (já decidido na fase 8 para o botão dourado/laranja).
- Os vídeos das animações (arquivos MP4) são mídia e não seguem este arquivo. Eles só precisam de: começar mudos, botão de pausar, quadro parado com os efeitos desligados e legendas.
- O projeto é em JavaScript: arquivos .js e .jsx, nomes em português, e toda parte lógica com o comentário "// Esta parte é lógica". (Fase 9: essa marcação foi retirada a pedido da equipe; o código não a usa mais.)

2. LINGUAGEM DE MOVIMENTO (o que torna a Pulse diferente de uma animação genérica)
Cada animação precisa responder: o que ela comunica? (estado, direção, hierarquia ou marca). Se não comunica nada, ela sai.
Use os três gestos da marca, tirados da própria pulseira, em vez de "fade-in subindo 20 px" em tudo:
- PULSO (confirmar): uma batida dupla curta, como a vibração no pulso. Para: registro salvo, item selecionado, ação concluída. Nunca em loop.
- GUIA (navegar e entrar): deslocamento curto, de 12 a 16 px, na direção do caminho. Avançar entra pela direita ou de baixo; voltar entra pela esquerda. Os elementos entram na ordem de leitura.
- PISO TÁTIL (revelar): a máscara de domos. Só em momentos de marca (capa, troca de página, troca da foto em "Os sinais"), no máximo um por tela.
- ERRO: um tremor horizontal curto no campo (±4 px, 0,3 s), sempre junto da mensagem de erro em texto. Nunca na tela inteira.

3. PRESETS (centralizados em lib/presetsMovimento.js e reutilizados)

  // Esta parte é lógica
  // Springs descritas pela duração visual (visualDuration, em segundos) e pelo quique (bounce):
  // assim dá para garantir o limite de 0,5 s. Entre parênteses, a referência em rigidez/amortecimento.
  export const spring = {
    rapida: { type: "spring", visualDuration: 0.18, bounce: 0.15 }, // toque, interruptor, ícones (≈ stiffness 500, damping 30, mass 0.6)
    padrao: { type: "spring", visualDuration: 0.3, bounce: 0.12 },  // maior parte da interface (≈ 350 / 28 / 0.8)
    suave: { type: "spring", visualDuration: 0.42, bounce: 0.06 },  // diálogos, painéis, cartões que viram (≈ 220 / 26 / 1)
  };
  export const saida = { type: "spring", visualDuration: 0.16, bounce: 0 }; // saídas: mais rápidas que as entradas
  export const cascata = { staggerChildren: 0.045, delayChildren: 0.03 };

  // Gestos da marca
  export const pulso = { scale: [1, 1.035, 1, 1.02, 1], transition: { duration: 0.42, times: [0, 0.2, 0.45, 0.7, 1], ease: "easeOut" } };
  export const guia = (direcao = 1) => ({
    initial: { opacity: 0, x: 14 * direcao },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -8 * direcao, transition: saida },
  });
  export const tremor = { x: [0, -4, 4, -3, 3, 0], transition: { duration: 0.3 } };

Observação: "pulso" e "tremor" têm vários quadros-chave, e o Motion não usa spring nesses casos. Por isso eles têm duração fixa e curta. É a única exceção à regra "spring sempre" na interface.

4. RAIZ: O INTERRUPTOR "EFEITOS" MANDA
O ProvedorMovimento já tem o MotionConfig. Ligue-o à preferência de movimento única da fase 9 (a mesma que o interruptor "Efeitos" controla), e não só ao aparelho:

  <MotionConfig transition={spring.padrao} reducedMotion={efeitosLigados ? "never" : "always"}>

Com os efeitos desligados, o Motion tira os movimentos de posição e escala e mantém só as trocas de opacidade. O interruptor começa desligado quando o aparelho pede "reduzir movimento", e a pessoa pode ligá-lo.

5. REGRAS
- Spring sempre na interface. Nada de linear, ease-in-out genérico ou duração visual acima de 0,5 s.
- Exceções, já aprovadas na especificação, que não usam o Motion ou passam de 0,5 s:
  a) contínuas (faixa dos ODS, faixa de texto, indicador de carregando): ease "linear" com repetição infinita, sempre com pausa ou parando pelo interruptor;
  b) ligadas à rolagem (GSAP com scrub): seguem o dedo ou a roda do mouse;
  c) momentos de marca: preloader (1,4 s), saída da capa (1 s), cortina entre páginas (0,42 s), troca da foto em "Os sinais" (0,7 s) e a pulseira 3D.
- Anime só transform e opacity. Para mudar tamanho ou posição, use a prop layout, e não anime width, height, top ou margin. Exceções aprovadas: a máscara de domos (variável --d registrada com @property), stroke-dashoffset (rota que se desenha), clip-path (antes e depois), filter (fotos que ganham cor) e background-size (traço no nome das polaroides).
- Listas e grades entram em cascata, mas:
  - só na primeira vez que aparecem, e não a cada atualização;
  - no máximo os 8 primeiros itens em cascata; o resto entra junto;
  - no Diário, só o registro novo anima.
- AnimatePresence:
  - mode="wait" quando um conteúdo substitui outro (por exemplo, "Ver a peça" / "Ver o texto");
  - mode="popLayout" quando itens saem de uma lista (excluir registro, com "Desfazer").
  - As mensagens para o leitor de tela (role="status" ou aria-live) ficam num contêiner que nunca sai da tela. Só o texto de dentro anima, e o anúncio nunca espera a animação terminar.
- Estado ativo usa um indicador com layoutId: a pílula laranja da barra de navegação, o "Nesta página" e os filtros.
- Clicáveis (botões e cartões, não links dentro de texto) têm whileTap={{ scale: 0.97 }}.
- Hover: y: -2 ou mudança de borda ou opacidade, com escala máxima de 1.03. O efeito magnético fica só nos botões laranja principais.
- O cursor do sistema nunca é trocado.
- O contorno de foco (3 px) aparece na hora, sem animação, e nunca é coberto.
- Nada pisca mais de 3 vezes por segundo, e nada se move por mais de 5 segundos sem pausa ou sem obedecer ao interruptor.

6. COREOGRAFIA (contra a cara de animação genérica)
- Um protagonista por tela. Os elementos secundários se mexem menos, ou não se mexem.
- A ordem segue a hierarquia: rótulo → título → texto → ação, com 40 a 60 ms entre eles. Nunca tudo ao mesmo tempo.
- A direção tem significado: avançar vai para a direita, voltar para a esquerda, e o que abre nasce de onde foi tocado (transform-origin no elemento clicado).
- Microdetalhes com propósito:
  - ícones que se transformam, como Pausar ↔ Retomar (rotação curta e troca de forma);
  - o "certo" que se desenha (pathLength de 0 a 1);
  - números que contam até o valor (o leitor de tela lê só o valor final).
- No celular: no máximo um grupo animando por vez, e will-change só durante a animação.

7. VISUAL (substitui "zinc/slate": vale a paleta aprovada da Pulse)
- Cores: só os tokens do projeto. Laranja #FC4C02 é o destaque (botão principal, item ativo, foco no tema escuro); o laranja escuro #CC4200 é para títulos, links e foco no tema claro; o grafite #242428 e os cinzas derivados formam a base. Nada de cores padrão do Tailwind.
- Bordas finas, mas com contraste: quando a borda é o que mostra o limite de um campo, botão ou cartão clicável, ela precisa de 3:1 (WCAG 1.4.11). Use --cor-borda (#6E6E78 no claro, #9A9AA4 no escuro). Bordas bem sutis (10%) só em separadores decorativos.
- Cantos: pílula (999 px) em botões e chips; 16 a 24 px em cartões e painéis.
- Sombras: um nível só, leve. Sem sombras pesadas.
