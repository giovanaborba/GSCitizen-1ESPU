# Pulse — Especificação para desenvolvimento

> Especificação da aplicação web da Pulse, feita em **React + Next.js + Tailwind CSS, em JavaScript (sem TypeScript)**. Reúne as decisões de UX/UI, de acessibilidade e de código, com o porquê de cada uma. Quando este arquivo e o código discordarem, **este arquivo vence**, a menos que a equipe decida o contrário e atualize este arquivo.
>
> - As seções 1 a 16 trazem a base do site. A **seção 18** traz a identidade visual e o movimento, a **seção 19** os efeitos, a paleta laranja e grafite, a pulseira 3D e os vídeos, e a **seção 20** o repositório, o deploy e o Simulador. Onde uma seção mais nova complementa uma antiga, as duas valem.
> - Os números que faltam (17, 18.3, 18.7, 18.16, 19.14 e 20.6) são de seções retiradas. A numeração não mudou porque o código cita as seções pelo número.
> - O que cada fase entregou e os testes feitos estão em `docs/REGISTRO_DESENVOLVIMENTO.md`. O padrão das animações de interface está em `docs/PADRAO_MOVIMENTO_PULSE.md`.
>
> Última atualização: 18/11/2026.

---

## Sumário

1. Visão geral
2. Requisitos obrigatórios da disciplina
3. Princípios que não podem ser quebrados
4. Rotas e arquitetura de informação
5. Estrutura comum de todas as páginas
6. Conteúdo das páginas (textos finais)
7. Diário de deslocamentos (CRUD)
8. Design tokens (base)
9. Navegação: cabeçalho, barra flutuante e índice
10. Componentes reutilizáveis
11. Estados da interface e mensagens
12. Responsividade
13. Ícones e imagens
14. Arquitetura de código
15. Checklist de acessibilidade e critérios de aceite
16. Pendências, decisões e riscos aceitos
18. Identidade visual e movimento
19. Efeitos, paleta laranja e grafite, pulseira 3D e vídeos
20. Repositório, deploy e Simulador

---

## 1. Visão geral

| Item | Definição |
| --- | --- |
| Projeto | Global Solution FIAP 2026.2, tema **CitizenTech** |
| Problema | Pessoas cegas e com baixa visão dependem da audição para atravessar ruas, e muitos semáforos não têm sinal sonoro. Cerca de 90% dos paulistanos consideram as calçadas não acessíveis (G1, 2019). No Brasil, 7,9 milhões de pessoas têm dificuldade para enxergar (IBGE, Censo 2022). |
| Solução | **Pulse** (nome provisório): pulseira que guia pelo pulso com vibrações direcionais, sinais de parar, continuar e aguardar, dados de semáforos e de transporte público. Funciona sem celular. |
| Papel do site | (1) **Apresentação** que liga tema, problema e solução; (2) **Simulador** da pulseira (seção 20); (3) **Diário de deslocamentos**, um CRUD que mede o impacto da Pulse. |
| Público | Pessoas cegas (leitor de tela no celular), pessoas com baixa visão (ampliação, alto contraste, modo escuro) e pessoas sem deficiência (familiares, instrutores). Nenhum perfil é secundário. |
| Avaliação | O site será apresentado aos professores, mas é desenhado para o público real. |
| Login | **Não há login.** Os dados do Diário são anônimos e compartilhados por todas as pessoas. |
| Linha de raciocínio | Toda decisão segue: **problema → solução → experiência na aplicação web**. |

---

## 2. Requisitos obrigatórios da disciplina

- Aplicação **funcional** em **React com Next.js** (App Router) e **Tailwind CSS**, escrita em **JavaScript** (`.js` e `.jsx`, sem TypeScript). Não pode ser só interface estática.
- **No mínimo 8 componentes** React reutilizáveis e organizados. O site tem 72 (seções 10, 18.14, 19.15 e 20.3).
- Uso obrigatório de **`useState` e `useEffect`**.
- **No mínimo 2 custom hooks**, separando lógica de negócio e gerenciamento de estado da camada visual. O site tem 40 (seção 20.3).
- **Separação de responsabilidades**: lógica de negócio e acesso a dados fora dos componentes de apresentação (seção 14.2).
- **Consumir uma API externa com CRUD completo**: criar, consultar, atualizar e excluir. É o Diário, ligado ao **MockAPI** (seção 7.6).
- Boas práticas de desenvolvimento e **versionamento** (Git).
- Briefing da GS: **nada de dados pessoais reais**. Usar dados simulados ou públicos e citar a fonte.
- O registro do uso de IA fica no **`AI.md`**, na raiz do repositório, como pede o enunciado.

---

## 3. Princípios que não podem ser quebrados

1. **WCAG 2.2 nível AA completo.**
2. **Meta voluntária: texto corrido com contraste de 7:1 ou mais** (equivale ao critério AAA 1.4.6). Ícones, bordas e foco com pelo menos 3:1. Títulos, links e botões em laranja ficam no mínimo em 4,5:1 (seção 19.3).
3. **Mobile-first.** Escrever o CSS para o celular primeiro e adaptar com `md:` e `lg:`.
4. **Funcionar a 320 px de largura sem rolagem lateral** (WCAG 1.4.10). Quem usa zoom de 400% num computador de 1280 px vê a tela com 320 px.
5. **Tamanhos em `rem`**, para o texto acompanhar a configuração do aparelho e ampliar até 200% sem quebrar (WCAG 1.4.4).
6. **HTML nativo antes de ARIA**: `<button>` para ações, `<a>`/`<Link>` para navegar, `<input type="radio">` dentro de `<fieldset>` com `<legend>`, `<dialog>` para confirmações.
7. **A cor nunca carrega sozinha uma informação**: erro, sucesso e aviso sempre com ícone (ou o "certo" desenhado) e texto.
8. **Ícone sempre com texto visível.** O ícone fica oculto para o leitor de tela (`aria-hidden="true"`).
9. **Alvos de toque de no mínimo 48 × 48 px**, com 8 px de espaço entre alvos vizinhos.
10. **Contorno de foco sempre visível**, 3 px, afastado 2 px do elemento.
11. **Tema claro e escuro seguindo somente a configuração do aparelho** (`prefers-color-scheme`). Não há botão de tema.
12. **Movimento sob controle da pessoa:** o interruptor "Efeitos" do cabeçalho controla todo o movimento do site. O "reduzir movimento" do aparelho é só o valor inicial dele (seção 19.2). Com os efeitos desligados, nada se move e as barras ficam visíveis.
13. **Funcionar no alto contraste do Windows** (`forced-colors`): áreas separadas por bordas; nada importante só em sombra ou imagem de fundo.
14. **Sem CAPTCHA, sem limites de tempo, sem gestos obrigatórios** (deslizar etc.), sem vibração do celular (para não confundir com os sinais da Pulse).
15. **Sem emoji** em texto importante.
16. **Toda imagem tem `alt` preenchido**, com uma comunicação simples, clara e direta para quem usa leitor de tela (regras na seção 13.2). Não há imagem de conteúdo puramente decorativa. Decorações feitas em CSS, SVG ou vídeo de fundo (textura de piso tátil, palavras gigantes, linhas da abertura, granulado) ficam com `aria-hidden="true"`.

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
| `/diario/[id]` | Ver registro | `Registro de DD/MM/AAAA — Pulse` · enquanto carrega: `Registro — Pulse` · registro inexistente: `Registro não encontrado` | Diário |
| `/diario/[id]/editar` | Editar registro | `Editar registro — Pulse` · registro inexistente: `Registro não encontrado` | Diário |
| qualquer outro endereço | Página 404 (seção 18.11) | `Página não encontrada — Pulse` | — |

- O Next.js anuncia a troca de página ao leitor de tela lendo o título. Cada página precisa de um título **único**.
- Na troca de rota, o foco vai para o `<h1>` da nova página (`tabIndex={-1}`, sem contorno visível nesse caso). Com uma âncora no endereço (ex.: `/solucao#os-sinais`), o foco vai para o título da âncora. No primeiro carregamento o foco **não** é movido, para o "Pular para o conteúdo" continuar sendo o primeiro foco (componente `FocoNaTroca`).
- Títulos: `title.template` (`%s — Pulse`) no layout raiz. A Início escreve o título completo, porque, pela regra do Next, o modelo do layout não vale para a página da mesma pasta. O título com a data só existe depois que a API responde, então é trocado no navegador pelo hook `useTituloDaAba`.

### 4.2 O que fica em cada página

| Página | Conteúdo | Perguntas do briefing da GS respondidas |
| --- | --- | --- |
| Início | Capa (primeira visita) → abertura com a pulseira 3D e os links da solução → tema CitizenTech → o problema → quem vive o problema → um trajeto com a Pulse (seção 18.6) | 02 Qual problema será resolvido? · 01 Quem é o cidadão beneficiado? |
| Solução | A pulseira, os sinais, como funciona, antes e depois, tecnologias, galeria, ecossistema, como ampliar o impacto, diferencial e equipe; os ODS ficam no rodapé desta página (seção 18.8) | 03 Como funcionará? · 04 Quais tecnologias? · 05 Quem participará do ecossistema? · 06 Como o impacto será ampliado? |
| Simulador | Simulador da pulseira (seção 20) | Demonstra a 03 |
| Diário | CRUD de registros de deslocamento + resumo de indicadores | 06 Como o impacto será medido? |
| Rodapé | Links e créditos em todas as páginas; na Solução, também a faixa contínua dos 3 ODS (seção 18.10) | Tema CitizenTech |
| 404 | "Você saiu da rota" (seção 18.11) | — |

---

## 5. Estrutura comum de todas as páginas

Ordem no HTML (é também a ordem visual e a ordem de leitura do leitor de tela):

1. Link **"Pular para o conteúdo"** (`href="#conteudo"`), invisível até receber foco.
2. `<header>` com o nome **Pulse** (link para `/`), o rótulo "GS 2026.2 · CitizenTech" e o botão "Efeitos" (seção 9.1).
3. `<main id="conteudo">` com:
   1. `<h1>` + uma frase de resumo.
   2. Índice **"Nesta página"** (`<nav aria-label="Nesta página">`), só em Início e Solução.
   3. Seções com `<h2>` (e `<h3>`/`<h4>` quando preciso). Um único `<h1>` por página. O tamanho visual acompanha o nível.
4. `<footer>`: o rodapé da seção 18.10.
5. `<nav aria-label="Navegação principal">` — a barra flutuante.

Regras de layout:
- **Uma coluna** de leitura. Elementos relacionados próximos. Mensagens de erro e status junto do campo ou da ação, nunca só no topo.
- Explicações em **texto corrido**; itens que se repetem (sinais, perfis, tecnologias, ODS, registros) em **cartões**.
- Espaçamento **arejado**, em múltiplos de 8 px.
- Texto limitado a **cerca de 40rem** (50 a 75 caracteres por linha) em telas grandes. A área das páginas tem até 76rem.
- **Espaço extra no fim de cada página**, do tamanho da barra flutuante + 16 px + área de segurança, para o último item e o foco nunca ficarem escondidos (WCAG 2.4.11).

---

## 6. Conteúdo das páginas (textos finais)

Use estes textos como estão. Tom de voz: próximo, sério, respeitoso e objetivo; trata quem lê por "você". Ver regras na seção 11.4.

### 6.1 Início (`/`)

A ordem da página, a capa e a abertura estão na seção 18.6.

**H1:** Inovação que chega a quem precisa
**Resumo:** A Pulse é uma pulseira que guia pessoas cegas e com baixa visão pela cidade. Conheça o problema que ela resolve.

**Nesta página:** Tema CitizenTech · O problema · Quem vive o problema · Um trajeto com a Pulse

**Tema CitizenTech** (`id="tema-citizentech"`; rótulo "CitizenTech", H2 **"Tecnologia que nasce de uma necessidade real"**)
- CitizenTech é tecnologia criada a partir das necessidades reais das pessoas, para ampliar direitos e reduzir desigualdades. É o tema da Global Solution 2026 da FIAP.
- Nosso ponto de partida é a acessibilidade nas ruas de São Paulo.

**Frase que acende** (seção 19.7): "Atravessar a rua não deveria depender de adivinhar."

**O problema** (`id="o-problema"`; rótulo "O problema", H2 **"Atravessar sem saber quando"**)
- Sem enxergar as cores do semáforo, a pessoa depende da audição para atravessar. Muitos semáforos não têm sinal sonoro, e o risco de atropelamento é diário.
- Citação (`<figure>` + `<blockquote>` + `<figcaption>`): “Não sabemos quando o sinal abriu ou fechou para nós.” — *Depoimento em reportagem da Unicentro, 2024*
- Cartão de dado: **Cerca de 90%** · dos paulistanos consideram as calçadas não acessíveis para pessoas com deficiência. · Fonte: G1, 2019
- Cartão de dado: **7,9 milhões** · de pessoas no Brasil têm dificuldade para enxergar. · Fonte: IBGE, Censo 2022
- Vídeo `animacao-o-problema` (seção 19.13).
- **H3 O que a Pulse quer reduzir** (lista):
  - A dependência de ajuda de outras pessoas.
  - A necessidade de identificar travessias só pelo som do trânsito.
  - O tempo perdido por falta de acessibilidade ou por erros de caminho.

**H2 Quem vive o problema** (rótulo "As pessoas")
- Pessoas cegas ou com qualquer nível de deficiência visual que dificulte os deslocamentos, especialmente quem usa as ruas e o transporte público.
- Cartão **H3 Pessoa cega**, com foto: Usa leitor de tela no celular e se orienta pela audição e pela bengala. Sem sinal sonoro, não sabe quando pode atravessar.
- Cartão **H3 Pessoa com baixa visão**, com foto: Usa ampliação e alto contraste. Pode ter dificuldade para ver o semáforo de longe, a placa do ônibus ou o meio-fio.

**H2 Um trajeto com a Pulse** (rótulo "No caminho"; seção 19.7)

**Botão-link principal:** Conheça a solução → `/solucao`

### 6.2 Solução (`/solucao`)

A ordem da página e as partes interativas estão na seção 18.8.

**H1:** A Pulse: um guia no pulso
**Resumo:** Uma pulseira que orienta o caminho por vibrações e sinais, com mais autonomia e segurança nos deslocamentos.

**Nesta página:** A pulseira · Os sinais · Como funciona · Antes e depois · Tecnologias · Galeria · Quem participa · Como ampliar o impacto · O diferencial · Equipe

**H2 A pulseira** (rótulo "Como usar")
- Você diz para onde quer ir e recebe as orientações do trajeto direto no pulso. A Pulse funciona sozinha, sem precisar estar conectada a um celular.
- Vídeo `animacao-a-pulseira` e a pulseira 3D no modo `explorar` (seções 19.12 e 19.13).
- Lista numerada (`<ol>`) de cartões:
  1. **H3 1. Fale o destino** — Aperte o botão e diga para onde quer ir. O reconhecimento de voz identifica o destino.
  2. **H3 2. Sinta o caminho** — Vibrações e sinais indicam virar, parar, continuar e aguardar durante todo o trajeto.
  3. **H3 3. Celular no bolso** — Sem consultar a tela e sem depender só de instruções por áudio.
- **H3 Apenas dois botões** (lista), com o vídeo `animacao-dois-botoes`:
  - Trocar o modo: alterna entre o modo sonoro e tátil e o modo exclusivamente tátil.
  - Informar o destino: ativa o reconhecimento de voz.

**H2 Os sinais** (rótulo "Linguagem da Pulse") — Cada comando tem um sinal próprio.
- Continuar — Modo tátil: pressão contínua no pulso até você andar. / Modo sonoro: som grave e curto.
- Parar — Modo tátil: vibração contínua até você parar. / Modo sonoro: som agudo e contínuo.
- Virar à esquerda ou à direita — Nos dois modos: vibração no lado correspondente.
- Aguardar — Nos dois modos: três vibrações curtas, repetidas em intervalos.

