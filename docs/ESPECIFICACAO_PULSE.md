# Pulse — Especificação para desenvolvimento

> Documento de contexto para implementar a aplicação web da Pulse em **React + Next.js + Tailwind CSS, em JavaScript (sem TypeScript)**.
> Reúne todas as decisões de UX/UI tomadas no planejamento (Etapas 1 a 14) e as convenções de código da equipe (seção 14.1). Quando este arquivo e o código discordarem, **este arquivo vence**, a menos que a equipe decida o contrário e atualize este arquivo.
>
> As decisões tomadas durante o desenvolvimento (Fases 0 a 7) já estão incorporadas nas seções, marcadas com **(Fase N)**, e reunidas na seção 17. O resumo de cada fase está em `docs/REGISTRO_DESENVOLVIMENTO.md`.
>
> **Fase 8 — nova identidade e movimento (11/11/2026):** a seção 18 traz o novo estilo, cores, fontes, efeitos, a capa, a pulseira 3D, o rodapé (com a faixa dos ODS na Solução) e a página 404. **Onde a seção 18 e uma seção antiga discordarem, vale a 18.** As seções afetadas têm uma nota **(Fase 8)**.
>
> **Fase 9 — efeitos, paleta nova, pulseira nova e vídeos (12/11/2026):** a seção 19 traz o interruptor "Efeitos", a paleta laranja e grafite, as fontes por pacote, o polimento, os efeitos e as interações novas, a pulseira 3D nova e os vídeos. **Onde a seção 19 discordar da 18 ou de uma seção antiga, vale a 19.** As seções afetadas têm uma nota **(Fase 9)**.
>
> Última atualização: 13/11/2026 (Fase 9 concluída). As decisões da Fase 9 estão na seção 17 e, onde mudam o texto da seção 19 ou de uma seção antiga, numa nota **(Fase 9)** ao lado.

---

## Sumário

1. Visão geral
2. Requisitos obrigatórios da disciplina
3. Princípios que não podem ser quebrados
4. Rotas e arquitetura de informação
5. Estrutura comum de todas as páginas
6. Conteúdo das páginas (textos finais)
7. Diário de deslocamentos (CRUD)
8. Design tokens (cores, tipografia, espaçamento, sombras)
9. Navegação: cabeçalho e barra flutuante
10. Componentes reutilizáveis
11. Estados da interface e mensagens
12. Responsividade
13. Ícones e imagens
14. Arquitetura de código sugerida
15. Checklist de acessibilidade e critérios de aceite
16. Pendências e suposições
17. Registro de alterações do desenvolvimento
18. Nova identidade e movimento (Fase 8)
19. Fase 9: efeitos, paleta nova, pulseira nova e vídeos

---

## 1. Visão geral

| Item | Definição |
| --- | --- |
| Projeto | Global Solution FIAP 2026.2, tema **CitizenTech** |
| Problema | Pessoas cegas e com baixa visão dependem da audição para atravessar ruas, e muitos semáforos não têm sinal sonoro. Cerca de 90% dos paulistanos consideram as calçadas não acessíveis (G1, 2019). No Brasil, 7,9 milhões de pessoas têm dificuldade para enxergar (IBGE, Censo 2022). |
| Solução | **Pulse** (nome provisório): pulseira que guia pelo pulso com vibrações direcionais, sinais de parar, continuar e aguardar, dados de semáforos e de transporte público. Funciona sem celular. |
| Papel do site | (1) **Apresentação** que liga tema, problema e solução; (2) **Simulador** da pulseira (feito por outro integrante); (3) **Diário de deslocamentos**, um CRUD que mede o impacto da Pulse. |
| Público | Pessoas cegas (leitor de tela no celular), pessoas com baixa visão (ampliação, alto contraste, modo escuro) e pessoas sem deficiência (familiares, instrutores). Nenhum perfil é secundário. |
| Avaliação | O site será apresentado aos professores, mas é desenhado para o público real. |
| Login | **Não há login.** Os dados do Diário são anônimos e compartilhados por todas as pessoas. |
| Linha de raciocínio | Toda decisão segue: **problema → solução → experiência na aplicação web**. |

---

## 2. Requisitos obrigatórios da disciplina

- Aplicação **funcional** em **React com Next.js** (App Router) e **Tailwind CSS**, escrita em **JavaScript** (`.js` e `.jsx`, sem TypeScript). Não pode ser só interface estática.
- **No mínimo 8 componentes** React reutilizáveis e organizados (a seção 10 lista 13).
- Uso obrigatório de **`useState` e `useEffect`**.
- **No mínimo 2 custom hooks**, separando lógica de negócio e gerenciamento de estado da camada visual (a seção 14 sugere 5).
- **Separação de responsabilidades**: lógica de negócio e acesso a dados fora dos componentes de apresentação (explicação na seção 14.2).
- **Consumir uma API externa com CRUD completo**: criar, consultar, atualizar e excluir (o Diário). **A API entra depois**; o código já fica preparado (seção 7.6). **(Fase 9)** A equipe escolheu o **MockAPI** (mockapi.io); falta configurar o endereço (passo a passo no registro, subfase 9.9).
- Boas práticas de desenvolvimento e **versionamento** (Git). **Os commits são feitos manualmente pela equipe**, com uma mensagem simples sugerida ao fim de cada fase.
- Briefing da GS: **nada de dados pessoais reais**. Usar dados simulados ou públicos e citar a fonte.
- O registro do uso de IA no **`prompts.md`** (exigência da GS) é feito manualmente pela equipe.
- **Não usar imagens geradas por IA.** **(Fase 8)** A regra vale para o Claude Code, que nunca gera imagens. A equipe pode usar imagens geradas por IA (seção 18.13). **(Depois da Fase 9)** O Claude Code só liga no código os arquivos que a equipe puser em `public/imagens/` (seção 13.2).

**Feito manualmente pela equipe (não refazer no código):** criação do projeto Next.js com App Router, instalação do Tailwind CSS e do ESLint, instalação da fonte Atkinson Hyperlegible Next, estrutura de pastas (seção 14) e o arquivo `prompts.md`. O desenvolvimento continua a partir do projeto já existente no VSCode, sem reinstalar pacotes nem mudar configurações.

**(Fase 8)** Na Fase 8, o Claude Code instala os pacotes da seção 18.1 (`lenis`, `gsap`, `@gsap/react`, `motion`, `three`), sempre depois de mostrar o comando e receber a confirmação da equipe. **Fontes continuam manuais**, com marcadores. Os ícones são colocados pelo Claude Code (seção 13.1). Nas imagens, a equipe põe os arquivos em `public/imagens/`, e o Claude Code liga os caminhos no código (seção 13.2).

---

## 3. Princípios que não podem ser quebrados

1. **WCAG 2.2 nível AA completo.**
2. **Meta voluntária: todo texto com contraste de 7:1 ou mais** (equivale ao critério AAA 1.4.6). Ícones, bordas e foco com pelo menos 3:1.
3. **Mobile-first.** Escrever o CSS para o celular primeiro e adaptar com `md:` e `lg:`.
4. **Funcionar a 320 px de largura sem rolagem lateral** (WCAG 1.4.10). Quem usa zoom de 400% num computador de 1280 px vê a tela com 320 px.
5. **Tamanhos em `rem`**, para o texto acompanhar a configuração do aparelho e ampliar até 200% sem quebrar (WCAG 1.4.4).
6. **HTML nativo antes de ARIA**: `<button>` para ações, `<a>`/`<Link>` para navegar, `<input type="radio">` dentro de `<fieldset>` com `<legend>`, `<dialog>` para confirmações.
7. **A cor nunca carrega sozinha uma informação**: erro, sucesso e aviso sempre com ícone e texto.
8. **Ícone sempre com texto visível.** O ícone fica oculto para o leitor de tela (`aria-hidden="true"`).
9. **Alvos de toque de no mínimo 48 × 48 px**, com 8 px de espaço entre alvos vizinhos.
10. **Contorno de foco sempre visível**, 3 px, afastado 2 px do elemento.
11. **Tema claro e escuro seguindo somente a configuração do aparelho** (`prefers-color-scheme`). Não há botão de tema.
12. **Respeitar "reduzir movimento"** (`prefers-reduced-motion`): sem animações e barras sempre visíveis. **(Fase 8)** Ver também o piso de acessibilidade da nova identidade (seção 18.2). **(Fase 9)** O "reduzir movimento" do aparelho passa a ser só o valor inicial do interruptor "Efeitos", que controla todo o movimento (seção 19.2).
13. **Funcionar no alto contraste do Windows** (`forced-colors`): áreas separadas por bordas; nada importante só em sombra ou imagem de fundo.
14. **Sem CAPTCHA, sem limites de tempo, sem gestos obrigatórios** (deslizar etc.), sem vibração do celular (para não confundir com os sinais da Pulse).
15. **Sem emoji** em texto importante.
16. **Toda imagem tem `alt` preenchido**, com uma comunicação simples, clara e direta para quem usa leitor de tela (regras na seção 13.2). Não há imagem puramente decorativa no site. **(Fase 8)** Decorações feitas em CSS ou SVG (textura de piso tátil, palavras gigantes, linhas da abertura) não são imagens de conteúdo e ficam com `aria-hidden="true"`.

---

## 4. Rotas e arquitetura de informação

### 4.1 Rotas (Next.js App Router)

| Rota | Página | Título da aba (`metadata.title`) | Item ativo na barra |
| --- | --- | --- | --- |
| `/` | Início | `Início — Pulse` | Início |
| `/solucao` | Solução | `Solução — Pulse` | Solução |
| `/simulador` | Simulador | `Simulador — Pulse` | Simulador |
| `/diario` | Diário: lista | `Diário — Pulse` | Diário |
| `/diario/novo` | Novo registro | `Novo registro — Pulse` | Diário |
| `/diario/[id]` | Ver registro | `Registro de DD/MM/AAAA — Pulse` · enquanto carrega: `Registro — Pulse` · registro inexistente: `Registro não encontrado` **(Fase 5)** | Diário |
| `/diario/[id]/editar` | Editar registro | `Editar registro — Pulse` · registro inexistente: `Registro não encontrado` **(Fase 5)** | Diário |

- O Next.js anuncia a troca de página ao leitor de tela lendo o título. Cada página precisa de um título **único**.
- Na troca de rota, mover o foco para o `<h1>` da nova página (`tabIndex={-1}`, sem contorno visível nesse caso). No primeiro carregamento o foco **não** é movido, para o "Pular para o conteúdo" continuar sendo o primeiro foco (componente `FocoNaTroca`, **Fase 2**).
- Implementação dos títulos **(Fases 2 e 5)**: `title.template` (`%s — Pulse`) no layout raiz. A Início escreve o título completo, porque, pela regra do Next, o modelo do layout não vale para a página da mesma pasta. O título com a data só existe depois que a API responde, então é trocado no navegador pelo hook `useTituloDaAba`.

### 4.2 O que fica em cada página

| Página | Conteúdo | Perguntas do briefing da GS respondidas |
| --- | --- | --- |
| Início | **(Fase 8)** Capa (primeira visita) → abertura com a pulseira 3D e os links da solução → tema CitizenTech → o problema → quem vive o problema | 02 Qual problema será resolvido? · 01 Quem é o cidadão beneficiado? |
| Solução | **(Fase 8)** A pulseira, os sinais, como funciona, tecnologias, galeria, ecossistema, como ampliar o impacto, diferencial, equipe (os ODS foram para o rodapé da Solução) | 03 Como funcionará? · 04 Quais tecnologias? · 05 Quem participará do ecossistema? · 06 Como o impacto será ampliado? |
| Simulador | Espaço reservado para o simulador | Demonstra a 03 |
| Diário | CRUD de registros de deslocamento + resumo de indicadores | 06 Como o impacto será medido? |
| Rodapé | **(Fase 8)** Links e créditos em todas as páginas; na Solução, também a faixa contínua dos 3 ODS (seção 18.10) | Tema CitizenTech |
| 404 | **(Fase 8)** "Você saiu da rota" (seção 18.11) | — |

---

## 5. Estrutura comum de todas as páginas

Ordem no HTML (é também a ordem visual e a ordem de leitura do leitor de tela):

1. Link **"Pular para o conteúdo"** (`href="#conteudo"`), invisível até receber foco.
2. `<header>` com o nome **Pulse** (link para `/`).
3. `<main id="conteudo">` com:
   1. `<h1>` + uma frase de resumo.
   2. Índice **"Nesta página"** (`<nav aria-label="Nesta página">`), só em Início e Solução.
   3. Seções com `<h2>` (e `<h3>`/`<h4>` quando preciso). Um único `<h1>` por página. O tamanho visual acompanha o nível.
4. `<footer>` com: "Pulse · Global Solution 2026 · FIAP" e "Protótipo acadêmico com dados públicos e simulados." **(Fase 8)** Substituído pelo rodapé da seção 18.10 (na Solução, com a faixa dos ODS).
5. `<nav aria-label="Navegação principal">` — a barra flutuante.

Regras de layout:
- **Uma coluna.** Elementos relacionados próximos. Mensagens de erro e status junto do campo ou da ação, nunca só no topo.
- Explicações em **texto corrido**; itens que se repetem (sinais, perfis, tecnologias, ODS, registros) em **cartões**.
- Espaçamento **arejado**, em múltiplos de 8 px.
- Texto limitado a **cerca de 40rem** (50 a 75 caracteres por linha) em telas grandes.
- **Espaço extra no fim de cada página**, do tamanho da barra flutuante + 16 px + área de segurança, para o último item e o foco nunca ficarem escondidos (WCAG 2.4.11).

---

## 6. Conteúdo das páginas (textos finais)

Use estes textos como estão. Tom de voz: próximo, sério, respeitoso e objetivo; trata quem lê por "você". Ver regras na seção 11.4.

### 6.1 Início (`/`)

> **(Fase 8)** Os textos abaixo continuam. A ordem da página e a abertura com a pulseira estão na seção 18.6.

**H1:** Inovação que chega a quem precisa
**Resumo:** A Pulse é uma pulseira que guia pessoas cegas e com baixa visão pela cidade. Conheça o problema que ela resolve.

**Nesta página:** Tema CitizenTech · O problema · Quem vive o problema

**H2 Tema CitizenTech**
- CitizenTech é tecnologia criada a partir das necessidades reais das pessoas, para ampliar direitos e reduzir desigualdades. É o tema da Global Solution 2026 da FIAP.
- Nosso ponto de partida é a acessibilidade nas ruas de São Paulo.

**H2 O problema**
- Sem enxergar as cores do semáforo, a pessoa depende da audição para atravessar. Muitos semáforos não têm sinal sonoro, e o risco de atropelamento é diário.
- Citação (`<figure>` + `<blockquote>` + `<figcaption>`): “Não sabemos quando o sinal abriu ou fechou para nós.” — *Depoimento em reportagem da Unicentro, 2024*
- Cartão de dado: **Cerca de 90%** · dos paulistanos consideram as calçadas não acessíveis para pessoas com deficiência. · Fonte: G1, 2019
- Cartão de dado: **7,9 milhões** · de pessoas no Brasil têm dificuldade para enxergar. · Fonte: IBGE, Censo 2022
- Espaço reservado de imagem: "Ilustração de uma travessia (a definir)". Marcador `IMAGEM-ilustração de uma travessia-AQUI`, com o `alt` sugerido na seção 13.2.
- **H3 O que a Pulse quer reduzir** (lista):
  - A dependência de ajuda de outras pessoas.
  - A necessidade de identificar travessias só pelo som do trânsito.
  - O tempo perdido por falta de acessibilidade ou por erros de caminho.

**H2 Quem vive o problema**
- Pessoas cegas ou com qualquer nível de deficiência visual que dificulte os deslocamentos, especialmente quem usa as ruas e o transporte público.
- Cartão **H3 Pessoa cega**: Usa leitor de tela no celular e se orienta pela audição e pela bengala. Sem sinal sonoro, não sabe quando pode atravessar.
- Cartão **H3 Pessoa com baixa visão**: Usa ampliação e alto contraste. Pode ter dificuldade para ver o semáforo de longe, a placa do ônibus ou o meio-fio.

**Botão-link principal:** Conheça a solução → `/solucao`

### 6.2 Solução (`/solucao`)

> **(Fase 8)** Mudanças na seção 18.8: "Os sinais" vira H2 próprio em rolagem fixa, entra a Galeria, a seção de ODS sai do meio desta página e vai para o rodapé dela, numa faixa contínua, e o "Nesta página" muda.

**H1:** A Pulse: um guia no pulso
**Resumo:** Uma pulseira que orienta o caminho por vibrações e sinais, com mais autonomia e segurança nos deslocamentos.

**Nesta página:** A pulseira · Como funciona · Tecnologias · Quem participa · Como ampliar o impacto · Objetivos de Desenvolvimento Sustentável · O diferencial · Equipe

**H2 A pulseira**
- Você diz para onde quer ir e recebe as orientações do trajeto direto no pulso. A Pulse funciona sozinha, sem precisar estar conectada a um celular.
- Espaço reservado de imagem: "Ilustração conceitual da pulseira (a definir)". Marcador `IMAGEM-ilustração conceitual da pulseira-AQUI`, com o `alt` sugerido na seção 13.2.
- Lista numerada (`<ol>`) de cartões:
  1. **H3 1. Fale o destino** — Aperte o botão e diga para onde quer ir. O reconhecimento de voz identifica o destino.
  2. **H3 2. Sinta o caminho** — Vibrações e sinais indicam virar, parar, continuar e aguardar durante todo o trajeto.
  3. **H3 3. Celular no bolso** — Sem consultar a tela e sem depender só de instruções por áudio.
- **H3 Apenas dois botões** (lista):
  - Trocar o modo: alterna entre o modo sonoro e tátil e o modo exclusivamente tátil.
  - Informar o destino: ativa o reconhecimento de voz.

**H2 Como funciona**
- **H3 Vibrações direcionais** — Precisa virar? A pulseira vibra no lado correspondente: à esquerda para virar à esquerda, à direita para virar à direita.
- **H3 Semáforos em tempo real** — A Pulse usa dados dos semáforos de pedestres para indicar parar, aguardar ou atravessar, sem adivinhar pelo som do trânsito.
- **H3 Dois modos** (cartões H4):
  - Sonoro e tátil — Sons curtos indicam parar, continuar ou aguardar. As vibrações continuam guiando as conversões.
  - Exclusivamente tátil — Para quem prefere não usar som ou está em lugares muito barulhentos.
- **H3 Os sinais** — Cada comando tem um sinal próprio. (cartões H4)
  - Continuar — Modo tátil: pressão contínua no pulso até você andar. / Modo sonoro: som grave e curto.
  - Parar — Modo tátil: vibração contínua até você parar. / Modo sonoro: som agudo e contínuo.
  - Virar à esquerda ou à direita — Nos dois modos: vibração no lado correspondente.
  - Aguardar — Nos dois modos: três vibrações curtas, repetidas em intervalos.
- **H3 Transporte público** (lista numerada):
  1. No local: identifica que você chegou ao ponto de ônibus ou à plataforma e avisa para aguardar.
  2. O veículo: orienta sobre a chegada do transporte e o momento de embarcar.
  3. O embarque: evita que você passe do local ou embarque no veículo errado.
- Opcional: a pulseira informa quanto falta para o transporte chegar, em voz no modo sonoro ou em Braille, com pinos retráteis, no modo tátil.
- Nota: Depende de essas informações estarem disponíveis nos sistemas de transporte público.

**H2 Tecnologias** (cartões, rótulo em negrito + descrição)
- GPS: localização e navegação.
- Reconhecimento de voz: identifica o destino.
- ESP32 ou equivalente: microcontrolador que comanda a pulseira.
- Motores de vibração: sinais táteis e direcionais.
- Atuadores de pressão: comando de continuar.
- Alto-falante: sinais sonoros.
- APIs de mapas, semáforos e transporte: informações em tempo real.
- Módulo de conectividade: acesso aos serviços e dados.

**H2 Quem participa** (lista)
- Pessoas cegas e com deficiência visual, principais usuárias e participantes dos testes.
- Equipe de desenvolvimento de hardware e software.
- Fabricantes e fornecedores de componentes eletrônicos.
- Prefeituras e órgãos de mobilidade urbana.
- Empresas de transporte público.
- Empresas de APIs de transporte e infraestrutura urbana.
- Instituições de apoio à pessoa com deficiência.

**H2 Como ampliar o impacto**
- Levar a Pulse a outras regiões e cidades, com novas integrações a semáforos e ao transporte público, evoluindo as funções conforme o retorno de quem usa.
- Link: Veja como medimos o impacto no Diário → `/diario`

**H2 Objetivos de Desenvolvimento Sustentável** (cartões H3)
- Rótulo de texto **"Principal"** + **ODS 10: Redução das Desigualdades** — Reduz as barreiras enfrentadas por pessoas com deficiência visual e promove igualdade de acesso à mobilidade. (cartão com borda de destaque; o texto "Principal" é obrigatório, a borda não basta)
- **ODS 9: Indústria, Inovação e Infraestrutura** — Um dispositivo inteligente que melhora a infraestrutura de acessibilidade e mobilidade urbana.
- **ODS 11: Cidades e Comunidades Sustentáveis** — Torna as cidades mais acessíveis, inclusivas e seguras nas ruas e no transporte público.

**H2 O diferencial**
- (destaque, 20 px) Informação importante pelo tato: menos dependência do celular, de ajuda externa e de meios inseguros nas travessias.
- Orientação de trajetos, travessias e transporte público reunidos em um único dispositivo.

**H2 Equipe**
- Resumo: Integrantes do grupo que criou a Pulse na Global Solution 2026 da FIAP.
- Lista (`<ul>`) de 5 cartões, nesta ordem: **Giovana**, **Giovane**, **Mie**, **Pedro**, **Thiago**. Cada cartão (`CartaoIntegrante`):
  - foto quadrada com cantos arredondados, no espaço `EspacoImagem` com o marcador `IMAGEM-foto de (nome)-AQUI`;
  - texto alternativo preenchido: **"Foto de (nome)"** (ex.: "Foto de Giovana");
  - nome em `<h3>` (20 px, negrito).
- Layout por tamanho de tela na seção 12. Os critérios de sempre valem: cartão com borda e sombra leve, texto com 7:1, nada só por cor.

**Botão-link principal:** Experimente o simulador → `/simulador`

### 6.3 Simulador (`/simulador`)

**H1:** Simulador
**Resumo:** Experimente os sinais da Pulse antes de usar a pulseira na rua.

Enquanto o simulador não existir: região `<section aria-labelledby>` com borda tracejada, **H2 Espaço reservado**, "O simulador está em desenvolvimento por outro integrante da equipe." e "Requisito: os sinais terão equivalentes em som e texto, para funcionar sem a visão."

**No código:** a página `app/simulador/page.jsx` deve ter, no lugar exato onde o simulador vai entrar, um bloco de comentário bem visível com o marcador **`SIMULADOR-AQUI`**, explicando que o componente do simulador substitui a seção "Espaço reservado" e listando os requisitos abaixo.

Requisitos do simulador (quando for feito):
- Cada sinal precisa de equivalente em **texto** e **som**. Vibração do celular só funciona no Android com Chrome (Vibration API); no iPhone, som e texto.
- Mesmos nomes de comandos da pulseira (continuar, parar, virar à esquerda, virar à direita, aguardar) e os dois modos.
- Sem limite de tempo. Som só começa após uma ação da pessoa.
- Deve ser avaliado com as heurísticas de Nielsen quando estiver pronto.

