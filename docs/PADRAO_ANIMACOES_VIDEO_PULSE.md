PADRÃO DAS ANIMAÇÕES EM VÍDEO DA PULSE (MP4)

Use este padrão em todas as animações em vídeo que você criar ou alterar neste projeto. Só fuja dele se eu pedir. Se alguma cena precisar fugir destas regras, me diga qual é e por quê, antes de renderizar.

1. ESCOPO E BASE TÉCNICA
- Vale para os vídeos MP4 feitos por código: cenário 2D em SVG e a pulseira em 3D (Three.js), sempre com o MESMO módulo do modelo aprovado (modelo.js). Mudou a pulseira do site, mudam os vídeos.
- Saída: 1280 × 720, 30 quadros por segundo, H.264 (CRF 20, yuv420p, faststart). No máximo cerca de 3 MB a cada 10 s.
- Cada vídeo sai com um quadro parado (JPG, para os efeitos desligados). Se tiver som, sai também com as legendas dos sons (arquivo .vtt).
- Todas as animações usam a mesma base (cidade, rua, pessoa, pulseira, sons). Nada é desenhado "do zero" por vídeo.

2. LINGUAGEM DE MOVIMENTO (os três gestos da marca)
Cada movimento precisa comunicar algo: estado, direção, causa e efeito ou marca. Se não comunica nada, sai.
- PULSO (a pulseira confirma ou sinaliza): batida dupla curta, escala 1 → 1,035 → 1 → 1,02 → 1 em 0,42 s, com um anel laranja que se abre. É a assinatura da Pulse: aparece em toda confirmação e todo sinal.
- GUIA (navegar): deslocamento curto, de 12 a 16 px, na direção do caminho. O progresso sempre vai da esquerda para a direita; nada que represente avanço anda para trás.
- PISO TÁTIL (transição): a máscara de domos abre e fecha cada vídeo (0,5 s), e só ela. Nada de fade preto, wipe ou zoom genérico entre cenas.

3. FÍSICA: SPRING SEMPRE (como na interface)
- Tudo o que entra, para, aperta ou muda de tamanho usa mola (spring), com estes presets:
  - rapida = duração visual 0,18 s, quique 0,15 (dedo apertando, rótulo trocando, ícone);
  - padrao = 0,30 s, quique 0,12 (rótulos, balões, setas, pessoas parando);
  - suave = 0,42 s, quique 0,06 (painéis, detalhe circular entrando, câmera chegando ao close).
- A mola é calculada quadro a quadro (oscilador amortecido) e para exatamente no alvo, sem tremer no fim.
- Linear só em movimento contínuo: rodas, carros ao fundo, ciclo de caminhada e varredura da bengala, que repetem sem começo nem fim.
- Câmera: movimentos de 0,8 a 1,2 s com o preset suave, sem quique (é a única exceção ao limite de 0,5 s, além das pausas de leitura).
- Saídas são cerca de 30% mais rápidas que as entradas.

4. COREOGRAFIA (contra a cara de animação genérica)
- Estrutura de cada cena: estabelece (cerca de 1 s) → ação (2 a 3 s) → resultado em pausa (1 a 1,5 s) → transição (0,5 s).
- Um protagonista por cena: a pessoa ou a pulseira.
  - O fundo fica mais apagado: prédios com menos contraste e, nos closes, desfocados.
  - Carros e passantes andam mais devagar e com menos contraste que o protagonista.
- Antecipação e continuidade:
  - antes de apertar, o dedo recua 2 a 3 px;
  - quando a pessoa para, o corpo assenta com a mola padrao, e a bengala termina a varredura.
- Cascata: elementos de um mesmo grupo (rótulo, linha, ícone) entram com 60 a 90 ms de intervalo, na ordem de leitura.
- Troca de conteúdo: o texto antigo sai primeiro (0,15 s) e só então entra o novo, com o gesto PULSO. Nunca texto sobre texto num cruzamento de opacidade.
- Indicador compartilhado: o rótulo do sinal embaixo do detalhe circular não some e reaparece. A mesma pílula muda de largura e de texto (CONTINUAR → PARAR), como um layoutId.
- Toque: o botão afunda e encolhe para 0,97, e o anel do PULSO nasce do botão.
- Câmera viva: durante pausas longas, aproximação lenta de 2 a 4%, quase imperceptível.
- Direção de tela constante: a pessoa sempre caminha da esquerda para a direita.