**H2 Como funciona**
- **H3 Vibrações direcionais** — Precisa virar? A pulseira vibra no lado correspondente: à esquerda para virar à esquerda, à direita para virar à direita.
- **H3 Semáforos em tempo real** — A Pulse usa dados dos semáforos de pedestres para indicar parar, aguardar ou atravessar, sem adivinhar pelo som do trânsito.
- **H3 Dois modos** (cartões H4):
  - Sonoro e tátil — Sons curtos indicam parar, continuar ou aguardar. As vibrações continuam guiando as conversões.
  - Exclusivamente tátil — Para quem prefere não usar som ou está em lugares muito barulhentos.
- **H3 Transporte público** (lista numerada):
  1. No local: identifica que você chegou ao ponto de ônibus ou à plataforma e avisa para aguardar.
  2. O veículo: orienta sobre a chegada do transporte e o momento de embarcar.
  3. O embarque: evita que você passe do local ou embarque no veículo errado.
- Opcional: a pulseira informa quanto falta para o transporte chegar, em voz no modo sonoro ou em Braille, com pinos retráteis, no modo tátil.
- Nota: Depende de essas informações estarem disponíveis nos sistemas de transporte público.

**H2 Antes e depois** (rótulo "A diferença"; seção 19.7)
- H3 Sem a Pulse — A pessoa espera o barulho dos carros parar para adivinhar se pode atravessar. Muitos semáforos não têm sinal sonoro.
- H3 Com a Pulse — A pulseira usa os dados do semáforo: "Aguardar" com três vibrações curtas e "Continuar" quando é seguro atravessar.

**H2 Tecnologias** (rótulo "Por dentro"; "O que faz a Pulse funcionar. Vire um cartão para ver a peça."; cartões da seção 19.8, com rótulo mono, nome e descrição)
- Localização · GPS: localização e navegação.
- Destino · Reconhecimento de voz: identifica o destino.
- Cérebro · ESP32 ou equivalente: microcontrolador que comanda a pulseira.
- Tato · Motores de vibração: sinais táteis e direcionais.
- Tato · Atuadores de pressão: comando de continuar.
- Som · Alto-falante: sinais sonoros.
- Dados · APIs de mapas, semáforos e transporte: informações em tempo real.
- Conexão · Módulo de conectividade: acesso aos serviços e dados.

**H2 Galeria** (rótulo "A cidade"; seção 19.9) — Onde a Pulse faz diferença: calçadas, travessias e transporte público.

**H2 Quem participa** (rótulo "Ecossistema"; lista)
- Pessoas cegas e com deficiência visual, principais usuárias e participantes dos testes.
- Equipe de desenvolvimento de hardware e software.
- Fabricantes e fornecedores de componentes eletrônicos.
- Prefeituras e órgãos de mobilidade urbana.
- Empresas de transporte público.
- Empresas de APIs de transporte e infraestrutura urbana.
- Instituições de apoio à pessoa com deficiência.

**H2 Como ampliar o impacto** (rótulo "Próximos passos")
- Levar a Pulse a outras regiões e cidades, com novas integrações a semáforos e ao transporte público, evoluindo as funções conforme o retorno de quem usa.
- Link: Veja como medimos o impacto no Diário → `/diario`

**Objetivos de Desenvolvimento Sustentável** (no rodapé da Solução, seção 18.10)
- **ODS 10: Redução das Desigualdades**, com a etiqueta **"Principal"** (o texto é obrigatório; a cor não basta) — Reduz as barreiras enfrentadas por pessoas com deficiência visual e promove igualdade de acesso à mobilidade.
- **ODS 9: Indústria, Inovação e Infraestrutura** — Um dispositivo inteligente que melhora a infraestrutura de acessibilidade e mobilidade urbana.
- **ODS 11: Cidades e Comunidades Sustentáveis** — Torna as cidades mais acessíveis, inclusivas e seguras nas ruas e no transporte público.

**H2 O diferencial** (rótulo "Por que a Pulse")
- (destaque, 20 px) Informação importante pelo tato: menos dependência do celular, de ajuda externa e de meios inseguros nas travessias.
- Orientação de trajetos, travessias e transporte público reunidos em um único dispositivo.

**H2 Equipe** (rótulo "Quem fez")
- Resumo: Integrantes do grupo que criou a Pulse na Global Solution 2026 da FIAP.
- Lista (`<ul>`) de 5 polaroides num varal (seção 19.10), nesta ordem: **Giovana**, **Giovane**, **Mie**, **Pedro**, **Thiago**. Cada um com a foto (`alt` "Foto de (nome)") e o nome.

**Botão-link principal:** Experimente o simulador → `/simulador`

### 6.3 Simulador (`/simulador`)

**H1:** Simulador
**Resumo:** Experimente os sinais da Pulse antes de usar a pulseira na rua.

O que o Simulador faz e como foi feito estão na seção 20. Requisitos:
- Cada sinal tem equivalente em **texto** e **som**. O celular não vibra (seção 3, item 14): a vibração aparece na tela e no texto.
- Mesmos comandos da pulseira (continuar, parar, virar à esquerda, virar à direita, aguardar) e os dois modos.
- Sem limite de tempo. O som só começa depois de uma ação da pessoa.

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
- Datas exibidas como **DD/MM/AAAA**. As datas ficam como texto (`"2026-11-05"`): `new Date("2026-11-05")` lê a data em UTC, e no Brasil viraria o dia 04.

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

**Validação: só ao enviar** (ao tocar em "Salvar registro"). Não validar a cada tecla nem ao sair do campo. O `noValidate` do formulário desliga os balões de erro do navegador.

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
- A mensagem aparece **junto de cada campo com problema** (sem resumo de erros no topo), e o campo dá um tremor curto (seção 19.11).
- Campo marcado com `aria-invalid="true"` e ligado à mensagem por `aria-describedby`. Em grupos de radio, `aria-describedby` no `<fieldset>`. O `aria-invalid` **não** vai nos radios: a especificação ARIA não aceita esse atributo no papel `radio`, e o leitor de tela o ignoraria.
- **O foco vai para o primeiro campo com erro.** As respostas já preenchidas continuam na tela.

Ao salvar:
- Botão muda para **"Salvando…"** e não aceita um segundo toque. Anunciar "Salvando". Usa `aria-disabled="true"`, e não `disabled`: com `disabled`, o navegador tira o foco do botão, e quem usa teclado ou leitor de tela se perde.
- Sucesso → volta para `/diario` com a mensagem **"Registro salvo."** (vale para Novo e para Editar).
- Falha → mensagem junto ao botão: "Não foi possível salvar. Verifique a conexão e tente de novo." Os dados continuam preenchidos.
- Espera acima de 10 s: seção 11.1.
- As observações são salvas sem espaços nas pontas. No limite de 300 caracteres, acentos e emojis contam como 1 caractere.

**Aviso ao sair do formulário (heurística H3, controle e liberdade):**
- Se houver respostas preenchidas (ou alteradas, ao editar) e a pessoa tocar em **Cancelar**, **Voltar**, no logo "Pulse" ou num **item da barra**, abre o diálogo:
  - Título: **Descartar as respostas?**
  - Texto: As respostas deste registro não serão salvas.
  - Botões: **"Descartar respostas"** (perigo preenchido) e **"Continuar preenchendo"** (secundário) — o foco começa em "Continuar preenchendo".
- Ao fechar a aba ou recarregar: aviso padrão do navegador (`beforeunload`).
- Implementação: contexto `useGuardaDeSaida` + prop `onNavigate` do `<Link>` do Next 16 (`evento.preventDefault()`), reaproveitando o `DialogoConfirmacao`. Todo link interno passa por ele (seção 18.9).
- Limite: o botão Voltar **do navegador** não pode ser bloqueado de forma confiável no App Router.

**Barra e teclado:** no celular, enquanto um campo de digitação (data ou observações) estiver em uso, a barra flutuante sai da frente e volta quando o campo perde o foco. Se a pessoa fechar o teclado sem sair do campo (botão Voltar do Android), a barra só volta quando o campo perder o foco. Com os efeitos desligados, a barra também sai da frente, só que sem animação (hook `useDigitandoNoCelular`).

### 7.4 Ver registro (`/diario/[id]`)

- Link "Voltar ao Diário". **H1:** Registro de DD/MM/AAAA.
- Enquanto os dados não chegam, o H1 é "Registro" (em Editar, "Editar registro"). Carregando e erro usam **os mesmos textos da lista**, no plural: "Carregando os registros…" e "Não foi possível carregar os registros." + "Verifique a conexão e tente de novo.".
- Lista de definições (`<dl>`), pergunta (`<dt>`) antes da resposta (`<dd>`): Meio de transporte; Chegou ao destino sem se perder?; Precisou de ajuda de outra pessoa?; Como se sentiu nas travessias?; As orientações da pulseira estavam certas?; Observações (ou "Nenhuma").
- Botões: **"Editar registro"** (link para `/diario/[id]/editar`) e **"Excluir registro"** (botão de perigo, contorno na cor de erro).
- Registro não encontrado: H1 "Registro não encontrado", texto "Esse registro pode ter sido excluído." e botão "Ir para o Diário".

### 7.5 Excluir

- "Excluir registro" abre `<dialog>` modal:
  - Título: **Excluir o registro de DD/MM/AAAA?**
  - Texto: Essa ação não pode ser desfeita.
  - Botões: **"Excluir registro"** (perigo, preenchido) e **"Manter registro"**. **O foco começa em "Manter registro".**
  - Conteúdo atrás inacessível enquanto aberto. `Esc` fecha. Ao fechar, o foco volta ao botão que abriu.
  - Durante a exclusão: "Excluindo…" (espera acima de 10 s: seção 11.1). Falha: "Não foi possível excluir. Verifique a conexão e tente de novo." dentro do diálogo.
- Sucesso → volta para `/diario` com a mensagem **"Registro excluído."** + botões **"Desfazer"** e **"Fechar"**.
- **Desfazer (heurística H3):** recria o registro com os mesmos dados (POST) e anuncia **"Registro restaurado."** Disponível enquanto a mensagem estiver na tela.
- Se o Desfazer falhar, aparece "Não foi possível salvar. Verifique a conexão e tente de novo." junto da mensagem, e o botão "Desfazer" continua disponível.
- A mensagem é levada até `/diario` pelo contexto `useMensagemDiario`. Ela pertence à página `/diario` e é apagada quando a pessoa vai para outra página, para não reaparecer depois.

### 7.6 Acesso a dados (API externa)

A API é o **MockAPI** (mockapi.io). O formato dele (`GET` e `POST` em `/registros`; `GET`, `PUT` e `DELETE` em `/registros/:id`; lista como array; `id` em texto) é o que o serviço espera. O acesso fica num **serviço único** (`services/registrosService.js`), com 5 funções: se a API mudar, só esse arquivo muda.

| Função | O que faz | Chamada na API (REST) | Devolve |
| --- | --- | --- | --- |
| `listar()` | Busca todos os registros | `GET /registros` | lista de registros |
| `obter(id)` | Busca um registro | `GET /registros/:id` | o registro, ou `null` se não existir |
| `criar(dados)` | Cria um registro (dados sem `id`) | `POST /registros` | o registro criado, com `id` |
| `atualizar(id, dados)` | Altera um registro | `PUT /registros/:id` | o registro atualizado |
| `excluir(id)` | Exclui um registro | `DELETE /registros/:id` | nada |

- `services/apiClient.js` é o **único** arquivo que faz `fetch`. Ele lê a URL base (`NEXT_PUBLIC_API_URL`), faz a requisição e transforma qualquer falha (sem URL, sem internet, servidor fora do ar, resposta inválida, erro HTTP) no erro de domínio `{ codigo: "conexao" }`, que a interface traduz para as mensagens da seção 11.
- **Sem mock e sem dados provisórios.** Sem a variável configurada, as telas mostram o estado de erro da seção 11 ("Não foi possível carregar os registros.") sem quebrar.
- Para configurar: crie `.env.local` na raiz (já ignorado pelo Git) com `NEXT_PUBLIC_API_URL=https://endereco-da-api.com`, sem barra no final, e reinicie o `npm run dev`. Na hospedagem, a mesma variável vai no painel do projeto (seção 20.4).
- 404 em `obter` → `null` ("Registro não encontrado"). 404 em `atualizar`/`excluir` (o registro sumiu enquanto a pessoa estava na tela) → erro de conexão.
- Todas as funções aceitam `{ sinal }` (`AbortSignal`): o hook cancela a busca se a pessoa sair da tela ou tocar em "Parar de carregar" (seção 11.1).
- `registrosService` normaliza o registro recebido (por exemplo, `id` sempre texto) e envia só os campos do formulário (sem `id`, `criadoEm`, `atualizadoEm`).
- Sem login: qualquer pessoa vê, edita e exclui qualquer registro.

---

## 8. Design tokens (base)

As cores, as fontes e a linguagem visual estão nas seções 18.4, 18.5 e 19.3. Esta seção traz o que vale para todos os tokens.

### 8.1 Cores: regras gerais

- As cores são **variáveis CSS** em `app/globals.css` (`:root` + `@media (prefers-color-scheme: dark)`), ligadas às classes do Tailwind v4 por `@theme inline` (ex.: `bg-fundo`, `text-texto`, `border-borda`). Quando o tema muda, a classe acompanha, sem precisar de `dark:`.
- **A paleta padrão do Tailwind foi removida** (`--color-*: initial`), para ninguém usar uma cor sem contraste conferido.
- **Links sempre sublinhados**, nos dois temas: o laranja dos links é o mesmo dos títulos, e o sublinhado é o que os diferencia.
- `color-scheme: light dark`, para os controles nativos acompanharem o tema.
- Qualquer cor nova precisa passar de **7:1 no texto corrido**, **4,5:1 em títulos, links e botões** e **3:1 em ícones, bordas e foco**.

### 8.2 Tipografia: regras gerais

- Texto corrido com **1,125rem (18 px)**; texto auxiliar, rótulos da barra e notas com **1rem (16 px), nunca menor**. A única exceção são os rótulos mono (seção 18.4).
- Sem pesos abaixo de 400 e sem itálico em textos longos.
- O layout precisa aguentar espaçamento maior entre linhas, letras e palavras (WCAG 1.4.12).
- `overflow-wrap: anywhere` no `<body>`: uma palavra longa só é quebrada quando, sozinha, não cabe na linha (texto muito ampliado). Em tamanho normal, nada muda.

### 8.3 Espaçamento, cantos, sombras e foco

| Token | Valor |
| --- | --- |
| Espaçamento | múltiplos de 8 px (4 px só em ajustes internos). No Tailwind v4, `p-2` = 8 px, `p-4` = 16 px |
| Margem lateral | `max(16px, env(safe-area-inset-left/right))` |
| Cantos | cartões, fotos e mensagens 18 px (`--radius-cartao`); campos, opções e etiquetas 12 px (`--radius-campo`); diálogo 16 px (`--radius-barra`); botões e barra em pílula; itens da barra no celular 20 px; polaroides 6 px |
| Sombras | só reforço: a **borda é o que separa os elementos** |
| Contorno de foco | `outline: 3px solid var(--cor-marca); outline-offset: 2px` (usar `:focus-visible`) |
| Transições | rápidas, só em cor e posição; nenhuma com os efeitos desligados. O resto do movimento segue o `PADRAO_MOVIMENTO_PULSE.md` |

- **Hover:** mudança leve de fundo (seção 19.3). O botão de perigo preenchido não muda de cor.
- **Foco no campo de data:** o campo tem partes internas (dia, mês, ano e, no Chrome, o ícone de calendário). Ele usa `input[type="date"]:focus-within` com o mesmo contorno, porque no ícone de calendário o `:focus-visible` não se aplica.
- Pontos de quebra: `md` (48rem, 768 px) e `lg` (64rem, 1024 px), os padrões do Tailwind. As condições próprias também ficam em `rem` (1000 px = 62,5rem; 1100 px = 68,75rem), para ficarem na ordem certa com as do Tailwind.

---

## 9. Navegação: cabeçalho, barra flutuante e índice

### 9.1 Cabeçalho

- Fundo `--cor-superficie` e borda inferior `--cor-borda`, na área de 76rem. Contém o link "Pulse" (ícone `Pulse` + nome em Anton), o rótulo mono "GS 2026.2 · CitizenTech" e o botão "Efeitos" (seção 19.2). Abaixo de 640 px, o rótulo desce para uma segunda linha.
- Embaixo dele fica a barra de progresso da leitura (seção 19.6).
- Fica preso no topo (`sticky`). Em Início e Solução, no celular, some ao rolar (ver 9.3).
- Mede a própria altura e guarda em `--altura-cabecalho`. As âncoras usam esse valor para parar logo abaixo dele.