---

## 7. Diário de deslocamentos (CRUD)

### 7.1 Textos da página `/diario`

- **H1:** Diário de deslocamentos
- **Resumo:** Registre como foi cada trajeto. Os registros ajudam a medir o impacto da Pulse.
- **Aviso de privacidade** (cartão, 16 px): Os registros são anônimos e compartilhados por todas as pessoas que usam o site. Não escreva nomes ou endereços.
- **H2 Resumo** + explicação: "Esses números somam todos os registros e mostram quantos deslocamentos foram feitos com autonomia e segurança. É assim que medimos se a Pulse está ajudando."
- Indicadores (lista `<ul>` de 4 cartões; número grande + rótulo):
  - total → "deslocamentos registrados" (singular: "deslocamento registrado")
  - `precisouDeAjuda === false` → "sem precisar de ajuda"
  - `chegouSemSePerder === true` → "chegaram sem se perder"
  - `travessias === "seguro"` → "com travessias seguras"
- Botão-link **"Novo registro"** (com ícone +) **no topo da lista**, nunca flutuante.
- **H2 Registros** + lista de cartões, do mais recente para o mais antigo. Cada cartão:
  - `<h3>` "DD/MM/AAAA · Meio de transporte"
  - etiquetas: "Sem se perder"/"Se perdeu", "Sem ajuda"/"Precisou de ajuda", "Travessias seguras"/"Travessias mais ou menos"/"Travessias inseguras"
  - link "Ver registro" com texto oculto para leitor de tela: "Ver registro **de DD/MM/AAAA**" (cada link com nome único)

### 7.2 Modelo de dados

Exemplo de um registro (JavaScript):

```js
const registroExemplo = {
  id: "abc123",                 // texto gerado pela API
  data: "2026-11-05",           // "AAAA-MM-DD", hoje ou antes
  meio: "onibus",               // "pe" | "onibus" | "metro"
  chegouSemSePerder: true,      // verdadeiro ou falso
  precisouDeAjuda: false,       // verdadeiro ou falso
  travessias: "seguro",         // "seguro" | "medio" | "inseguro"
  orientacoes: "parte",         // "sim" | "parte" | "nao"
  observacoes: "",              // opcional, até 300 caracteres
  criadoEm: "2026-11-05T14:30:00Z",    // opcional, se a API fornecer
  atualizadoEm: "2026-11-05T14:30:00Z" // opcional, se a API fornecer
};
```

Rótulos para exibição:

| Campo | Valores e rótulos |
| --- | --- |
| meio | pe "A pé" · onibus "Ônibus" · metro "Metrô ou trem" |
| chegouSemSePerder | true "Sim" · false "Não" |
| precisouDeAjuda | true "Sim" · false "Não" |
| travessias | seguro "Seguro" · medio "Mais ou menos" · inseguro "Inseguro" |
| orientacoes | sim "Sim" · parte "Em parte" · nao "Não" |

- **Sem campo de endereço ou nome.** Nenhum dado pessoal.
- Datas exibidas como **DD/MM/AAAA**.

### 7.3 Formulário (`/diario/novo` e `/diario/[id]/editar`)

- Página própria (não modal). Link "Voltar ao Diário" (ou "Voltar ao registro", ao editar) no topo.
- **H1:** "Novo registro" ou "Editar registro de DD/MM/AAAA". **Resumo:** Conte como foi um deslocamento que você já fez.
- Campos, nesta ordem, uma coluna:

| Rótulo visível | Controle | Obrigatório |
| --- | --- | --- |
| Data do deslocamento (obrigatório) | `<input type="date" max={hoje}>` | Sim |
| Meio de transporte (obrigatório) | radio: A pé / Ônibus / Metrô ou trem | Sim |
| Chegou ao destino sem se perder? (obrigatório) | radio: Sim / Não | Sim |
| Precisou de ajuda de outra pessoa? (obrigatório) | radio: Sim / Não | Sim |
| Como se sentiu nas travessias? (obrigatório) | radio: Seguro / Mais ou menos / Inseguro | Sim |
| As orientações da pulseira estavam certas? (obrigatório) | radio: Sim / Em parte / Não | Sim |
| Observações (opcional) | `<textarea>` + dica "Até 300 caracteres. Não escreva nomes ou endereços." (ligada por `aria-describedby`) | Não |

- Radios: cada opção é um rótulo clicável inteiro de 56 px de altura; a opção marcada ganha borda de 2 px e negrito.
- Botões: **"Salvar registro"** (principal) e **"Cancelar"** (secundário).
- **Sem controles deslizantes.** Botões de opção são mais fáceis com leitor de tela e ampliação.

**Validação: só ao enviar** (ao tocar em "Salvar registro"). Não validar a cada tecla nem ao sair do campo.

| Erro | Mensagem (junto do campo, com ícone) |
| --- | --- |
| Data vazia | Escolha a data do deslocamento. |
| Data no futuro | Escolha uma data de hoje ou de antes. O Diário registra deslocamentos que já aconteceram. |
| Meio vazio | Escolha o meio de transporte. |
| Se perdeu vazio | Responda se chegou ao destino sem se perder. |
| Ajuda vazio | Responda se precisou de ajuda de outra pessoa. |
| Travessias vazio | Responda como se sentiu nas travessias. |
| Orientações vazio | Responda se as orientações da pulseira estavam certas. |
| Observações > 300 | Use no máximo 300 caracteres nas observações. |

Após envio com erro:
- A mensagem aparece **junto de cada campo com problema** (sem resumo de erros no topo).
- Campo marcado com `aria-invalid="true"` e ligado à mensagem por `aria-describedby`. Em grupos de radio, `aria-describedby` no `<fieldset>`. **(Fase 5)** O `aria-invalid` **não** vai nos radios: a especificação ARIA não aceita esse atributo no papel `radio`, e o leitor de tela o ignoraria. O erro do grupo chega pelo `aria-describedby` do `<fieldset>`.
- **O foco vai para o primeiro campo com erro.** As respostas já preenchidas continuam na tela.

Ao salvar:
- Botão muda para **"Salvando…"** e não aceita um segundo toque. Anunciar "Salvando". **(Fase 5)** Implementado com `aria-disabled="true"`, e não `disabled`: com `disabled`, o navegador tira o foco do botão.
- Sucesso → volta para `/diario` com a mensagem **"Registro salvo."** (vale para Novo e para Editar).
- Falha → mensagem junto ao botão: "Não foi possível salvar. Verifique a conexão e tente de novo." Os dados continuam preenchidos.
- **(Fase 4)** As observações são salvas sem espaços nas pontas. No limite de 300 caracteres, acentos e emojis contam como 1 caractere.

**Aviso ao sair do formulário (correção H3 da Etapa 14):**
- Se houver respostas preenchidas (ou alteradas, ao editar) e a pessoa tocar em **Cancelar**, **Voltar** ou num **item da barra**, abrir o diálogo:
  - Título: **Descartar as respostas?**
  - Texto: As respostas deste registro não serão salvas.
  - Botões: **"Descartar respostas"** e **"Continuar preenchendo"** — o foco começa em "Continuar preenchendo".
- Ao fechar a aba ou recarregar: aviso padrão do navegador (`beforeunload`).
- Reaproveitar o componente `DialogoConfirmacao`.
- Dica de implementação: o App Router não bloqueia navegação sozinho; interceptar os cliques nos links do formulário e da barra (por exemplo, um contexto `useGuardaDeSaida` que a barra consulta antes de navegar).
- **Implementado (Fase 5):**
  - contexto `useGuardaDeSaida` + prop `onNavigate` do `<Link>` do Next 16 (`evento.preventDefault()`);
  - vale para a barra, o logo "Pulse", "Voltar" e "Cancelar";
  - "Descartar respostas" usa o botão de perigo preenchido e "Continuar preenchendo" o secundário, como no diálogo de excluir;
  - limite: o botão Voltar **do navegador** não pode ser bloqueado de forma confiável no App Router.

**Barra e teclado:** no celular, enquanto um campo de digitação (data ou observações) estiver em uso, a barra flutuante se esconde e volta quando o teclado fecha. **(Fase 5)** A barra volta quando o campo perde o foco. Se a pessoa fechar o teclado sem sair do campo (botão Voltar do Android), a barra só volta quando o campo perder o foco. Com "reduzir movimento", a barra também sai da frente, só que sem animação (hook `useDigitandoNoCelular`).

### 7.4 Ver registro (`/diario/[id]`)

- Link "Voltar ao Diário". **H1:** Registro de DD/MM/AAAA.
- **(Fase 5)** Enquanto os dados não chegam, o H1 é "Registro" (em Editar, "Editar registro"). Carregando e erro usam **os mesmos textos da lista**, no plural (decisão da equipe): "Carregando os registros…" e "Não foi possível carregar os registros." + "Verifique a conexão e tente de novo.".
- Lista de definições (`<dl>`), pergunta (`<dt>`) antes da resposta (`<dd>`): Meio de transporte; Chegou ao destino sem se perder?; Precisou de ajuda de outra pessoa?; Como se sentiu nas travessias?; As orientações da pulseira estavam certas?; Observações (ou "Nenhuma").
- Botões: **"Editar registro"** (link para `/diario/[id]/editar`) e **"Excluir registro"** (botão de perigo, contorno na cor de erro).
- Registro não encontrado: H1 "Registro não encontrado", texto "Esse registro pode ter sido excluído." e botão "Ir para o Diário".

### 7.5 Excluir

- "Excluir registro" abre `<dialog>` modal:
  - Título: **Excluir o registro de DD/MM/AAAA?**
  - Texto: Essa ação não pode ser desfeita.
  - Botões: **"Excluir registro"** (perigo, preenchido) e **"Manter registro"**. **O foco começa em "Manter registro".**
  - Conteúdo atrás inacessível enquanto aberto. `Esc` fecha. Ao fechar, o foco volta ao botão que abriu.
  - Durante a exclusão: "Excluindo…". Falha: "Não foi possível excluir. Verifique a conexão e tente de novo." dentro do diálogo.
- Sucesso → volta para `/diario` com a mensagem **"Registro excluído."** + botões **"Desfazer"** e **"Fechar"**.
- **Desfazer (correção H3 da Etapa 14):** recria o registro com os mesmos dados (POST) e anuncia **"Registro restaurado."** Disponível enquanto a mensagem estiver na tela.
- **(Fase 5)** Se o Desfazer falhar, aparece "Não foi possível salvar. Verifique a conexão e tente de novo." junto da mensagem, e o botão "Desfazer" continua disponível. A mensagem é levada até `/diario` pelo contexto `useMensagemDiario`. Ela pertence à página `/diario` e é apagada quando a pessoa vai para outra página, para não reaparecer depois.

### 7.6 Acesso a dados (API externa)

- **A API externa não será colocada agora.** O código fica preparado com um **serviço único** (`services/registrosService.js`), com 5 funções. Quando a API chegar, **só esse arquivo muda**; as telas e os hooks continuam iguais.
- **(Fase 9)** A equipe escolheu o **MockAPI** (mockapi.io). O formato dele (`GET` e `POST` em `/registros`; `GET`, `PUT` e `DELETE` em `/registros/:id`; lista como array; `id` em texto) é o que o serviço já espera, então o código não muda. Falta só a equipe criar o recurso `registros` e pôr o endereço no `.env.local` e na hospedagem (passo a passo no registro, subfase 9.9).

| Função | O que faz | Chamada esperada na API (REST) | Devolve |
| --- | --- | --- | --- |
| `listar()` | Busca todos os registros | `GET /registros` | lista de registros |
| `obter(id)` | Busca um registro | `GET /registros/:id` | o registro, ou `null` se não existir |
| `criar(dados)` | Cria um registro (dados sem `id`) | `POST /registros` | o registro criado, com `id` |
| `atualizar(id, dados)` | Altera um registro | `PUT /registros/:id` | o registro atualizado |
| `excluir(id)` | Exclui um registro | `DELETE /registros/:id` | nada |

- **Dentro de cada função**, um bloco de comentário com o marcador **`API-EXTERNA-AQUI`**, explicando o que a API deve receber e devolver (como na tabela).
- **URL base** em variável de ambiente (ex.: `NEXT_PUBLIC_API_URL`), também marcada com **`API-EXTERNA-AQUI`** no arquivo onde é lida.
- **Sem mock e sem dados provisórios.** Enquanto a API não existir, cada função **lança um erro de conexão** (`codigo: "conexao"`), e as telas mostram o estado de erro da seção 11 ("Não foi possível carregar os registros.") sem quebrar.
- Erros de rede, quando a API existir, também viram esse erro de domínio (`codigo: "conexao"`), que a interface traduz para as mensagens da seção 11.
- Sem login: qualquer pessoa vê, edita e exclui qualquer registro. Manter registros de exemplo prontos para recriar dados apagados durante a apresentação.
  - **Decisão da equipe (Fase 4):** o arquivo de registros de exemplo **não** será criado agora. Ele será feito quando a API existir, com dados fictícios, e nunca será importado pelo site (não é mock).

**Como ficou implementado (Fase 4):**
- `services/apiClient.js` é o **único** arquivo que faz `fetch`. Ele lê a URL base, faz a requisição e transforma qualquer falha (sem URL, sem internet, servidor fora do ar, resposta inválida, erro HTTP) no erro de domínio `{ codigo: "conexao" }`.
- O `fetch` já está escrito seguindo a tabela acima, mas só roda quando `NEXT_PUBLIC_API_URL` estiver configurada. Para configurar:
  1. crie `projeto-citizentech-1espu/.env.local` (já ignorado pelo Git) com `NEXT_PUBLIC_API_URL=https://endereco-da-api.com`, sem barra no final;
  2. reinicie o `npm run dev`.
- 404 em `obter` → `null` ("Registro não encontrado"). 404 em `atualizar`/`excluir` (o registro sumiu enquanto a pessoa estava na tela) → erro de conexão.
- Todas as funções aceitam `{ sinal }` (`AbortSignal`), para o hook cancelar a busca se a pessoa sair da tela.
- `registrosService` normaliza o registro recebido (por exemplo, `id` sempre texto) e envia só os campos do formulário (sem `id`, `criadoEm`, `atualizadoEm`).
- Se a API usar outro formato (PATCH em vez de PUT, lista dentro de `{ "itens": [...] }`), o bloco `API-EXTERNA-AQUI` de cada função diz qual linha ajustar.

---

## 8. Design tokens

> **(Fase 8)** Estilo, cores e tipografia substituídos pelas seções 18.3, 18.4 e 18.5. Espaçamento, foco e unidades desta seção continuam valendo.

Estilo visual (até a Fase 7): **Flat Design 2.0** — superfícies limpas, cores sólidas, sem degradê/textura/brilho, sombras sutis. A **borda é o que separa os elementos**; a sombra é só reforço.

### 8.1 Cores

Implementar como **variáveis CSS** que mudam com `@media (prefers-color-scheme: dark)` e expor ao Tailwind (no Tailwind v4, via `@theme`; no v3, em `theme.extend.colors` apontando para `var(--...)`). Todos os contrastes abaixo foram calculados.

**Tema claro**

| Token | Uso | Cor | Contraste |
| --- | --- | --- | --- |
| `--cor-fundo` | Fundo da página, cabeçalho e barra | `#FFFFFF` | — |
| `--cor-cartao` | Fundo de cartões e campos | `#F3F0FB` | — |
| `--cor-texto` | Texto principal | `#1E0F4A` | 17,2:1 (15,3:1 no cartão) |
| `--cor-texto-2` | Texto secundário | `#453A66` | 10,2:1 (9,1:1 no cartão) |
| `--cor-marca` | Títulos de destaque, links, item ativo da barra | `#3B1D8B` | 12,1:1 (10,8:1 no cartão) |
| `--cor-botao` / `--cor-botao-texto` | Botão principal | `#3B1D8B` / `#FFFFFF` | 12,1:1 |
| `--cor-borda` | Bordas | `#6B5F94` | 5,7:1 (5,1:1 no cartão) |
| `--cor-foco` | Contorno de foco | `#3B1D8B` | 12,1:1 |
| `--cor-linha-item` | Linha dos itens não selecionados da barra | `rgba(59, 29, 139, 0.6)` | 3,9:1 |
| `--cor-erro` / `--cor-erro-fundo` | Erro | `#8B0A1A` / `#FDECEC` | 8,5:1 |
| `--cor-sucesso` / `--cor-sucesso-fundo` | Sucesso | `#0A4D2E` / `#E7F6EC` | 8,9:1 |
| `--cor-aviso` / `--cor-aviso-fundo` | Aviso | `#5A3E00` / `#FFF4CC` | 9,0:1 |

**Tema escuro**

| Token | Uso | Cor | Contraste |
| --- | --- | --- | --- |
| `--cor-fundo` | Fundo da página | `#3B1D8B` | — |
| `--cor-cromo` | Cabeçalho e barra flutuante | `#2A1366` | — |
| `--cor-cartao` | Fundo de cartões e campos | `#2E1670` | — |
| `--cor-texto` | Texto principal | `#FFFFFF` | 12,1:1 (14,3:1 no cartão, 15,2:1 na barra) |
| `--cor-texto-2` | Texto secundário | `#EDE8FC` | 10,1:1 |
| `--cor-link` | Links (**sempre sublinhados**) | `#FFFFFF` | 12,1:1 |
| `--cor-botao` / `--cor-botao-texto` | Botão principal e item ativo da barra | `#FFFFFF` / `#2A1366` | 15,2:1 |
| botão secundário | Contorno branco, sem preenchimento | `#FFFFFF` | 12,1:1 |
| `--cor-borda` | Bordas | `#B9ADEB` | 5,9:1 (7,4:1 na barra) |
| `--cor-foco` | Contorno de foco | `#FFFFFF` | 12,1:1 (15,2:1 na barra) |
| `--cor-linha-item` | Linha dos itens não selecionados da barra | `rgba(255, 255, 255, 0.4)` | 3,5:1 |
| `--cor-erro` | Erro | `#FFDADA` | 9,4:1 (11,1:1 no cartão) |
| `--cor-sucesso` | Sucesso | `#B8F5CB` | 9,8:1 (11,6:1 no cartão) |
| `--cor-aviso` | Aviso | `#FFE7A3` | 9,9:1 (11,8:1 no cartão) |

Regras:
- No tema claro, `--cor-cromo` = `#FFFFFF`. No escuro, mensagens de status usam fundo `--cor-cartao`.
- **No tema escuro, links e texto têm a mesma cor**: links **sempre sublinhados**; botões diferenciados pelo formato (principal preenchido, secundário só contorno). Recomendado sublinhar links também no tema claro, por consistência.
- **Sem amarelo na interface.**
- Qualquer cor nova precisa passar de **7:1 para texto** e **3:1 para ícones, bordas e foco**. Conferir em https://webaim.org/resources/contrastchecker/.
- Adicionar `color-scheme: light dark` para controles nativos acompanharem o tema.

**Tokens definidos na implementação (Fase 1).** Reaproveitam cores que já estão na paleta acima; o contraste foi recalculado na Fase 7.

| Token | Claro | Escuro | Uso |
| --- | --- | --- | --- |
| `--cor-link` | `#3B1D8B` (= marca) | `#FFFFFF` | Links |
| `--cor-marca` | `#3B1D8B` | `#FFFFFF` (a cor do texto, como os links) | H1, logo, botão secundário |
| `--cor-cromo` | `#FFFFFF` | `#2A1366` | Cabeçalho, barra, diálogo |
| `--cor-botao-hover` | `#2A1366` (15,2:1 com o texto do botão) | `#EDE8FC` (12,7:1) | Botão principal com o mouse em cima |
| `--cor-hover` | `#F3F0FB` (= cartão) | `#2E1670` (= cartão) | Fundo leve no hover de botões secundários e itens da barra |
| `--cor-perigo-texto` | `#FFFFFF` (9,7:1) | `#2A1366` (11,8:1) | Texto do botão de perigo preenchido (fundo `--cor-erro`) |
| `--cor-erro/sucesso/aviso-fundo` | conforme a tabela | `#2E1670` (= cartão) | Fundo das mensagens de status |

- No Tailwind v4, os tokens ficam em `app/globals.css` (`:root` + `@media (prefers-color-scheme: dark)`) e são ligados às classes por `@theme inline` (ex.: `bg-fundo`, `text-texto`, `border-borda`). A paleta padrão do Tailwind foi removida (`--color-*: initial`), para ninguém usar uma cor sem contraste conferido.

### 8.2 Tipografia

- Família única: **Atkinson Hyperlegible Next** (Google Fonts, licença OFL), pesos **400 e 700**. **A fonte é instalada e ligada manualmente pela equipe.** No código, deixar o marcador **`FONTE-Atkinson Hyperlegible Next-AQUI`** no lugar onde ela será carregada (no `app/layout.jsx` ou no CSS global) e usar uma variável CSS de família (ex.: `--fonte-base`) com fallback `Verdana, system-ui, sans-serif`, para o site funcionar antes da fonte entrar.

| Uso | Tamanho | Altura de linha | Peso |
| --- | --- | --- | --- |
| H1 | 1,875rem (30 px) | 1,25 | 700 |
| H2 | 1,5rem (24 px) | 1,3 | 700 |
| H3 | 1,25rem (20 px) | 1,35 | 700 |
| H4 | 1,125rem (18 px) | 1,4 | 700 |
| Texto corrido | **1,125rem (18 px)** | 1,5 | 400 |
| Auxiliar, rótulos da barra, notas | 1rem (16 px) — **nunca menor** | 1,5 | 400 ou 700 |
| Números do resumo | 1,875rem | 1,2 | 700, `tabular-nums` |

- Sem pesos abaixo de 400, sem itálico em textos longos, **sem texto todo em maiúsculas**.
- O layout precisa aguentar espaçamento maior entre linhas, letras e palavras (WCAG 1.4.12).
- Títulos com `text-wrap: balance`.
- **(Fase 1)** Variável `--fonte-base: var(--fonte-atkinson, Verdana), Verdana, system-ui, sans-serif`. Para ligar a fonte, basta o `next/font` criar a variável `--fonte-atkinson` e colocar a classe dela na tag `<html>` (passo a passo no marcador em `app/layout.jsx`).
- **(Fase 7)** `overflow-wrap: anywhere` no `<body>`: uma palavra longa só é quebrada quando, sozinha, não cabe na linha (texto muito ampliado). Em tamanho normal, nada muda.

### 8.3 Espaçamento, cantos e sombras

| Token | Valor |
| --- | --- |
| Espaçamento | múltiplos de 8 px (4 px só em ajustes internos) |
| Margem lateral | `max(16px, env(safe-area-inset-left/right))` |
| Raio de cartões, campos e botões | 12 px |
| Raio da barra flutuante e do diálogo | 16 px |
| Raio dos itens da barra | 12 px |
| Sombra de cartão (claro) | `0 1px 2px rgba(30,15,74,.08), 0 4px 12px rgba(30,15,74,.06)` |
| Sombra de barra e diálogo (claro) | `0 8px 24px rgba(30,15,74,.14)` |
| Sombra de cartão (escuro) | `0 4px 12px rgba(0,0,0,.30)` |
| Sombra de barra e diálogo (escuro) | `0 8px 24px rgba(0,0,0,.35)` |
| Contorno de foco | `outline: 3px solid var(--cor-foco); outline-offset: 2px` (usar `:focus-visible`) |
| Transições | até 200 ms, só em cor de fundo e posição das barras; nenhuma com `prefers-reduced-motion: reduce` |