5. TEXTO DENTRO DO VÍDEO
- Só textos curtos que reforçam a cena: o nome do sinal, o destino, um rótulo. A explicação completa fica no texto da página, que é a alternativa para quem não vê o vídeo.
- Tamanho mínimo de 24 px (a 720p), sobre uma pílula ou um balão de fundo sólido, com contraste de 4,5:1 ou mais.
- Tempo de leitura: o texto fica na tela pelo menos 1,5 s, mais 0,3 s por palavra.

6. VISUAL (igual ao site)
- Só a paleta aprovada:
  - laranja #FC4C02 é o destaque: a pulseira, os sinais e os anéis;
  - grafite #242428 e os cinzas derivados formam a cidade;
  - os carros são cinzas, para não competir com a pulseira;
  - verde e vermelho só no semáforo.
- Formas: pílulas para os rótulos, cantos de 16 a 28 px nos painéis, bordas finas e sombras leves de um nível só.
- Realismo sem poluição: no máximo 2 passantes e 2 carros visíveis ao mesmo tempo, e calçada normal.

7. SOM (quando o vídeo tiver som)
- O som é tranquilo: sem carros passando, sem "vento" e sem efeitos de transição.
- Ficam só os sons que informam:
  - o clique do botão;
  - a confirmação;
  - "Continuar" (grave e curto) e "Parar" (agudo e contínuo, suave);
  - toques leves da bengala.
- O fundo da cidade fica quase imperceptível.
- Cada som cai no mesmo quadro do evento na tela, com tolerância de 1 quadro.
- O silêncio também comunica: em "O problema", o semáforo abre sem nenhum som.
- Volume final de −20 LUFS. No site, o vídeo começa mudo, com o botão "Ativar som". Os sons que informam algo entram nas legendas (.vtt).

8. ACESSIBILIDADE
- Nada pisca mais de 3 vezes por segundo. Sem tremor de câmera.
- O vídeo é um loop sem salto: começa e termina na máscara de domos.
- Nenhuma informação existe só no vídeo: o texto da página diz o mesmo.
- O site toca o vídeo com o botão de pausar e, com os efeitos desligados, mostra o quadro parado.

9. CONFERÊNCIA ANTES DE ENTREGAR
- Folha de contato com 6 quadros, nos momentos de mais coisa na tela. Conferir:
  - o protagonista;
  - a leitura dos textos;
  - os rótulos que não podem cobrir a pulseira nem a pessoa;
  - a emenda do loop.
- Conferir no vídeo final 3 quadros extraídos e o volume (LUFS).

10. DECISÕES DEPOIS DO LOTE FINAL (12/11/2026)
- Bengala: toda branca, com a ponteira cinza-escura. Pela Lei 14.951/2024, a bengala branca é de pessoas cegas, a verde de pessoas com baixa visão e a vermelha e branca de pessoas surdocegas. Nada de faixa ou ponta vermelha.
- Mão que aperta os botões: indicador com três falanges, leve curva, unha e articulações um pouco mais escuras; os outros dedos fechados; a mão chega de cima e um pouco da direita, para tapar menos a pulseira.
- Ônibus: tamanho real (12 m × 3,15 m na escala da pessoa de 1,75 m), urbano de piso baixo, com portas, letreiro lateral, rodas que giram e freada com mola sem quique. A porta só abre depois que ele para.
- Volume: −20 LUFS nos vídeos com sinais sonoros. Vídeos só com o fundo da cidade ficam mais baixos ("O problema" em −30 LUFS e "Virar" em −32 LUFS), porque ali o silêncio é a mensagem. Normalizar com ganho linear, não com o loudnorm dinâmico, que aumenta o fundo quando quase não há som.
- Legendas: descrevem também o que não tem som, por exemplo "[vibração no lado esquerdo, sem som]" e "[o semáforo abre sem nenhum som]".
- Exceção aprovada: a capa (horizontal 1280 × 720 e vertical 720 × 1280) é um loop contínuo de 10,5 s, sem os domos, para não piscar atrás do texto da capa.