### 9.2 Barra flutuante (`<nav aria-label="Navegação principal">`)

- **Em todos os tamanhos de tela.** Centralizada horizontalmente, **16 px acima da borda inferior + área de segurança** (`env(safe-area-inset-bottom)`).
- Pílula de fundo **sólido** `--cor-superficie` (nunca translúcido), com borda.
- 4 itens, nesta ordem: **Início** (`/`), **Solução** (`/solucao`), **Simulador** (`/simulador`), **Diário** (`/diario` e subrotas).
- Cada item: ícone (24 px) + texto (16 px), centralizados. **Celular:** ícone em cima e texto embaixo, altura mínima 56 px. **A partir de 768 px:** ícone e texto lado a lado, altura mínima 48 px.
- **Largura dos itens no celular:** 4 colunas iguais com texto de 16 px não cabem a 320 px ("Simulador" em negrito precisa de ~91 px; cada coluna teria ~64 px) e causariam rolagem lateral (WCAG 1.4.10). Por isso:
  - cada item tem a largura do seu texto, numa linha só, e divide o espaço que sobra;
  - quando não cabe (tela de ~320 px ou texto ampliado), a barra passa para **2 × 2**;
  - a decisão é feita **medindo os textos no navegador** (hook `useCabeEmUmaLinha`), então acompanha a fonte, o tamanho de texto e o espaçamento escolhidos pela pessoa; a medição é refeita quando os textos mudam de largura (WCAG 1.4.12);
  - o texto do item reserva a largura do negrito, para a barra não "pular" quando o item ativo muda.
- A altura real da barra é medida e guardada em `--altura-barra`. O espaço extra no fim da página e o `scroll-padding` usam esse valor.
- Item **selecionado**: fundo `--cor-acao`, texto `--cor-sobre-acao`, negrito, `aria-current="page"` (o leitor de tela anuncia "página atual").
- Itens **não selecionados**: sem borda visível (a pílula da barra já mostra a área); a borda transparente aparece no alto contraste do Windows.
- Ícones com `aria-hidden="true"`.
- **Pouca altura disponível** (`max-height: 30rem`, 480 px: zoom alto ou celular deitado): a barra deixa de flutuar e passa a ficar no fim da página, no fluxo normal (variante `pouca-altura:`), e o espaço extra no fim cai para 2rem.

### 9.3 Barras que somem ao rolar (custom hook `useDirecaoRolagem`)

Aplica-se **só a Início e Solução, só abaixo de 768 px**:
- Rolou para baixo mais que uma distância mínima (≈ altura do cabeçalho, 64 px) → cabeçalho e barra deslizam para fora da tela.
- Continuam escondidos quando a rolagem para.
- Rolou para cima mais que 64 px → voltam.
- **Voltam também**: no topo da página, perto do fim da página, e quando qualquer elemento delas recebe foco.
- Esconder **só visualmente** (`transform: translateY`), nunca com `display: none`/`hidden`: elas continuam acessíveis ao leitor de tela.
- Com os efeitos desligados: **sempre visíveis**.
- Em Simulador e Diário, e em telas a partir de 768 px: sempre visíveis.

### 9.4 Índice "Nesta página"

- Início e Solução. `<nav aria-label="Nesta página">` com `<h2>` "Nesta página" visualmente oculto e links em pílulas para os `id` das seções (cada `<h2>` de seção com `id` e `tabIndex={-1}` para receber o foco).
- Fica depois do resumo (Solução) ou da abertura e da faixa de texto (Início). A ordem no HTML não muda com o tamanho da tela.
- **No computador (≥ 1024 px de largura e ≥ 700 px de altura):** gruda embaixo do cabeçalho ao rolar, e a pílula da seção atual fica laranja, com `aria-current="true"` (hook `useSecaoAtual`). Ele mede a própria altura (`--altura-indice`), e as âncoras descontam o cabeçalho e o índice.
- Os títulos com rótulo têm `scroll-margin-top` de 40 px: ao pular para a seção, o rótulo também aparece.
- Pílulas sem sublinhado, como os itens da barra: são controles de navegação, não links no meio do texto.
- Rolagem suave só com os efeitos ligados.

---

## 10. Componentes reutilizáveis

| # | Componente | Onde aparece | Notas de acessibilidade |
| --- | --- | --- | --- |
| 1 | `LinkPular` | Todas as páginas | Primeiro elemento focável; visível só com foco |
| 2 | `Cabecalho` | Todas | `<header>`; link "Pulse" para `/`; botão "Efeitos" |
| 3 | `BarraNavegacao` + `ItemBarra` | Todas | `<nav aria-label="Navegação principal">`; `aria-current="page"` |
| 4 | `Botao` (também como link) | Todo o site | Pílula de 56 px; `aria-disabled` durante salvar e excluir; texto visível contido no nome acessível |
| 5 | `IndiceNestaPagina` | Início, Solução | `<nav aria-label="Nesta página">`; `aria-current="true"` na seção atual |
| 6 | `Cartao` | Perfis, dados, registros, resumo | Borda; heading interno no nível certo |
| 7 | `GrupoOpcoes` | Formulário | `<fieldset>` + `<legend>` + radios; erro ligado ao fieldset |
| 8 | `Campo` (data, área de texto) | Formulário | `<label for>`, dica e erro por `aria-describedby`, `aria-invalid` |
| 9 | `MensagemStatus` (sucesso, erro, aviso) | Diário | Ícone (ou o "certo" desenhado) + texto; `role="status"` (sucesso) ou `role="alert"` (erro); botão "Fechar" (`aria-label="Fechar mensagem"`); pode ter ação extra ("Desfazer"); **não some sozinha** |
| 10 | `DialogoConfirmacao` | Excluir, Descartar respostas | `<dialog>` modal, `aria-labelledby`/`aria-describedby`, foco inicial na opção segura, foco volta ao fechar |
| 11 | `ResumoIndicadores` | Topo do Diário | `<ul>` de 4 itens; números com `tabular-nums` |
| 12 | `EstadoTela` (carregando, vazio, erro) | Diário, Ver e Editar registro | Carregando com `role="status"` e "Parar de carregar" (11.1); erro com `role="alert"` e botão "Tentar de novo" |
| 13 | `CartaoIntegrante` | Solução (Equipe) | Polaroide com `alt="Foto de (nome)"` + nome; item de uma `<ul>` |

Componentes de apoio:

| Componente | Para que serve |
| --- | --- |
| `EspacoIcone` | Desenha o ícone Phosphor pelo nome (seção 13.1) |
| `ErroCampo` | Mensagem de erro com ícone e texto (campo, botão Salvar, diálogo) |
| `LinkVoltar` | "Voltar ao Diário" / "Voltar ao registro", passando pela guarda de saída |
| `LinkInterno` | `<Link>` do Next que passa pela guarda de saída e pela transição (seção 18.9) |
| `TituloPagina` | `<h1 tabIndex={-1}>` + resumo |
| `Secao` | `<section>` com `<h2 id tabIndex={-1}>`, destino do "Nesta página", com as opções `banda`, `duasColunas`, `encaixe` e `larga` |
| `PaginaComIndice` | Estrutura de Início e Solução: título (se houver) → índice → seções |
| `FocoNaTroca` | Leva o foco ao `<h1>` (ou ao título da âncora) na troca de rota |
| `Provedores` | Junta os contextos (transição, guarda de saída e mensagem do Diário) no layout |
| `RegistroNaoEncontrado` | Tela "Registro não encontrado" (Ver e Editar) |
| `TelaDiario`, `TelaNovoRegistro`, `TelaRegistro`, `TelaEditarRegistro` | Telas do Diário: ligam os hooks aos componentes de apresentação |

Notas de implementação:
- `Botao` tem as variantes `principal` (laranja, com o efeito magnético da 19.6), `secundario`, `secundario-sobre-cor` (fundo sólido, para os fundos de status; 19.3), `perigo` (contorno) e `perigo-preenchido`.
- `Cartao` tem as opções `as` (ex.: `as="li"`) e `compacto` (espaço interno de 16 px, usado no resumo em 2 × 2).
- `MensagemStatus` cria a região `role="status"` vazia e coloca o texto logo depois. O leitor de tela só anuncia mudanças dentro de uma região que já existia na página.
- `DialogoConfirmacao` usa `<dialog>` com `showModal()`: o navegador já deixa o fundo inacessível. O Esc é tratado pelo evento `cancel`, e o foco volta ao elemento que abriu o diálogo.

---

## 11. Estados da interface e mensagens

### 11.1 Tempos (limites de Nielsen)

- Abaixo de 1 s: nenhum indicador.
- Entre 1 e 10 s: indicador de carregamento + texto.
- Acima de 10 s: aviso e, quando é seguro, opção de parar. Um hook só, `useEsperaLonga` (10 s, `LIMITE_ESPERA_LONGA`), serve às três esperas. A contagem começa quando a espera começa e recomeça a cada nova espera. Com os efeitos desligados, o indicador não gira.
  - **Carregando** (lista, Ver registro e Editar registro): a região `role="status"` do carregando ganha "Está demorando mais que o normal. Você pode esperar ou parar.". Abaixo dela, fora da região, aparece o botão secundário "Parar de carregar" (sem ícone). Ao tocar, a busca é interrompida pelo `AbortSignal` e entra o estado de erro com o título "Carregamento interrompido." (sem a linha "Verifique a conexão…", porque a conexão não falhou) e o botão "Tentar de novo", que recebe o foco (o botão de parar some).
  - **Salvando… e Excluindo…:** não há botão de parar, porque o servidor pode gravar ou excluir mesmo se a espera for interrompida. O aviso "Está demorando mais que o normal. Aguarde mais um pouco." aparece **na tela**, logo abaixo dos botões, em `--cor-texto-2`, 16 px, sem ícone e sem animação, para quem tem baixa visão. O leitor de tela ouve o aviso **uma vez só**, pela região de status (`sr-only`) que antes anunciava "Salvando" ou "Excluindo": o texto visível tem `aria-hidden="true"`. O foco continua no botão ocupado.

### 11.2 Estados do Diário

| Momento | O que aparece | O que o leitor de tela anuncia |
| --- | --- | --- |
| Carregando a lista (> 1 s) | "Carregando os registros…" + indicador simples (parado com os efeitos desligados) | "Carregando os registros" |
| Carregando há mais de 10 s | Também "Está demorando mais que o normal. Você pode esperar ou parar." + botão secundário "Parar de carregar" | "Está demorando mais que o normal. Você pode esperar ou parar." |
| Carregamento interrompido | "Carregamento interrompido." · botão "Tentar de novo", com o foco | "Carregamento interrompido." (alerta) |
| Lista vazia | **H2 Nenhum deslocamento registrado ainda** · "Registre o primeiro para começar a medir o impacto da Pulse." · botão "Novo registro" | O texto |
| Erro ao carregar | "Não foi possível carregar os registros." · "Verifique a conexão e tente de novo." · botão "Tentar de novo" | O texto do erro (alerta) |
| Salvando | Botão "Salvando…", travado | "Salvando" |
| Salvando ou excluindo há mais de 10 s | Botão "Salvando…" ou "Excluindo…", travado; abaixo dos botões, "Está demorando mais que o normal. Aguarde mais um pouco." (16 px, `--cor-texto-2`, sem ícone); sem botão de parar | "Está demorando mais que o normal. Aguarde mais um pouco." (uma vez só) |
| Salvo | Volta à lista com "Registro salvo." + "Fechar" | "Registro salvo" |
| Erro de preenchimento | Mensagem em cada campo com problema; foco no primeiro | Nome do campo, "inválido" e o erro |
| Erro ao salvar | Mensagem junto ao botão; dados mantidos | O texto do erro |
| Excluído | Volta à lista com "Registro excluído." + "Desfazer" + "Fechar" | "Registro excluído" |
| Restaurado | "Registro restaurado." + "Fechar" | "Registro restaurado" |

- Ver registro e Editar registro usam os mesmos textos de carregando e de erro da lista, no plural.
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

Pontos de quebra do Tailwind: **`md` = 768 px** (tablet) e **`lg` = 1024 px** (computador). As partes da identidade visual (capa, abertura, sinais, galeria, polaroides, 404) estão na seção 18.12.

| Elemento | Celular (< 768 px) | Tablet (≥ 768) | Computador (≥ 1024) |
| --- | --- | --- | --- |
| Barra flutuante | Ícone em cima, texto embaixo; largura pelo texto em 1 linha, 2 × 2 quando não couber | Ícone e texto lado a lado | Igual ao tablet |
| Barras que somem ao rolar | Início e Solução | Não | Não |
| Coluna de texto | Largura total | Até ~40rem | Até ~40rem |
| "Nesta página" | Pílulas paradas | Pílulas paradas | Pílulas presas embaixo do cabeçalho (com altura ≥ 700 px) |
| Cartões repetidos (inclusive os registros do Diário) | 1 por linha | 2 por linha | 2 por linha |
| Resumo do Diário | 2 × 2 (palavras longas podem ser hifenizadas a 320 px) | 4 lado a lado | 4 lado a lado |
| Formulário | 1 coluna | 1 coluna | 1 coluna |

---

## 13. Ícones e imagens

### 13.1 Ícones

- Biblioteca **Phosphor Icons**, peso **Bold** (licença MIT), pelo pacote `@phosphor-icons/react` (versão fixa `2.1.10`). Tamanho mínimo 24 px. Sempre com texto visível ao lado; `aria-hidden="true"`.
- O componente `EspacoIcone` desenha o ícone pelo prop `nome`, com `size={24}`, `weight="bold"` e `aria-hidden="true"`. Ele importa de `@phosphor-icons/react/ssr`, que funciona em Server e Client Components.
- Só os ícones do mapa `ICONES` de `EspacoIcone` entram no site (sem importar a biblioteca inteira). Para usar um ícone novo, importe-o e acrescente-o ao mapa. Um nome fora do mapa volta um espaço vazio, que não ocupa lugar: o texto continua centralizado e o site funciona.
- Os ícones ficam ocultos para o leitor de tela, porque o texto ao lado já diz o mesmo. Assim a leitura fica direta: "Início", e não "Ícone casa, Início".

| Uso | Ícone Phosphor |
| --- | --- |
| Logo / Pulse | `Pulse` |
| Início · Solução · Simulador · Diário (barra) | `House` · `Watch` · `Play` · `Notebook` |
| Novo registro · Editar · Excluir | `Plus` · `PencilSimple` · `Trash` |
| Voltar | `ArrowLeft` |
| Tentar de novo · Desfazer | `ArrowClockwise` · `ArrowCounterClockwise` |
| Fechar | `X` |
| Erro · Aviso | `WarningCircle` · `Warning` |
| Sucesso | Sem ícone: o "certo" é desenhado por código (`CertoDesenhado`) |
| Pausar · Retomar ou Reproduzir | `Pause` · `Play` (dentro do `IconeAlternado`) |
| Girar a pulseira | `ArrowCounterClockwise` · `ArrowClockwise` |
| Ver por dentro (pulseira) | `Eye` |
| Links da abertura · mover a galeria | `ArrowRight`, `ArrowLeft`, `ArrowUp`, `ArrowDown` · `ArrowsOutCardinal` (centralizar) |
| Dica da capa | `ArrowDown` |
| Ver a peça (Tecnologias) | `ArrowsClockwise` |
| Alça do "Antes e depois" | `CaretLeft` · `CaretRight` |
| Som dos vídeos | `SpeakerHigh` · `SpeakerSlash` |
| Polaroide sem foto | `Image` |

### 13.2 Imagens

- **Todo `alt` é preenchido.** Não há imagens de conteúdo decorativas: se uma imagem não comunica nada, ela não entra.
- Regras do texto alternativo (`alt`), para soar como o leitor de tela nativo do celular:
  - **simples, claro e direto**, em uma frase curta;
  - diz o que importa na imagem **para aquele trecho da página**, e o que a foto mostra de verdade;
  - **não começa com "imagem de" ou "figura de"**, porque o leitor de tela já anuncia "imagem";
  - sem repetir textos longos que já estão ao lado;
  - se a imagem tiver informação que não cabe numa frase (um diagrama, por exemplo), essa informação também aparece em texto na página.