Toque e passagem do mouse: **mudança leve de fundo**, sem animações chamativas. **(Fase 1)** As cores são `--cor-botao-hover` e `--cor-hover` (8.1). O botão de perigo preenchido não muda de cor, porque não há uma cor da paleta que sirva para isso.

**Foco no campo de data (Fase 7):** o campo de data tem partes internas (dia, mês, ano e, no Chrome, o ícone de calendário). Ele usa `input[type="date"]:focus-within` com o mesmo contorno de 3 px, porque no ícone de calendário o `:focus-visible` não se aplica.

**Unidades (Fase 1):** a unidade de espaçamento do Tailwind v4 é 0,25rem (4 px): `p-2` = 8 px, `p-4` = 16 px. Os pontos de quebra `md` (48rem) e `lg` (64rem) são os padrões do Tailwind.

---

## 9. Navegação: cabeçalho e barra flutuante

### 9.1 Cabeçalho

- Altura 64 px, fundo `--cor-cromo`, borda inferior `--cor-borda`. Contém só o link "Pulse" (logo + texto, 22 px, negrito).
- Fica preso no topo (`sticky`). Em Início e Solução, no celular, some ao rolar (ver 9.3).

### 9.2 Barra flutuante (`<nav aria-label="Navegação principal">`)

> **(Fase 8)** Comportamento igual; visual em pílula com o item ativo dourado (seção 18.9).

- **Em todos os tamanhos de tela.** Centralizada horizontalmente, **16 px acima da borda inferior + área de segurança** (`env(safe-area-inset-bottom)`).
- Fundo **sólido** `--cor-cromo` (nunca translúcido), borda 1 px `--cor-borda`, raio 16 px, sombra de barra, padding 6 px, 6 px entre itens.
- 4 itens, nesta ordem: **Início** (`/`), **Solução** (`/solucao`), **Simulador** (`/simulador`), **Diário** (`/diario` e subrotas).
- Cada item: ícone (24 px) + texto (16 px). **Celular:** ícone em cima e texto embaixo, altura mínima 56 px. **A partir de 768 px:** ícone e texto lado a lado, altura mínima 48 px.
- **Largura dos itens no celular (decisão da equipe, Fase 2):** a regra original era "4 colunas iguais", mas 4 colunas iguais com texto de 16 px não cabem a 320 px ("Simulador" em negrito precisa de ~91 px; cada coluna teria ~64 px), e isso causaria rolagem lateral (WCAG 1.4.10). Ficou assim:
  - cada item tem a largura do seu texto, numa linha só, e divide o espaço que sobra;
  - quando não cabe (tela de ~320 px ou texto ampliado), a barra passa para **2 × 2**;
  - a decisão é feita **medindo os textos no navegador** (hook `useCabeEmUmaLinha`), então acompanha a fonte instalada, o tamanho de texto e o espaçamento escolhidos pela pessoa;
  - o espaço interno dos itens no celular é de 4 px, para caber em uma linha a partir de ~375 px;
  - o texto do item reserva a largura do negrito, para a barra não "pular" quando o item ativo muda.
- **(Fase 2)** A altura real da barra é medida e guardada em `--altura-barra`. O espaço extra no fim da página e o `scroll-padding` usam esse valor.
- Item **não selecionado**: borda 1 px `--cor-linha-item` (mostra onde tocar).
- Item **selecionado**: fundo `--cor-botao`, texto `--cor-botao-texto`, negrito, `aria-current="page"` (o leitor de tela anuncia "página atual"). Nunca depende só da linha.
- Ícones com `aria-hidden="true"`.
- **Pouca altura disponível** (`max-height: 480px`, zoom alto ou celular deitado): a barra deixa de flutuar e passa a ficar no fim da página, no fluxo normal.

### 9.3 Barras que somem ao rolar (custom hook `useDirecaoRolagem`)

Aplica-se **só a Início e Solução, só abaixo de 768 px**:
- Rolou para baixo mais que uma distância mínima (≈ altura do cabeçalho, 64 px) → cabeçalho e barra deslizam para fora da tela.
- Continuam escondidos quando a rolagem para.
- Rolou para cima mais que 64 px → voltam.
- **Voltam também**: no topo da página, perto do fim da página, e quando qualquer elemento delas recebe foco.
- Esconder **só visualmente** (`transform: translateY`), nunca com `display: none`/`hidden`: elas continuam acessíveis ao leitor de tela.
- Com `prefers-reduced-motion: reduce`: **sempre visíveis**.
- Em Simulador e Diário, e em telas a partir de 768 px: sempre visíveis.

### 9.4 Índice "Nesta página"

> **(Fase 8, decisão da equipe)** O índice virou uma fileira de pílulas depois do resumo (Solução) ou da abertura (Início), com o `<h2>` "Nesta página" visualmente oculto. A coluna lateral desta seção saiu. No computador (≥ 1024 px de largura e ≥ 700 px de altura), o índice gruda embaixo do cabeçalho, e a pílula da seção atual fica dourada (`aria-current="true"`). Ver a seção 17.

- Início e Solução. `<nav aria-label="Nesta página">` com `<h2>` "Nesta página" e links para os `id` das seções (cada `<h2>` de seção com `id` e `tabIndex={-1}` para receber o foco).
- Celular e tablet: cartão no topo da página, depois do resumo.
- **A partir de 1024 px**: coluna ao lado do texto, presa ao rolar (`position: sticky`). **(Fase 6)** Implementado assim:
  - fica à **direita** do texto, numa grade de 59rem (texto 40rem + espaço 3rem + índice 16rem), no componente `PaginaComIndice`;
  - a ordem no HTML não muda: título → índice → seções;
  - em telas baixas, o índice rola por dentro em vez de ficar cortado.
- Rolagem suave só sem `prefers-reduced-motion`.

---

## 10. Componentes reutilizáveis

| # | Componente | Onde aparece | Notas de acessibilidade |
| --- | --- | --- | --- |
| 1 | `LinkPular` | Todas as páginas | Primeiro elemento focável; visível só com foco |
| 2 | `Cabecalho` | Todas | `<header>`; link "Pulse" para `/` |
| 3 | `BarraNavegacao` + `ItemBarra` | Todas | `<nav aria-label="Navegação principal">`; `aria-current="page"` |
| 4 | `Botao` (variantes: principal, secundário, perigo; também como link) | Todo o site | 56 px de altura; `disabled` só durante salvar/excluir; texto visível contido no nome acessível |
| 5 | `IndiceNestaPagina` | Início, Solução | `<nav aria-label="Nesta página">` |
| 6 | `Cartao` | Sinais, perfis, tecnologias, ODS, registros, dados | Borda + sombra leve; heading interno no nível certo |
| 7 | `GrupoOpcoes` | Formulário | `<fieldset>` + `<legend>` + radios; erro ligado ao fieldset |
| 8 | `Campo` (data, área de texto) | Formulário | `<label for>`, dica e erro por `aria-describedby`, `aria-invalid` |
| 9 | `MensagemStatus` (sucesso, erro, aviso) | Diário | Ícone + texto; `role="status"` (sucesso) ou `role="alert"` (erro); botão "Fechar" (`aria-label="Fechar mensagem"`); pode ter ação extra ("Desfazer"); **não some sozinha** |
| 10 | `DialogoConfirmacao` | Excluir, Descartar respostas | `<dialog>` modal, `aria-labelledby`/`aria-describedby`, foco inicial na opção segura, foco volta ao fechar |
| 11 | `ResumoIndicadores` | Topo do Diário | `<ul>` de 4 itens; números com `tabular-nums` |
| 12 | `EstadoTela` (carregando, vazio, erro) | Diário, Ver registro | Carregando com `role="status"`; erro com `role="alert"` e botão "Tentar de novo" |
| 13 | `EspacoImagem` | Início, Solução, Simulador | Espaço reservado tracejado com o marcador `IMAGEM-...-AQUI`; quando o Claude Code ligar a imagem, ele sai, e o `alt` é sempre preenchido (seção 13.2) |
| 14 | `CartaoIntegrante` | Solução (Equipe) | Foto com `alt="Foto de (nome)"` + nome em `<h3>`; item de uma `<ul>` |

Componentes extras de layout permitidos (ex.: `Rodape`, `CartaoRegistro`, `ListaRegistros`, `FormularioRegistro`).

**Como ficou implementado (Fases 2 a 6): 33 componentes.**

| Componente extra | Para que serve |
| --- | --- |
| `EspacoIcone` | Desenha o ícone Phosphor pelo nome (24 px, peso Bold, `aria-hidden`); o marcador `ICONE-…-AQUI` fica em comentário ao lado de cada uso (seção 13.1) |
| `ErroCampo` | Mensagem de erro com ícone e texto (campo, botão Salvar, diálogo) |
| `LinkVoltar` | "Voltar ao Diário" / "Voltar ao registro", passando pela guarda de saída |
| `TituloPagina` | `<h1 tabIndex={-1}>` + resumo, em todas as páginas |
| `Secao` | `<section>` com `<h2 id tabIndex={-1}>`, destino do "Nesta página" |
| `PaginaComIndice` | Estrutura de Início e Solução, com o índice lateral no computador |
| `FocoNaTroca` | Leva o foco ao `<h1>` na troca de rota |
| `Provedores` | Junta os contextos (guarda de saída e mensagem do Diário) no layout |
| `RegistroNaoEncontrado` | Tela "Registro não encontrado" (Ver e Editar) |
| `TelaDiario`, `TelaNovoRegistro`, `TelaRegistro`, `TelaEditarRegistro` | Telas do Diário: ligam os hooks aos componentes de apresentação |

Notas de implementação:
- `Botao` tem as variantes `principal`, `secundario`, `perigo` (contorno) e `perigo-preenchido`. Durante "Salvando…" e "Excluindo…" usa `aria-disabled`, e não `disabled`.
- `Cartao` tem as opções `as` (ex.: `as="li"`), `destaque` (ODS principal) e `compacto` (espaço interno de 16 px, usado no resumo em 2 × 2).
- `MensagemStatus` cria a região `role="status"` vazia e coloca o texto logo depois. O leitor de tela só anuncia mudanças dentro de uma região que já existia na página.
- `DialogoConfirmacao` usa `<dialog>` com `showModal()`. O Esc é tratado pelo evento `cancel`, e o foco volta ao elemento que abriu o diálogo.

---

## 11. Estados da interface e mensagens

### 11.1 Tempos (limites de Nielsen)

- Abaixo de 1 s: nenhum indicador.
- Entre 1 e 10 s: indicador de carregamento + texto.
- Acima de 10 s: progresso e opção de cancelar. **(Pendente)** O cancelamento já existe por dentro (`AbortSignal`), mas faltam os textos do aviso e do botão (seção 16).

### 11.2 Estados do Diário

| Momento | O que aparece | O que o leitor de tela anuncia |
| --- | --- | --- |
| Carregando a lista (> 1 s) | "Carregando os registros…" + indicador simples (não gira com movimento reduzido) | "Carregando os registros" |
| Lista vazia | **H2 Nenhum deslocamento registrado ainda** · "Registre o primeiro para começar a medir o impacto da Pulse." · botão "Novo registro" | O texto |
| Erro ao carregar | "Não foi possível carregar os registros." · "Verifique a conexão e tente de novo." · botão "Tentar de novo" | O texto do erro (alerta) |
| Salvando | Botão "Salvando…", travado | "Salvando" |
| Salvo | Volta à lista com "Registro salvo." + "Fechar" | "Registro salvo" |
| Erro de preenchimento | Mensagem em cada campo com problema; foco no primeiro | Nome do campo, "inválido" e o erro |
| Erro ao salvar | Mensagem junto ao botão; dados mantidos | O texto do erro |
| Excluído | Volta à lista com "Registro excluído." + "Desfazer" + "Fechar" | "Registro excluído" |
| Restaurado | "Registro restaurado." + "Fechar" | "Registro restaurado" |

**Decisões da implementação (Fase 5):**
- Ver registro e Editar registro usam os mesmos textos de carregando e de erro da lista, no plural (decisão da equipe).
- Nos estados de erro e de lista vazia, o Resumo e o botão "Novo registro" do topo não aparecem. Na lista vazia, o botão fica dentro do próprio estado.
- Quando o "Tentar de novo" falha outra vez, a mensagem é anunciada de novo e o foco volta para o botão.

### 11.3 Regras

- Mensagens de status anunciadas **sem mover o foco** (WCAG 4.1.3), exceto erro de preenchimento (foco vai ao campo).
- Mensagens de sucesso **não somem sozinhas**: ficam no topo da lista até "Fechar".

### 11.4 Tom de voz

- Próximo, sério, respeitoso e objetivo. "Você". Sem gírias, sem "incrível!", sem excesso de exclamação.
- Frases curtas, informação mais importante primeiro, palavras do dia a dia, nome completo antes da sigla.
- Links e botões dizem o que fazem ("Ver os sinais da pulseira", nunca "Clique aqui").
- Instruções nunca dependem de cor, forma ou posição.
- Termos: "pessoa com deficiência visual", "pessoa cega", "pessoa com baixa visão". **Nunca** "portador" ou "deficiente". Sem pena e sem "superação heroica".
- Como o Diário é compartilhado, evitar "seus registros"; usar "os registros".

---

## 12. Responsividade

> **(Fase 8)** Complementada pela seção 18.12.

Pontos de quebra do Tailwind: **`md` = 768 px** (tablet) e **`lg` = 1024 px** (computador).

| Elemento | Celular (< 768 px) | Tablet (≥ 768) | Computador (≥ 1024) |
| --- | --- | --- | --- |
| Barra flutuante | Ícone em cima, texto embaixo; largura pelo texto em 1 linha, 2 × 2 quando não couber **(Fase 2)** | Ícone e texto lado a lado | Igual ao tablet |
| Barras que somem ao rolar | Início e Solução | Não | Não |
| Coluna de texto | Largura total | Até ~40rem, centralizada | Até ~40rem, centralizada |
| "Nesta página" | Cartão no topo | Cartão no topo | Coluna lateral `sticky` |
| Cartões repetidos | 1 por linha | 2 por linha | 2 por linha |
| Resumo do Diário | 2 × 2 (palavras longas podem ser hifenizadas a 320 px) | 4 lado a lado | 4 lado a lado |
| Formulário | 1 coluna | 1 coluna | 1 coluna |
| Equipe (Solução) | 1 por linha: foto de 64 px à esquerda, nome à direita | 3 por linha (3 + 2, segunda linha centralizada): foto em cima, nome embaixo | **5 lado a lado**: foto em cima, nome embaixo; a seção pode ocupar até ~64rem para caber os 5 (implementado: ocupa a grade inteira de 59rem, **Fase 6**) |

- **(Fase 6)** "Cartões repetidos" inclui os registros do Diário (2 por linha a partir de 768 px).
- **(Fase 2)** "Pouca altura" (`max-height: 30rem`, ou seja, 480 px): variante `pouca-altura:` no CSS. A barra fica no fim da página e o espaço extra no fim cai para 2rem.

---

## 13. Ícones e imagens

### 13.1 Ícones

- Biblioteca **Phosphor Icons**, peso **Bold** (licença MIT). Tamanho mínimo 24 px. Sempre com texto visível ao lado; `aria-hidden="true"`.
- **Os ícones são colocados pelo Claude Code** (decisão da equipe em 14/11/2026, depois da Fase 9), com o pacote `@phosphor-icons/react` (versão fixa `2.1.10`, instalado depois de mostrar o comando e receber a confirmação da equipe).
  - O componente `EspacoIcone` desenha o ícone pelo prop `nome`, com `size={24}`, `weight="bold"` e `aria-hidden="true"`. Ele importa de `@phosphor-icons/react/ssr`, que funciona em Server e Client Components.
  - Só os ícones listados em `EspacoIcone` entram no site (mapa explícito, sem importar a biblioteca inteira). Para usar um ícone novo, importe-o e acrescente-o ao mapa.
  - Nome fora do mapa: o `EspacoIcone` volta o espaço vazio antigo, que não ocupa lugar (19.5). O texto continua centralizado e o site funciona.
  - Os marcadores **`ICONE-(nome)-AQUI`** continuam no código, em comentário, ao lado de cada uso, como referência.
- Nomes de referência (conferidos na versão `2.1.10`: todos existem):

| Uso | Ícone Phosphor |
| --- | --- |
| Logo / Pulse | `Pulse` |
| Início | `House` |
| Solução | `Watch` |
| Simulador | `Play` |
| Diário | `Notebook` |
| Novo registro | `Plus` |
| Editar | `PencilSimple` |
| Excluir | `Trash` |
| Voltar | `ArrowLeft` |
| Tentar de novo | `ArrowClockwise` |
| Desfazer | `ArrowCounterClockwise` |
| Fechar | `X` |
| Erro | `WarningCircle` |
| Sucesso | ~~`CheckCircle`~~ **(Fase 9)** sem ícone da equipe: o "certo" é desenhado por código (`CertoDesenhado`) |
| Aviso | `Warning` |
| Espaço de imagem | `Image` |

- **(Fases 8 e 9)** Além desses, o site usa `Pause`, `CaretLeft`, `CaretRight`, `ArrowDown`, `ArrowUp`, `ArrowRight`, `ArrowsClockwise`, `ArrowsOutCardinal`, `Eye`, `SpeakerHigh` e `SpeakerSlash` (18.13 e 19.14). Ao todo são 26 ícones; a lista completa está no mapa `ICONES` de `components/ui/EspacoIcone.jsx`.

### 13.2 Imagens

- **Quem faz o quê** (decisão da equipe em 14/11/2026, depois da Fase 9):
  - **A equipe** só coloca os arquivos das imagens na pasta `public/imagens/`.
  - **O Claude Code** liga os caminhos no código: troca cada `EspacoImagem` pela imagem (`/imagens/…`), com o `alt` sugerido no comentário do marcador. Onde houver `FotoFiltro`, a imagem entra **dentro** dele (o filtro e o parallax só funcionam com uma `<img>`).
  - **Quando:** só depois que **todas** as imagens estiverem na pasta, com os nomes certos, e a equipe avisar. Até lá, os espaços `EspacoImagem` continuam.
  - O Claude Code continua sem gerar imagens (18.13).
- Enquanto a imagem não entra, o componente `EspacoImagem` ocupa o lugar dela, com o marcador **`IMAGEM-(descrição da imagem)-AQUI`**, por exemplo `IMAGEM-pessoa cega usando o celular-AQUI`. Os marcadores ficam em comentário, como referência, também depois que a imagem entrar.
- **Todo `alt` é preenchido.** Não há imagens decorativas no site: se uma imagem não comunica nada, ela não entra.
- Regras do texto alternativo (`alt`), para soar como o leitor de tela nativo do celular:
  - **simples, claro e direto**, em uma frase curta;
  - diz o que importa na imagem **para aquele trecho da página**;
  - **não começa com "imagem de" ou "figura de"**, porque o leitor de tela já anuncia "imagem";
  - sem repetir textos longos que já estão ao lado;
  - se a imagem tiver informação que não cabe numa frase (um diagrama, por exemplo), essa informação também aparece em texto na página.
- Ao lado de cada marcador, deixar em comentário o `alt` sugerido:

| Marcador | `alt` sugerido (ajustar quando a imagem existir) |
| --- | --- |
| `IMAGEM-ilustração de uma travessia-AQUI` | "Pessoa cega com bengala esperando para atravessar a rua na faixa de pedestres." |
| `IMAGEM-ilustração conceitual da pulseira-AQUI` | "Ilustração da pulseira Pulse no pulso de uma pessoa." |
| `IMAGEM-foto de (nome)-AQUI` | "Foto de (nome)." |

- **Ícones continuam ocultos para o leitor de tela** (`aria-hidden="true"`), porque o texto ao lado já diz o mesmo. Assim a leitura fica direta: "Início", e não "Ícone casa, Início".
- **Sem texto dentro de imagens.** Imagens da pulseira são apresentadas como "ilustração conceitual".
- **Não usar imagens geradas por IA.** **(Fase 8)** Vale para o Claude Code; a equipe pode colocá-las. Marcadores novos na seção 18.13.
- Outras mídias, se houver, também são manuais: **`VIDEO-(descrição)-AQUI`** e **`AUDIO-(descrição)-AQUI`**. Sem animação ou vídeo automático de mais de 5 s sem botão de pausa; som só depois de uma ação da pessoa. **(Fase 9)** Os vídeos e o componente `VideoPulse` estão na seção 19.13.

---

## 14. Arquitetura de código sugerida

A estrutura de pastas é criada manualmente pela equipe. Se os nomes no projeto forem diferentes dos abaixo, seguir o projeto e avisar a equipe.

**Estrutura real do projeto (decidida na Fase 0):**
- não há `src/`: as pastas ficam na raiz de `projeto-citizentech-1espu/`, ao lado de `app/` (o alias `@/*` do `jsconfig.json` aponta para essa raiz);
- arquivos com JSX usam `.jsx`; hooks, serviços e `lib` usam `.js`. Os hooks que trazem um contexto (provedor com JSX) usam `.jsx`.

Versões encontradas: Next.js 16.4.6 (App Router, Turbopack e React Compiler ligados), React 19.3, Tailwind CSS 4.3.3 (loader `@tailwindcss/turbopack`, configuração no próprio CSS) e ESLint 9 com `eslint-config-next`.

```
docs/
  ESPECIFICACAO_PULSE.md          # este arquivo
  REGISTRO_DESENVOLVIMENTO.md     # resumo de cada fase do desenvolvimento
AI.md                             # registro do uso de IA (mantido pela equipe; ver seção 16)
projeto-citizentech-1espu/
  app/
    layout.jsx                    # FONTE-...-AQUI, Provedores, LinkPular, Cabecalho, <main>, Rodape, BarraNavegacao, FocoNaTroca
    page.jsx                      # Início
    solucao/page.jsx              # Solução (com a seção Equipe)
    simulador/page.jsx            # SIMULADOR-AQUI
    diario/page.jsx               # lista (TelaDiario)
    diario/novo/page.jsx          # TelaNovoRegistro
    diario/[id]/page.jsx          # TelaRegistro
    diario/[id]/editar/page.jsx   # TelaEditarRegistro
    globals.css                   # tokens, tema escuro, @theme, foco, forced-colors, reduced-motion
  components/
    layout/   # LinkPular, Cabecalho, BarraNavegacao, ItemBarra, Rodape, IndiceNestaPagina,
              # TituloPagina, Secao, PaginaComIndice, FocoNaTroca, Provedores
    ui/       # Botao, Cartao, Campo, GrupoOpcoes, MensagemStatus, DialogoConfirmacao, EstadoTela,
              # EspacoImagem, EspacoIcone, ErroCampo, LinkVoltar
    diario/   # ResumoIndicadores, ListaRegistros, CartaoRegistro, FormularioRegistro, DetalheRegistro,
              # RegistroNaoEncontrado, TelaDiario, TelaNovoRegistro, TelaRegistro, TelaEditarRegistro
    solucao/  # CartaoIntegrante
  hooks/
    useRegistros.js               # estado do CRUD: lista, carregando, erro, criar/atualizar/excluir/restaurar
    useRegistro.js                # um registro (Ver e Editar), incluindo "não encontrado"
    useFormularioRegistro.js      # valores, validação ao enviar, foco no 1º erro, "Salvando…", aviso de saída
    useResumoIndicadores.js       # os 4 indicadores a partir da lista
    useGuardaDeSaida.jsx          # contexto + diálogo "Descartar as respostas?"
    useMensagemDiario.jsx         # contexto da mensagem "Registro salvo." / "Registro excluído." + Desfazer
    useDirecaoRolagem.js          # esconde/mostra cabeçalho e barra (seção 9.3)
    usePrefereMovimentoReduzido.js
    useCabeEmUmaLinha.js          # barra em 1 linha ou 2 × 2 (mede os textos)
    useDigitandoNoCelular.js      # barra sai da frente do teclado
    useHoje.js                    # data de hoje no fuso do aparelho (max do campo de data)
    useTituloDaAba.js             # título "Registro de DD/MM/AAAA — Pulse"
  services/
    apiClient.js                  # URL base (API-EXTERNA-AQUI), o único fetch, tradução de erros
    registrosService.js           # as 5 funções do CRUD, cada uma com API-EXTERNA-AQUI
  lib/
    datas.js                      # DD/MM/AAAA, hoje em AAAA-MM-DD, validar data, ordenar
    rotulos.js                    # perguntas, opções, etiquetas e textos dos indicadores
    validacao.js                  # regras e mensagens (seção 7.3) — funções puras
```

