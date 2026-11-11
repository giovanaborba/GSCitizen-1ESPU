# Pulse — Especificação para desenvolvimento

> Documento de contexto para implementar a aplicação web da Pulse em **React + Next.js + Tailwind CSS, em JavaScript (sem TypeScript)**.
> Reúne todas as decisões de UX/UI tomadas no planejamento (Etapas 1 a 14) e as convenções de código da equipe (seção 14.1). Quando este arquivo e o código discordarem, **este arquivo vence**, a menos que a equipe decida o contrário e atualize este arquivo.
>
> Última atualização: 10/11/2026.

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
- **Consumir uma API externa com CRUD completo**: criar, consultar, atualizar e excluir (o Diário). **A API entra depois**; o código já fica preparado (seção 7.6).
- Boas práticas de desenvolvimento e **versionamento** (Git). **Os commits são feitos manualmente pela equipe**, com uma mensagem simples sugerida ao fim de cada fase.
- Briefing da GS: **nada de dados pessoais reais**. Usar dados simulados ou públicos e citar a fonte.
- O registro do uso de IA no **`prompts.md`** (exigência da GS) é feito manualmente pela equipe.
- **Não usar imagens geradas por IA.**

**Feito manualmente pela equipe (não refazer no código):** criação do projeto Next.js com App Router, instalação do Tailwind CSS e do ESLint, instalação da fonte Atkinson Hyperlegible Next, estrutura de pastas (seção 14) e o arquivo `prompts.md`. O desenvolvimento continua a partir do projeto já existente no VSCode, sem reinstalar pacotes nem mudar configurações.

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
12. **Respeitar "reduzir movimento"** (`prefers-reduced-motion`): sem animações e barras sempre visíveis.
13. **Funcionar no alto contraste do Windows** (`forced-colors`): áreas separadas por bordas; nada importante só em sombra ou imagem de fundo.
14. **Sem CAPTCHA, sem limites de tempo, sem gestos obrigatórios** (deslizar etc.), sem vibração do celular (para não confundir com os sinais da Pulse).
15. **Sem emoji** em texto importante.
16. **Toda imagem tem `alt` preenchido**, com uma comunicação simples, clara e direta para quem usa leitor de tela (regras na seção 13.2). Não há imagem puramente decorativa no site.

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
| `/diario/[id]` | Ver registro | `Registro de DD/MM/AAAA — Pulse` | Diário |
| `/diario/[id]/editar` | Editar registro | `Editar registro — Pulse` | Diário |

- O Next.js anuncia a troca de página ao leitor de tela lendo o título. Cada página precisa de um título **único**.
- Na troca de rota, mover o foco para o `<h1>` da nova página (`tabIndex={-1}`, sem contorno visível nesse caso).

### 4.2 O que fica em cada página

| Página | Conteúdo | Perguntas do briefing da GS respondidas |
| --- | --- | --- |
| Início | Tema CitizenTech → o problema → quem vive o problema | 02 Qual problema será resolvido? · 01 Quem é o cidadão beneficiado? |
| Solução | A pulseira, como funciona, tecnologias, ecossistema, como ampliar o impacto, ODS, diferencial, equipe | 03 Como funcionará? · 04 Quais tecnologias? · 05 Quem participará do ecossistema? · 06 Como o impacto será ampliado? |
| Simulador | Espaço reservado para o simulador | Demonstra a 03 |
| Diário | CRUD de registros de deslocamento + resumo de indicadores | 06 Como o impacto será medido? |

---

## 5. Estrutura comum de todas as páginas

Ordem no HTML (é também a ordem visual e a ordem de leitura do leitor de tela):

1. Link **"Pular para o conteúdo"** (`href="#conteudo"`), invisível até receber foco.
2. `<header>` com o nome **Pulse** (link para `/`).
3. `<main id="conteudo">` com:
   1. `<h1>` + uma frase de resumo.
   2. Índice **"Nesta página"** (`<nav aria-label="Nesta página">`), só em Início e Solução.
   3. Seções com `<h2>` (e `<h3>`/`<h4>` quando preciso). Um único `<h1>` por página. O tamanho visual acompanha o nível.