- **Sem texto dentro de imagens.** As fotos não mostram a pulseira e usam a bengala toda branca (Lei 14.951/2024).
- As imagens foram escolhidas pela equipe e ficam em `public/imagens/` (WebP). O uso de IA para gerar algumas delas está registrado no `AI.md`.
- **Desempenho:** toda `<img>` tem `loading="lazy"` e `decoding="async"` (nenhuma foto está na primeira tela, e a capa é vídeo). O espaço de cada foto é reservado pela moldura (`aspect-[4/3]` ou `aspect-square`), então nada pula de lugar quando ela chega. Fotos com no máximo 1200 × 900 px (1600 × 1200 só nas 2 de "Quem vive o problema").
- As fotos aparecem como são: o `FotoFiltro` só recorta os cantos arredondados, sem filtro, zoom ou parallax.
- Vídeos: seção 19.13. O logo e a pulseira são código, não imagens (seção 18.13).

| Arquivo (`public/imagens/`) | Onde | `alt` | Legenda visível |
| --- | --- | --- | --- |
| `pessoa-cega-celular.webp` | Início, "Quem vive o problema", cartão Pessoa cega | "Pessoa cega usando o celular com leitor de tela." | — |
| `pessoa-baixa-visao-ampliando.webp` | Início, "Quem vive o problema", cartão Pessoa com baixa visão | "Pessoa com baixa visão ampliando a tela do celular." | — |
| `sinal-continuar.webp` | Solução, "Os sinais" | "Pessoa cega com bengala atravessando a faixa de pedestres." | — |
| `sinal-parar.webp` | Solução, "Os sinais" | "Pessoa parada no meio-fio diante do semáforo fechado." | — |
| `sinal-virar.webp` | Solução, "Os sinais" | "Esquina de calçada com piso tátil indicando a curva." | — |
| `sinal-aguardar.webp` | Solução, "Os sinais" | "Pessoa esperando no ponto de ônibus." | — |
| `galeria-faixa-pedestres.webp` | Galeria | "Faixa de pedestres numa avenida movimentada." | Travessias sem sinal sonoro |
| `galeria-calcada-obstaculo.webp` | Galeria | "Calçada com placas de concreto quebradas e desniveladas." | Calçadas com obstáculos |
| `galeria-semaforo-pedestres.webp` | Galeria | "Semáforo de pedestres com o boneco vermelho aceso." | Semáforos de pedestres |
| `galeria-ponto-onibus.webp` | Galeria | "Pessoa esperando o ônibus no ponto." | Embarque no transporte |
| `galeria-plataforma-metro.webp` | Galeria | "Plataforma do metrô com piso tátil na borda." | Plataformas de metrô e trem |
| `galeria-esquina-rampa.webp` | Galeria | "Esquina em ladeira, com calçada estreita e sem rampa de acesso." | Esquinas e rampas |
| `peca-*.webp` (8) | Verso dos cartões de Tecnologias | "Foto da peça: (nome da tecnologia)." | — |
| `peca-apis.webp` | Verso do cartão das APIs | "Ilustração de um chip com a palavra API, ligado a circuitos." | — |
| `equipe-*.webp` (5) | Solução, Equipe (polaroides) | "Foto de (nome)" | O nome |

---

## 14. Arquitetura de código

- Não há `src/`: as pastas ficam na raiz do repositório, ao lado de `app/` (o alias `@/*` do `jsconfig.json` aponta para essa raiz).
- Arquivos com JSX usam `.jsx`; hooks, serviços e `lib` usam `.js`. Os hooks que trazem um contexto (provedor com JSX) usam `.jsx`.
- Versões: Next.js 16.4.6 (App Router, Turbopack e React Compiler ligados), React 19.3, Tailwind CSS 4.3.3 (loader `@tailwindcss/turbopack`, configuração no próprio CSS, sem `tailwind.config.js`) e ESLint 9 com `eslint-config-next`.
- Navegadores: os que o Next.js 16 suporta, declarados no `browserslist` do `package.json` (Chrome e Edge 111+, Firefox 111+ e Safari 16.4+).

```
docs/
  ESPECIFICACAO_PULSE.md          # este arquivo
  REGISTRO_DESENVOLVIMENTO.md     # o que cada fase entregou e os testes
  PADRAO_MOVIMENTO_PULSE.md       # padrão das animações de interface
AI.md                             # registro do uso de IA (mantido pela equipe)
README.md                         # links, descrição, instalação e execução
.env.example                      # nomes das variáveis de ambiente (seção 20.4)
app/
  layout.jsx                      # fontes, script do <head>, Provedores, LinkPular, Cabecalho, <main>, Rodape, BarraNavegacao, FocoNaTroca
  page.jsx                        # Início
  solucao/page.jsx                # Solução
  simulador/page.jsx              # Simulador (seção 20)
  diario/page.jsx                 # lista (TelaDiario)
  diario/novo/page.jsx            # TelaNovoRegistro
  diario/[id]/page.jsx            # TelaRegistro
  diario/[id]/editar/page.jsx     # TelaEditarRegistro
  not-found.jsx                   # página 404
  api/rotas/route.js              # rotas salvas do Simulador no banco (seção 20.4)
  globals.css                     # tokens, temas, @theme, foco, forced-colors, efeitos desligados
components/
  layout/     # cabeçalho, barra, rodapé, índice, seções, transição, provedores, interruptor "Efeitos"
  ui/         # botões, cartões, campos, mensagens, diálogo, estados, ícones, vídeo, efeitos de texto
  diario/     # telas e partes do Diário
  abertura/   # capa, preloader e abertura do Início
  pulseira/   # pulseira 3D
  solucao/    # partes da Solução
  simulador/  # Simulador (seção 20.3)
hooks/        # estado e lógica (CRUD, formulário, navegação, movimento, 3D, vídeos, Simulador)
services/
  apiClient.js                    # URL base, o único fetch do Diário, tradução de erros
  registrosService.js             # as 5 funções do CRUD
  simuladorService.js             # endereços, rotas a pé, rotas salvas, voz e fala
lib/
  datas.js, rotulos.js, validacao.js        # funções puras do Diário
  movimento.js, presetsMovimento.js, efeitos.js, cortinaDomos.js
  pulseira3d/   # cena, modelo, partes e sinais da pulseira 3D
  simulador/    # dados do Simulador
public/
  imagens/    # fotos (seção 13.2)
  videos/     # vídeos, quadros parados e legendas (seção 19.13)
```

- Hooks fazem a ponte entre serviços e componentes. `useState` e `useEffect` aparecem naturalmente nos hooks e componentes interativos.
- Páginas de conteúdo (Início, Solução) são Server Components; as partes interativas são Client Components (`"use client"`).
- As páginas do Diário são divididas em dois arquivos: o `page.jsx` (servidor) define o título da aba, e a `Tela…` (cliente) tem o conteúdo interativo. Uma página com `"use client"` não pode exportar `metadata`.
- O ESLint do Next 16 (`eslint-plugin-react-hooks` 7) proíbe chamar `setState` diretamente dentro de `useEffect`. Por isso alguns hooks usam `useSyncExternalStore` (`usePrefereMovimentoReduzido`, `useHoje`) ou atualizam o estado só em retornos assíncronos e eventos.

### 14.1 Convenções do código

| Convenção | Regra |
| --- | --- |
| Linguagem | **JavaScript** (`.js` e `.jsx`), componentes funcionais. **Sem TypeScript.** |
| Nomes | Componentes, hooks e variáveis em **português**, como nesta especificação |
| Comentários | Um comentário só fica se disser o porquê de uma escolha, uma regra do projeto (começa com "Regra:" e cita a WCAG ou a seção desta especificação) ou uma armadilha técnica, em até 2 linhas. Não descreve o que o código faz, não lista props nem formatos e não conta histórico (a história fica no Git e no registro) |
| Pacotes | Versões fixas no `package.json`: `lenis` 1.3.27, `gsap` 3.15.0, `@gsap/react` 2.1.2, `motion` 14.6.0, `three` 0.186.1, `@phosphor-icons/react` 2.1.10, `leaflet` 1.9.4 e `@neondatabase/serverless` 1.2.1. Pacote novo só com o motivo explicado à equipe |

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
1. **Trocar ou ajustar a API muda só o serviço.** As telas continuam iguais. Foi o que aconteceu com o MockAPI: nem o serviço precisou mudar.
2. **É um requisito da disciplina:** separar a lógica de negócio, o acesso a dados e a camada visual.
3. **Cada parte fica mais fácil de entender e corrigir.** Se a lista não aparece, o problema está no serviço ou no hook, não espalhado pelas telas.

Movimento e 3D seguem a mesma separação: os componentes só desenham; quem anima são hooks (`usePulseira3D`, `useRolagemFixa`, `useTransicaoPagina`…) e módulos em `lib/`.

---

## 15. Checklist de acessibilidade e critérios de aceite

Antes de considerar uma página pronta:

- [ ] Funciona só com teclado: ordem de foco igual à ordem visual, foco sempre visível e nunca escondido pela barra.
- [ ] "Pular para o conteúdo" funciona e é o primeiro foco.
- [ ] Um `<h1>` por página, títulos em ordem, regiões (`header`, `nav`, `main`, `footer`) presentes.
- [ ] Título da aba único; foco vai para o `<h1>` ao trocar de rota.
- [ ] Testado com leitor de tela (VoiceOver no iPhone ou TalkBack no Android; NVDA no computador): tudo anunciado como descrito nas seções 7, 11, 18.15 e 19.16.
- [ ] 320 px de largura sem rolagem lateral; zoom de 200% e 400% sem perda de conteúdo.
- [ ] Texto ampliado nas configurações do celular sem quebrar o layout.
- [ ] Contraste conferido nos dois temas (seção 19.3).
- [ ] Efeitos desligados: nada se move e as barras ficam visíveis.
- [ ] Alto contraste do Windows: bordas visíveis, item ativo da barra identificável.
- [ ] Alvos de toque ≥ 48 × 48 px.
- [ ] Nenhuma informação só por cor; todo ícone com texto.
- [ ] Toda imagem com `alt` preenchido, simples, claro e direto (seção 13.2).
- [ ] Sem erros no `eslint-plugin-jsx-a11y` e sem violações no axe DevTools / Lighthouse.
- [ ] Sem a API: o Diário mostra o estado de erro de conexão sem quebrar.
- [ ] Com a API: CRUD completo funcionando, incluindo Desfazer e o aviso de descartar respostas.

**Exceções aceitas no `jsx-a11y`** (configuração `strict`): 4 pontos na Galeria em canvas (a janela com `tabIndex`, as fotos focáveis e o teclado na janela e nos botões), porque a seção 19.9 pede exatamente esse comportamento (WCAG 2.1.1 e 2.5.7).

O resultado da revisão automática está na seção 19.17. Os testes que só uma pessoa consegue fazer estão em `docs/REGISTRO_DESENVOLVIMENTO.md`.

---

## 16. Pendências, decisões e riscos aceitos

**Pendências:**
- Nome definitivo da pulseira ("Pulse" é provisório).
- Frase da capa provisória: "Um guia no pulso para atravessar a cidade."

**Decisões da equipe:**
- Todas as perguntas do Diário são obrigatórias, exceto Observações.
- O Diário mostra o aviso de privacidade (7.1).
- Na confirmação de exclusão, o foco começa em "Manter registro".

**Riscos aceitos na avaliação heurística (não corrigir sem decisão da equipe):**
- Termos técnicos da seção Tecnologias sem explicação extra (H2).
- Diário sem filtro (H7), por enquanto.
- Código aceito como está: GSAP, Motion e Lenis carregados em todas as rotas (cerca de 305 KB com gzip); o estilo de botão em pílula repetido em 4 arquivos; o padrão de rolagem e a media query repetidos em 4 hooks.

---

## 18. Identidade visual e movimento

Estilo visual, cores, tipografia, a abertura do Início, a página Solução, a barra, a transição entre páginas, o rodapé, a página 404 e as fotos. Complementada pela seção 19. Rotas, textos, a camada de dados e as regras de acessibilidade da seção 3 continuam valendo. O Diário recebe só as cores, as fontes e as microinterações de feedback (19.11).

### 18.1 Pacotes

| Pacote | Para quê | Como é usado |
| --- | --- | --- |
| `lenis` 1.3.27 | Rolagem suave com a roda do mouse, no computador | Criado e destruído pelo `ProvedorMovimento` só com os efeitos ligados (seção 19.2), com `anchors: true` (links internos e "Pular para o conteúdo" funcionando) e `autoRaf: false`. **Um relógio só:** o do GSAP chama o Lenis a cada quadro e avisa o ScrollTrigger, para as animações ligadas à rolagem nunca ficarem um quadro atrasadas. No toque, a rolagem continua a do aparelho |
| `gsap` 3.15.0 e `@gsap/react` 2.1.2 | Animações ligadas à rolagem (ScrollTrigger) | ScrollTrigger registrado uma vez (`lib/movimento.js`). `useGSAP` limpa as animações ao sair da página. As condições de tela vêm de uma media query lida no React (`useConsultaMidia`), e não de `gsap.matchMedia()`, porque o React também troca o layout |
| `motion` 14.6.0 | Microinterações | Importado de `motion/react`. `MotionConfig` na raiz, ligado ao interruptor (seção 19.2) |
| `three` 0.186.1 | Pulseira 3D | Só em componentes de cliente, carregados com `next/dynamic` e `ssr: false` (seção 19.12) |

### 18.2 Piso de acessibilidade

Substituído pela seção 19.1, que vale para todo o site e mantém a numeração dos itens. Do item 1 antigo, continua valendo: **texturas de domos e palavras gigantes nunca ficam atrás de texto** (só o granulado pode, seção 19.1).

### 18.4 Tipografia

| Família | Papel | Tamanho | Regras |
| --- | --- | --- | --- |
| **Anton** (`--fonte-titulo`, reserva `Impact, "Arial Narrow", sans-serif`) | H1, H2, nomes dos sinais, palavras de fundo, números grandes, nome "Pulse" | H1 `clamp(2.6rem, 14vw, 5.6rem)`; H1 da abertura do Início `clamp(2.1rem, 9vw, 3.6rem)`; H2 `clamp(2rem, 9vw, 3.2rem)`; título do diálogo 2rem; nome do sinal `clamp(2.2rem, 10vw, 3.5rem)`; números dos cartões de dados 3,25rem e do resumo do Diário 2,5rem; altura de linha 1 | Só títulos curtos. Maiúsculas **só por CSS** (`text-transform: uppercase`); no código o texto fica normal, para o leitor de tela não soletrar |
| **Atkinson Hyperlegible Next** (`--fonte-base`, reserva Verdana), pesos 400 e 700 | Texto corrido, botões, links, H3, H4 e formulário | Texto 1,125rem (18 px), altura de linha 1,55; H3 1,25rem negrito; nunca menor que 16 px | Todo texto longo |
| **JetBrains Mono** (`--fonte-mono`, reserva `ui-monospace, "Courier New"`), peso 700 | Rótulos curtos: "MODO TÁTIL", "FONTE: G1, 2019", contagens | `rotulo-mono`: 0,875rem (14 px), letras espaçadas (0,14em), maiúsculas por CSS; as abas de "Os sinais" usam 0,9rem | Única exceção à regra dos 16 px: por isso são curtos e nunca carregam sozinhos uma informação |

- **Por que o termo do meio do `clamp` é tão inclinado:** com valores de `vw` menores, o título crescia só 1,14× com zoom de 200% (WCAG 1.4.4, falha F94). Assim ele chega ao tamanho máximo já em 640 px e dobra com o zoom. Os números grandes ficam em `rem` pelo mesmo motivo.
- Títulos com `text-wrap: balance`, `hyphens: manual` e `overflow-wrap: break-word`: a palavra só quebra quando não cabe sozinha na linha (texto ampliado a 200% a 320 px) e, diferente do `anywhere` do corpo, não encolhe para caber ao lado de outra. Em tamanho normal, nenhum título quebra no meio da palavra.
- Continua valendo o teste de espaçamento de texto (WCAG 1.4.12).

### 18.5 Linguagem visual