- Hooks fazem a ponte entre serviços e componentes. `useState` e `useEffect` aparecem naturalmente nos hooks e componentes interativos.
- Páginas de conteúdo (Início, Solução, Simulador) são Server Components. Barra, cabeçalho, formulário e telas do Diário são Client Components (`"use client"`).
- **(Fase 5)** As páginas do Diário são divididas em dois arquivos: o `page.jsx` (servidor) define o título da aba, e a `Tela…` (cliente) tem o conteúdo interativo. Uma página com `"use client"` não pode exportar `metadata`.
- **(Fase 5)** O ESLint do Next 16 (`eslint-plugin-react-hooks` 7) proíbe chamar `setState` diretamente dentro de `useEffect`. Por isso alguns hooks usam `useSyncExternalStore` (`usePrefereMovimentoReduzido`, `useHoje`) ou atualizam o estado só em retornos assíncronos e eventos.

### 14.1 Convenções do código

| Convenção | Regra |
| --- | --- |
| Linguagem | **JavaScript** (`.js` e `.jsx`), componentes funcionais. **Sem TypeScript.** |
| Nomes | Componentes, hooks e variáveis em **português**, como nesta especificação |
| Parte lógica | **(Fase 9) Regra retirada a pedido da equipe:** o código não usa mais a marcação. Regra antiga: todo trecho lógico recebia, logo acima, o comentário **`// Esta parte é lógica`** (em JSX: `{/* Esta parte é lógica */}`). Vale para hooks, serviços, validação, cálculos e funções que tratam eventos dentro dos componentes. |
| Pacotes e configuração | Não instalar pacotes nem mudar configurações. Se algo for necessário, informar à equipe o que instalar e por quê. |
| Commits | Feitos **manualmente pela equipe**. Ao fim de cada fase, sugerir uma mensagem simples em português (ex.: `Adiciona layout comum e barra de navegação`). |
| `prompts.md` | Mantido manualmente pela equipe. Não editar. |

**Marcadores** (deixar no lugar exato de cada item, de forma bem visível):

| Item | Marcador | Onde |
| --- | --- | --- |
| Fonte | `FONTE-Atkinson Hyperlegible Next-AQUI` | `app/layout.jsx` ou CSS global (seção 8.2) |
| Ícone | `ICONE-(nome)-AQUI`, ex.: `ICONE-House-AQUI` | Comentário ao lado de cada ícone, só como referência: o ícone já é desenhado pelo `EspacoIcone` (seção 13.1) |
| Imagem | `IMAGEM-(descrição)-AQUI`, ex.: `IMAGEM-foto de Giovana-AQUI` | Dentro de cada `EspacoImagem`, incluindo as 5 fotos da equipe, sempre com o `alt` sugerido ao lado (seção 13.2) |
| Vídeo e áudio | `VIDEO-(descrição)-AQUI`, `AUDIO-(descrição)-AQUI` | Onde houver (seção 13.2) |
| API externa | `API-EXTERNA-AQUI` | Em cada função de `registrosService.js` e na URL base (seção 7.6) |
| Simulador | `SIMULADOR-AQUI` | `app/simulador/page.jsx` (seção 6.3) |

Os marcadores não podem quebrar o layout nem a acessibilidade: cada espaço mantém o tamanho final, e o texto visível já existe.

### 14.2 Por que componentes de apresentação não chamam `fetch`

`fetch` é o comando que busca ou envia dados para uma API. A regra divide o trabalho em três camadas, cada uma com uma função:

| Camada | Função | Exemplo na Pulse |
| --- | --- | --- |
| **Serviço** | É o único que conversa com a API | `registrosService.listar()` faz o `fetch` |
| **Hook** | Guarda o estado (lista, carregando, erro) e chama o serviço | `useRegistros()` |
| **Componente de apresentação** | Só mostra o que recebe por *props* (dados passados de um componente para outro) | `CartaoRegistro` mostra data, meio e etiquetas |

```jsx
// O componente só recebe e mostra. Não sabe de onde os dados vieram.
function CartaoRegistro({ registro }) {
  return <h3>{registro.data} · {registro.meio}</h3>;
}

// A página usa o hook, e o hook usa o serviço.
function PaginaDiario() {
  const { registros, carregando, erro } = useRegistros();
  // ...mostra os estados e a lista de CartaoRegistro
}
```

Por que isso importa:
1. **A API entra depois.** Quando ela chegar, muda **só o serviço**. As telas continuam iguais. **(Fase 9:** a API escolhida é o MockAPI, e nem o serviço precisou mudar.**)**
2. **É um requisito da disciplina:** separar a lógica de negócio, o acesso a dados e a camada visual.
3. **Cada parte fica mais fácil de entender e corrigir.** Se a lista não aparece, o problema está no serviço ou no hook, não espalhado pelas telas.

---

## 15. Checklist de acessibilidade e critérios de aceite

Antes de considerar uma página pronta:

- [ ] Funciona só com teclado: ordem de foco igual à ordem visual, foco sempre visível e nunca escondido pela barra.
- [ ] "Pular para o conteúdo" funciona e é o primeiro foco.
- [ ] Um `<h1>` por página, títulos em ordem, regiões (`header`, `nav`, `main`, `footer`) presentes.
- [ ] Título da aba único; foco vai para o `<h1>` ao trocar de rota.
- [ ] Testado com leitor de tela (VoiceOver no iPhone ou TalkBack no Android; NVDA no computador): tudo anunciado como descrito nas seções 7 e 11.
- [ ] 320 px de largura sem rolagem lateral; zoom de 200% e 400% sem perda de conteúdo.
- [ ] Texto ampliado nas configurações do celular sem quebrar o layout.
- [ ] Contraste conferido nos dois temas (7:1 texto, 3:1 ícones/bordas/foco).
- [ ] `prefers-reduced-motion`: nada se move e as barras ficam visíveis.
- [ ] Alto contraste do Windows: bordas visíveis, item ativo da barra identificável.
- [ ] Alvos de toque ≥ 48 × 48 px.
- [ ] Nenhuma informação só por cor; todo ícone com texto.
- [ ] Toda imagem com `alt` preenchido, simples, claro e direto (seção 13.2).
- [ ] Sem erros no `eslint-plugin-jsx-a11y` (já vem no Next) e sem violações no axe DevTools / Lighthouse.
- [ ] Sem a API: o Diário mostra o estado de erro de conexão sem quebrar.
- [ ] Quando a API for conectada: CRUD completo funcionando, incluindo Desfazer e o aviso de descartar respostas.
- [ ] Todos os marcadores da seção 14.1 estão no lugar e listados para a equipe.

**Resultado da revisão automática (Fase 7):**
- ESLint `jsx-a11y` completo (33 regras): 0 problemas.
- Contraste calculado nos dois temas: 54 de 54 combinações.
- axe-core (WCAG 2.2 AA + contraste 7:1): 0 violações, em 14 estados e nos dois temas.
- Teclado, alvos de toque, zoom de 400%, espaçamento de texto, texto em 200%, movimento reduzido e alto contraste: todos aprovados.

Os itens que só uma pessoa consegue testar (leitor de tela, aparelho real, alto contraste real, texto ampliado no celular) e o passo a passo de cada teste estão em `docs/REGISTRO_DESENVOLVIMENTO.md`, Fase 7.

---

## 16. Pendências e suposições

**Pendências (não inventar; perguntar à equipe):**
- API externa do Diário: espaço preparado com `API-EXTERNA-AQUI` (seção 7.6).
- Simulador: outro integrante; espaço preparado com `SIMULADOR-AQUI` (seção 6.3).
- Imagens (ilustrações): a equipe põe os arquivos em `public/imagens/`, e o Claude Code liga os caminhos depois que todas estiverem lá. Até lá, espaços com `IMAGEM-...-AQUI` e `alt` sugerido (seção 13.2).
- API: a equipe vai **aguardar a API** para testar o CRUD. Sem mock.
- Fotos da equipe (Giovana, Giovane, Mie, Pedro e Thiago): a equipe põe os arquivos em `public/imagens/`, e o Claude Code liga os caminhos nos marcadores `IMAGEM-foto de (nome)-AQUI` (seção 13.2).
- Fontes: colocadas manualmente pela equipe nos marcadores (seções 8.2 e 18.1). **(Fase 8)** São 3 fontes: Anton, Atkinson Hyperlegible Next e JetBrains Mono (`app/layout.jsx`). **(Fase 9)** As fontes passam a entrar por `next/font/google` (19.4).
- Ícones: colocados pelo Claude Code com o pacote `@phosphor-icons/react`, pelo componente `EspacoIcone` (seção 13.1).
- **(Fase 9)** Vídeos: a equipe coloca os arquivos em `public/videos/` (19.13) e, quando tiver, a versão de "A pulseira" com a voz "Trianon-Masp".
- **(Fase 9)** Imagens: os prompts para gerar as difíceis de achar estão no documento "Prompts das imagens da Pulse"; marcadores novos na 19.14.
- **(Fase 9, decisão da equipe, 12/11/2026)** Os vídeos de "Os sinais" substituem a pulseira 3D pequena (19.13); a pulseira no modo `explorar` entra em "A pulseira" (19.12); em "Como funciona", as miniaturas são os quadros parados dos vídeos (19.13).
- Nome definitivo da pulseira ("Pulse" é provisório).
- ~~**(Fase 7)** Página 404 em português.~~ **(Fase 8)** Feita (`app/not-found.jsx`).
- **(Fase 8)** Imagens novas: capa (2 versões), 4 sinais e 6 fotos da galeria (seção 18.13), colocadas pela equipe. Ao colocar a imagem da capa, conferir o contraste de 7:1 do rótulo, de "PULSE" e da dica sobre ela.
- **(Fase 8)** Quando a Anton entrar, conferir a 320 px os títulos longos ("Deslocamentos") e os números dos cartões (hoje medidos com a Impact, a fonte de reserva).
- **(Fase 8)** Frase da capa provisória: "Um guia no pulso para atravessar a cidade."
- **(Fase 5)** Espera acima de 10 s (seção 11.1): faltam o texto do aviso e o do botão de cancelar.
- **(Fase 3)** Vibração no simulador: a seção 6.3 cita a Vibration API no Android, e a seção 3, item 14, proíbe vibração do celular. A equipe precisa decidir antes de o simulador usar essa API.
- ~~**(Fase 6)** No computador, na Início e na Solução, o logo do cabeçalho (coluna de 40rem) não fica alinhado com a grade de 59rem.~~ **(Fase 8)** Resolvida: cabeçalho, rodapé, Início, Solução, Simulador e 404 usam a mesma área de 76rem.
- **(Fase 7)** Com zoom de 400% e pouca altura, o cabeçalho fixo (64 px) ocupa cerca de 1/4 da tela. A seção 9.1 manda que ele fique fixo; avaliar.
- **(Fase 0)** O registro do uso de IA está em `AI.md`, na raiz do repositório. Não existe `prompts.md`. A equipe decide o nome final.

**Suposições em uso até confirmação:**
- Todas as perguntas do Diário são obrigatórias, exceto Observações.
- O Diário mostra o aviso de privacidade.
- Na confirmação de exclusão, o foco começa em "Manter registro".
- ~~**(Fases 3 a 6)** As decisões da seção 17 marcadas como "proposta da implementação" valem até a equipe confirmar ou mudar.~~ Confirmadas pela equipe em 11/11/2026.

**Riscos aceitos na avaliação heurística (não corrigir sem decisão da equipe):**
- Termos técnicos da seção Tecnologias sem explicação extra (H2).
- Diário sem filtro (H7).

---

## 17. Registro de alterações do desenvolvimento

Decisões tomadas durante as Fases 0 a 9 (e depois dela). **Equipe** = escolhida pela equipe quando perguntada. **Implementação** = proposta durante a implementação, para cobrir uma lacuna ou um limite técnico; vale até a equipe decidir diferente.

| Fase | Decisão | Origem | Seção |
| --- | --- | --- | --- |
| 0 | Sem `src/`: pastas na raiz de `projeto-citizentech-1espu/`, ao lado de `app/` | Equipe | 14 |
| 0 | `layout.js` e `page.js` renomeados para `.jsx`; `.jsx` para arquivos com JSX e `.js` para hooks, serviços e `lib` | Equipe | 14 |
| 0 | Código de exemplo do create-next-app removido (fontes Geist, página de exemplo); `lang="pt-BR"`; nada apagado de `public/` | Equipe | 14 |
| 1 | Hover só com cores da paleta (`--cor-botao-hover`, `--cor-hover`) | Equipe | 8.1, 8.3 |
| 1 | Tokens novos: `--cor-link`, `--cor-marca` no escuro (`#FFFFFF`), `--cor-perigo-texto`; fundos de status no escuro = `--cor-cartao` | Implementação | 8.1 |
| 2 | Barra no celular: largura pelo texto em 1 linha e 2 × 2 quando não couber (4 colunas iguais não cabem a 320 px) | Equipe | 9.2, 12 |
| 2 | A barra mede os próprios textos no navegador para escolher entre 1 linha e 2 × 2; espaço interno de 4 px no celular | Implementação | 9.2 |
| 3 | "Principal" dentro do `<h3>` do ODS 10, para ser ouvido por quem navega pelos títulos | Implementação | 6.2 |
| 3 | Os sinais em lista de definições (`<dl>`): "Modo tátil:" / "Modo sonoro:" | Implementação | 6.2 |
| 3 | `alt` das fotos "Foto de (nome)", sem ponto final, como na seção 6.2 | Implementação | 6.2, 13.2 |
| 4 | Arquivo de registros de exemplo **não** criado agora | Equipe | 7.6 |
| 4 | `fetch` já escrito no `apiClient`, só ativo com `NEXT_PUBLIC_API_URL`; qualquer falha vira `codigo: "conexao"`; 404 só significa "não encontrado" em `obter` | Implementação | 7.6 |
| 4 | Observações salvas sem espaços nas pontas; acentos e emojis contam 1 caractere | Implementação | 7.3 |
| 5 | Ver e Editar registro usam os textos de carregando e de erro da lista, no plural | Equipe | 7.4, 11.2 |
| 5 | Título da aba de registro inexistente: `Registro não encontrado` (sem "— Pulse") | Equipe | 4.1 |
| 5 | Enquanto carrega: H1 "Registro" e aba `Registro — Pulse` | Implementação | 4.1, 7.4 |
| 5 | Falha no Desfazer reaproveita "Não foi possível salvar. Verifique a conexão e tente de novo." | Implementação | 7.5 |
| 5 | Nos estados de erro e vazio, sem Resumo e sem o "Novo registro" do topo | Implementação | 11.2 |
| 5 | "Descartar respostas" = perigo preenchido; "Continuar preenchendo" = secundário | Implementação | 7.3 |
| 5 | O logo "Pulse" também passa pela guarda de saída | Implementação | 7.3 |
| 5 | Barra sai da frente do teclado também com "reduzir movimento", sem animação | Implementação | 7.3 |
| 5 | `aria-disabled` em vez de `disabled` em "Salvando…" e "Excluindo…" | Implementação | 7.3, 10 |
| 5 | Sem `aria-invalid` nos radios (não aceito pela ARIA); erro pelo `aria-describedby` do `<fieldset>` | Implementação | 7.3 |
| 5 | Indicadores em 2 × 2 a 320 px podem hifenizar palavras longas | Implementação | 12 |
| 6 | "Nesta página" à **direita** do texto, numa grade de 59rem; rola por dentro em telas baixas | Implementação | 9.4, 12 |
| 6 | Equipe ocupa a grade inteira (59rem) no computador; registros do Diário 2 por linha a partir de 768 px | Implementação | 12 |
| 7 | Campo de data com contorno de foco por `:focus-within` | Implementação | 8.3 |
| 7 | `overflow-wrap: anywhere` no corpo, para palavras longas com texto muito ampliado | Implementação | 8.2 |
| 7 | A barra refaz a medição quando os textos mudam de largura (WCAG 1.4.12) | Implementação | 9.2 |
| 8 | Versões instaladas: `lenis` 1.3.27, `gsap` 3.15.0, `@gsap/react` 2.1.2, `motion` 14.6.0, `three` 0.186.1 (exatas; nenhuma com menos de 2 semanas de uso, sem versões beta) | Equipe | 18.1 |
| 8 | "Nesta página" em pílulas, depois do resumo (Solução) ou da abertura (Início); sai a coluna lateral da 9.4. No computador (≥ 1024 × 700 px), o índice gruda embaixo do cabeçalho, e a pílula da seção atual fica dourada (`aria-current="true"`) | Equipe | 9.4, 18.6, 18.8 |
| 8 | Valem os textos da especificação ("O problema", "Cerca de 90%", "7,9 milhões"). Entra a introdução de Tecnologias do protótipo. Com a pulseira parada, a abertura mostra "Sinais da Pulse" / "Veja cada sinal explicado na página Solução." | Equipe | 6.1, 18.6, 18.8 |
| 8 | Rótulos mono que faltavam: "As pessoas", "No trajeto", "Ecossistema", "Próximos passos" e "Por que a Pulse"; também os dos protótipos ("Como usar", "Por dentro", "Quem fez", "Experimente"). O Diário fica sem rótulo | Equipe | 18.5 |
| 8 | Cabeçalho: "Pulse" em Anton com `ICONE-Pulse-AQUI`, e "GS 2026.2 · CitizenTech" em mono à direita | Equipe | 9.1, 18.9 |
| 8 | Cortina de piso tátil só ao entrar e ao sair do Diário; nenhuma entre as páginas internas dele. Diálogo e mensagens sem animação | Equipe | 18.1, 18.9 |
| 8 | Capa: camada sólida criada por um script no `<head>`, só sem a chave `pulse-capa-vista`; some quando a capa monta ou em até 2 s | Equipe | 18.6 |
| 8 | Títulos (opção C): H1 `clamp(2.6rem, 14vw, 5.6rem)`, H1 da abertura `clamp(2.1rem, 9vw, 3.6rem)` e H2 `clamp(2.2rem, 10vw, 4rem)`. Os valores com `vw` da 18.4 cresciam só 1,14× com zoom de 200% (WCAG 1.4.4, falha F94) | Equipe | 18.4 |
| 8 | Textura de piso tátil nunca atrás de texto (opção B): na abertura e na 404, só atrás da pulseira, apagando-se nas bordas; nas cabeças de página, numa faixa à direita, só no computador | Equipe | 18.2, 18.5 |
| 8 | Um relógio só: o Lenis é movido pelo relógio do GSAP, que também atualiza o ScrollTrigger | Implementação | 18.1 |
| 8 | Com "reduzir movimento", a roda do mouse deixa de ser suavizada pelo Lenis (`smoothWheel: false`); sem isso, ele ainda amortecia a roda por cerca de 0,1 s | Implementação | 18.1, 18.2 |
| 8 | Hover e borda dos itens da barra calculados a partir da marca: `--cor-hover` = marca a 12%; `--cor-linha-item` = marca a 70% (4,3:1 e 5,3:1) | Implementação | 18.3, 9.2 |
| 8 | Cantos: cartões, fotos e mensagens com 18 px; campos, opções e etiquetas com 12 px; diálogo com 16 px; itens da barra no celular com 20 px (pílula perfeita a partir de 768 px) | Implementação | 18.5, 18.9 |
| 8 | Título do diálogo no menor tamanho do H2 (2,2rem) | Implementação | 18.4 |
| 8 | Hover do botão dourado em CSS (sombra sempre; subida de 2 px só sem "reduzir movimento"); o Motion fica para a revelação da abertura e a troca da palavra de fundo | Implementação | 18.1, 18.3 |
| 8 | Um fluxo único de navegação: link interno → guarda de saída → transição. Trava de 3 s na cortina; Voltar e Avançar do navegador só com a saída; alto contraste do Windows sem cortina | Implementação | 18.9, 7.3 |
| 8 | `FocoNaTroca`: com âncora no endereço, o foco vai para o título da âncora (e não para o H1) | Implementação | 4.1, 18.8 |
| 8 | Faixa dos ODS: com o foco dentro, ela para, volta ao começo e rola até o botão focado aparecer inteiro; o clique também mostra a frase (Safari do iPhone não foca no toque); frases ligadas por `aria-describedby` a parágrafos `hidden` | Implementação | 18.10 |
| 8 | Cabeçalho mede a própria altura (`--altura-cabecalho`); o índice fixo mede a dele (`--altura-indice`); o desconto das âncoras usa as duas | Implementação | 9.1, 9.4 |
| 8 | Rodapé: o espaço do fim da página fica dentro dele (fundo escuro até o fim da tela); links numa lista simples, sem um segundo `<nav>` | Implementação | 18.10 |
| 8 | Pulseira 3D: o `<canvas>` é criado pelo hook (para funcionar com a montagem dupla do modo de desenvolvimento); a caixa tem `role="img"` só depois do primeiro quadro; o WebGL2 é pedido antes do Three.js (sem erro no console quando falta); liberação com `forceContextLoss` | Implementação | 18.7 |
| 8 | Ritmo do "Parar": um anel a cada 0,35 s (máximo de 3 por segundo, WCAG 2.3.1). Na 404, o limite de 4,6 s conta o tempo real, e os últimos anéis saem até 3,7 s | Implementação | 18.7, 18.11 |
| 8 | Abertura e "Os sinais": sem a cena pronta (carregando, sem JavaScript, sem WebGL), legenda parada e nenhum botão de pausa | Implementação | 18.6, 18.8 |
| 8 | Logo da capa pulsa sobre o fundo escuro dela; capa sem imagem, com fundo sólido `#120B24`, até a equipe colocar as imagens | Implementação | 18.6 |
| 8 | Palavra de fundo: na abertura, com a altura da pulseira e a largura da tela; na 404, só na coluna da pulseira (`cqw`). O rótulo dourado sobre ela ficaria em 6,84:1 no escuro | Implementação | 18.5, 18.6, 18.11 |
| 8 | Títulos com rótulo ganham `scroll-margin-top` de 40 px: ao pular para a seção, o rótulo também aparece | Implementação | 9.4 |
| 8 | Links da abertura numa lista só, posicionada com `subgrid` no computador (a ordem no HTML não muda) | Implementação | 18.6 |
| 8 | Números grandes em `rem` (cartões de dados 3,25rem; resumo do Diário 2,5rem), sem `vw` | Implementação | 18.4, 18.6 |
| 8 | Modo fixo de "Os sinais" e galeria horizontal ligados por uma media query lida no React (`useConsultaMidia`) e no `useGSAP`, em vez de `gsap.matchMedia()`, porque o React também troca o layout | Implementação | 18.1, 18.8 |
| 8 | "Os sinais": H3 "Virar à esquerda ou à direita" (texto da 6.2) e link "Virar"; nome do movimento na pulseira pequena com os textos do protótipo | Implementação | 18.8 |
| 8 | Carrossel: a lista recebe o foco (área rolável sem nada focável); contagem com `aria-live="polite"`; botão desabilitado com borda tracejada, sem perder contraste e sem trocar o cursor | Implementação | 18.8 |
| 8 | Condições de tela em `rem` (1000 px = 62,5rem; 1100 px = 68,75rem), para ficarem na ordem certa com as do Tailwind | Implementação | 18.8, 18.12 |
| 8 | Polaroides com cores fixas nos dois temas (branco e `#1E0F4A`) | Implementação | 18.8 |
| 9 | Granulado atrás do conteúdo (só no fundo da página e das bandas), branco no tema claro e preto no escuro: assim ele nunca baixa o contraste | Equipe | 19.1, 19.3, 19.6 |
| 9 | Vídeos com os caminhos reais de `public/videos/` (os arquivos já estavam lá); o marcador `VIDEO-…-AQUI` fica em comentário | Equipe | 19.13 |
| 9 | O padrão de movimento vence a seção 19 em 3 pontos: preloader de 1,4 s; cartão de Tecnologias com `spring.suave` (0,42 s); "texto que se constrói" com o gesto GUIA, sem a máscara de domos | Equipe | 19.6, 19.8 |
| 9 | O espaço vazio do ícone não ocupa lugar (texto dos botões e da barra centralizado). Depois da Fase 9, ele só aparece para um nome fora da lista do `EspacoIcone` | Equipe | 13.1, 19.5 |
| 9 | Palavra de fundo em grafite suave (`rgba(36,36,40,.06)` no claro; `rgba(255,255,255,.05)` no escuro); botões dos ODS no rodapé em `#1A1A1D` (claro) e `#242428` (escuro) | Equipe | 19.3 |
| 9 | Granulado do tema escuro a 25% (opção B; a 19.3 dizia 8%, que ficava invisível) | Equipe | 19.3, 19.6 |
| 9 | "Girar sozinha" com texto fixo e `aria-pressed`; só o ícone troca | Equipe | 19.12 |
| 9 | Cena 3D compilada sem travar a página (`compileAsync`, opção B), com o visual completo | Equipe | 19.12 |
| 9 | "Como funciona" no celular, com zoom alto ou com os efeitos desligados: lista com as miniaturas; o fundo que troca é só do computador | Equipe | 19.6, 19.13 |
| 9 | Tecnologias: botão com texto fixo "Ver a peça" e `aria-pressed` | Equipe | 19.8 |
| 9 | Polaroides: com o mouse, endireitam e sobem 6 px com a mola, sem acompanhar o mouse (sai a inclinação da 18.8) | Equipe | 19.10 |
| 9 | Botões dos vídeos com o texto da ação ("Pausar"/"Reproduzir", "Ativar som"/"Desativar som"), sem `aria-pressed` | Equipe | 19.13 |
| 9 | "Os sinais": o vídeo do sinal atual fica junto do índice no modo fixo (15rem no computador; 8rem ao lado dos botões no celular); na lista comum, cada sinal tem o seu vídeo | Equipe | 19.13 |
| 9 | Sai o marcador `IMAGEM-ilustração de uma travessia-AQUI`: o vídeo de "O problema" ocupa o lugar | Equipe | 19.14 |
| 9 | Capa: véu grafite `#1A1A1D` a 60% sobre o vídeo e o rótulo "GS 2026.2 · CitizenTech" numa faixa sólida (sem isso, 2,5:1 e 1,0:1) | Equipe | 19.13, 18.6 |
| 9 | Sem as marcações "Esta parte é lógica" no código | Equipe | 14.1 |
| 9 | API externa do Diário: MockAPI (formato igual ao do `registrosService`) | Equipe | 2, 7.6 |
| 9 | Salvar: o "certo" se desenha na mensagem "Registro salvo." (e não no botão), para o anúncio não esperar animação | Equipe | 19.11 |
| 9 | Excluir: só a volta com o PULSO no "Desfazer" (a exclusão acontece em outra página) | Equipe | 19.11 |
| 9 | Lenis sem `stop()`: com os efeitos desligados, ele nem é criado (o `stop()` travaria a rolagem) | Implementação | 19.2 |
| 9 | O estado dos efeitos mora no atributo `data-efeitos` do `<html>`, gravado antes da pintura; no servidor e sem JavaScript, conta como desligado | Implementação | 19.2 |
| 9 | Seções fixas com `position: sticky` do CSS (o GSAP só lê o progresso); só a partir de 64rem e 600 px de altura | Implementação | 19.6 |
| 9 | "Pausar o giro" da abertura para também os sinais e o Braille (WCAG 2.2.2) | Implementação | 19.12 |
| 9 | Hover do botão secundário com texto grafite (o laranja ficaria em 4,0:1) | Implementação | 19.3 |
| 9 | Títulos com `overflow-wrap: break-word` (a 19.5 pedia `normal`, que impede a quebra mesmo quando a palavra não cabe) | Implementação | 19.5 |
| 9 | Bandas da Solução: "A pulseira", "Antes e depois" e "Equipe"; 72 px de espaço interno | Implementação | 19.5 |
| 9 | Granulado em duas camadas (página e bandas), movido só por `transform`, 12% maior que a tela | Implementação | 19.6 |
| 9 | Capa e preloader desenhados no `<body>` (portal), por causa do rodapé revelado | Implementação | 19.6 |
| 9 | Linha do rótulo com `scaleX` e `spring.padrao`; cortina em `<canvas>` (um raio por domo); preloader pulado por qualquer tecla, gesto ou foco | Implementação | 19.6 |
| 9 | Encaixe só depois da roda do mouse, nunca com o foco num campo; faixa de texto pausada pelo botão "Efeitos"; barra de progresso escondida com os efeitos desligados; rodapé revelado só se tiver menos de 80% da tela | Implementação | 19.6 |
| 9 | Parallax só da imagem, dentro da moldura parada; filtro e parallax só quando há uma `<img>` | Implementação | 19.6 |
| 9 | "Um trajeto com a Pulse" e "Antes e depois" no "Nesta página" | Implementação | 19.7 |
| 9 | Botão magnético em todos os botões laranja principais, dentro do próprio `Botao` | Implementação | 19.6 |
| 9 | Cartões de Tecnologias com as duas faces na mesma célula da grade (crescem com o texto ampliado); giro de duração 0 com os efeitos desligados; foto da peça colorida, como no protótipo | Implementação | 19.8 |
| 9 | Galeria: fotos em 4:3; `touch-action: pan-y` no toque; fotos focáveis só no modo canvas; Tab e Shift+Tab entre as fotos com `preventScroll`; inércia com a mola do padrão | Implementação | 19.9 |
| 9 | Polaroide sobe 6 px (19.10), e não 2 px (o padrão fala dos clicáveis); varal em trechos com leve curva; parallax leve na foto | Implementação | 19.10 |
| 9 | Vídeos: botões embaixo do vídeo; fundos (capa e "Como funciona") sem botões, pausados pelo botão "Efeitos"; um botão para o par de "Antes e depois"; nome pelo título que já existe; sem o arquivo, caixa 16:9 com o marcador; memória liberada ao sair | Implementação | 19.13 |
| 9 | PULSO também no registro salvo e no alterado; o "certo" é desenho por código e substitui `ICONE-CheckCircle-AQUI` nas mensagens de sucesso; o tremor vale para todos os campos com erro | Implementação | 19.11 |
| 9 | Variante `secundario-sobre-cor` (fundo sólido) nos botões sobre os fundos de status: o laranja sobre eles ficava em 4,2–4,3:1 | Implementação | 19.3 |
| 9 | Galeria: 4 avisos da configuração `strict` do `jsx-a11y` aceitos como exceção (janela com `tabIndex`, fotos focáveis e teclado na janela e nos botões), porque a 19.9 pede esse comportamento | Implementação | 15, 19.9 |
| Depois da 9 | Os ícones são colocados pelo Claude Code com o pacote `@phosphor-icons/react` (2.1.10), pelo `EspacoIcone`; os marcadores `ICONE-…-AQUI` ficam em comentário, como referência | Equipe | 13.1 |
| Depois da 9 | Imagens: a equipe só põe os arquivos em `public/imagens/`; o Claude Code liga os caminhos no código, depois que todas estiverem lá e a equipe avisar | Equipe | 13.2 |