4. `<footer>` com: "Pulse · Global Solution 2026 · FIAP" e "Protótipo acadêmico com dados públicos e simulados."
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
- Campo marcado com `aria-invalid="true"` e ligado à mensagem por `aria-describedby`. Em grupos de radio, `aria-describedby` no `<fieldset>`.
- **O foco vai para o primeiro campo com erro.** As respostas já preenchidas continuam na tela.

Ao salvar:
- Botão muda para **"Salvando…"** e não aceita um segundo toque. Anunciar "Salvando".
- Sucesso → volta para `/diario` com a mensagem **"Registro salvo."**
- Falha → mensagem junto ao botão: "Não foi possível salvar. Verifique a conexão e tente de novo." Os dados continuam preenchidos.

**Aviso ao sair do formulário (correção H3 da Etapa 14):**
- Se houver respostas preenchidas (ou alteradas, ao editar) e a pessoa tocar em **Cancelar**, **Voltar** ou num **item da barra**, abrir o diálogo:
  - Título: **Descartar as respostas?**
  - Texto: As respostas deste registro não serão salvas.
  - Botões: **"Descartar respostas"** e **"Continuar preenchendo"** — o foco começa em "Continuar preenchendo".
- Ao fechar a aba ou recarregar: aviso padrão do navegador (`beforeunload`).
- Reaproveitar o componente `DialogoConfirmacao`.
- Dica de implementação: o App Router não bloqueia navegação sozinho; interceptar os cliques nos links do formulário e da barra (por exemplo, um contexto `useGuardaDeSaida` que a barra consulta antes de navegar).

**Barra e teclado:** no celular, enquanto um campo de digitação (data ou observações) estiver em uso, a barra flutuante se esconde e volta quando o teclado fecha.

### 7.4 Ver registro (`/diario/[id]`)

- Link "Voltar ao Diário". **H1:** Registro de DD/MM/AAAA.
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

### 7.6 Acesso a dados (API externa)

- **A API externa não será colocada agora.** O código fica preparado com um **serviço único** (`services/registrosService.js`), com 5 funções. Quando a API chegar, **só esse arquivo muda**; as telas e os hooks continuam iguais.

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

---

## 8. Design tokens

Estilo visual: **Flat Design 2.0** — superfícies limpas, cores sólidas, sem degradê/textura/brilho, sombras sutis. A **borda é o que separa os elementos**; a sombra é só reforço.

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

Toque e passagem do mouse: **mudança leve de fundo**, sem animações chamativas.

---

## 9. Navegação: cabeçalho e barra flutuante

### 9.1 Cabeçalho

- Altura 64 px, fundo `--cor-cromo`, borda inferior `--cor-borda`. Contém só o link "Pulse" (logo + texto, 22 px, negrito).
- Fica preso no topo (`sticky`). Em Início e Solução, no celular, some ao rolar (ver 9.3).

### 9.2 Barra flutuante (`<nav aria-label="Navegação principal">`)

- **Em todos os tamanhos de tela.** Centralizada horizontalmente, **16 px acima da borda inferior + área de segurança** (`env(safe-area-inset-bottom)`).
- Fundo **sólido** `--cor-cromo` (nunca translúcido), borda 1 px `--cor-borda`, raio 16 px, sombra de barra, padding 6 px, 6 px entre itens.
- 4 itens, nesta ordem: **Início** (`/`), **Solução** (`/solucao`), **Simulador** (`/simulador`), **Diário** (`/diario` e subrotas).
- Cada item: ícone (24 px) + texto (16 px). **Celular:** ícone em cima e texto embaixo, 4 colunas iguais, altura mínima 56 px. **A partir de 768 px:** ícone e texto lado a lado, altura mínima 48 px.
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

- Início e Solução. `<nav aria-label="Nesta página">` com `<h2>` "Nesta página" e links para os `id` das seções (cada `<h2>` de seção com `id` e `tabIndex={-1}` para receber o foco).
- Celular e tablet: cartão no topo da página, depois do resumo.
- **A partir de 1024 px**: coluna ao lado do texto, presa ao rolar (`position: sticky`).
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
| 13 | `EspacoImagem` | Início, Solução, Simulador | Espaço reservado tracejado com o marcador `IMAGEM-...-AQUI`; quando a imagem entrar, `alt` sempre preenchido (seção 13.2) |
| 14 | `CartaoIntegrante` | Solução (Equipe) | Foto com `alt="Foto de (nome)"` + nome em `<h3>`; item de uma `<ul>` |