- **Textura de piso tátil** (`textura-piso`): grade de domos de 30 px, feita em CSS com camadas de brilho, domo e sombra (`--cor-ponto`, `--cor-ponto-brilho`, `--cor-ponto-sombra`). Fica só atrás do objeto central (pulseira) e se apaga em direção às bordas, onde fica o texto; nas cabeças de página, numa faixa à direita, só no computador.
- **Palavras gigantes de fundo** (`PalavraFundo`) em Anton, `--cor-palavra-fundo`, na frente da textura e atrás do objeto principal, com `aria-hidden="true"`. Tamanho `min(21rem, 150vw ÷ número de letras)`; na 404, só na largura da coluna da pulseira (`cqw`). Nenhum texto laranja passa por cima delas.
- **Um objeto central por tela:** a pulseira 3D na abertura, a foto da situação em "Os sinais".
- **Rótulos mono** acima dos títulos (eyebrow), com a linha laranja que se desenha (seção 19.6). O Diário fica sem rótulo.
- **Botões:** principal laranja em pílula, 56 px de altura; no hover, sombra e, com os efeitos ligados, subida de 2 px, sem trocar a cor (em CSS: é uma mudança simples de estado). Secundário com contorno de 2 px em `--cor-marca`.
- **Cantos:** seção 8.3.
- **O Diário fica calmo:** sem textura, sem palavra de fundo, sem cenas e sem cortina entre as páginas internas dele.
- **Alto contraste do Windows:** textura, palavra de fundo, divisor das bandas e granulado são desligados, para não virarem ruído.

### 18.6 Início

Ordem: preloader e capa (primeira visita da sessão) → abertura com a pulseira → faixa de texto → "Nesta página" → Tema CitizenTech (banda) → frase que acende → O problema → Quem vive o problema (banda) → Um trajeto com a Pulse → "Conheça a solução". Os textos estão na seção 6.1; os efeitos, na 19.6 e na 19.7.

**Preloader e capa de introdução (`Preloader` e `CapaIntro`)**
- Aparecem só na **primeira visita de cada sessão** e só com os efeitos ligados (`sessionStorage`, chave `pulse-capa-vista`, com `try/catch`; se o armazenamento falhar, a capa aparece). São criados **só no navegador**, depois da hidratação: sem JavaScript, não existem.
- **Sem a página piscar antes da capa:** o script do `<head>` cria uma camada sólida, que some quando a capa monta ou em no máximo 2 s.
- O preloader conta de 0 a 100 em 1,4 s ("Pulse · carregando") e revela a capa (seção 19.6).
- Conteúdo da capa: rótulo mono "GS 2026.2 · CitizenTech" numa faixa sólida, "PULSE" gigante, a frase provisória **"Um guia no pulso para atravessar a cidade."** sobre uma faixa sólida e a dica "Toque, role ou aperte uma tecla" (com seta). Atrás, o vídeo da capa com um véu (seção 19.13).
- A capa inteira tem `aria-hidden="true"` e nenhum elemento focável. Sai com clique, rolagem, toque arrastado, qualquer tecla ou foco. O primeiro Tab (no "Pular para o conteúdo") já abre o site.
- Saída em **piso tátil**: a capa se desfaz nos domos em 1 segundo. Ao sair, os títulos e os links da abertura aparecem com o gesto GUIA, e a pulseira entra.
- Capa e preloader são desenhados no `<body>` (portal), para ficarem na frente do cabeçalho mesmo com o rodapé revelado (seção 19.6).

**Abertura com a pulseira (`AberturaPulseira`)**
- Rótulo mono "Pulseira de navegação", H1 "Inovação que chega a quem precisa" e o resumo.
- `Pulseira3D` no centro, no modo `abertura` (seção 19.12), com os botões de giro e "Pausar o giro".
- Embaixo dela: o nome do sinal atual em mono e a descrição curta (ambos `aria-hidden`, porque mudam sozinhos).
- Atrás, a palavra gigante acompanha o sinal: **Esquerda, Direita, Aguardar, Parar, Continuar** (troca com esmaecimento de 0,35 s; com os efeitos desligados, fica "Pulse").
- **Sem a cena pronta** (carregando, sem JavaScript, sem WebGL) ou com os efeitos desligados: legenda parada "Sinais da Pulse" / "Veja cada sinal explicado na página Solução." e nenhum botão de pausa, porque nada se move e um botão sem efeito confundiria.
- Navegação **"Partes da solução"** (`<nav>` com `<h2>` visualmente oculto), com uma lista de 6 links para a Solução (o leitor anuncia "lista, 6 links" em qualquer tela):

| Link | Destino | Descrição | Parte da pulseira que acende |
| --- | --- | --- | --- |
| Como funciona | `/solucao#como-funciona` | Aperte o botão e diga o destino. | Botão do destino |
| Os sinais | `/solucao#os-sinais` | Cada comando tem uma vibração própria. | Zona de vibração esquerda |
| Transporte público | `/solucao#transporte-publico` | Avisa a hora de embarcar no veículo certo. | Fecho, embaixo da tira |
| Dois modos | `/solucao#dois-modos` | Sonoro e tátil, ou só tátil. | Botão de modo |
| Semáforos | `/solucao#semaforos` | Dados reais para saber quando atravessar. | Zona de vibração direita |
| Tecnologias | `/solucao#tecnologias` | GPS, ESP32, motores e atuadores. | Atuador de pressão |

- **No computador (≥ 1000 px):** 3 links de cada lado, posicionados com `subgrid` (a ordem no HTML não muda). Linhas tracejadas em SVG (`aria-hidden`) ligam cada link à parte da pulseira, recalculadas a cada quadro a partir da posição 3D projetada na tela (hook `useLinhasPartes`, direto no SVG, sem passar pelo estado do React). Ao passar o mouse ou focar um link, a linha engrossa e a parte acende.
- **No celular:** a pulseira em cima e os links em lista de cartões abaixo (2 colunas a partir de 640 px), sem linhas.

**Seções seguintes:** cabeça de seção com rótulo mono e H2 em Anton. Em "O problema", a citação tem borda laranja à esquerda, e os dados aparecem em cartões com o número grande em Anton (`--cor-destaque`, com a contagem da 19.6) e a fonte em mono.

### 18.8 Solução

Ordem: A pulseira (banda) → Os sinais → Como funciona (seção fixa) → Antes e depois (banda) → Tecnologias → Galeria → Quem participa → Como ampliar o impacto → O diferencial → Equipe (banda) → "Experimente o simulador". Os ODS ficam no rodapé desta página (seção 18.10). Os textos estão na seção 6.2.

- Âncoras para os links da abertura: `id="como-funciona"`, `id="os-sinais"` e `id="tecnologias"` (H2), e nos H3 de "Como funciona": `id="dois-modos"`, `id="semaforos"` e `id="transporte-publico"`. Todos com `tabIndex={-1}` para receber o foco.
- "A pulseira": os 3 passos são cartões com o número grande em Anton (o número é `aria-hidden`; a lista `<ol>` já diz a ordem).
- "Como funciona": seção fixa no computador, com o fundo de vídeo que troca (seções 19.6 e 19.13).
- Tecnologias: cartões que viram (19.8). Galeria: canvas (19.9). Equipe: varal de polaroides (19.10). Antes e depois: 19.7.

**Os sinais, em rolagem fixa (`SinaisRolagemFixa`)**
- Rótulo "Linguagem da Pulse", H2 "Os sinais" e o texto "Cada comando tem um sinal próprio. Role a página para passar de um sinal para o outro."
- No HTML: navegação "Sinais" (`<nav aria-label="Sinais">` com `<ol>` de 4 links para `#sinal-continuar`, `#sinal-parar`, `#sinal-virar` e `#sinal-aguardar`; o do Virar diz só "Virar"), o vídeo do sinal (seção 19.13) e 4 `<article>`, cada um com a foto, o H3 do sinal ("Virar à esquerda ou à direita" no Virar) e os pares em `<dl>` ("Modo tátil:", "Modo sonoro:" ou "Nos dois modos:"). A lista de definições faz o leitor de tela entender o modo e a explicação como um par.
- **Modo fixo** (só com os efeitos ligados, a altura da janela ≥ 700 px e a largura ≥ 340 px, lido por `useConsultaMidia`): o trilho tem `4 × 85svh + 100svh` de altura e o palco fica `position: sticky`, abaixo do cabeçalho e do índice. O progresso da rolagem (lido com ScrollTrigger, **sem `pin`**) escolhe o sinal ativo. O link ativo recebe `aria-current="step"`, com borda de 3 px e ponto em `--cor-acao` e o texto em `--cor-texto`. Clicar num link rola até o meio do trecho daquele sinal.
- Troca da foto com **piso tátil** (máscara de domos de 26 px, 0,7 s; propriedade `--d` registrada com `@property`). O texto esmaece e sobe 12 px.
- Computador (≥ 1000 px): índice à esquerda (15rem), com o vídeo do sinal atual embaixo dele; foto e texto lado a lado (1,5 : 1). Celular: índice como faixa no topo, o vídeo com 8rem ao lado dos botões, depois a foto e o texto.
- **Fora do modo fixo:** os 4 artigos aparecem em lista comum, um embaixo do outro, cada um com a sua foto (4:3, para aparecer inteira) e o seu vídeo.
- Os artigos inativos ficam transparentes, mas o leitor de tela lê os 4 em ordem. Eles não têm nada focável.

### 18.9 Navegação, transição e rolagem

- **Barra em pílula:** seção 9.2.
- **Um fluxo único de navegação:** todo link interno (`LinkInterno`, barra, logo, Voltar, Cancelar) passa primeiro pela **guarda de saída** (há respostas não salvas? → diálogo "Descartar as respostas?") e só depois pela **transição**. Assim nunca há cortina com o diálogo aberto.
- **Transição entre páginas (`TransicaoPagina`, provedor no layout):** uma cortina de domos em `--cor-cortina`, desenhada em `<canvas>` (`lib/cortinaDomos.js`), cobre a tela numa varredura diagonal em 0,42 s; a página troca (`router.push`), e a cortina sai na mesma ordem em 0,42 s. A camada tem `aria-hidden` e `pointer-events: none`, e o foco continua indo para o H1 (`FocoNaTroca`).
  - **Não anima:** com os efeitos desligados ou no alto contraste do Windows (a máscara de domos não funciona bem nesse modo); entre as páginas internas do Diário (só ao entrar e ao sair dele); quando o destino é a mesma página.
  - Pelos botões Voltar e Avançar do navegador, só a saída anima (com `useLayoutEffect`, para a página nova não "piscar").
  - **Trava de 3 s:** se a página nova não chegar, a cortina some mesmo assim.
- **Rolagem suave (Lenis):** só no computador e com os efeitos ligados. "Pular para o conteúdo", "Nesta página" e os links da abertura continuam funcionando, com o desconto da altura do cabeçalho e do índice. Sem `scroll-behavior: smooth` com o Lenis ativo, para as duas suavizações não se somarem. As barras que somem ao rolar (9.3) continuam iguais.
- **Mouse:** a pulseira, os polaroides e o botão magnético só reagem ao mouse em `@media (hover: hover) and (pointer: fine)` e com os efeitos ligados. O cursor nunca é trocado (quem tem baixa visão costuma aumentá-lo).

### 18.10 Rodapé

O rodapé é escuro nos dois temas (cores na seção 19.3) e existe em todas as páginas.

**Em todas as páginas:** links Início, Solução, Simulador e Diário (48 px de altura), numa lista simples (um segundo `<nav>` precisaria de um nome que a especificação não define), e a linha "Pulse · Global Solution 2026.2 · FIAP · Giovana, Giovane, Mie, Pedro e Thiago. Protótipo acadêmico com dados públicos e simulados." Também o "PULSE" gigante e o rodapé revelado (seção 19.6). O espaço do fim da página fica dentro do rodapé, para o fundo escuro ir até o fim da tela.

**Só na Solução: faixa contínua dos ODS (`FaixaODS`)**, acima dos links:
- Rótulo mono "Objetivos de Desenvolvimento Sustentável", H2 "A Pulse e os ODS" e o botão **"Pausar"/"Retomar"** (ícone e texto, `aria-pressed`, `aria-controls` apontando para a faixa).
- Uma faixa que **anda sem parar** para a esquerda (animação CSS de cerca de 48 s, linear e infinita). Uma cópia da lista, com `aria-hidden="true"` e botões com `tabIndex={-1}`, fecha o laço.
- Na faixa, cada ODS é um **botão curto em pílula**: número em Anton (`aria-hidden`, sem encolher nem quebrar de linha) + "ODS 10 · Redução das Desigualdades" + a etiqueta **"Principal"** (só no ODS 10), depois "ODS 9 · Indústria, Inovação e Infraestrutura" e "ODS 11 · Cidades e Comunidades Sustentáveis".
- **A frase completa de cada ODS** (seção 6.2) aparece **ao passar o mouse, focar ou tocar**, numa **área fixa logo abaixo da faixa**, que não cobre nada (WCAG 1.4.13). O clique também mostra a frase, porque o Safari do iPhone não foca botões no toque. Sem interação, a área mostra "Passe o mouse, foque ou toque num ODS para ver o que ele significa." A área tem `aria-hidden="true"`; para o leitor de tela, cada botão leva a frase pelo `aria-describedby`, apontando para parágrafos `hidden` (lida com o botão, mas não de novo ao percorrer a página).
- **A faixa para** com o mouse em cima, pelo botão "Pausar" (WCAG 2.2.2) ou com o foco dentro: nesse caso ela volta ao começo e rola até o botão focado aparecer inteiro (nada invisível recebe foco).
- **Com os efeitos desligados (e sem JavaScript):** sem animação e sem o botão de pausa; os 3 botões aparecem parados, um embaixo do outro, e a área da frase continua funcionando.
- Ordem no Tab: "Pausar" → os 3 botões de ODS → links do rodapé.

### 18.11 Página 404 (`app/not-found.jsx`)

- Aba: `Página não encontrada — Pulse`, em português (WCAG 3.1.2). Textura de piso tátil e "PARAR" gigante ao fundo (`aria-hidden`), só na coluna da pulseira, para nenhum texto ficar sobre eles.
- Rótulo mono "Erro 404", H1 **"Você saiu da rota"**, texto **"Esta página não existe ou mudou de endereço."**, botões **"Voltar ao Início"** (principal) e **"Ir para a Solução"** (secundário).
- `Pulseira3D modo="parar"` ao lado (embaixo no celular; lado a lado a partir de 900 px), com a legenda visual "A pulseira faz o sinal de parar." (`aria-hidden`). A animação dura menos de 5 s e para (seção 19.12). Sem WebGL, a reserva também é decorativa: o texto da página já explica a situação.

### 18.12 Responsividade da identidade visual

| Elemento | Celular | Tablet (≥ 768 px) | Computador (≥ 1024 px) |
| --- | --- | --- | --- |
| Capa | Vídeo vertical (pela orientação da tela) | Vídeo horizontal | Vídeo horizontal |
| Abertura do Início | Pulseira em cima, links em cartões (2 colunas a partir de 640 px) | Igual | Pulseira no centro, 3 links de cada lado com linhas (a partir de 1000 px) |
| "O problema" e "Como funciona" | Lista | Lista | Seção fixa (≥ 64rem e altura ≥ 600 px) |
| "Os sinais" | Modo fixo só com altura ≥ 700 px: índice em faixa e vídeo de 8rem; senão, lista | Igual | Índice lateral de 15rem com o vídeo; foto e texto lado a lado |
| Tecnologias | 1 coluna | 2 colunas (≥ 40rem) | 4 colunas (≥ 64rem) |
| Galeria | Grade | Grade | Canvas para arrastar (≥ 64rem e altura ≥ 600 px) |
| Polaroides | 2 por linha | 3 + 2 (≥ 640 px) | 5 lado a lado (≥ 1100 px) |
| Faixa dos ODS (Solução) | Anda na horizontal; com os efeitos desligados, botões um embaixo do outro | Igual | Igual |
| 404 | Texto, depois a pulseira | Igual | Texto e pulseira lado a lado (≥ 900 px) |
| Pouca altura (≤ 480 px) ou zoom alto | Seções fixas, encaixe, modo fixo dos sinais e canvas viram listas e grades; barra no fim da página | Igual | Igual |