---

## 18. Nova identidade e movimento (Fase 8)

Decidida pela equipe em 11/11/2026, depois das Fases 0 a 7. **Esta seção vence as seções antigas onde elas discordarem.** As seções afetadas têm uma nota **(Fase 8)** apontando para cá.

- **O que muda:** estilo visual, cores, tipografia, a abertura do Início, a página Solução, a barra, a transição entre páginas, o rodapé, a página 404 e as fotos.
- **O que não muda:** rotas, textos (exceto onde esta seção diz), o Diário (só recebe cores e fontes novas, sem efeitos), a camada de dados, a API, os marcadores e todas as regras de acessibilidade da seção 3.
- **Protótipos de referência:** `docs/prototipos/pulse-abertura.html`, `docs/prototipos/pulse-solucao.html` e `docs/prototipos/pulse-navegacao.html`. São HTML puro, feitos para aprovação visual. Servem de referência de aparência, de comportamento e da geometria da pulseira 3D. **Não copiar o código direto:** eles carregam bibliotecas por CDN e não seguem a arquitetura do projeto.

### 18.1 Pacotes e fontes

> **(Fase 9)** As fontes passam a ser carregadas com `next/font/google` (seção 19.4), sem marcadores. Nenhum pacote novo.

Na Fase 8, **o Claude Code instala os pacotes**, depois de mostrar o comando à equipe e receber a confirmação. Nada fora desta lista sem perguntar.

| Pacote | Para quê | Observações |
| --- | --- | --- |
| `lenis` | Rolagem suave no computador | Usar `ReactLenis` de `lenis/react` na raiz, com `anchors: true` (links internos e "Pular para o conteúdo" funcionando) e `autoRaf: false`, sincronizado com o relógio do GSAP. Já desliga sozinho com "reduzir movimento". No toque, a rolagem continua a do aparelho. |
| `gsap` e `@gsap/react` | Animações ligadas à rolagem (ScrollTrigger) | Registrar o ScrollTrigger uma vez. Usar `useGSAP` (limpa as animações ao sair da página) e `gsap.matchMedia()` para separar "movimento permitido" de "reduzir movimento". |
| `motion` | Microinterações | Importar de `motion/react`. `MotionConfig reducedMotion="user"` na raiz. Uso: diálogo, mensagens, barra e botões. |
| `three` | Pulseira 3D | Só em componentes de cliente, carregados com `next/dynamic` e `ssr: false`. |

- **Fontes: instaladas manualmente pela equipe**, como antes. No lugar onde cada uma será carregada (`app/layout.jsx` ou CSS global), deixar os marcadores **`FONTE-Anton-AQUI`** (peso 400), **`FONTE-Atkinson Hyperlegible Next-AQUI`** (400 e 700, já existe) e **`FONTE-JetBrains Mono-AQUI`** (500 e 700), com o passo a passo em comentário. Usar as variáveis `--fonte-titulo`, `--fonte-base` e `--fonte-mono` com as fontes de reserva da seção 18.4, para o site funcionar antes das fontes entrarem.
- **21st.dev, Aceternity UI e React Bits:** não instalar agora. Só se a equipe pedir um bloco específico, sempre convertido para JavaScript e conferido quanto à acessibilidade. As dependências possíveis (`clsx`, `tailwind-merge`) só entram nesse caso.
- **Fontes continuam manuais**, com os marcadores `FONTE-…-AQUI`. Os ícones são colocados pelo Claude Code (seção 13.1). Nas imagens (`IMAGEM-…-AQUI`), a equipe põe os arquivos em `public/imagens/`, e o Claude Code liga os caminhos (seção 13.2).

### 18.2 Piso de acessibilidade da nova identidade

> **(Fase 9)** Substituído pela seção 19.1: o granulado pode ficar atrás do texto (contraste mínimo de 4,5:1 onde houver granulado), e o interruptor "Efeitos" substitui o "reduzir movimento" como regra de parada.

Vale junto com a seção 3 e não pode ser quebrado por nenhum efeito:

1. Texto sempre sobre fundo sólido, com contraste de 7:1 ou mais. Texturas, palavras gigantes e degradês só atrás de áreas sem texto.
2. Com "reduzir movimento": nada se move. As cenas 3D mostram um quadro parado, as rolagens fixas e a galeria horizontal viram listas comuns, a capa sai sem animação e a transição entre páginas é instantânea.
3. O que se move sozinho por mais de 5 segundos tem botão de pausa visível (WCAG 2.2.2). Nada pisca mais de 3 vezes por segundo (WCAG 2.3.1).
4. Nenhum conteúdo depende de animação ou de JavaScript para aparecer. O texto vem do servidor; os efeitos só enfeitam o que já está na página.
5. Nada invisível recebe foco. Elementos fora da tela ou transparentes não podem ser alcançados pelo Tab.
6. O cursor do sistema nunca é substituído (quem tem baixa visão costuma aumentá-lo). Nenhuma ação depende só do mouse ou de um gesto.
7. Decorações (textura, palavra gigante, linhas da abertura, nome do sinal animado) ficam com `aria-hidden="true"`.
8. Ícone sempre com texto visível, inclusive nos botões dos carrosséis: "Anterior", "Próximo", "Pausar", "Girar".
9. Desempenho: no máximo uma cena 3D visível por vez; a cena só anima enquanto está na tela; densidade de pixels limitada a 1,75; tudo liberado da memória ao sair da página. Se o WebGL falhar, aparece a descrição em texto.

### 18.3 Cores (substitui a seção 8.1)

> **(Fase 9)** Substituída pela paleta laranja e grafite da seção 19.3.

Os temas continuam seguindo só o aparelho. Contrastes calculados.

**Tema claro**

| Token | Uso | Cor | Contraste |
| --- | --- | --- | --- |
| `--cor-fundo` | Fundo da página | `#F5F1E8` (creme) | — |
| `--cor-superficie` | Cartões, campos, cabeçalho, barra e diálogo | `#FFFFFF` | — |
| `--cor-texto` | Texto principal | `#1E0F4A` | 15,2:1 no creme; 17,2:1 no branco |
| `--cor-texto-2` | Texto secundário | `#453A66` | 9,1:1; 10,2:1 |
| `--cor-marca` | Títulos, links, foco e botão secundário | `#4F2BAB` | 8,2:1; 9,3:1 |
| `--cor-destaque` | Rótulos mono e números grandes | `#4F2BAB` | 8,2:1 |
| `--cor-ouro` / `--cor-sobre-ouro` | Botão principal e item ativo da barra | `#D4A24A` / `#120B24` | 8,3:1 |
| `--cor-borda` | Bordas | `#6B5F94` | 5,1:1; 5,7:1 |
| `--cor-erro` / `--cor-sucesso` / `--cor-aviso` | Status | iguais à seção 8.1 | 8,5 a 9,0:1 |
| `--cor-perigo-texto` | Texto do botão de perigo preenchido | `#FFFFFF` sobre `#8B0A1A` | 9,7:1 |

**Tema escuro**

| Token | Uso | Cor | Contraste |
| --- | --- | --- | --- |
| `--cor-fundo` | Fundo da página | `#120B24` | — |
| `--cor-superficie` | Cartões, campos, cabeçalho, barra, diálogo e fundo das mensagens | `#1C1238` | — |
| `--cor-texto` | Texto principal | `#F5F1E8` | 16,9:1; 15,6:1 na superfície |
| `--cor-texto-2` | Texto secundário | `#D9D0F2` | 13,0:1; 12,0:1 |
| `--cor-marca` | Títulos, links (sublinhados) e foco | `#C4B5FD` (lilás) | 10,4:1; 9,5:1 |
| `--cor-destaque` | Rótulos mono e números grandes | `#D4A24A` | 8,3:1; 7,6:1 |
| `--cor-ouro` / `--cor-sobre-ouro` | Botão principal e item ativo da barra | `#D4A24A` / `#120B24` | 8,3:1 |
| `--cor-borda` | Bordas | `#8C7BC9` | 5,3:1; 4,9:1 |
| `--cor-erro` / `--cor-sucesso` / `--cor-aviso` | Status, sobre a superfície | `#FFDADA` / `#B8F5CB` / `#FFE7A3` | 13,7 a 14,4:1 |
| `--cor-perigo-texto` | Texto do botão de perigo preenchido | `#2A1366` sobre `#FFDADA` | 11,8:1 |

**Tokens de decoração e de 3D** (sem texto em cima):

| Token | Claro | Escuro | Uso |
| --- | --- | --- | --- |
| `--cor-ponto` | `rgba(79, 43, 171, .09)` | `rgba(196, 181, 253, .07)` | Domos da textura de piso tátil |
| `--cor-ponto-brilho` | `rgba(255, 255, 255, .7)` | `rgba(255, 255, 255, .04)` | Brilho de cada domo |
| `--cor-palavra-fundo` | `rgba(79, 43, 171, .07)` | `rgba(79, 43, 171, .35)` | Palavras gigantes de fundo |
| `--cor-faixa-3d` | `#4F2BAB` | `#5B37BA` | Tira e módulo da pulseira 3D |
| `--cor-cortina` | `#4F2BAB` | `#4F2BAB` | Transição entre páginas |

**Rodapé** (escuro nos dois temas): fundo `#120B24` no tema claro e `#0B0716` no escuro; cartões `#1C1238`; texto `#F5F1E8` (16,9:1 e 17,6:1); texto secundário `#D9D0F2` (13,0:1 e 13,5:1); dourado `#D4A24A` em números, rótulos e foco (8,3:1 e 8,6:1); bordas `#8C7BC9`.

Regras:
- **O roxo `#4F2BAB` só vira texto no tema claro** (no escuro teria 2,1:1). No escuro, o texto roxo vira lilás `#C4B5FD`.
- **O dourado só vira texto no tema escuro e no rodapé** (no creme teria 2,1:1). No claro, ele só aparece como fundo de botão, sempre com texto `#120B24`.
- A regra antiga "sem amarelo na interface" deixa de valer: o dourado `#D4A24A` foi escolhido pela equipe.
- Hover do botão dourado: sombra leve e subida de 2 px, sem trocar a cor. Hover de botões secundários e itens da barra: fundo `color-mix(in srgb, var(--cor-marca) 12%, transparent)`.
- Remover os tokens antigos (`#3B1D8B`, `#2A1366` como fundo, `#2E1670`) e manter a paleta padrão do Tailwind desligada.
- Recalcular todos os pares de contraste na revisão da fase.

### 18.4 Tipografia (substitui a família única da seção 8.2)

| Família | Papel | Tamanho | Regras |
| --- | --- | --- | --- |
| **Anton** (`--fonte-titulo`, reserva `Impact, "Arial Narrow", sans-serif`) | H1, H2, nomes dos sinais, palavras de fundo, números grandes, nome "Pulse" | H1 `clamp(2.6rem, 8vw, 5.6rem)`; H1 da abertura do Início `clamp(2.1rem, 5.4vw, 3.6rem)`; H2 `clamp(2.2rem, 6vw, 4rem)`; altura de linha 1 | Só títulos curtos. Maiúsculas **só por CSS** (`text-transform: uppercase`); no código o texto fica normal, para o leitor de tela não soletrar. |
| **Atkinson Hyperlegible Next** (`--fonte-base`, reserva Verdana) | Texto corrido, botões, links, H3, H4 e formulário | Texto 1,125rem (18 px), altura de linha 1,55; H3 1,25rem negrito; nunca menor que 16 px | Todo texto longo. |
| **JetBrains Mono** (`--fonte-mono`, reserva `ui-monospace, "Courier New"`) | Rótulos curtos: "MODO TÁTIL", "SINAL · PARAR", "FONTE: G1, 2019", contagens | 0,8 a 0,9rem, letras espaçadas (0,12 a 0,14em), maiúsculas por CSS | Única exceção à regra dos 16 px: por isso são curtos e nunca carregam sozinhos uma informação. |

Continuam valendo: `text-wrap: balance` nos títulos, `overflow-wrap: anywhere` no corpo e o teste de espaçamento de texto (WCAG 1.4.12).

> **(Fase 8, decisão da equipe — opção C)** Para os títulos dobrarem de tamanho com zoom de 200% (WCAG 1.4.4), o termo do meio ficou mais inclinado: H1 `clamp(2.6rem, 14vw, 5.6rem)`, H1 da abertura `clamp(2.1rem, 9vw, 3.6rem)` e H2 `clamp(2.2rem, 10vw, 4rem)`. Os mínimos e máximos da tabela continuam.

### 18.5 Linguagem visual (substitui o Flat Design 2.0 da seção 8)

> **(Fase 9)** Complementada pela seção 19.5 (seções alternadas, textura com relevo, H2 menor, títulos novos). O Diário ganha microinterações de feedback (19.11).

- **Textura de piso tátil:** grade de domos de 30 px, feita em CSS com dois `radial-gradient` (`--cor-ponto` e `--cor-ponto-brilho`), no fundo das aberturas e das cabeças de página.
- **Palavras gigantes de fundo** em Anton, `--cor-palavra-fundo`, atrás do objeto principal, com `aria-hidden="true"`.
- **Um objeto central por tela:** a pulseira 3D na abertura, a foto da situação em "Os sinais".
- **Rótulos mono** acima dos títulos (eyebrow): "Tema", "O problema", "A solução", "Linguagem da Pulse"…
- **Cantos:** cartões e fotos 18 a 20 px; botões e barra em pílula (999 px); polaroides 6 px.
- **Botões:** principal dourado em pílula, 56 px de altura; secundário com contorno de 2 px em `--cor-marca`.
- **O Diário fica calmo:** cores e fontes novas, sem textura, sem palavra de fundo e sem efeitos.

### 18.6 Início (substitui a ordem da seção 6.1)

Ordem: capa (primeira visita da sessão) → abertura com a pulseira → "Nesta página" → Tema CitizenTech → O problema → Quem vive o problema → "Conheça a solução". Os textos da seção 6.1 continuam.

**Capa de introdução (`CapaIntro`)**
- Aparece só na **primeira visita de cada sessão** (`sessionStorage`, chave `pulse-capa-vista`, com `try/catch`; se o armazenamento falhar, a capa aparece). É criada **só no navegador**, depois da hidratação: sem JavaScript, ela não existe.
- Antes dela, o logo "pulsa" uma vez, em até 1 segundo.
- Conteúdo: rótulo mono "GS 2026.2 · CitizenTech", "PULSE" gigante, a frase provisória **"Um guia no pulso para atravessar a cidade."** e a dica "Toque, role ou aperte uma tecla" (com seta).
- Imagem de capa em `<picture>`, com marcadores: `IMAGEM-capa versão computador (horizontal)-AQUI` e `IMAGEM-capa versão celular (vertical)-AQUI`. `alt` sugerido: "Capa da Pulse.". A frase fica sobre uma faixa sólida.
- A capa inteira tem `aria-hidden="true"` e nenhum elemento focável. Sai com clique, rolagem, toque arrastado, qualquer tecla ou foco. O primeiro Tab (no "Pular para o conteúdo") já abre o site.
- Transição de saída **piso tátil**: a capa se desfaz nos domos (máscara `radial-gradient` com tamanho de 30 px, raio de 22 px para 0 em 1 segundo). Com "reduzir movimento", a saída é instantânea.
- Ao sair, os títulos e os links da abertura aparecem (opacidade e subida de 10 px, 0,6 s), e a pulseira entra.