Componentes extras de layout permitidos (ex.: `Rodape`, `CartaoRegistro`, `ListaRegistros`, `FormularioRegistro`).

---

## 11. Estados da interface e mensagens

### 11.1 Tempos (limites de Nielsen)

- Abaixo de 1 s: nenhum indicador.
- Entre 1 e 10 s: indicador de carregamento + texto.
- Acima de 10 s: progresso e opção de cancelar.

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

Pontos de quebra do Tailwind: **`md` = 768 px** (tablet) e **`lg` = 1024 px** (computador).

| Elemento | Celular (< 768 px) | Tablet (≥ 768) | Computador (≥ 1024) |
| --- | --- | --- | --- |
| Barra flutuante | Ícone em cima, texto embaixo | Ícone e texto lado a lado | Igual ao tablet |
| Barras que somem ao rolar | Início e Solução | Não | Não |
| Coluna de texto | Largura total | Até ~40rem, centralizada | Até ~40rem, centralizada |
| "Nesta página" | Cartão no topo | Cartão no topo | Coluna lateral `sticky` |
| Cartões repetidos | 1 por linha | 2 por linha | 2 por linha |
| Resumo do Diário | 2 × 2 | 4 lado a lado | 4 lado a lado |
| Formulário | 1 coluna | 1 coluna | 1 coluna |
| Equipe (Solução) | 1 por linha: foto de 64 px à esquerda, nome à direita | 3 por linha (3 + 2, segunda linha centralizada): foto em cima, nome embaixo | **5 lado a lado**: foto em cima, nome embaixo; a seção pode ocupar até ~64rem para caber os 5 |

---

## 13. Ícones e imagens

### 13.1 Ícones

- Biblioteca **Phosphor Icons**, peso **Bold** (licença MIT). Tamanho mínimo 24 px. Sempre com texto visível ao lado; `aria-hidden="true"`.
- **Os ícones são colocados manualmente pela equipe.** No código, no lugar de cada ícone, deixar um espaço de 24 × 24 px oculto para o leitor de tela (`aria-hidden="true"`) com o marcador **`ICONE-(nome)-AQUI`**, por exemplo `ICONE-House-AQUI`. O texto visível ao lado do ícone já existe, então o site funciona sem o ícone.
- Nomes de referência (conferir os nomes exatos na versão que for instalada):

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
| Sucesso | `CheckCircle` |
| Aviso | `Warning` |
| Espaço de imagem | `Image` |

### 13.2 Imagens

- **Pendentes e colocadas manualmente pela equipe.** Usar o componente `EspacoImagem` onde as imagens entrariam, com o marcador **`IMAGEM-(descrição da imagem)-AQUI`**, por exemplo `IMAGEM-ilustração conceitual da pulseira-AQUI` e `IMAGEM-ilustração de uma travessia-AQUI`.
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
- **Não usar imagens geradas por IA.**
- Outras mídias, se houver, também são manuais: **`VIDEO-(descrição)-AQUI`** e **`AUDIO-(descrição)-AQUI`**. Sem animação ou vídeo automático de mais de 5 s sem botão de pausa; som só depois de uma ação da pessoa.

---

## 14. Arquitetura de código sugerida

A estrutura de pastas é criada manualmente pela equipe. Se os nomes no projeto forem diferentes dos abaixo, seguir o projeto e avisar a equipe.