### 18.13 Logo e pulseira são código

O logo, a pulseira 3D e a pulseira do Simulador são desenhados por código, não são imagens. As imagens do site estão na tabela da seção 13.2.

### 18.14 Componentes e hooks da identidade visual

| Componente | Pasta | Função |
| --- | --- | --- |
| `CapaIntro` | `components/abertura/` | Capa da primeira visita e saída em piso tátil |
| `AberturaPulseira` | `components/abertura/` | Abertura do Início: H1, pulseira, sinal atual, palavra de fundo e links |
| `PartesSolucao` | `components/abertura/` | Os 6 links e as linhas em SVG |
| `Pulseira3D` e `CenaPulseira` | `components/pulseira/` | Cena 3D (a cena só no cliente, com `ssr: false`) e a descrição em texto |
| `PalavraFundo` | `components/ui/` | Palavra gigante decorativa |
| `SinaisRolagemFixa` | `components/solucao/` | Seção "Os sinais" |
| `CartaoIntegrante` | `components/solucao/` | Polaroide da Equipe |
| `FaixaODS` | `components/solucao/` | Faixa contínua dos ODS com a área da frase (só no rodapé da Solução) |
| `TransicaoPagina` | `components/layout/` | Provedor da transição entre páginas |
| `Rodape` | `components/layout/` | Links e créditos em todas as páginas |
| `ProvedorMovimento` | `components/layout/` | Estado dos efeitos, Lenis e `MotionConfig` |
| `LinkInterno` | `components/ui/` | Link que passa pela guarda de saída e pela transição |

A textura de piso tátil é o utilitário CSS `textura-piso`, e não um componente.

| Hook | Função |
| --- | --- |
| `useCapaIntro` | Primeira visita da sessão, preloader, eventos de saída, estado "saindo" |
| `usePulseira3D` | Montagem da cena, sinais, pausa, visibilidade, limpeza |
| `useLinhasPartes` | Linhas da abertura, a cada quadro |
| `useSecaoAtual` | Seção atual do "Nesta página" |
| `useRolagemFixa` | Progresso da rolagem → sinal ativo; liga e desliga o modo fixo |
| `useConsultaMidia` | Diz se uma condição de tela vale agora |
| `useFaixaODS` | Pausa (botão, mouse e foco) e o ODS em destaque na área da frase |
| `useTransicaoPagina` | Animação de entrada e saída da cortina |

Módulos: `lib/movimento.js` (ScrollTrigger e o relógio do Lenis) e `lib/pulseira3d/` (seção 19.12).

### 18.15 Leitor de tela na identidade visual

- **Capa e preloader:** ignorados (`aria-hidden`), sem nada focável.
- **Início:** Pular → Pulse → "Efeitos" → H1 → resumo → pulseira (descrição) → botões de giro → "Partes da solução, lista, 6 links" → Nesta página → seções. A palavra de fundo e o nome do sinal animado não são lidos.
- **Os sinais:** navegação "Sinais" com 4 links (o atual com `aria-current="step"`, lido como "etapa atual") → o vídeo do sinal → cada sinal: foto com `alt`, H3, pares "Modo tátil:"… Os 4 são lidos em ordem.
- **Faixa dos ODS (Solução):** "A Pulse e os ODS" → "Pausar" → 3 botões, cada um lido com o nome do ODS e a frase completa (`aria-describedby`). A cópia da animação não é lida nem recebe foco.
- **Troca de página:** a cortina não é lida; o leitor anuncia o novo H1.
- **404:** "Erro 404" → H1 "Você saiu da rota" → texto → dois botões.

O restante (vídeos, galeria, cartões, "Antes e depois") está na seção 19.16.

---

## 19. Efeitos, paleta laranja e grafite, pulseira 3D e vídeos

Complementa a seção 18 com:
- um interruptor "Efeitos" que controla todo o movimento do site;
- a paleta laranja e grafite e as fontes carregadas por pacote;
- o polimento do layout, os efeitos e as interações;
- Tecnologias em cartões que viram, a Galeria em canvas e a Equipe num varal;
- a pulseira 3D (com luzes e giro de 360°) e os vídeos.

Rotas, a camada de dados, o Diário (que só ganha microinterações de feedback), a ordem de leitura e as regras da seção 3 continuam valendo.

**Padrão obrigatório:** `docs/PADRAO_MOVIMENTO_PULSE.md` vale para todas as animações de interface: molas do Motion, gestos da marca, presets em `lib/presetsMovimento.js` e coreografia.

### 19.1 Piso de acessibilidade

O site continua o mais acessível possível com os efeitos:

1. **Granulado em todo o site, inclusive atrás do texto.** Onde houver granulado, o contraste mínimo do texto é de 4,5:1 (WCAG 1.4.3). No texto corrido, a meta de 7:1 continua. Títulos, links e botões em laranja ficam no mínimo em AA (19.3). Texturas de domos e palavras gigantes continuam fora de trás do texto (18.2).
2. **Com os efeitos desligados (19.2), nada se move:**
   - as cenas 3D mostram um quadro parado e os vídeos, o quadro parado;
   - as seções fixas, o encaixe e o canvas viram listas e grades comuns;
   - a capa e o preloader não aparecem, e a troca de página é instantânea.
3. O que se move sozinho por mais de 5 segundos tem botão de pausa visível (WCAG 2.2.2). Nada pisca mais de 3 vezes por segundo (WCAG 2.3.1).
4. Nenhum conteúdo depende de animação ou de JavaScript para aparecer. O texto vem do servidor; os efeitos só enfeitam o que já está na página.
5. Nada invisível recebe foco. Elementos fora da tela ou transparentes não podem ser alcançados pelo Tab.
6. O cursor do sistema nunca é substituído. Nenhuma ação depende só do mouse ou de um gesto: arrastar sempre tem alternativa em botões e teclas (WCAG 2.5.7).
7. Decorações ficam com `aria-hidden="true"`: granulado, textura, palavras de fundo, faixa de texto, "PULSE" do rodapé, linhas, barra de progresso e vídeos de fundo.
8. Ícone sempre com texto visível.
9. Desempenho:
   - no máximo uma cena 3D visível por vez;
   - vídeos só tocam quando estão na tela;
   - densidade de pixels limitada a 1,75;
   - tudo liberado da memória ao sair da página;
   - se o WebGL falhar, aparece a descrição em texto.
10. **Som:** nada toca som sozinho. Os vídeos começam mudos, com o botão "Ativar som" (WCAG 1.4.2), e os sons que informam algo têm legenda (WCAG 1.2.2).

### 19.2 Preferência de movimento única e o interruptor "Efeitos"

Todo o movimento do site obedece a uma preferência só, controlada pelo interruptor.

**Estado e memória**
- Contexto no `ProvedorMovimento` com `efeitosLigados` e `alternarEfeitos()`, lido pelo hook `useEfeitos()`. O estado fica em `lib/efeitos.js`.
- **Valor inicial:**
  1. a escolha salva no `localStorage`, chave `pulse-efeitos` (`"ligados"` ou `"desligados"`), com `try/catch`;
  2. sem escolha salva, desligado quando o aparelho pede "reduzir movimento" e ligado nos outros casos.
- **Sem piscar na carga:** o script do `<head>` (o mesmo da camada da capa) grava `data-efeitos="ligados"` ou `"desligados"` na tag `<html>` antes da pintura. O CSS, o texto do botão e o trilho já nascem certos, e o React lê o mesmo atributo.
- **No servidor e sem JavaScript, conta como desligado:** sem o atributo, as regras de efeitos desligados valem (`:root:not([data-efeitos="ligados"])`). Assim nada (Lenis, GSAP, 3D) começa antes de o React ler o valor real, e a faixa dos ODS fica parada quando o botão de pausa não funcionaria.
- **Mudança do aparelho:** se a pessoa nunca mexeu no interruptor e liga "reduzir movimento" no aparelho com o site aberto, o estado acompanha. Com escolha salva, o aparelho não manda mais.

**Onde o estado é aplicado**
- **CSS:** variantes do Tailwind `efeitos-ligados:` e `efeitos-desligados:`, criadas com `@custom-variant` a partir de `[data-efeitos]`, e regras com `[data-efeitos="desligados"]`.
- **JavaScript:** só o `ProvedorMovimento` consulta o aparelho (pelo `usePrefereMovimentoReduzido`, para o valor inicial e a mudança do aparelho) e o script do `<head>`. O resto do site usa `useEfeitos()`.
- **Motion:** `MotionConfig reducedMotion={efeitosLigados ? "never" : "always"}`, com `transition={spring.padrao}` (PADRAO_MOVIMENTO_PULSE, item 4).
- **Lenis:** com os efeitos desligados, ele nem é criado; ao religar, é criado de novo. O `stop()` não serve: ele põe `overflow: clip` no `<html>` e cancela a roda do mouse, e a página deixaria de rolar. O Lenis também não fica em volta das páginas: ligar e desligar remontaria o site, e um formulário do Diário perderia o que foi digitado.
- **GSAP e ScrollTrigger:** os efeitos ligados à rolagem só são criados com os efeitos ligados. O `useGSAP` depende de `efeitosLigados` e desfaz tudo ao desligar.
- **Pulseira 3D, vídeos e faixas contínuas:** param e mostram o quadro parado (19.12 e 19.13).
- **Barras que somem ao rolar (9.3):** sempre visíveis com os efeitos desligados.
- **Capa:** com os efeitos desligados, conta como vista, para não aparecer de repente se a pessoa ligar os efeitos no meio da visita.

**O botão (`InterruptorEfeitos`)**
- Fica no cabeçalho, à direita do rótulo "GS 2026.2 · CitizenTech".
- É um `<button type="button" aria-pressed>`, com o texto visível "Efeitos: ligados" ou "Efeitos: desligados" e um trilho decorativo (`aria-hidden`).
- Tem 48 px de altura, contorno de 2 px em `--cor-borda` e o trilho preenchido em `--cor-acao` quando ligado.
- O nome acessível é o próprio texto, e o `aria-pressed` diz o estado. Não precisa de anúncio extra.
- Ligar ou desligar vale na hora para a página inteira, sem recarregar.

**Por quê:** muita gente não conhece a configuração do aparelho, e quem é atrapalhado pelo movimento precisa desligá-lo logo na chegada (WCAG 2.2.2, heurística H3).

### 19.3 Cores: paleta laranja e grafite

Paleta da equipe: laranja principal `#FC4C02`, laranja secundário `#FC5200`, laranja escuro `#CC4200`, branco `#FFFFFF` e grafite `#242428`. Os tons derivados existem só para garantir contraste: cinzas `#4E4E57`, `#6E6E78`, `#9A9AA4` e `#C9C9CF`, faixa clara `#FAFAFA` e grafite mais escuro `#1A1A1D`. Os temas seguem o aparelho.

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
| `--cor-aviso` / `--cor-aviso-fundo` | Aviso | `#5A3E00` / `#FFF4CC` | `#FFE7A3` / `#242428` |

**Decoração e 3D** (sem texto em cima, exceto o granulado):

| Token | Claro | Escuro | Uso |
| --- | --- | --- | --- |
| `--cor-ponto` / `--cor-ponto-brilho` / `--cor-ponto-sombra` | `rgba(36,36,40,.07)` / `rgba(255,255,255,.9)` / `rgba(36,36,40,.10)` | `rgba(255,255,255,.05)` / `rgba(255,255,255,.08)` / `rgba(0,0,0,.35)` | Domos da textura, com relevo |
| `--cor-palavra-fundo` | `rgba(36,36,40,.06)` | `rgba(255,255,255,.05)` | Palavras gigantes de fundo |
| `--grao-opacidade` | `.06` (grão branco) | `.25` (grão preto) | Granulado, atrás do conteúdo |
| `--cor-faixa-3d` | `#FC4C02` | `#FC4C02` | Tira da pulseira 3D |
| `--cor-cortina` | `#242428` | `#242428` | Transição entre páginas, preloader e caixa dos vídeos |

**Rodapé** (escuro nos dois temas): fundo `#242428` no claro e `#141416` no escuro, texto `#FFFFFF` (15,5:1 e 18,4:1), texto secundário `#C9C9CF`, destaque e foco `#FC4C02` (5,4:1 no `#141416`), bordas `#9A9AA4` e botões dos ODS em `#1A1A1D` (claro) e `#242428` (escuro).

**Regras**
- Branco sobre laranja tem só 3,4:1. Só pode em texto grande (24 px, ou 18,7 px em negrito).
- O laranja escuro sobre o grafite (3,2:1) nunca é usado como texto.
- Os dois laranjas principais são praticamente iguais (1,03:1) e nunca diferenciam estados.
- O vermelho de erro fica separado do laranja e sempre vem com ícone e texto.
- A meta de 7:1 vale para o texto corrido. Títulos, links e botões em laranja ficam no mínimo em AA (4,5:1). Os títulos em Anton são texto grande, mas usam o mesmo laranja.
- **Granulado atrás do conteúdo:** cartões, botões e campos o cobrem, e a cor dele segue o tema (branco no claro, preto no escuro). Assim ele nunca baixa o contraste: no escuro, só escurece o fundo (a marca na faixa sobe para 5,05:1). Um grão cinza por cima de tudo baixaria 3 pares para menos de 4,5:1.
- **Hover:** botões secundários e itens da barra ganham fundo laranja a 12% (`color-mix`), com o texto em grafite: o laranja sobre esse fundo ficaria em 4,0:1.
- **Botões sobre os fundos de status** (mensagens e estados do Diário) usam a variante `secundario-sobre-cor`, com fundo sólido `--cor-superficie` (4,8:1): com fundo transparente, o laranja ficava em 4,2–4,3:1 no tema claro.
- **Faixa de texto do Início:** fundo `--cor-marca` e letras `--cor-fundo` (4,8:1 no claro; 5,1:1 no escuro).

### 19.4 Fontes por pacote

As fontes são carregadas com **`next/font/google`**, que já vem com o Next. Ele baixa as fontes no build e as serve pelo próprio site (sem chamar o Google quando a página abre), pré-carrega as fontes e ajusta a fonte de reserva para o texto não "pular".

```js
// app/layout.jsx
import { Anton, Atkinson_Hyperlegible_Next, JetBrains_Mono } from "next/font/google";
const anton = Anton({ weight: "400", subsets: ["latin", "latin-ext"], display: "swap", variable: "--fonte-anton" });
const atkinson = Atkinson_Hyperlegible_Next({ weight: ["400", "700"], subsets: ["latin", "latin-ext"], display: "swap", variable: "--fonte-atkinson" });
const mono = JetBrains_Mono({ weight: "700", subsets: ["latin", "latin-ext"], display: "swap", variable: "--fonte-jetbrains" });
// <html lang="pt-BR" className={`${anton.variable} ${atkinson.variable} ${mono.variable}`}>
```

- `--fonte-titulo`, `--fonte-base` e `--fonte-mono` apontam para essas variáveis, com as reservas da 18.4. `"latin-ext"` cobre todos os acentos, e `"swap"` nunca deixa o texto invisível.
- A JetBrains Mono carrega só o peso 700, o único usado (no `rotulo-mono` e nos números do mapa do trajeto).
- **Aviso conhecido no build:** "Failed to find font override values for font Atkinson Hyperlegible Next". O Next 16.4 não tem as medidas dessa família para criar a reserva ajustada; a reserva continua a Verdana. Não é erro.
- O Simulador usa uma quarta fonte, a DM Sans, só na página dele (seção 20.5).

### 19.5 Linguagem visual e polimento

Ajustes pelos 4 pilares do design (contraste, repetição, alinhamento e proximidade):