**Abertura com a pulseira (`AberturaPulseira`)**
- Rótulo mono "Pulseira de navegação", H1 "Inovação que chega a quem precisa" e o resumo.
- `Pulseira3D` no centro, com a descrição como texto alternativo (18.7).
- Embaixo dela: o nome do sinal atual em mono e a descrição curta (ambos `aria-hidden`, porque mudam sozinhos) e o botão **"Pausar animação" / "Retomar animação"** (`aria-pressed`).
- Atrás, a palavra gigante acompanha o sinal: **Esquerda, Direita, Aguardar, Parar, Continuar** (troca com esmaecimento de 0,35 s; com "reduzir movimento", fica "Pulse"). O tamanho se ajusta ao comprimento: `min(21rem, 150vw / número de letras)`.
- Navegação **"Partes da solução"** (`<nav>` com `<h2>` visualmente oculto), com 6 links para a página Solução:

| Link | Destino | Descrição | Parte da pulseira que acende |
| --- | --- | --- | --- |
| Como funciona | `/solucao#como-funciona` | Aperte o botão e diga o destino. | Botão grande (destino) |
| Os sinais | `/solucao#os-sinais` | Cada comando tem uma vibração própria. | Motor esquerdo |
| Transporte público | `/solucao#transporte-publico` | Avisa a hora de embarcar no veículo certo. | Parte de baixo da tira |
| Dois modos | `/solucao#dois-modos` | Sonoro e tátil, ou só tátil. | Botão pequeno (modo) |
| Semáforos | `/solucao#semaforos` | Dados reais para saber quando atravessar. | Motor direito |
| Tecnologias | `/solucao#tecnologias` | GPS, ESP32, motores e atuadores. | Atuador de pressão |

- **No computador (≥ 1000 px):** 3 links de cada lado (os 3 primeiros à esquerda, alinhados à direita). Linhas tracejadas em SVG (`aria-hidden`) ligam cada link à parte da pulseira, recalculadas a cada quadro a partir da posição 3D projetada na tela. A linha anda devagar (tracejado em movimento). Ao passar o mouse ou focar um link, a linha engrossa e a parte acende.
- **No celular:** a pulseira em cima e os links em lista de cartões abaixo (2 colunas a partir de 640 px), sem linhas.
- No HTML, a ordem é a da tabela, igual nos dois tamanhos.

**Seções seguintes:** cabeça de seção com rótulo mono e H2 em Anton. Em "O problema", a citação tem borda dourada à esquerda, e os dados aparecem em cartões com o número grande em Anton (`--cor-destaque`) e a fonte em mono.

### 18.7 Pulseira 3D (`Pulseira3D`)

> **(Fase 9)** Substituída pela pulseira nova da seção 19.12 (laranja, com fecho, célula Braille, luzes de sinal e giro de 360°).

Inspirada em pulseiras esportivas (referência visual da equipe): tira de silicone roxa em laço e um módulo em forma de pílula na frente, da mesma cor. A geometria de referência está em `docs/prototipos/pulse-abertura.html`.

| Parte | Como é feita (Three.js) |
| --- | --- |
| Tira | `TorusGeometry(1, 0.075)` girada para o eixo x e escalada `(3.3, 1.12, 0.72)`: laço oval, alto e estreito. Material fosco com brilho lilás (`sheen`). Seis furos escuros na parte de trás. |
| Módulo | `CapsuleGeometry(0.3, 0.56)` achatada no z (0,36), na frente do laço. Material brilhante (`clearcoat`), mesma cor da tira (`--cor-faixa-3d`). |
| Botões | Botão grande dourado (raio 0,12, "informar o destino") no centro do módulo; botão pequeno (raio 0,055, "trocar o modo") embaixo. Um furo de microfone em cima e três de alto-falante embaixo. |
| Motores | Duas cápsulas douradas finas nas laterais do módulo (esquerda e direita). |
| Atuador de pressão | Disco dourado atrás do módulo, na parte de dentro. |
| Luz e câmera | Luz hemisférica, uma luz principal, uma lilás de contorno e uma dourada suave. Câmera de 32°, vista de 3/4 (`rotation.y = -0.55`). Fundo transparente. |

**Sinais animados** (ciclo de 2,8 s cada; anéis dourados de "pulso" saem da parte que vibra e somem em 0,9 s):

| Sinal | Animação |
| --- | --- |
| Virar à esquerda / à direita | Três pulsos no motor do lado (0,1, 0,45 e 0,8 s); o motor acende |
| Aguardar | Três vibrações curtas nos dois motores, duas vezes no ciclo |
| Parar | Vibração contínua nos dois motores por cerca de 2 s, com um tremor leve da pulseira |
| Continuar | O atuador acende e pulsa devagar; dois pulsos grandes |

**Modos de uso (prop `modo`):**
- `"abertura"`: percorre os 5 sinais em sequência; entra depois da capa (escala de 0,35 para 1 e uma volta completa em 1,6 s); balança devagar e acompanha o mouse em telas com mouse (`pointer: fine`); `role="img"` com `aria-label`: "Pulseira Pulse em 3D: uma tira roxa de silicone com um módulo em forma de pílula na frente. No módulo há um botão dourado grande, para dizer o destino, e um menor, para trocar o modo. Dos lados do módulo ficam os motores que vibram para indicar o lado da conversão."
- `"sinal"`: repete um sinal fixo (usado em "Os sinais"; em "Virar", alterna esquerda e direita). `aria-hidden`, porque o texto do sinal está ao lado.
- `"parar"`: usado na 404; vibra por no máximo 4,6 s e para. `aria-hidden`.

**Regras:** carregar com `next/dynamic` e `ssr: false`, mostrando a descrição em texto enquanto carrega e se o WebGL falhar; animar só quando visível (`IntersectionObserver`); botão de pausa onde a animação é contínua; com "reduzir movimento", um quadro parado; cor da tira lida de `--cor-faixa-3d` e atualizada quando o tema muda; liberar geometrias, materiais e o renderizador ao desmontar. A lógica da cena fica num hook (`usePulseira3D`) ou num módulo em `lib/`, ~~marcada com "// Esta parte é lógica"~~ **(Fase 9: marcação retirada)**.

### 18.8 Solução (substitui a ordem e partes da seção 6.2)

> **(Fase 9)** Tecnologias vira grade de cartões que viram (19.8); a Galeria vira canvas no computador (19.9); a Equipe vai para um varal (19.10); entram "Antes e depois" (19.7) e os vídeos (19.13).

**Nesta página:** A pulseira · Os sinais · Como funciona · Tecnologias · Galeria · Quem participa · Como ampliar o impacto · O diferencial · Equipe

Mudanças nos textos da seção 6.2:
- **A seção "Objetivos de Desenvolvimento Sustentável" sai desta página**, sem link. Os ODS passam para o rodapé desta página, numa faixa contínua (18.10).
- **"Os sinais" vira um H2 próprio**, logo depois de "A pulseira", e sai de dentro de "Como funciona". Textos dos sinais iguais aos da 6.2, agrupados em 4: Continuar, Parar, Virar (esquerda ou direita), Aguardar.
- **Nova seção H2 "Galeria"**, depois de Tecnologias.
- Âncoras para os links da abertura: `id="como-funciona"` (H2), `id="os-sinais"` (H2), `id="tecnologias"` (H2), e nos H3 de "Como funciona": `id="dois-modos"`, `id="semaforos"` (H3 "Semáforos em tempo real") e `id="transporte-publico"`. Todos com `tabIndex={-1}` para receber o foco.
- "A pulseira": os 3 passos viram cartões com o número grande em Anton (o número é `aria-hidden`; a lista `<ol>` já diz a ordem).

**Os sinais, em rolagem fixa (`SinaisRolagemFixa`)**
- Rótulo "Linguagem da Pulse", H2 "Os sinais" e o texto "Cada comando tem um sinal próprio. Role a página para passar de um sinal para o outro."
- No HTML: navegação "Sinais" (`<nav aria-label="Sinais">` com `<ol>` de 4 links para `#sinal-continuar`, `#sinal-parar`, `#sinal-virar` e `#sinal-aguardar`), a pulseira pequena, o botão de pausa e 4 `<article>`, cada um com a foto, o H3 do sinal e os pares em `<dl>` ("Modo tátil", "Modo sonoro" ou "Nos dois modos").
- **Modo fixo** (só quando não há "reduzir movimento", a altura da janela é ≥ 560 px e a largura ≥ 340 px): o trilho tem `4 × 85svh + 100svh` de altura e o palco fica `position: sticky`. O progresso da rolagem (lido com ScrollTrigger, **sem `pin`**) escolhe o sinal ativo. O link ativo recebe `aria-current="step"` e fica marcado em dourado. Clicar num link rola até o meio do trecho daquele sinal.
- Troca da foto com **piso tátil** (máscara de domos de 26 px, 0,7 s; propriedade `--d` registrada com `@property`). O texto esmaece e sobe 12 px.
- Pulseira pequena (`Pulseira3D modo="sinal"`) **junto do índice**, nunca em cima da foto: 76 px no celular (ao lado do botão de pausa) e 132 px no computador (embaixo do índice, com o nome do movimento em mono).
- Computador (≥ 1000 px): índice à esquerda (15rem); foto e texto lado a lado (1,5 : 1). Celular: índice como faixa no topo, depois a pulseira e o pausar, a foto e o texto.
- **Fora do modo fixo:** os 4 artigos aparecem em lista comum, um embaixo do outro, cada um com a sua foto; a pulseira pequena e o botão de pausa somem.
- Os artigos inativos ficam transparentes, mas o leitor de tela lê os 4 em ordem. Eles não têm nada focável.

**Tecnologias, em carrossel (`Carrossel`)**
- Região com `aria-roledescription="carrossel"` e `aria-label="Tecnologias"`; lista com rolagem horizontal e `scroll-snap`; os 8 cartões (rótulo mono, H3 e descrição; rótulos: Localização, Destino, Cérebro, Tato, Tato, Som, Dados, Conexão).
- Botões **"Anterior"** e **"Próximo"** com ícone e texto, `aria-controls`; `aria-disabled` nas pontas; contagem visível "1 a 3 de 8". Também dá para deslizar. **Sem avanço automático.**

**Galeria (`GaleriaHorizontal`)**
- Rótulo "A cidade", H2 "Galeria" e o texto "Onde a Pulse faz diferença: calçadas, travessias e transporte público."
- Lista de 6 `<figure>` com foto (marcador e `alt`) e legenda (`<figcaption>`), na tabela da 18.13.
- **Computador** (largura ≥ 900 px, altura ≥ 600 px, sem "reduzir movimento"): o trilho tem a altura da janela + a largura que sobra da lista; o palco fica fixo e a lista anda para a esquerda conforme a rolagem (ScrollTrigger). Fotos de 16 a 24rem, as pares 64 px mais baixas. Se o foco do teclado cair numa foto, a página rola até ela.
- **Celular, zoom alto ou "reduzir movimento":** grade comum de fotos.

**Equipe em polaroides**
- Cartão branco com sombra, foto quadrada, nome em Anton maiúsculo. Inclinações fixas: −3°, 2°, −1,5°, 3°, −2°.
- Distribuição com `flex-wrap` centralizado: 2 por linha no celular, 3 + 2 no tablet (≥ 640 px), 5 lado a lado no computador (≥ 1100 px). **Nenhum cartão pode sair da tela** (os protótipos antigos cortavam o último com margens negativas).
- Com mouse e sem "reduzir movimento": o cartão se endireita, sobe e inclina acompanhando o mouse (até 10°).

### 18.9 Navegação, transição e rolagem (complementa a seção 9)

- **Barra em pílula:** mesmas regras da seção 9.2 (largura pelo texto, 2 × 2, medição, área de segurança). Visual novo: fundo `--cor-superficie`, borda, cantos de 999 px; item ativo com fundo dourado e texto `#120B24`.
- **Transição entre páginas (`TransicaoPagina`, provedor no layout):** domos de piso tátil em `--cor-cortina` crescem e cobrem a tela (200 ms), a página troca, e os domos somem (220 ms). Implementação sugerida: interceptar a navegação no `onNavigate` do `<Link>` (o mesmo usado pela guarda de saída, que tem prioridade), animar a entrada, chamar `router.push` e animar a saída quando o `pathname` mudar. Pelos botões Voltar e Avançar do navegador, só a saída anima. A camada tem `aria-hidden` e `pointer-events: none`. O foco continua indo para o H1 (`FocoNaTroca`). Com "reduzir movimento": troca instantânea.
- **Rolagem suave (Lenis):** só no computador. "Pular para o conteúdo", "Nesta página" e os links da abertura continuam funcionando (`anchors: true`, com o desconto da altura do cabeçalho). As barras que somem ao rolar (9.3) continuam iguais.
- **Interação do mouse:** inclinação da pulseira, dos polaroides e dos cartões só em `@media (hover: hover) and (pointer: fine)` e sem "reduzir movimento". Nunca trocar o cursor.

### 18.10 Rodapé (substitui o rodapé da seção 5)

O rodapé é escuro nos dois temas (18.3) e existe em todas as páginas. **Os ODS aparecem só no rodapé da página Solução** (decisão da equipe).

**Em todas as páginas:** links Início, Solução, Simulador e Diário (48 px de altura) e a linha "Pulse · Global Solution 2026.2 · FIAP · Giovana, Giovane, Mie, Pedro e Thiago. Protótipo acadêmico com dados públicos e simulados." O espaço no fim continua do tamanho da barra flutuante.

**Só na Solução: faixa contínua dos ODS (`FaixaODS`)**, acima dos links:
- Rótulo mono "Objetivos de Desenvolvimento Sustentável", H2 "A Pulse e os ODS" e o botão **"Pausar"/"Retomar"** (ícone e texto, `aria-pressed`, `aria-controls` apontando para a faixa).
- Uma faixa que **anda sem parar** para a esquerda (animação CSS de cerca de 48 s, linear e infinita). Uma cópia da lista, com `aria-hidden="true"` e botões com `tabIndex={-1}`, fecha o laço.
- Na faixa, cada ODS é um **botão curto em pílula**: número em Anton dourado (`aria-hidden`) + "ODS 10 · Redução das Desigualdades" + a etiqueta **"Principal"** (só no ODS 10), depois "ODS 9 · Indústria, Inovação e Infraestrutura" e "ODS 11 · Cidades e Comunidades Sustentáveis".
- **A frase completa de cada ODS** (textos da antiga seção de ODS da 6.2) aparece **ao passar o mouse, focar ou tocar** (o toque foca o botão), numa **área fixa logo abaixo da faixa**, que não cobre nada (WCAG 1.4.13). Sem interação, a área mostra "Passe o mouse, foque ou toque num ODS para ver o que ele significa." A área tem `aria-hidden="true"`; para o leitor de tela, cada botão leva a frase pelo `aria-describedby`.
- **A faixa para** com o mouse em cima, com o foco dentro ou pelo botão "Pausar" (WCAG 2.2.2).
- **Com "reduzir movimento":** sem animação e sem o botão de pausa; os 3 botões aparecem parados, um embaixo do outro, e a área da frase continua funcionando.
- Ordem no Tab: "Pausar" → os 3 botões de ODS → links do rodapé.

### 18.11 Página 404 (`app/not-found.jsx`)

- Aba: `Página não encontrada — Pulse`. Textura de piso tátil e "PARAR" gigante ao fundo (`aria-hidden`).
- Rótulo mono "Erro 404", H1 **"Você saiu da rota"**, texto **"Esta página não existe ou mudou de endereço."**, botões **"Voltar ao Início"** (dourado) e **"Ir para a Solução"** (secundário).
- `Pulseira3D modo="parar"` ao lado (embaixo no celular), com a legenda visual "A pulseira faz o sinal de parar." (`aria-hidden`). A animação dura menos de 5 s e para.
- Resolve a pendência da página em inglês (WCAG 3.1.2).

### 18.12 Responsividade da nova identidade (complementa a seção 12)

| Elemento | Celular | Tablet (≥ 768 px) | Computador (≥ 1024 px) |
| --- | --- | --- | --- |
| Capa | Imagem vertical | Imagem horizontal | Imagem horizontal |
| Abertura do Início | Pulseira em cima, links em lista (2 colunas a partir de 640 px) | Igual | Pulseira no centro (até 30rem), 3 links de cada lado com linhas (a partir de 1000 px) |
| "Os sinais" | Índice em faixa, pulseira de 76 px e pausar, foto, texto | Igual | Índice lateral com pulseira de 132 px; foto e texto lado a lado |
| Galeria | Grade | Grade | Corre na horizontal com a rolagem (≥ 900 px de largura) |
| Polaroides | 2 por linha | 3 + 2 | 5 lado a lado (≥ 1100 px) |
| Faixa dos ODS (Solução) | Anda na horizontal; com "reduzir movimento", botões um embaixo do outro | Igual | Igual |
| 404 | Texto, depois a pulseira | Igual | Texto e pulseira lado a lado (≥ 900 px) |
| Pouca altura (≤ 480 px) ou zoom alto | Rolagens fixas e galeria viram listas; barra no fim da página | Igual | Igual |

### 18.13 Marcadores novos de imagem

> **(Fase 9)** Atualizada pela seção 19.14: a capa usa vídeos, a ilustração da pulseira sai e entram as fotos de "Quem vive o problema" e das peças de Tecnologias.

Seguem as regras da seção 13.2. **As imagens são escolhidas pela equipe**, que pode usar fotos próprias, bancos gratuitos ou imagens geradas por IA; o Claude Code nunca gera imagens. A regra antiga "não usar imagens geradas por IA" passa a valer só para o Claude Code. **(Depois da Fase 9)** A equipe põe os arquivos em `public/imagens/`, e o Claude Code liga os caminhos no código, depois que todas estiverem lá (13.2).

| Marcador | Onde | `alt` sugerido | Legenda visível |
| --- | --- | --- | --- |
| `IMAGEM-capa versão computador (horizontal)-AQUI` | Capa | "Capa da Pulse." | — |
| `IMAGEM-capa versão celular (vertical)-AQUI` | Capa | "Capa da Pulse." | — |
| `IMAGEM-sinal continuar-AQUI` | Os sinais | "Pessoa cega com bengala atravessando a faixa de pedestres." | — |
| `IMAGEM-sinal parar-AQUI` | Os sinais | "Pessoa parada no meio-fio diante do semáforo fechado." | — |
| `IMAGEM-sinal virar-AQUI` | Os sinais | "Esquina de calçada com piso tátil indicando a curva." | — |
| `IMAGEM-sinal aguardar-AQUI` | Os sinais | "Pessoa esperando no ponto de ônibus." | — |
| `IMAGEM-galeria faixa de pedestres-AQUI` | Galeria | "Faixa de pedestres numa avenida movimentada." | Travessias sem sinal sonoro |
| `IMAGEM-galeria calçada com obstáculo-AQUI` | Galeria | "Calçada com piso tátil interrompido por um poste." | Calçadas com obstáculos |
| `IMAGEM-galeria semáforo de pedestres-AQUI` | Galeria | "Semáforo de pedestres com botão de acionamento." | Semáforos de pedestres |
| `IMAGEM-galeria ponto de ônibus-AQUI` | Galeria | "Pessoa esperando o ônibus no ponto." | Embarque no transporte |
| `IMAGEM-galeria plataforma do metrô-AQUI` | Galeria | "Plataforma do metrô com piso tátil na borda." | Plataformas de metrô e trem |
| `IMAGEM-galeria esquina com rampa-AQUI` | Galeria | "Esquina com rampa de acesso e piso tátil." | Esquinas e rampas |

Continuam: `IMAGEM-ilustração de uma travessia-AQUI` (Início), `IMAGEM-ilustração conceitual da pulseira-AQUI` (Solução, "A pulseira") e `IMAGEM-foto de (nome)-AQUI` (Equipe).

**Ícones novos** (marcadores `ICONE-…-AQUI`, Phosphor Bold): `Pause`, `Play` (retomar e girar), `CaretLeft` (anterior), `CaretRight` (próximo), `ArrowDown` (dica da capa), `ArrowRight` (links "→"). A pulseira 3D e o logo da capa são código, não marcadores.

### 18.14 Componentes e hooks novos (complementa as seções 10 e 14)

| Componente | Pasta sugerida | Função |
| --- | --- | --- |
| `CapaIntro` | `components/abertura/` | Capa da primeira visita e saída em piso tátil |
| `AberturaPulseira` | `components/abertura/` | Abertura do Início: H1, pulseira, sinal atual, pausar, palavra de fundo e links |
| `PartesSolucao` | `components/abertura/` | Os 6 links e as linhas em SVG |
| `Pulseira3D` | `components/pulseira/` | Cena 3D (cliente, `ssr: false`) |
| `PalavraFundo` | `components/ui/` | Palavra gigante decorativa |
| `TexturaPiso` | `components/ui/` | Fundo de piso tátil (ou só uma classe CSS) |
| `SinaisRolagemFixa` | `components/solucao/` | Seção "Os sinais" |
| `Carrossel` | `components/ui/` | Carrossel com botões e contagem (Tecnologias). **(Fase 9: apagado; 19.8)** |
| `GaleriaHorizontal` | `components/solucao/` | Galeria. **(Fase 9: apagado; 19.9)** |
| `CartaoIntegrante` | `components/solucao/` | Passa a ser polaroide |
| `TransicaoPagina` | `components/layout/` | Provedor da transição entre páginas |
| `Rodape` | `components/layout/` | Links e créditos, no visual novo, em todas as páginas |
| `FaixaODS` | `components/solucao/` | Faixa contínua dos ODS com a área da frase (só no rodapé da Solução) |
| `ProvedorMovimento` | `components/layout/` | Lenis + `MotionConfig` + registro do GSAP |

| Hook | Função |
| --- | --- |
| `useCapaIntro` | Primeira visita da sessão, eventos de saída, estado "saindo" |
| `usePulseira3D` | Montagem da cena, sinais, pausa, visibilidade, limpeza |
| `useRolagemFixa` | Progresso da rolagem → índice ativo; liga e desliga o modo fixo |
| `useCarrossel` | Posição, contagem, pontas e passos. **(Fase 9: apagado)** |
| `useFaixaODS` | Pausa (botão, mouse e foco) e o ODS em destaque na área da frase |
| `useGaleriaHorizontal` | Altura do trilho e deslocamento da lista. **(Fase 9: apagado)** |
| `useTransicaoPagina` | Animação de entrada e saída da cortina |
| `useInclinacaoMouse` | Inclinação dos cartões com o mouse. **(Fase 9: apagado; os polaroides não acompanham mais o mouse, 19.10)** |

~~Todos os hooks e funções de animação levam o comentário `// Esta parte é lógica`.~~ **(Fase 9: regra retirada.)** Componentes de apresentação continuam sem `fetch`.

### 18.15 Leitor de tela na nova identidade (complementa a seção 15 do documento de decisões)