```
src/
  app/
    layout.jsx              # FONTE-...-AQUI, LinkPular, Cabecalho, <main>, Rodape, BarraNavegacao
    page.jsx                # Início
    solucao/page.jsx
    simulador/page.jsx      # SIMULADOR-AQUI
    diario/page.jsx
    diario/novo/page.jsx
    diario/[id]/page.jsx
    diario/[id]/editar/page.jsx
    globals.css             # tokens (variáveis CSS), tema escuro, forced-colors, reduced-motion
  components/
    layout/                 # LinkPular, Cabecalho, BarraNavegacao, ItemBarra, Rodape, IndiceNestaPagina
    ui/                     # Botao, Cartao, Campo, GrupoOpcoes, MensagemStatus, DialogoConfirmacao, EstadoTela, EspacoImagem
    diario/                 # ResumoIndicadores, ListaRegistros, CartaoRegistro, FormularioRegistro, DetalheRegistro
  hooks/
    useRegistros.js         # estado do CRUD: lista, carregando, erro, criar/atualizar/excluir/restaurar
    useFormularioRegistro.js# valores, validação ao enviar, erros, foco no primeiro erro, "sujo" (para o aviso de saída)
    useResumoIndicadores.js # calcula os 4 indicadores a partir da lista
    useDirecaoRolagem.js    # esconde/mostra cabeçalho e barra (regras da seção 9.3)
    usePrefereMovimentoReduzido.js
  services/
    registrosService.js     # as 5 funções do CRUD, cada uma com API-EXTERNA-AQUI
    apiClient.js            # URL base (API-EXTERNA-AQUI), fetch, tradução de erros
  lib/
    datas.js                # formatar DD/MM/AAAA, hoje em AAAA-MM-DD
    rotulos.js              # rótulos dos campos (seção 7.2)
    validacao.js            # regras e mensagens (seção 7.3) — funções puras
prompts.md                  # mantido manualmente pela equipe
```

- Hooks fazem a ponte entre serviços e componentes. `useState` e `useEffect` aparecem naturalmente nos hooks e componentes interativos.
- Páginas de conteúdo (Início, Solução) podem ser Server Components; Diário, barra e formulário são Client Components (`"use client"`).

### 14.1 Convenções do código

| Convenção | Regra |
| --- | --- |
| Linguagem | **JavaScript** (`.js` e `.jsx`), componentes funcionais. **Sem TypeScript.** |
| Nomes | Componentes, hooks e variáveis em **português**, como nesta especificação |
| Parte lógica | Todo trecho lógico recebe, logo acima, o comentário **`// Esta parte é lógica`** (em JSX: `{/* Esta parte é lógica */}`). Vale para hooks, serviços, validação, cálculos e funções que tratam eventos dentro dos componentes. |
| Pacotes e configuração | Não instalar pacotes nem mudar configurações. Se algo for necessário, informar à equipe o que instalar e por quê. |
| Commits | Feitos **manualmente pela equipe**. Ao fim de cada fase, sugerir uma mensagem simples em português (ex.: `Adiciona layout comum e barra de navegação`). |
| `prompts.md` | Mantido manualmente pela equipe. Não editar. |

**Marcadores** (deixar no lugar exato de cada item, de forma bem visível):

| Item | Marcador | Onde |
| --- | --- | --- |
| Fonte | `FONTE-Atkinson Hyperlegible Next-AQUI` | `app/layout.jsx` ou CSS global (seção 8.2) |
| Ícone | `ICONE-(nome)-AQUI`, ex.: `ICONE-House-AQUI` | Cada lugar com ícone, num espaço de 24 px oculto para o leitor de tela (seção 13.1) |
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
1. **A API entra depois.** Quando ela chegar, muda **só o serviço**. As telas continuam iguais.
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

---

## 16. Pendências e suposições

**Pendências (não inventar; perguntar à equipe):**
- API externa do Diário: espaço preparado com `API-EXTERNA-AQUI` (seção 7.6).
- Simulador: outro integrante; espaço preparado com `SIMULADOR-AQUI` (seção 6.3).
- Imagens (ilustrações): colocadas manualmente; espaços com `IMAGEM-...-AQUI` e `alt` sugerido (seção 13.2).
- API: a equipe vai **aguardar a API** para testar o CRUD. Sem mock.
- Fotos da equipe (Giovana, Giovane, Mie, Pedro e Thiago): colocadas manualmente nos marcadores `IMAGEM-foto de (nome)-AQUI`.
- Fonte e ícones: colocados manualmente pela equipe nos marcadores (seções 8.2 e 13.1).
- Nome definitivo da pulseira ("Pulse" é provisório).

**Suposições em uso até confirmação:**
- Todas as perguntas do Diário são obrigatórias, exceto Observações.
- O Diário mostra o aviso de privacidade.
- Na confirmação de exclusão, o foco começa em "Manter registro".

**Riscos aceitos na avaliação heurística (não corrigir sem decisão da equipe):**
- Termos técnicos da seção Tecnologias sem explicação extra (H2).
- Diário sem filtro (H7).