| Ajuste | Como |
| --- | --- |
| Seções alternadas | `--cor-faixa` nas seções "banda", de ponta a ponta da tela, com 72 px de espaço interno e um divisor de piso tátil direcional (barras de 6 px de altura) no topo (`aria-hidden`). Bandas: Tema e Quem vive o problema (Início); A pulseira, Antes e depois e Equipe (Solução) |
| Textura com relevo | Domos com brilho e sombra (`--cor-ponto-brilho` e `--cor-ponto-sombra`) |
| Títulos | H2 menor que o H1 e regras de quebra na seção 18.4 |
| Duas colunas | Tema, no computador (≥ 64rem): rótulo e H2 à esquerda e texto à direita, começando na altura do título. A ordem no HTML não muda |
| Palavra de fundo | Na frente da textura (`z-index`), nunca atrás dela |
| Barra de navegação | Texto centralizado em cada item, com o ícone ao lado; itens não selecionados sem borda visível (seção 9.2) |
| Botões | Texto centralizado vertical e horizontalmente |
| Diário | Espaçamentos entre o título, o aviso, o resumo e a lista em múltiplos de 8 px (32 e 48 px entre blocos; 8, 16 e 24 px dentro deles) |

### 19.6 Efeitos

Todos ficam parados ou somem com os efeitos desligados (19.2).

| Efeito | Onde | Como funciona | Acessibilidade |
| --- | --- | --- | --- |
| Rolagem suave | Computador | Lenis com um pouco de inércia (`lerp` 0,09) | No toque, a rolagem continua a do aparelho |
| Preloader | Antes da capa, na primeira visita | Fundo `#1A1A1D`, contagem de 0 a 100 em Anton laranja e "Pulse · carregando" em mono, em 1,4 s; some (0,35 s) e revela a capa | `aria-hidden`; qualquer tecla, gesto ou foco o pula na hora, para o foco nunca ficar atrás dele; usa a mesma camada de espera da capa (no máximo 2 s) |
| Granulado | Site todo | Ruído SVG (`feTurbulence`) atrás do conteúdo, em duas camadas: a da página (no `<main>`, `z-index: -1`) e a de cada banda (que tem fundo opaco). Move-se só por `transform`, em 6 passos por segundo, e é só 12% maior que a tela (mais seria pesado para o celular) | Parado com os efeitos desligados; some no alto contraste do Windows; nunca baixa o contraste (19.3) |
| Transição entre páginas | Seção 18.9 | Cortina de domos em `<canvas>`, numa varredura diagonal (um raio por domo, o que uma máscara de CSS não faz) | Nada pisca; o leitor anuncia o novo H1 |
| Barra de progresso da leitura | Embaixo do cabeçalho | Linha de 3 px em `--cor-acao` que cresce da esquerda (`scaleX`) com a rolagem | `aria-hidden`; escondida com os efeitos desligados (parada em 0, ela nem apareceria) |
| Rolagem com encaixe | Início: abertura, Tema e Quem vive (`data-encaixe`) | Encaixe do tipo "proximidade": 160 ms depois de a roda do mouse parar, se uma dessas seções estiver a menos de 30% da altura da tela, a página assenta nela | Nunca obrigatório; só a partir de 64rem e 600 px de altura; só depois da roda do mouse, nunca com o teclado ou com o foco num campo |
| Seções fixas | "O problema" (Início) e "Como funciona" (Solução) | O título fica fixo de um lado e o conteúdo rola do outro, só no computador (≥ 64rem e altura ≥ 600 px). Usa `position: sticky` do CSS; o GSAP só lê o progresso, para não desalinhar as âncoras e o Lenis | A ordem do HTML continua a de leitura; com zoom alto, vira lista comum |
| Texto que se constrói | Texto de Tema, O problema e Quem vive | O bloco entra com o gesto GUIA quando chega à tela | O texto está no HTML desde o início; com o foco, aparece na hora |
| Contagem dos números | Cartões de dados de "O problema" | De 0 até o valor em 1,2 s, ao entrar na tela | O número animado tem `aria-hidden`, e um texto oculto lê o valor real ("Cerca de 90%", "7,9 milhões") |
| Faixa de texto | Entre a abertura e o "Nesta página" | "Pulse · um guia no pulso" em Anton, andando sem parar e acelerando um pouco com a rolagem; só anda na tela | `aria-hidden`; a pausa dela é o botão "Efeitos" (WCAG 2.2.2) |
| Linha antes do rótulo | Cabeças de seção (`RotuloSecao`) | Uma linha laranja de 24 × 3 px se desenha (`scaleX` com `spring.padrao`) antes do rótulo mono quando a seção chega, só na primeira vez. Nasce desenhada no servidor e sem JavaScript | Decorativa |
| Botão magnético | Botões laranja principais (dentro do `Botao`) | O conteúdo do botão segue o mouse até 8 px; a área de clique fica parada | Só com `pointer: fine` |
| Rodapé revelado | Todas as páginas, quando o rodapé tem menos de 80% da altura da tela | O conteúdo sobe e revela o rodapé fixo por baixo, com "PULSE" gigante em laranja | "PULSE" com `aria-hidden`; sem o efeito, o rodapé é normal |

### 19.7 Interações

| Interação | Onde | Como funciona | Acessibilidade |
| --- | --- | --- | --- |
| Frase que acende | Início, entre Tema e O problema | Seção `aria-label="Frase de abertura"` com "Atravessar a rua não deveria depender de **adivinhar.**" (Atkinson negrito, grande). Cada palavra vai de `--cor-apagada` para `--cor-texto` conforme a rolagem; "adivinhar." acende em `--cor-destaque` | O texto inteiro está no HTML; o leitor lê a frase de uma vez; com os efeitos desligados, já aparece acesa |
| Um trajeto com a Pulse | Início, depois de "Quem vive o problema"; está no "Nesta página" | Rótulo "No caminho", H2 "Um trajeto com a Pulse". O mapa SVG (`aria-hidden`) desenha a rota com a rolagem (`stroke-dashoffset`), e o ponto passa pelas paradas. A lista `<ol>` das 5 paradas (Saída, Esquina, Semáforo fechado, Ponto de ônibus e Destino) acende a parada atual. Depois, o botão "Conheça a solução" | A lista é o conteúdo real; o mapa é decorativo; com os efeitos desligados, a rota já aparece inteira |
| Antes e depois | Solução, depois de "Como funciona"; está no "Nesta página" | Rótulo "A diferença", H2 "Antes e depois" e a instrução "Arraste a barra, ou use as setas do teclado, para comparar a mesma travessia sem e com a Pulse.". Os dois vídeos gêmeos ficam sobrepostos numa moldura 16:9 (em todos os tamanhos, igual aos vídeos), e um `<input type="range">` de verdade move a divisória (`clip-path`): mouse, dedo, setas e leitor de tela funcionam sem código de arrasto. Um botão "Pausar"/"Reproduzir" para o par. Os textos "Sem a Pulse" e "Com a Pulse" (H3) vêm logo abaixo | O controle tem `aria-label="Comparar sem a Pulse e com a Pulse"`, `aria-valuetext` em palavras e `aria-describedby` nos textos; setas, `Home` e `End`; os vídeos ficam `aria-hidden` (o texto diz o mesmo) |

### 19.8 Tecnologias em cartões que viram

- Rótulo "Por dentro", H2 "Tecnologias" e o texto "O que faz a Pulse funcionar. Vire um cartão para ver a peça."
- Grade de 8 cartões, sem rolagem lateral: 1 coluna no celular, 2 a partir de 40rem e 4 a partir de 64rem.
- **Frente:** rótulo mono, H3 e descrição (textos da 6.2).
- **Verso:** a foto da peça (seção 13.2).
- Botão no pé do cartão, com ícone e o texto fixo **"Ver a peça"**, e `aria-pressed="true"` enquanto o cartão está virado. O cartão gira 180° (`rotateY` com `backface-visibility: hidden`) com a mola `spring.suave` (0,42 s).
- As duas faces ficam na mesma célula da grade: o cartão tem a altura da face mais alta e cresce com o texto ampliado.
- O verso escondido tem `inert`, para não receber foco nem ser lido. Ao virar, o foco continua no botão.
- Com os efeitos desligados, a troca é instantânea (giro de duração 0).

### 19.9 Galeria em canvas

- **No computador** (≥ 64rem, altura ≥ 600 px e efeitos ligados), as 6 fotos ficam espalhadas num plano maior que a janela (2400 × 1500 px), que se arrasta em qualquer direção (`pointer events`, com inércia na mola do padrão de movimento; `touch-action: pan-y` no toque).
- **Alternativas ao arrasto:**
  - a janela é uma `region` com `aria-label="Galeria para explorar"`, `tabindex="0"` e a instrução visível "Arraste a área para explorar as fotos. Pelo teclado, entre na área com Tab e use as setas.";
  - as setas movem o plano;
  - os botões "Esquerda", "Cima", "Baixo", "Direita" e "Centralizar", com ícone e texto (WCAG 2.5.7), também movem o plano;
  - as fotos são focáveis só no modo canvas. O Tab e o Shift+Tab entre elas usam `focus({ preventScroll: true })`, e a mola leva a foto ao meio. Sem isso, a página pulava ao focar.
- **No celular, com zoom alto ou com os efeitos desligados:** grade comum de fotos, sem os botões.
- Cada foto é uma `<figure>` em 4:3 com o `alt` e a legenda da tabela da 13.2.
- O `jsx-a11y` (configuração `strict`) acusa 4 pontos por esse comportamento; eles estão aceitos na seção 15.

### 19.10 Equipe num varal

- Os 5 polaroides ficam pendurados num varal: uma linha fina com uma leve curva (`aria-hidden`) e um prendedor laranja em cada foto.
- Polaroides com cores fixas nos dois temas, como uma foto de verdade, e inclinações fixas: −3°, 2°, −1,5°, 3° e −2°.
- **Nomes:** só o primeiro nome (Giovana, Giovane, Mie, Pedro e Thiago), sem a linha de função.
- **Com o mouse:**
  - a foto se endireita e sobe 6 px com a mola, sem acompanhar o mouse;
  - o nome ganha um traço laranja que se desenha (`background-size`).
- O balanço é leve e só com o mouse. Nada depende dele.
- **Layout:** 2 por linha no celular, 3 + 2 no tablet e 5 lado a lado no computador. Nenhum polaroide pode sair da tela.
- `alt` "Foto de (nome)".

### 19.11 Diário: microinterações de feedback

O Diário continua sem textura, palavra de fundo e cenas, mas ganha feedback nas ações (PADRAO_MOVIMENTO_PULSE):

- **Salvar:** o site vai direto para o Diário. Lá, a mensagem "Registro salvo." chega com um "certo" que se desenha (`CertoDesenhado`, `pathLength` de 0 a 1), e o cartão do registro salvo ou alterado dá uma batida dupla curta (o gesto PULSO). O "certo" fica na mensagem, e não no botão, para o anúncio não esperar nenhuma animação.
- **Excluir e Desfazer:**
  - a exclusão acontece na página do registro; "Registro excluído." também traz o "certo";
  - com "Desfazer", o cartão volta com o PULSO, e os outros se ajeitam sem salto (a lista usa `AnimatePresence mode="popLayout"`);
  - as mensagens de status continuam numa região que nunca sai da tela.
- **Erro de preenchimento:** tremor horizontal curto em cada campo com erro (±4 px, 0,3 s, componente `Tremor`), sempre junto da mensagem em texto. Cada nova tentativa treme de novo; o campo já respondido não treme.
- **Pausar ↔ Retomar** (em todo o site): o ícone troca com uma rotação curta (`IconeAlternado`).
- **Limites:**
  - tudo em menos de 1 s, sem repetir;
  - nada atrasa o anúncio ao leitor de tela;
  - com os efeitos desligados, só a troca de opacidade.

### 19.12 Pulseira 3D

**O modelo é um módulo único** (`lib/pulseira3d/modelo.js`), usado pelo site e pelos vídeos. O que os hooks leem sem desenhar (a vista de cada parte e as letras do Braille) fica em `lib/pulseira3d/partes.js`, que não importa `three`: assim o Three.js (cerca de 223 KB) só carrega quando a cena aparece (`next/dynamic`). A montagem da cena fica em `lib/pulseira3d/cena.js`, e os sinais em `lib/pulseira3d/sinais.js`.

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
  - o botão "Pausar o giro" / "Girar sozinha" (texto fixo, `aria-pressed`; só o ícone troca) para também a passagem dos sinais e o Braille (WCAG 2.2.2);
  - ela também gira arrastando, pelas setas do teclado (a caixa recebe foco) e pelos botões "Girar para a esquerda" e "Girar para a direita";
  - os 6 links e as linhas da 18.6 ficam ligados às partes do modelo.
- `"explorar"` (Solução, "A pulseira"; componente `ExplorarPulseira`):
  - o palco é `role="group"` com `aria-roledescription="modelo 3D"` e `aria-label="Pulseira Pulse em 3D. Use as setas do teclado para girar."`;
  - controles "Girar para a esquerda", "Girar para a direita", "Ver por dentro", "Vista da frente" e "Pausar o giro";
  - listas "Partes da pulseira" (8 botões) e "Os sinais no pulso" (5 botões), com `aria-pressed` e a explicação numa área `aria-live="polite"`. A pulseira gira até a parte e a acende.
- `"parar"` (404): vibra por no máximo 4,6 s e para (WCAG 2.2.2). O limite conta o tempo real do relógio do navegador, e não o tempo da animação, que anda mais devagar num aparelho lento. Os anéis do "Parar" saem a cada 0,35 s (no máximo 3 por segundo, WCAG 2.3.1), e os últimos até 3,7 s. `aria-hidden`.

**Descrição em texto** (reserva e `aria-describedby`): começa com "Pulseira Pulse: tira esportiva laranja de silicone, com fecho embaixo do pulso…".

**Regras**
- Carregar com `next/dynamic` e `ssr: false` (`CenaPulseira`), mostrando a descrição em texto enquanto carrega, sem JavaScript e se o WebGL falhar. O código pede o WebGL2 antes de chamar o Three.js, então, sem WebGL, aparece a descrição sem erro no console.
- O `<canvas>` é criado pelo hook, não no JSX: no modo de desenvolvimento, o React monta, desmonta e monta de novo, e um canvas com o WebGL já liberado não pode ser reaproveitado.
- O nome acessível da cena só entra quando o primeiro quadro está pronto. Antes disso, quem descreve é o texto de reserva, então o leitor nunca lê a descrição duas vezes.
- A cena é compilada sem travar a página (`compileAsync`), com o visual completo.
- Anima só quando visível (`IntersectionObserver`); densidade de pixels até 1,75; liberação de geometrias, materiais e do renderizador ao desmontar (`dispose` e `forceContextLoss`).
- Com os efeitos desligados: quadro parado na vista da frente, sem giro automático; os botões de girar continuam funcionando, sem animação.

### 19.13 Vídeos

Os vídeos (MP4, 1280 × 720) ficam em `public/videos/`, cada um com o quadro parado (`…-quadro-parado.jpg`) e, nos que têm som, as legendas (`…-legendas.vtt`). Os caminhos saem do nome do vídeo (`caminhosDoVideo`).

**Componente `VideoPulse` (e o hook `useVideoPulse`)**
- `<video playsinline muted loop preload="none" poster="…-quadro-parado.jpg">`. O `preload="none"` evita baixar cerca de 0,9 MB de metadados ao abrir a Solução; o quadro parado aparece até o vídeo tocar.
- Toca só com os efeitos ligados e o vídeo na tela (`IntersectionObserver`); fora da tela, pausa. Pausado pela pessoa, continua parado ao voltar à tela.
- **Botões logo abaixo do vídeo** (por cima, com zoom de 400%, cobririam o vídeo inteiro): "Pausar" / "Reproduzir", com ícone e o texto da ação, **sem** `aria-pressed` (como nos tocadores de vídeo; com `aria-pressed`, o leitor diria "Reproduzir, pressionado" com o vídeo parado), sempre visível (WCAG 2.2.2).
- **Vídeos com som:**
  - têm também o botão "Ativar som" / "Desativar som", do mesmo jeito;
  - o som só liga por esse botão (WCAG 1.4.2);
  - `<track kind="captions" srclang="pt-BR" label="Português">` com o `.vtt`, sem `default`: as legendas aparecem quando o som está ligado e também podem ser ligadas pelo controle do navegador.
- **Efeitos desligados:** mostra o quadro parado e o botão "Reproduzir". Se a pessoa apertar, o vídeo toca uma vez (sem `loop`) e o botão volta a "Reproduzir". Ao desligar com um vídeo andando, ele para e volta ao quadro parado (`load()`).
- **Texto equivalente:** o texto da seção diz o mesmo que o vídeo (WCAG 1.2.1).
  - Vídeos de conteúdo: nome pelo título que já existe (`aria-labelledby`) e `aria-describedby` apontando para esse texto.
  - Vídeos de fundo: `aria-hidden`, sem foco e sem botões; quem os pausa é o botão "Efeitos".