- **Capa:** ignorada (`aria-hidden`), sem nada focável.
- **Início:** Pular → Pulse → H1 → resumo → pulseira (descrição) → "Pausar animação" → "Partes da solução, lista, 6 links" → Nesta página → seções. A palavra de fundo e o nome do sinal animado não são lidos.
- **Os sinais:** navegação "Sinais" com 4 links (o atual com `aria-current="step"`) → pausar → cada sinal: foto com `alt`, H3, pares "Modo tátil:"… Os 4 são lidos em ordem.
- **Carrossel de Tecnologias:** "Tecnologias, carrossel"; botões "Anterior" e "Próximo".
- **Faixa dos ODS (Solução):** "A Pulse e os ODS" → "Pausar" → 3 botões, cada um lido com o nome do ODS e a frase completa (`aria-describedby`). A cópia da animação não é lida nem recebe foco.
- **Galeria:** 6 fotos com `alt` e legenda.
- **Troca de página:** a cortina não é lida; o leitor anuncia o novo H1.
- **404:** "Erro 404" → H1 "Você saiu da rota" → texto → dois botões.

### 18.16 Critérios de aceite da Fase 8

- [ ] Todos os itens da 18.2 conferidos em cada página.
- [ ] Com "reduzir movimento": nada se move, nenhuma rolagem fixa, capa e trocas instantâneas, cenas 3D paradas.
- [ ] 320 px sem rolagem lateral; zoom de 400% com rolagens fixas e galeria em lista; nenhum polaroide cortado.
- [ ] Teclado alcança tudo, nada invisível recebe foco, e a capa nunca prende o foco.
- [ ] Contraste recalculado com os tokens da 18.3, nos dois temas e no rodapé.
- [ ] WebGL desligado: aparece a descrição em texto, sem erro.
- [ ] Uma cena 3D animando por vez; nenhum vazamento de memória ao trocar de página.
- [ ] ESLint `jsx-a11y` e axe sem violações.
- [ ] Diário sem efeitos, só com cores e fontes novas.
- [ ] Todos os marcadores novos (18.13) no lugar e listados para a equipe.

---

## 19. Fase 9: efeitos, paleta nova, pulseira nova e vídeos

Decidida pela equipe em 12/11/2026, depois da Fase 8. **Esta seção vence a 18 e as seções antigas onde elas discordarem.** As seções afetadas têm uma nota **(Fase 9)** apontando para cá.

- **O que muda:**
  - um interruptor "Efeitos" que controla todo o movimento do site;
  - paleta laranja e grafite e fontes instaladas por pacote;
  - polimento geral do layout;
  - efeitos e interações novos;
  - Tecnologias em cartões que viram e Galeria em canvas;
  - Equipe num varal;
  - a pulseira 3D nova (com luzes e giro de 360°);
  - os vídeos das animações.
- **O que não muda:** rotas, a camada de dados e a API, o Diário (só ganha microinterações de feedback), os marcadores, a ordem de leitura e as regras da seção 3. A única exceção é o item 1 da 18.2 (ver 19.1).
- **Protótipos de referência** (HTML puro, para aprovação; **não copiar o código direto**):
  - `docs/prototipos/pulse-efeitos.html`: efeitos, paleta, interruptor, interações, Tecnologias, Galeria, Equipe e Diário;
  - `docs/prototipos/pulse-pulseira-3d.html`: a pulseira nova, com giro de 360°, partes, sinais e luzes.

  O que é só da prévia não entra no site: o aviso "Protótipo da fase 9", o botão "Rever o preloader e a capa", as etiquetas "Amostra da página Solução", os rótulos "ANIMAÇÃO · …" e "IMAGEM · …" e o campo "Destino" do Diário. Esse campo existe só na demonstração; o formulário real continua o da 7.3.
- **Padrões obrigatórios:**
  - `docs/PADRAO_MOVIMENTO_PULSE.md` vale para todas as animações de interface: molas do Motion, gestos da marca, presets em `lib/presetsMovimento.js` e coreografia.
  - `docs/PADRAO_ANIMACOES_VIDEO_PULSE.md` vale só para os vídeos MP4, que são feitos fora do código do site. Fica como referência.

### 19.1 Piso de acessibilidade (substitui a 18.2)

A equipe liberou desfazer o piso, desde que o site continue o mais acessível possível. Só a regra da textura atrás do texto caiu; as outras continuam.

1. **Granulado em todo o site, inclusive atrás do texto.** Onde houver granulado, o contraste mínimo do texto é de 4,5:1 (WCAG 1.4.3). No texto corrido, a meta de 7:1 continua. Títulos, links e botões em laranja ficam no mínimo em AA (19.3).
2. **Com os efeitos desligados (19.2), nada se move:**
   - as cenas 3D mostram um quadro parado e os vídeos, o quadro parado;
   - as seções fixas, o encaixe e o canvas viram listas e grades comuns;
   - a capa e o preloader não aparecem, e a troca de página é instantânea.
3. O que se move sozinho por mais de 5 segundos tem botão de pausa visível (WCAG 2.2.2). Nada pisca mais de 3 vezes por segundo (WCAG 2.3.1).
4. Nenhum conteúdo depende de animação ou de JavaScript para aparecer.
5. Nada invisível recebe foco.
6. O cursor do sistema nunca é substituído. Nenhuma ação depende só do mouse ou de um gesto: arrastar sempre tem alternativa em botões e teclas (WCAG 2.5.7).
7. Decorações ficam com `aria-hidden="true"`: granulado, palavras de fundo, faixa de texto, "PULSE" do rodapé, linhas, barra de progresso e vídeos de fundo.
8. Ícone sempre com texto visível.
9. Desempenho:
   - no máximo uma cena 3D visível por vez;
   - vídeos só tocam quando estão na tela;
   - densidade de pixels limitada a 1,75;
   - tudo liberado da memória ao sair da página.
10. **Som:** nada toca som sozinho. Os vídeos começam mudos, com o botão "Ativar som" (WCAG 1.4.2), e os sons que informam algo têm legenda (WCAG 1.2.2). Isso substitui a decisão "nada com som no site".

### 19.2 Preferência de movimento única e o interruptor "Efeitos"

Hoje o "reduzir movimento" é conferido em cerca de 20 lugares (análise de 12/11/2026):
- o hook `usePrefereMovimentoReduzido`, usado em 5 lugares;
- cerca de 10 consultas diretas a `matchMedia`;
- 8 classes `motion-safe:` e `motion-reduce:` do Tailwind;
- 5 blocos `@media (prefers-reduced-motion)` no CSS.

A Fase 9 junta tudo numa preferência só, controlada pelo interruptor.

**Estado e memória**
- Contexto `ProvedorMovimento` (já existe) com `efeitosLigados` e `alternarEfeitos()`, lido pelo hook `useEfeitos()`.
- **Valor inicial:**
  1. a escolha salva no `localStorage`, chave `pulse-efeitos` (`"ligados"` ou `"desligados"`), com `try/catch`;
  2. sem escolha salva, desligado quando o aparelho pede "reduzir movimento" e ligado nos outros casos.
- **Sem piscar na carga:** o script do `<head>` (o mesmo da camada da capa) grava `data-efeitos="ligados"` ou `"desligados"` na tag `<html>` antes da pintura. O React lê esse atributo na hidratação.
- **Mudança do aparelho:** se a pessoa nunca mexeu no interruptor e liga "reduzir movimento" no aparelho com o site aberto, o estado acompanha.

**Onde o estado é aplicado**
- **CSS:**
  - variantes do Tailwind `efeitos-ligados:` e `efeitos-desligados:`, criadas com `@custom-variant` a partir de `[data-efeitos]`. Elas substituem as 8 classes `motion-safe:` e `motion-reduce:`;
  - os 5 blocos `@media (prefers-reduced-motion)` viram regras com `[data-efeitos="desligados"]`.
- **JavaScript:** as consultas a `matchMedia("(prefers-reduced-motion…)")` e o `usePrefereMovimentoReduzido` dão lugar a `useEfeitos()`. O hook antigo pode continuar existindo só para o valor inicial.
- **Motion:** `MotionConfig reducedMotion={efeitosLigados ? "never" : "always"}`, com `transition={spring.padrao}` (PADRAO_MOVIMENTO_PULSE, item 4).
- **Lenis:** desligado (`stop()` e `smoothWheel: false`) com os efeitos desligados; religa ao ligar.
- **GSAP e ScrollTrigger:** os efeitos ligados à rolagem só são criados com os efeitos ligados. O `useGSAP` depende de `efeitosLigados` e desfaz tudo ao desligar.
- **Pulseira 3D, vídeos e faixas contínuas:** param e mostram o quadro parado (19.12 e 19.13).
- **Barras que somem ao rolar (9.3):** sempre visíveis com os efeitos desligados.

**O botão**
- Fica no cabeçalho, à direita do rótulo "GS 2026.2 · CitizenTech". No celular, o rótulo pode ir para a segunda linha.
- É um `<button type="button" aria-pressed>`, com o texto visível "Efeitos: ligados" ou "Efeitos: desligados" e um trilho decorativo (`aria-hidden`).
- Tem 48 px de altura, contorno de 2 px em `--cor-borda` e o trilho preenchido em `--cor-acao` quando ligado, como no protótipo.
- O nome acessível é o próprio texto, e o `aria-pressed` diz o estado. Não precisa de anúncio extra.
- Ligar ou desligar vale na hora para a página inteira, sem recarregar.

**Por quê:** muita gente não conhece a configuração do aparelho, e quem é atrapalhado pelo movimento precisa desligá-lo logo na chegada (WCAG 2.2.2, heurística H3).

### 19.3 Cores: paleta laranja e grafite (substitui a 18.3)

Paleta da equipe: laranja principal `#FC4C02`, laranja secundário `#FC5200`, laranja escuro `#CC4200`, branco `#FFFFFF` e grafite `#242428`. Os tons derivados existem só para garantir contraste: cinzas `#4E4E57`, `#6E6E78`, `#9A9AA4` e `#C9C9CF`, faixa clara `#FAFAFA` e grafite mais escuro `#1A1A1D`. Os temas continuam seguindo o aparelho.

**Tokens** (renomear `--cor-ouro` e `--cor-sobre-ouro` para `--cor-acao` e `--cor-sobre-acao`, que não são mais dourados):

| Token | Uso | Tema claro | Tema escuro |
| --- | --- | --- | --- |
| `--cor-fundo` | Fundo da página | `#FFFFFF` | `#1A1A1D` |
| `--cor-faixa` | Seções alternadas ("bandas") | `#FAFAFA` | `#242428` |
| `--cor-superficie` | Cartões, campos, cabeçalho, barra, diálogo | `#FFFFFF` | `#242428` |
| `--cor-texto` | Texto principal | `#242428` (15,5:1; 14,8:1 na faixa) | `#FFFFFF` (17,4:1; 15,5:1) |
| `--cor-texto-2` | Texto secundário | `#4E4E57` (8,2:1; 7,9:1) | `#C9C9CF` (10,5:1; 9,4:1) |
| `--cor-marca` | Títulos, links, foco, botão secundário | `#CC4200` (4,8:1; 4,6:1) | `#FC4C02` (5,1:1; 4,55:1) |
| `--cor-destaque` | Rótulos mono e números grandes | `#CC4200` | `#FC4C02` |
| `--cor-acao` / `--cor-sobre-acao` | Botão principal e item ativo da barra | `#FC4C02` / `#242428` (4,55:1) | igual |
| `--cor-borda` | Bordas de campos, botões e cartões clicáveis | `#6E6E78` (5,0:1) | `#9A9AA4` (5,5:1) |
| `--cor-apagada` | Palavras ainda apagadas da frase que acende (19.7) | `#6E6E78` | `#9A9AA4` |
| `--cor-erro` | Erro (sempre com ícone e texto) | `#B3261E` (6,5:1) | `#FF8A80` (6,8:1) |
| `--cor-sucesso` | Sucesso | `#1F6B3A` (6,5:1) | `#7FD69B` (8,8:1) |
| `--cor-aviso` | Aviso | igual à 8.1 | igual à 8.1 |

**Decoração e 3D** (sem texto em cima, exceto o granulado):

| Token | Claro | Escuro | Uso |
| --- | --- | --- | --- |
| `--cor-ponto` / `--cor-ponto-brilho` / `--cor-ponto-sombra` | `rgba(36,36,40,.07)` / `rgba(255,255,255,.9)` / `rgba(36,36,40,.10)` | `rgba(255,255,255,.05)` / `rgba(255,255,255,.08)` / `rgba(0,0,0,.35)` | Domos da textura, com relevo |
| `--grao-opacidade` | `.06` | `.08` (**Fase 9: `.25`**, grão preto, decisão da equipe na 9.4) | Granulado (**atrás do conteúdo**: branco no claro, preto no escuro; decisão da equipe na 9.0) |
| `--cor-faixa-3d` | `#FC4C02` | `#FC4C02` | Tira da pulseira 3D |
| `--cor-cortina` | `#242428` | `#242428` | Transição entre páginas e preloader |

**Rodapé** (escuro nos dois temas): fundo `#242428` no claro e `#141416` no escuro, texto `#FFFFFF` (15,5:1 e 18,4:1), texto secundário `#C9C9CF`, destaque e foco `#FC4C02` (5,4:1 no `#141416`) e bordas `#9A9AA4`.

**Regras**
- Branco sobre laranja tem só 3,4:1. Só pode em texto grande (24 px, ou 18,7 px em negrito).
- O laranja escuro sobre o grafite (3,2:1) nunca é usado como texto.
- Os dois laranjas principais são praticamente iguais (1,03:1) e nunca diferenciam estados.
- O vermelho de erro fica separado do laranja e sempre vem com ícone e texto.
- A meta de 7:1 vale para o texto corrido. Títulos, links e botões em laranja ficam no mínimo em AA (4,5:1). Os títulos em Anton são texto grande, mas usam o mesmo laranja.
- **Conferir o contraste com o granulado por cima:** no tema claro, o link laranja sobre a faixa `#FAFAFA` fica em 4,6:1. Se o granulado baixar algum par para menos de 4,5:1, reduzir a opacidade dele (mínimo de 4%) e registrar.
- Remover os tokens da 18.3 (roxos, lilás, dourado e creme). A paleta padrão do Tailwind continua desligada.

### 19.4 Fontes por pacote (substitui a instalação manual da 18.1 e da 18.4)

As fontes passam a ser carregadas com **`next/font/google`**, que já vem com o Next e não exige pacote novo. O Next baixa as fontes no momento do build e as serve pelo próprio site (self-hosting), sem chamar o Google quando a página abre. Ele também pré-carrega as fontes e ajusta a fonte de reserva para o texto não "pular" quando a fonte chega.

```js
// app/layout.jsx
import { Anton, Atkinson_Hyperlegible_Next, JetBrains_Mono } from "next/font/google";
const anton = Anton({ weight: "400", subsets: ["latin", "latin-ext"], display: "swap", variable: "--fonte-anton" });
const atkinson = Atkinson_Hyperlegible_Next({ weight: ["400", "700"], subsets: ["latin", "latin-ext"], display: "swap", variable: "--fonte-atkinson" });
const mono = JetBrains_Mono({ weight: ["500", "700"], subsets: ["latin", "latin-ext"], display: "swap", variable: "--fonte-jetbrains" });
// <html lang="pt-BR" className={`${anton.variable} ${atkinson.variable} ${mono.variable}`}>
```

- `--fonte-titulo`, `--fonte-base` e `--fonte-mono` apontam para essas variáveis, com as reservas da 18.4. Se o nome exato de uma família for outro na versão instalada, conferir na lista do `next/font/google` e avisar.
- Os marcadores `FONTE-…-AQUI` saem, junto com o passo a passo antigo. Os ícones são colocados pelo Claude Code (seção 13.1). Nas imagens, a equipe põe os arquivos em `public/imagens/`, e o Claude Code liga os caminhos (seção 13.2).
- **Conferir a 320 px**, já com a Anton de verdade, os títulos longos ("Deslocamentos") e os números dos cartões. Essa pendência era da Fase 8.

### 19.5 Linguagem visual e polimento (complementa a 18.5)

Ajustes da análise com os 4 pilares do design (contraste, repetição, alinhamento e proximidade):

| Ajuste | Como |
| --- | --- |
| Seções alternadas | `--cor-faixa` nas seções "banda", com um divisor de piso tátil direcional (barras de 6 px de altura) no topo da faixa (`aria-hidden`). Ordem do Início: Abertura → faixa de texto → Tema (banda) → frase que acende → O problema → Quem vive (banda) → Um trajeto com a Pulse |
| Textura com relevo | Domos com brilho e sombra (`--cor-ponto-brilho` e `--cor-ponto-sombra`) |
| H2 menor que o H1 | H1 `clamp(2.6rem, 14vw, 5.6rem)` (opção C, mantida); H2 `clamp(2rem, 9vw, 3.2rem)` (o mesmo critério da opção C, para dobrar com zoom de 200%) |
| Títulos sem quebrar no meio da palavra | `hyphens: manual` e `overflow-wrap: normal` nos H1 e H2. O H2 menor faz "Deslocamentos" caber a 320 px; se não couber, a palavra pode quebrar só nesse caso, como hoje, pela regra do `body` |
| Títulos novos | Tema: rótulo "CitizenTech", H2 **"Tecnologia que nasce de uma necessidade real"**. O problema: rótulo "O problema", H2 **"Atravessar sem saber quando"**. Aprovados por enquanto. Os ids e os itens do "Nesta página" continuam ("Tema CitizenTech", "O problema") |
| Duas colunas | Tema, no computador (≥ 64rem): rótulo e H2 à esquerda e texto à direita. A ordem no HTML não muda |
| Palavra de fundo | Na frente da textura (`z-index`), nunca atrás dela |
| Barra de navegação | Texto centralizado em cada item, com o ícone ao lado (seção 13.1). Se faltar um ícone, o espaço vazio dele não ocupa lugar visível. Os itens não selecionados perdem a borda de 1 px (a pílula da barra já mostra a área). O item ativo continua com fundo `--cor-acao` e `aria-current="page"` |
| Botões | Texto centralizado vertical e horizontalmente |
| Diário de deslocamentos | Conferir os espaçamentos entre o título, o aviso, o resumo e a lista (múltiplos de 8 px) |

### 19.6 Efeitos (complementa a 18.9)

Todos ficam parados ou somem com os efeitos desligados (19.2).

| Efeito | Onde | Como funciona | Acessibilidade |
| --- | --- | --- | --- |
| Rolagem suave | Computador | Lenis com um pouco mais de inércia (`lerp` ≈ 0,09) | No toque, a rolagem continua a do aparelho |
| Preloader | Antes da capa, na primeira visita | Fundo `#1A1A1D`, contagem de 0 a 100 em Anton laranja e "Pulse · carregando" em mono, por até 1,2 s (**Fase 9: 1,4 s**, decisão da equipe na 9.0); some (0,35 s) e revela a capa | `aria-hidden`; não aparece com os efeitos desligados; usa a mesma camada de espera da capa (no máximo 2 s) |
| Granulado | Site todo | Ruído SVG (`feTurbulence`) num elemento fixo com `pointer-events: none` (**Fase 9: atrás do conteúdo**, decisão da equipe na 9.0), opacidade `--grao-opacidade`; troca de posição em 6 passos por segundo | Parado com os efeitos desligados; some no alto contraste do Windows; contraste do texto ≥ 4,5:1 (19.1) |
| Transição entre páginas | Igual à 8.3 (no Diário, só ao entrar e sair) | Os domos em `--cor-cortina` entram numa varredura diagonal (como pixels), sem glitch | Nada pisca; o leitor anuncia o novo H1 |
| Barra de progresso da leitura | Embaixo do cabeçalho | Linha de 3 px em `--cor-acao` que cresce da esquerda (`scaleX`) com a rolagem | `aria-hidden`; parada com os efeitos desligados |
| Rolagem com encaixe | Início: abertura, Tema e Quem vive (`data-encaixe`) | Encaixe do tipo "proximidade": 160 ms depois de a rolagem parar, se uma dessas seções estiver a menos de 30% da altura da tela, a página assenta nela | Nunca obrigatório; desligado com zoom alto, tela baixa e efeitos desligados; nunca durante o arrasto ou o teclado |
| Seções fixas | "O problema" (Início) e "Como funciona" (Solução) | O título fica fixo de um lado e o conteúdo rola do outro, só no computador (≥ 64rem e altura ≥ 600 px) | A ordem do HTML continua a de leitura; com zoom alto, vira lista comum |
| Texto que se constrói | Texto de Tema, O problema e Quem vive | O bloco aparece através de uma máscara de domos quando entra na tela (ScrollTrigger). **Fase 9 (decisão da equipe na 9.0):** entra com o gesto GUIA, sem a máscara | O texto está no HTML desde o início; com o foco, aparece na hora; sem máscara no alto contraste |
| Contagem dos números | Cartões de dados de "O problema" | De 0 até o valor em 1,2 s, ao entrar na tela | O número animado tem `aria-hidden`, e um texto oculto lê o valor real ("Cerca de 90%", "7,9 milhões") |
| Parallax | Fotos de "Quem vive", polaroides e textura das cabeças de página | Velocidades diferentes, até cerca de 60 px (`data-velocidade` de ±0,06) | O texto nunca se move |
| Faixa de texto | Entre a abertura e o Tema | "Pulse · um guia no pulso" em Anton, andando sem parar e acelerando um pouco com a rolagem | `aria-hidden`; parada com os efeitos desligados (WCAG 2.2.2) |
| Linha antes do rótulo | Cabeças de seção | Uma linha laranja de 24 px se desenha antes do rótulo mono quando a seção chega. Os títulos ficam sem efeito | Decorativa |
| Botão magnético | Só os botões laranja principais | O conteúdo do botão segue o mouse até 8 px; a área de clique fica parada | Só com `pointer: fine` |
| Filtro nas fotos | Galeria, polaroides, "Quem vive" e Tecnologias | Foto em tons de cinza com pontilhado de domos; ao passar o mouse ou focar, ganha cor e zoom de 1,05 | No celular, ganha cor ao entrar na tela; com `prefers-contrast: more` e alto contraste, já aparece colorida |
| Rodapé revelado | Todas as páginas | O conteúdo sobe e revela o rodapé fixo por baixo, com "PULSE" gigante em laranja | "PULSE" com `aria-hidden`; sem o efeito, o rodapé é normal |

### 19.7 Interações novas

| Interação | Onde | Como funciona | Acessibilidade |
| --- | --- | --- | --- |
| Frase que acende | Início, entre Tema e O problema | Seção `aria-label="Frase de abertura"` com "Atravessar a rua não deveria depender de **adivinhar.**" (Atkinson negrito, grande). Cada palavra vai de `--cor-apagada` para `--cor-texto` conforme a rolagem; "adivinhar." acende em `--cor-destaque` | O texto inteiro está no HTML; o leitor lê a frase de uma vez; com os efeitos desligados, já aparece acesa |
| Um trajeto com a Pulse | Início, depois de "Quem vive o problema" | Rótulo "No caminho", H2 "Um trajeto com a Pulse". O mapa SVG (`aria-hidden`) desenha a rota com a rolagem (`stroke-dashoffset`), e o ponto passa pelas paradas. A lista `<ol>` das 5 paradas (Saída, Esquina, Semáforo fechado, Ponto de ônibus e Destino), com os textos do protótipo, acende a parada atual. Depois, o botão "Conheça a solução" | A lista é o conteúdo real; o mapa é decorativo; com os efeitos desligados, a rota já aparece inteira |
| Antes e depois | Solução, depois de "Como funciona" | Rótulo "A diferença", H2 "Antes e depois" e a instrução do protótipo. Os dois vídeos gêmeos ficam sobrepostos, e um `<input type="range">` move a divisória (`clip-path`). Os textos "Sem a Pulse" e "Com a Pulse" (H3) vêm logo abaixo | O controle tem `aria-label="Comparar sem a Pulse e com a Pulse"` e `aria-describedby` nos textos; setas do teclado; os vídeos ficam `aria-hidden` (o texto diz o mesmo) |
| Barra de progresso | Todas as páginas | Ver 19.6 | — |
| Rodapé revelado | Todas as páginas | Ver 19.6 | — |

### 19.8 Tecnologias em cartões que viram (substitui o carrossel da 18.8)

- Rótulo "Por dentro", H2 "Tecnologias" e o texto "O que faz a Pulse funcionar. Vire um cartão para ver a peça."
- Grade de 8 cartões, sem rolagem lateral e sem a barra de rolagem do navegador: 1 coluna no celular, 2 a partir de 40rem e 4 a partir de 64rem.
- **Frente:** rótulo mono, H3 e descrição (textos da 6.2).
- **Verso:** a foto da peça, com o marcador `IMAGEM-peça (nome da tecnologia)-AQUI` (19.14).
- Botão no pé do cartão: **"Ver a peça"** ou **"Ver o texto"**, com ícone e texto e `aria-pressed`. O cartão gira 180° em 0,55 s (`rotateY` com `backface-visibility: hidden`). **(Fase 9, decisões da equipe na 9.0 e na 9.7:** texto fixo "Ver a peça", com `aria-pressed="true"` enquanto o cartão está virado; o giro usa a mola `spring.suave`, 0,42 s.**)**
- O verso escondido tem `inert`, para não receber foco nem ser lido. Ao virar, o foco continua no botão.
- Com os efeitos desligados, a troca é instantânea.
- O `Carrossel` e o `useCarrossel` saem. Se não forem usados em mais nenhum lugar, apagar.

### 19.9 Galeria em canvas (substitui a galeria horizontal da 18.8 no computador)

- **No computador** (≥ 64rem, altura ≥ 600 px e efeitos ligados), as 6 fotos ficam espalhadas num plano maior que a janela, que se arrasta em qualquer direção (`pointer events`, com inércia leve).
- **Alternativas ao arrasto:**
  - a janela é uma `region` com `aria-label="Galeria para explorar"`, `tabindex="0"` e a instrução visível "Arraste a área para explorar as fotos. Pelo teclado, entre na área com Tab e use as setas.";
  - as setas movem o plano;
  - os botões "Esquerda", "Cima", "Baixo", "Direita" e "Centralizar", com ícone e texto (WCAG 2.5.7), também movem o plano;
  - quando o foco cai numa foto, o plano se move até ela.
- **No celular, com zoom alto ou com os efeitos desligados:** grade comum de fotos, sem os botões.
- Cada foto é uma `<figure>` com o marcador, o `alt` e a legenda da 18.13. O filtro da 19.6 também vale aqui.
- `GaleriaHorizontal` e `useGaleriaHorizontal` dão lugar a `GaleriaCanvas` e `useGaleriaCanvas`.

### 19.10 Equipe num varal (complementa a 18.8)

- Os 5 polaroides ficam menores, pendurados num varal: uma linha fina com uma leve curva (`aria-hidden`) e um prendedor laranja em cada foto.
- **Nomes:** só o primeiro nome (Giovana, Giovane, Mie, Pedro e Thiago), sem a linha de função.
- **Com o mouse:**
  - a foto se endireita, sobe 6 px e ganha cor;
  - o nome ganha um traço laranja que se desenha (`background-size`).
- O balanço é leve e só com o mouse. Nada depende dele.
- **Layout:** 2 por linha no celular, 3 + 2 no tablet e 5 lado a lado no computador. Nenhum polaroide pode sair da tela.
- `alt` "Foto de (nome)", como antes.

### 19.11 Diário: microinterações de feedback (complementa a 18.5)

O Diário continua sem textura, palavra de fundo e cenas, mas ganha feedback nas ações (PADRAO_MOVIMENTO_PULSE):

- **Salvar:** o botão se preenche e uma marca de "certo" se desenha (`pathLength` de 0 a 1) depois da resposta de sucesso. O texto "Registro salvo." continua sendo anunciado como hoje. **(Fase 9, decisão da equipe na 9.9:** o site vai direto para o Diário, e o "certo" se desenha na mensagem "Registro salvo.", e não no botão; assim o anúncio não espera nenhuma animação. O cartão do registro salvo ou alterado chega com o gesto PULSO.**)**
- **Excluir e Desfazer:**
  - o cartão sai com `AnimatePresence mode="popLayout"` **(Fase 9, decisão da equipe na 9.9:** a exclusão acontece na página do registro, então só a volta com o PULSO aparece; a lista fica pronta para saídas**)**;
  - com "Desfazer", volta com o gesto PULSO (batida dupla curta);
  - as mensagens de status continuam numa região que nunca sai da tela.
- **Erro de preenchimento:** tremor horizontal curto no campo (±4 px, 0,3 s), sempre junto da mensagem em texto.
- **Pausar ↔ Retomar** (em todo o site): o ícone troca com uma rotação curta.
- **Limites:**
  - tudo em menos de 1 s, sem repetir;
  - nada atrasa o anúncio ao leitor de tela;
  - com os efeitos desligados, só a troca de opacidade.

### 19.12 Pulseira 3D nova (substitui a 18.7; era da Fase 10 e foi antecipada)

A geometria, os materiais e os sinais estão em `docs/prototipos/pulse-pulseira-3d.html` (função `criarPulseira()`). **O modelo é um módulo único** (`lib/pulseira3d/modelo.js`), usado pelo site e pelos vídeos.

| Parte | Como é |
| --- | --- |
| Tira | Pulseira esportiva laranja (`--cor-faixa-3d`): faixa extrudada ao longo de uma elipse fechada, com frisos, fivela embaixo do pulso, furos de ajuste e passador |
| Módulo | Achatado e arredondado, corpo em `#CC4200` e face grafite |
| Botão do destino | Grande, saltado, côncavo, com dois anéis em relevo e colar laranja |
| Botão de modo | Pequeno, em pílula, saltado, com um ponto em relevo e colar laranja |
| Célula Braille | 6 pinos retráteis no centro do módulo (escrevem P-U-L-S-E) |
| Alto-falante e microfone | Furos na face |
| Zonas de vibração | Por dentro da tira, nos dois lados do pulso |
| Atuador de pressão | Por dentro, embaixo do módulo |
| Contatos de carga | Dois pinos de metal na ponta de baixo do módulo (carregador magnético) |
| Luzes de sinal | 5 pontos de cada lado da face, com brilho radial |

**Sinais**

| Sinal | Vibração | Luzes |
| --- | --- | --- |
| Virar à esquerda / à direita | Zona do lado | O lado correspondente aceso |
| Parar | As duas zonas | Os dois lados acesos |
| Aguardar | Três vibrações curtas em 1 s, a cada 1,6 s | Três piscadas em 1 s (no máximo 3 por segundo) |
| Continuar | O atuador aperta e solta devagar | Uma luz que sobe pelas laterais |

As luzes complementam o tato para quem tem baixa visão e para quem acompanha a pessoa. A informação principal continua sendo a vibração.

**Modos**
- `"abertura"` (Início):
  - gira sozinha devagar e passa pelos sinais;
  - o botão "Pausar o giro" / "Girar sozinha" tem `aria-pressed`;
  - ela também gira arrastando, pelas setas e pelos botões "Girar para a esquerda" e "Girar para a direita";
  - os 6 links e as linhas da 18.6 continuam, ligados às partes equivalentes do modelo novo: o motor esquerdo e o direito viram as zonas de vibração, e a parte de baixo da tira vira o fecho. As linhas mais criativas continuam para a Fase 10.
- `"explorar"` (Solução, "A pulseira", decisão da equipe; ver 19.13):
  - o palco é `role="group"` com `aria-roledescription="modelo 3D"` e `aria-label="Pulseira Pulse em 3D. Use as setas do teclado para girar."`;
  - controles "Girar para a esquerda", "Girar para a direita", "Ver por dentro", "Vista da frente" e "Pausar o giro";
  - listas "Partes da pulseira" (8 botões) e "Os sinais no pulso" (5 botões), com `aria-pressed` e a explicação numa área `aria-live="polite"`, com os textos do protótipo. A pulseira gira até a parte e a acende.
- `"sinal"` e `"parar"`: iguais à 18.7, com o modelo novo.

**Descrição em texto** (reserva e `aria-describedby`): o texto do protótipo, que começa com "Pulseira Pulse: tira esportiva laranja de silicone, com fecho embaixo do pulso…".

**Regras:** continuam as da 18.7 (`next/dynamic` com `ssr: false`, reserva em texto, animação só quando visível, limpeza de memória). Com os efeitos desligados: quadro parado na vista da frente, sem giro automático; os botões de girar continuam funcionando, sem animação.

### 19.13 Vídeos (novo)

Os vídeos foram feitos pelo Claude fora do código do site, no padrão PADRAO_ANIMACOES_VIDEO_PULSE. **A equipe coloca os arquivos** em `public/videos/`. O Claude Code cria o componente e deixa um marcador `VIDEO-(nome)-AQUI` em cada lugar, com o caminho esperado em comentário.

**Componente `VideoPulse`**
- `<video playsinline muted loop preload="metadata" poster="…-quadro-parado.jpg">`. Toca só com os efeitos ligados e o vídeo na tela (`IntersectionObserver`); fora da tela, pausa.
- **Botão de pausa:** "Pausar" / "Reproduzir", com ícone, texto e `aria-pressed`, sempre visível (WCAG 2.2.2). **(Fase 9, decisão da equipe na 9.8:** o texto diz a ação e troca junto com o ícone, **sem** `aria-pressed`. Os botões ficam logo abaixo do vídeo.**)**
- **Vídeos com som:**
  - têm também o botão "Ativar som" / "Desativar som", com `aria-pressed` **(Fase 9: sem `aria-pressed`, como o botão de pausa)**;
  - o som só liga por esse botão (WCAG 1.4.2);
  - `<track kind="captions" srclang="pt-BR" label="Português">` com o `.vtt`. As legendas aparecem quando o som está ligado e também podem ser ligadas pelo controle do navegador.
- **Efeitos desligados:** mostra o quadro parado e o botão "Reproduzir". Se a pessoa apertar, o vídeo toca uma vez e para.
- **Texto equivalente:** o texto da seção diz o mesmo que o vídeo (WCAG 1.2.1).
  - Vídeos de conteúdo: `aria-describedby` apontando para esse texto.
  - Vídeos de fundo: `aria-hidden`, sem foco.
- **Sem os arquivos** (antes de a equipe colocar): o espaço mantém a proporção 16:9 e mostra só o marcador, sem erro.

| Vídeo (arquivos em `public/videos/`) | Onde | Som | Tipo |
| --- | --- | --- | --- |
| `animacao-capa.mp4` / `animacao-capa-vertical.mp4` | Capa (computador / celular) | não | Fundo, loop contínuo; substitui as imagens de capa |
| `animacao-o-problema.mp4` | Início, "O problema" (lado que rola) | sim | Conteúdo |
| `animacao-a-pulseira.mp4` | Solução, "A pulseira", antes dos 3 passos | sim | Conteúdo; substitui `IMAGEM-ilustração conceitual da pulseira-AQUI` |
| `animacao-dois-botoes.mp4` | Solução, "Apenas dois botões" | sim | Conteúdo |
| `animacao-vibracoes.mp4`, `animacao-semaforos.mp4`, `animacao-dois-modos.mp4`, `animacao-transporte.mp4` | Solução, "Como funciona": fundo que troca conforme o item com o mouse, o foco ou a rolagem | não | Fundo, com véu sólido atrás do texto |
| `animacao-antes-sem.mp4` + `animacao-antes-com.mp4` | Solução, "Antes e depois" | não | Par gêmeo: tocam e pausam juntos, com o mesmo `currentTime` |
| `animacao-sinal-continuar.mp4`, `-parar`, `-virar`, `-aguardar` | Solução, "Os sinais", um por sinal (ver abaixo) | sim | Conteúdo |

- **Como funciona (decisão da equipe):** os 4 itens usam o quadro parado do vídeo correspondente como miniatura, sem imagem nova. O fundo da seção troca com o mouse e o foco (no computador) ou com a rolagem (no celular), em 0,4 s.
- **Os sinais (decisão da equipe):** o vídeo de cada sinal **substitui a pulseira 3D pequena** junto do índice. Isso deixa uma cena 3D a menos na página. A foto da situação continua. **(Fase 9, decisão da equipe na 9.8:** no modo fixo, o vídeo do sinal atual fica na coluna do índice no computador (15rem) e com 8rem, ao lado dos botões, no celular; na lista comum, cada sinal mostra o seu vídeo.**)**
- **Capa:**
  - escolhe o vídeo horizontal ou o vertical pela orientação da tela, só no navegador;
  - o texto da capa fica sobre a faixa sólida, como antes **(Fase 9, decisão da equipe na 9.8:** um véu grafite `#1A1A1D` a 60% cobre o vídeo, e o rótulo "GS 2026.2 · CitizenTech" também fica numa faixa sólida; sem isso, o contraste caía a 2,5:1 e 1,0:1**)**;
  - com os efeitos desligados, não há capa.
- **Voz "Trianon-Masp":** a equipe pode trocar `animacao-a-pulseira.mp4` pela versão com voz. O nome do arquivo não muda.

### 19.14 Imagens (atualiza a 18.13)

As imagens continuam escolhidas pela equipe, que põe os arquivos em `public/imagens/`; o Claude Code liga os caminhos depois que todas estiverem lá (13.2). Os prompts para gerar as que são difíceis de achar de graça estão no documento "Prompts das imagens da Pulse". As fotos não mostram a pulseira e usam a bengala toda branca (Lei 14.951/2024).

| Marcador | Situação na Fase 9 |
| --- | --- |
| `IMAGEM-capa versão computador (horizontal)-AQUI` e `…celular (vertical)-AQUI` | Saem: a capa usa os vídeos (19.13) |
| `IMAGEM-ilustração conceitual da pulseira-AQUI` | Sai: "A pulseira" usa o vídeo e a pulseira 3D no modo `explorar` |
| `IMAGEM-sinal …-AQUI` (4) e `IMAGEM-galeria …-AQUI` (6) | Continuam, com os `alt` da 18.13 |
| `IMAGEM-foto de (nome)-AQUI` (5) | Continuam (polaroides) |
| `IMAGEM-ilustração de uma travessia-AQUI` | Continua no Início, se a equipe quiser uma imagem parada além do vídeo de "O problema"; se não, sai. **(Fase 9, decisão da equipe na 9.8: saiu; o vídeo ocupa o lugar.)** |
| **Novo:** `IMAGEM-pessoa cega usando o celular-AQUI` | "Quem vive o problema", cartão "Pessoa cega". `alt`: "Pessoa cega usando o celular com leitor de tela." |
| **Novo:** `IMAGEM-pessoa com baixa visão ampliando a tela-AQUI` | "Quem vive o problema", cartão "Pessoa com baixa visão". `alt`: "Pessoa com baixa visão ampliando a tela do celular." |
| **Novo:** `IMAGEM-peça (nome)-AQUI` (8) | Verso dos cartões de Tecnologias. `alt`: "Foto da peça: (nome da tecnologia)." |

**Ícones novos** (`ICONE-…-AQUI`, Phosphor Bold): `ArrowsClockwise` (virar o cartão), `SpeakerHigh` e `SpeakerSlash` (som), `ArrowsOutCardinal` (centralizar a galeria), `ArrowUp` e `ArrowDown` (mover a galeria), `ArrowCounterClockwise` e `ArrowClockwise` (girar a pulseira), `Eye` (ver por dentro).

### 19.15 Componentes e hooks novos (complementa a 18.14)

| Componente | Pasta | Função |
| --- | --- | --- |
| `InterruptorEfeitos` | `components/layout/` | Botão "Efeitos" do cabeçalho |
| `Granulado` | `components/ui/` | Camada de ruído |
| `Preloader` | `components/abertura/` | Contagem antes da capa |
| `BarraProgresso` | `components/layout/` | Progresso da leitura |
| `FaixaTexto` | `components/ui/` | Faixa contínua "Pulse · um guia no pulso" |
| `FraseAcende` | `components/abertura/` | Frase que acende palavra por palavra |
| `TrajetoPulse` | `components/abertura/` | Mapa e paradas do trajeto |
| `NumeroContado` | `components/ui/` | Número que conta até o valor |
| `TextoConstroi` | `components/ui/` | Bloco que aparece pela máscara de domos |
| `BotaoMagnetico` | `components/ui/` | Variante do botão principal |
| `VideoPulse` | `components/ui/` | Vídeo com pausa, som, legendas e quadro parado |
| `AntesDepois` | `components/solucao/` | Comparação com os vídeos gêmeos |
| `ComoFuncionaFundo` | `components/solucao/` | Lista com o fundo de vídeo que troca |
| `CartaoTecnologia` | `components/solucao/` | Cartão que vira |
| `GaleriaCanvas` | `components/solucao/` | Galeria de arrastar |
| `ExplorarPulseira` | `components/pulseira/` | Palco, controles, partes e sinais (modo `explorar`) |

| Hook | Função |
| --- | --- |
| `useEfeitos` | Lê e muda a preferência de movimento única (19.2) |
| `useEncaixe` | Rolagem com encaixe por proximidade |
| `useProgressoLeitura` | Fração lida da página |
| `useFraseAcende` | Palavra acesa conforme a rolagem |
| `useTrajeto` | Desenho da rota e a parada atual |
| `useContagem` | Contagem de 0 até o valor |
| `useMagnetico` | Deslocamento do conteúdo do botão |
| `useVideoPulse` | Visibilidade, pausa, som e sincronia dos vídeos gêmeos |
| `useGaleriaCanvas` | Posição do plano, arrasto, teclado e foco |
| `useGiroPulseira` | Giro automático, arrasto, teclado, partes e sinais |

`lib/presetsMovimento.js` (molas, saída, cascata, pulso, guia e tremor) segue o PADRAO_MOVIMENTO_PULSE.

**(Fase 9, implementação)** Também entraram:
- componentes `RotuloSecao` (rótulo com a linha que se desenha), `FotoFiltro` (filtro e parallax das fotos), `IconeAlternado` (troca de ícone com rotação), `CertoDesenhado` (o "certo" das mensagens de sucesso) e `Tremor` (gesto de erro nos campos);
- hooks `useComoFuncionaFundo`, `useLinhaRotulo`, `useFaixaTexto`, `useTextoConstroi`, `useParallax`, `useFiltroFoto`, `useRodapeRevelado` e `useRolagemSuave`;
- módulos `lib/efeitos.js` (o estado do interruptor), `lib/cortinaDomos.js` (a cortina em `<canvas>`) e `lib/pulseira3d/modelo.js` (o modelo único da pulseira).

Saíram `Carrossel`, `useCarrossel`, `GaleriaHorizontal`, `useGaleriaHorizontal` e `useInclinacaoMouse`.

### 19.16 Leitor de tela na Fase 9 (complementa a 18.15)

- **Cabeçalho:** Pulse → "Efeitos: ligados, botão de alternância, pressionado" (o texto exato varia com o leitor).
- **Início:**
  - abertura com a pulseira e os botões de giro → faixa de texto (não lida) → Tema → "Frase de abertura", lida inteira;
  - O problema: os números lidos pelo valor real, depois o vídeo ("Pausar", "Ativar som") e a lista;
  - Quem vive (fotos com `alt`) → "Um trajeto com a Pulse", com a lista de 5 paradas (o mapa não é lido).
- **Solução:**
  - "A pulseira": vídeo, passos e "Pulseira Pulse em 3D", com os grupos "Girar a pulseira", "Partes da pulseira" e "Os sinais no pulso";
  - "Como funciona": 4 itens; o vídeo de fundo não é lido;
  - "Antes e depois": controle deslizante com os dois textos;
  - Tecnologias: 8 cartões, cada um com o botão "Ver a peça" (alternância); o verso escondido não é lido;
  - Galeria: a região "Galeria para explorar" com a instrução e o grupo "Mover a galeria", ou a grade;
  - Equipe: 5 fotos.
- **Rodapé:** "PULSE" gigante e a barra de progresso não são lidos.

### 19.17 Critérios de aceite da Fase 9

- [x] Interruptor "Efeitos": desligado, nada se move em nenhuma página (`document.getAnimations()` vazio, nenhum quadro 3D novo, vídeos parados no quadro parado); a escolha sobrevive a recarregar; começa desligado com "reduzir movimento" no aparelho.
- [x] Nenhuma consulta direta a `prefers-reduced-motion` fora do `ProvedorMovimento` e do script do `<head>`.
- [x] Contraste recalculado com os tokens da 19.3, nos dois temas, no rodapé e com o granulado.
- [x] Fontes carregadas por `next/font/google`, sem pedido ao Google no navegador; títulos a 320 px conferidos.
- [x] 320 px sem rolagem lateral; zoom de 400% com seções fixas, encaixe e canvas desligados; nenhum polaroide cortado.
- [x] Teclado alcança tudo: galeria (setas e botões), pulseira (setas e botões), cartões que viram, controle do antes e depois, vídeos.
- [x] Vídeos: começam mudos; o som só com "Ativar som"; legendas nos que têm som; pausa sempre visível; sem os arquivos, nenhum erro.
- [x] Pulseira 3D: uma cena por vez, liberada ao sair; reserva em texto sem WebGL; giro parado com os efeitos desligados.
- [x] Nada pisca mais de 3 vezes por segundo (Aguardar: três piscadas em 1 s).
- [x] ESLint `jsx-a11y` e axe sem violações nos dois temas.
- [x] Marcadores novos (19.13 e 19.14) no lugar e listados para a equipe.

**Resultado da revisão automática (Fase 9, subfase 9.10):**
- ESLint do projeto: 0 problemas. `jsx-a11y` completo (configuração `strict`, 33 regras): só as 4 exceções da Galeria registradas na seção 17.
- axe-core 4.14 (WCAG 2.2 A/AA): 0 violações em 24 páginas-estado (6 rotas × 2 temas × efeitos ligados e desligados) e no Diário com as mensagens de sucesso na tela.
- Efeitos desligados, nas 6 rotas e nos 2 temas: nenhuma animação, nenhum quadro 3D novo em 1 s e nenhum vídeo tocando.
- Teclado (Início, Solução e Diário): primeiro foco no "Pular para o conteúdo"; cada foco visível, com contorno e fora do cabeçalho e da barra; a Solução alcança a pulseira, os 8 cartões, o "Antes e depois", os vídeos e a Galeria.
- 320 px, zoom de 400% e texto em 200%: sem rolagem lateral nas 6 rotas; com zoom de 400%, sem seções fixas e sem canvas.
- Alvos de toque com 48 × 48 px ou mais; imagens com `alt`; nenhum botão só com ícone; alto contraste (simulado) e sem WebGL aprovados; nenhum pedido ao Google Fonts.

Os testes que só uma pessoa faz (leitor de tela, aparelho real, alto contraste real, desempenho no celular) estão em `docs/REGISTRO_DESENVOLVIMENTO.md`, subfase 9.10.