- **Se o vídeo falhar:** a caixa mostra o quadro parado do vídeo e, se ele também falhar, o texto "Vídeo indisponível." (componente `ReservaVideo`, com `aria-hidden`, porque o texto da seção já descreve o vídeo), sem os botões. O vídeo de fundo some. O hook também confere `video.error`, porque o arquivo pode falhar antes de o React assumir a página.
- **Memória:** ao sair da página, cada vídeo pausa, perde o `src` e é recarregado vazio, o que libera o decodificador. No modo de desenvolvimento, o `src` volta pelo `data-src`.

| Vídeo (arquivos em `public/videos/`) | Onde | Som | Tipo |
| --- | --- | --- | --- |
| `animacao-capa.mp4` / `animacao-capa-vertical.mp4` | Capa (computador / celular) | não | Fundo, loop contínuo |
| `animacao-o-problema.mp4` | Início, "O problema" | sim | Conteúdo |
| `animacao-a-pulseira.mp4` | Solução, "A pulseira", antes dos 3 passos | sim | Conteúdo |
| `animacao-dois-botoes.mp4` | Solução, "Apenas dois botões" | sim | Conteúdo |
| `animacao-vibracoes.mp4`, `animacao-semaforos.mp4`, `animacao-dois-modos.mp4`, `animacao-transporte.mp4` | Solução, "Como funciona" | não | Fundo, com véu sólido atrás do texto |
| `animacao-antes-sem.mp4` + `animacao-antes-com.mp4` | Solução, "Antes e depois" | não | Par gêmeo: tocam e pausam juntos, com o mesmo `currentTime` (diferença de até 0,15 s) |
| `animacao-sinal-continuar.mp4`, `-parar`, `-virar`, `-aguardar` | Solução, "Os sinais", um por sinal | sim | Conteúdo |

- **Como funciona:** os 4 itens usam o quadro parado do vídeo correspondente como miniatura. No computador, o fundo da seção troca com o mouse, o foco ou a rolagem, em 0,4 s, e só o vídeo do item ativo toca. No celular, com zoom alto ou com os efeitos desligados, fica a lista com as miniaturas.
- **Os sinais:** o vídeo do sinal fica junto do índice, no lugar de uma pulseira 3D pequena (uma cena 3D a menos na página). No modo fixo, um vídeo só troca de arquivo quando o sinal muda, mantendo a pausa e o som escolhidos. Na lista comum, cada sinal mostra o seu vídeo.
- **Capa:**
  - escolhe o vídeo horizontal ou o vertical pela orientação da tela, só no navegador;
  - um véu grafite `#1A1A1D` a 60% cobre o vídeo, e o rótulo "GS 2026.2 · CitizenTech" fica numa faixa sólida. Sem isso, "PULSE" caía a 2,5:1 e o rótulo laranja a 1,0:1; com o véu, "PULSE" fica com 7,8:1 ou mais, e o rótulo, na faixa, com 5,1:1;
  - com os efeitos desligados, não há capa.

### 19.15 Componentes e hooks dos efeitos

| Componente | Pasta | Função |
| --- | --- | --- |
| `InterruptorEfeitos` | `components/layout/` | Botão "Efeitos" do cabeçalho |
| `BarraProgresso` | `components/layout/` | Progresso da leitura |
| `RotuloSecao` | `components/layout/` | Rótulo mono com a linha que se desenha |
| `Granulado` | `components/ui/` | Camada de ruído |
| `FaixaTexto` | `components/ui/` | Faixa contínua "Pulse · um guia no pulso" |
| `NumeroContado` | `components/ui/` | Número que conta até o valor |
| `TextoConstroi` | `components/ui/` | Bloco que entra com o gesto GUIA |
| `BotaoMagnetico` | `components/ui/` | Botão principal com o efeito magnético |
| `VideoPulse` (com `ControlesVideo` e `ReservaVideo`) | `components/ui/` | Vídeo com pausa, som, legendas, quadro parado e reserva |
| `FotoFiltro` | `components/ui/` | Recorta os cantos da foto |
| `IconeAlternado` | `components/ui/` | Troca de ícone com rotação |
| `CertoDesenhado` | `components/ui/` | O "certo" das mensagens de sucesso |
| `Tremor` | `components/ui/` | Gesto de erro nos campos |
| `Preloader` | `components/abertura/` | Contagem antes da capa |
| `FraseAcende` | `components/abertura/` | Frase que acende palavra por palavra |
| `TrajetoPulse` | `components/abertura/` | Mapa e paradas do trajeto |
| `AntesDepois` | `components/solucao/` | Comparação com os vídeos gêmeos |
| `ComoFuncionaFundo` | `components/solucao/` | Lista com o fundo de vídeo que troca |
| `CartaoTecnologia` | `components/solucao/` | Cartão que vira |
| `GaleriaCanvas` | `components/solucao/` | Galeria de arrastar |
| `ExplorarPulseira` | `components/pulseira/` | Palco, controles, partes e sinais (modo `explorar`) |

| Hook | Função |
| --- | --- |
| `useEfeitos` | Lê e muda a preferência de movimento única (19.2) |
| `useRolagemSuave` | Devolve o Lenis do site, ou `null` com os efeitos desligados |
| `useEncaixe` | Rolagem com encaixe por proximidade |
| `useProgressoLeitura` | Fração lida da página |
| `useLinhaRotulo` | Linha antes do rótulo |
| `useFaixaTexto` | Andamento da faixa de texto |
| `useTextoConstroi` | Entrada do texto que se constrói |
| `useRodapeRevelado` | Rodapé revelado |
| `useFraseAcende` | Palavra acesa conforme a rolagem |
| `useTrajeto` | Desenho da rota e a parada atual |
| `useContagem` | Contagem de 0 até o valor |
| `useMagnetico` | Deslocamento do conteúdo do botão |
| `useVideoPulse` | Visibilidade, pausa, som, falha e sincronia dos vídeos gêmeos |
| `useComoFuncionaFundo` | Item ativo e fundo de "Como funciona" |
| `useGaleriaCanvas` | Posição do plano, arrasto, teclado e foco |
| `useGiroPulseira` | Giro automático, arrasto, teclado, partes e sinais |

Módulos: `lib/presetsMovimento.js` (molas, saída, cascata, pulso, guia e tremor, do PADRAO_MOVIMENTO_PULSE), `lib/efeitos.js` (o estado do interruptor), `lib/cortinaDomos.js` (a cortina em `<canvas>`) e `lib/pulseira3d/modelo.js` e `partes.js` (19.12).

### 19.16 Leitor de tela nos efeitos e nas interações

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

### 19.17 Critérios de aceite

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

**Resultado da revisão automática:**
- ESLint do projeto: 0 erros. `jsx-a11y` completo (configuração `strict`, 33 regras): só as 4 exceções da Galeria (seção 15).
- axe-core 4.14 (WCAG 2.2 A/AA): 0 violações em 24 páginas-estado (6 rotas × 2 temas × efeitos ligados e desligados) e no Diário com as mensagens de sucesso na tela.
- Efeitos desligados, nas 6 rotas e nos 2 temas: nenhuma animação, nenhum quadro 3D novo em 1 s e nenhum vídeo tocando.
- Teclado (Início, Solução e Diário): primeiro foco no "Pular para o conteúdo"; cada foco visível, com contorno e fora do cabeçalho e da barra; a Solução alcança a pulseira, os 8 cartões, o "Antes e depois", os vídeos e a Galeria.
- 320 px, zoom de 400% e texto em 200%: sem rolagem lateral nas 6 rotas; com zoom de 400%, sem seções fixas e sem canvas.
- Alvos de toque com 48 × 48 px ou mais; imagens com `alt`; nenhum botão só com ícone; alto contraste (simulado) e sem WebGL aprovados; nenhum pedido ao Google Fonts.

Os testes que só uma pessoa faz (leitor de tela, aparelho real, alto contraste real, desempenho no celular) estão em `docs/REGISTRO_DESENVOLVIMENTO.md`, subfase 9.10.

---

## 20. Repositório, deploy e Simulador

### 20.1 Repositório, estrutura e deploy

| Item | Valor |
| --- | --- |
| Repositório | **`giovanaborba/GSCitizen-1ESPU`** (privado) |
| Onde fica o projeto | **Raiz do repositório**, com `docs/`, `AI.md`, `README.md` e `INTEGRANTES.txt` ao lado de `app/` |
| Deploy | **`gscitizentech.vercel.app`** |
| ZIP da entrega | Gerado pelo GitHub (**Code → Download ZIP**), com a pasta `GSCitizen-1ESPU-main` |

- **README:** traz o link do repositório, o deploy, a descrição do projeto (Simulador, Vitrine e Diário de Deslocamentos), os pré-requisitos (VS Code, Node.js 20.9 ou mais novo, Git para clonar) e a instalação e execução pelo ZIP e pelo clone (`npm ci`, `.env.local`, `npm run dev`, `npm run build` e `npm start`).
- **`.gitignore`:** ignora `node_modules/`, `.next/`, `dist/`, `.vercel/`, `.env` e `.env.*` (menos o `.env.example`). A pasta `.next/` (resultado do build) não vai para o Git nem para o ZIP: fica velha e pode levar dentro o endereço da API, porque as variáveis `NEXT_PUBLIC_` entram no código no build.
- O repositório tem um `.env.example` com os nomes das variáveis (20.4).

### 20.2 O que o Simulador faz

O Simulador fica em `/simulador`, abaixo do H1 "Simulador" e do resumo da 6.3, numa região única (`role="region"`) cujo nome acompanha a tela atual (por exemplo, "Simulador da pulseira: rota no mapa"). A cada troca de tela, o foco volta para essa região.

| Tela | O que mostra |
| --- | --- |
| **Tela inicial** | A pulseira desenhada em CSS, com o botão de voz, o botão de modo, a janela Braille e o alto-falante, e duas notas: como **salvar uma rota** pela voz ("salvar rota", depois início, destino e nome; para usar, "destino [nome]") e como **ir a um destino** dizendo o endereço. Botões **"Rotas salvas"**, **"Conheça como cada comando é feito"** e **"Testar simulação pronta"** |
| **Rota no mapa** | Mapa do Leaflet com a rota a pé, a pulseira na horizontal com o sinal atual em texto (por exemplo, "VIBRAÇÃO À ESQUERDA", "SOM AGUDO CONTÍNUO", "PRESSÃO") e os botões **CONTINUAR, PARAR, ESQUERDA e DIREITA**. No semáforo, aparece o aviso "FECHA EM … SEGUNDOS". Botão **"ÔNIBUS E TREM"** e **"VOLTAR"** |
| **Ônibus e trem** | Lista "Chegando Agora" com 4 partidas simuladas (ônibus 875A e 477P, metrô Linha 2 Verde e trem Linha 9 Esmeralda). A pulseira mostra os minutos em Braille e fala a linha e o tempo. Botões **"MAPA"** e **"VOLTAR"** |
| **Rotas salvas** | Lista das rotas, com editar e excluir. A "Rota 1" de exemplo (Alameda Santos → FIAP Paulista, Av. Paulista, 1106) não pode ser editada nem excluída |
| **Vitrine (comandos da pulseira)** | 7 cartões: 5 táteis (Continue, Pare, Vire à esquerda, Vire à direita e Aguarde) e 2 sonoros (Continue e Pare). Cada um tem a pulseira animada e a explicação em texto; os sonoros têm o botão **"Som"** (`aria-pressed`), e o som só toca por ele |

- **Modos:** "Sonoro e tátil" e "Exclusivamente tátil" (o padrão), escolhidos no menu da pulseira e guardados no `localStorage`.
- **Simulação pronta:** carrega a rota de exemplo e anda sozinha pelo mapa até o próximo passo (curva, semáforo ou chegada), sem precisar de voz nem de localização.
- **Sinais:** cada sinal aparece na tela e num texto lido pelo leitor de tela (`role="status"`). No modo sonoro, o "continuar" é um som grave e curto, e o semáforo fechado é um som agudo e contínuo, que só começa depois de a pessoa iniciar o trajeto. **O celular não vibra:** a vibração é mostrada na tela e no texto.
- **Voz e fala:** o reconhecimento de voz e a fala usam as APIs do navegador, em português (`pt-BR`). A voz só funciona no Chrome e no Edge; nos outros navegadores, ficam a simulação pronta e as rotas salvas.
- **Localização:** a origem vem da localização do aparelho. Se o navegador bloquear, o Simulador usa um ponto de reserva na Av. Paulista. Os endereços são só de São Paulo.

### 20.3 Como foi feito

| Parte | Arquivos |
| --- | --- |
| Página | `app/simulador/page.jsx`: `TituloPagina` e o componente `Simulador` |
| Componentes | `components/simulador/`: `Simulador`, `TelaInicial`, `TelaRota`, `TelaTransporte`, `RotasSalvas`, `Vitrine`, `Pulseira` e `MapaRota` (8), mais `simulador.css` e `fonte.js` |
| Hooks | `useNavegacaoSimulador` (telas, voz, rota, passos, semáforo, transporte e simulação pronta) e `usePulseiraSimulador.js`, que exporta `usePulseiraSimulador` (modo, menu e som de "continuar") e `useSomSemaforo` |
| Dados | `lib/simulador/dados.js`: modos, rota de exemplo, partidas, origem de reserva e o Braille dos números de 0 a 6 |
| Serviço | `services/simuladorService.js`: busca de endereço, rota a pé, rotas salvas, voz e fala |
| API interna | `app/api/rotas/route.js`: rotas salvas no banco (20.4) |
| Pacotes | `leaflet` 1.9.4 (mapa) e `@neondatabase/serverless` 1.2.1 (banco) |

- **Mapa:** o `MapaRota` usa o Leaflet com `next/dynamic` e `ssr: false`, porque o Leaflet só funciona no navegador. Enquanto carrega, aparece "Carregando mapa…" (`role="status"`). Os mapas são do OpenStreetMap, com o crédito "© OpenStreetMap".
- **Serviços externos, sem chave:** Nominatim, do OpenStreetMap (busca de endereço), e `routing.openstreetmap.de` (rota a pé). O Simulador precisa de internet.
- **Contagem do site inteiro:** 72 componentes, 3 serviços, 12 módulos em `lib/` e 39 arquivos de hooks (40 hooks, porque `usePulseiraSimulador.js` exporta dois).

### 20.4 Variáveis de ambiente e rotas salvas

| Variável | Para quê | Sem ela |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Endereço do MockAPI do Diário (7.6) | O site funciona, e o Diário mostra o erro de conexão |
| `DATABASE_URL` (ou `POSTGRES_URL` ou `NEON_DATABASE_URL`) | Banco Neon (Postgres) das rotas salvas do Simulador | No `npm run dev`, as rotas ficam no `localStorage` do navegador. Na versão de produção (`npm run build` e `npm start`, e no deploy), listar, salvar, editar e excluir rotas **dá erro** |

- A rota `app/api/rotas` cria a tabela `rotas_salvas` se ela não existir e coloca a rota de exemplo para cada pessoa.
- **Sem login:** cada navegador recebe um identificador aleatório, guardado no `localStorage` e enviado no cabeçalho `x-pulseira-usuario`. As rotas de um navegador não aparecem em outro, e nenhum dado pessoal é pedido.
- O endereço do banco dá acesso total a ele. **Nunca** vai para o README, para o repositório nem para uma variável `NEXT_PUBLIC_`. Na Vercel, ele é configurado só no painel do projeto.

### 20.5 Visual do Simulador

O Simulador tem visual próprio, separado dos tokens do site (seções 18 e 19):
- `simulador.css`, com cerca de 400 regras, todas dentro de `.simulador`;
- a fonte **DM Sans**, carregada por `next/font/google` (servida pelo próprio site) e só na página do Simulador;
- **vermelho** (`#ff4859` e tons próximos) como cor dos sinais e das luzes, sobre grafite (`#1d1f22` e `#46484c`).

O cabeçalho, a barra, o rodapé, o H1 e o resumo da página continuam com a identidade do site.
