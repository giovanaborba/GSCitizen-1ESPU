# Pulse — Registro do desenvolvimento

> Resumo de cada fase do desenvolvimento da aplicação web da Pulse (Global Solution 2026.2, CitizenTech, FIAP): o que foi feito, as decisões técnicas em linguagem simples, como testar e o que ficou pendente.
>
> - As regras completas estão em `docs/ESPECIFICACAO_PULSE.md`. A seção 17 dela reúne todas as decisões desta lista.
> - O registro do uso de IA é mantido pela equipe em `AI.md`.
>
> Última atualização: 11/11/2026.

---

## Visão geral

| Fase | Entrega | Commit |
| --- | --- | --- |
| 0 | Leitura da especificação, reconhecimento do projeto e plano | — (sem código) |
| 1 | Estilos globais: cores, tipografia, foco, alto contraste, movimento reduzido | `8106c78` |
| 2 | Layout comum: cabeçalho, rodapé, barra flutuante, foco ao trocar de página | `a6bc102` |
| 3 | Páginas Início, Solução (com Equipe) e Simulador | `4873e18` |
| 4 | Camada de dados do Diário, preparada para a API (sem mock) | `3cfdb27` |
| 5 | Diário completo: lista, formulário, ver, editar, excluir, desfazer | `a303670` |
| 6 | Responsividade para tablet e computador | `37175ba` |
| 7 | Revisão de acessibilidade e correções | `f13241a` |
| 8 | Nova identidade e movimento (seção 18 da especificação) — **em andamento**: 8.0 a 8.6 feitas | — |

**Em números:** 7 rotas · 33 componentes (o mínimo é 8) · 12 custom hooks (o mínimo é 2) · 2 serviços · 3 arquivos de funções puras.

**Como a aplicação é organizada:**

```
Tela (componente)  →  hook (estado)  →  serviço  →  apiClient  →  fetch → API externa
TelaDiario            useRegistros       registrosService.listar()    (único fetch do site)
```

Os componentes de apresentação só recebem dados e funções por props. Quando a API chegar, só a pasta `services/` precisa de ajuste.

---

## Fase 0 — Leitura e reconhecimento

**O que foi feito:** leitura da especificação inteira e exame do projeto existente, sem escrever código.

**O que encontramos no projeto:**
- Next.js 16.4.6 (App Router), com **Turbopack** e **React Compiler** ligados;
- React 19.3;
- Tailwind CSS 4.3.3, configurado no próprio CSS e sem `tailwind.config.js`;
- ESLint 9.

**Diferenças com a especificação e o que a equipe decidiu:**

| Diferença | Decisão |
| --- | --- |
| Não havia `src/` nem as pastas `components/`, `hooks/`, `services/`, `lib/` | Criar as pastas na raiz, ao lado de `app/` |
| `layout.js` e `page.js` em vez de `.jsx` | Renomear para `.jsx` |
| Projeto ainda com o código de exemplo do Next (fontes Geist, `lang="en"`) | Limpar o código e manter `public/` |
| A especificação pede "mudança leve de fundo" no hover, mas não define cores | Usar só cores que já estão na paleta |
| Não existe `prompts.md`, só `AI.md` | Não mexer em nenhum dos dois |

---

## Fase 1 — Estilos globais

**Arquivos:** `app/globals.css` e `app/layout.jsx`.

**O que foi feito:**
- todas as cores dos dois temas como variáveis CSS, que trocam sozinhas no modo escuro do aparelho;
- a ligação das cores com o Tailwind, para usar classes como `bg-fundo` e `text-texto`;
- a escala de tipografia, os cantos, as sombras e o contorno de foco (3 px, afastado 2 px);
- regras para o alto contraste do Windows e para "reduzir movimento";
- o marcador da fonte Atkinson, com o passo a passo para ligar.

**Decisões, em linguagem simples:**
- **Token** é um nome para um valor de design (`--cor-texto` = `#1E0F4A`). Muda num lugar só e vale para o site todo.
- **`@theme inline`** é o jeito do Tailwind v4 criar classes a partir dos tokens. Quando o tema muda, a classe acompanha, sem precisar de `dark:`.
- **A paleta padrão do Tailwind foi removida.** Assim ninguém usa uma cor sem contraste conferido, e a regra "sem amarelo" fica garantida.
- **`:focus-visible`** mostra o contorno só para quem navega pelo teclado.
- **Hover com cores da paleta:**
  - botão principal claro `#3B1D8B` → `#2A1366`;
  - botão principal escuro `#FFFFFF` → `#EDE8FC`;
  - botões secundários e itens da barra ganham o fundo do cartão.

**Marcador:** `FONTE-Atkinson Hyperlegible Next-AQUI`, em `app/layout.jsx`.

---

## Fase 2 — Layout comum

**O que é o "layout comum":** a parte que se repete em todas as páginas (pular para o conteúdo, cabeçalho, rodapé e barra). Fica no `app/layout.jsx`, e o Next troca só o conteúdo do meio (`{children}`) ao navegar.

**O que foi feito:**
- os componentes `LinkPular`, `Cabecalho`, `Rodape`, `BarraNavegacao` + `ItemBarra`, `FocoNaTroca` e `Botao`;
- os hooks `useDirecaoRolagem` (barras que somem ao rolar) e `usePrefereMovimentoReduzido`.

**Decisões, em linguagem simples:**
- **Barra no celular (decisão da equipe):** 4 colunas iguais com texto de 16 px não cabem a 320 px e causariam rolagem lateral. Cada item tem a largura do seu texto, e a barra vira **2 × 2** quando não couber.
- **A barra mede os próprios textos** no navegador para escolher entre 1 linha e 2 × 2. Assim ela funciona com qualquer fonte e com texto ampliado. A altura real vira `--altura-barra`, e é ela que define o espaço extra no fim da página, para o rodapé e o foco nunca ficarem escondidos.
- **Esconder com `transform`:** o cabeçalho e a barra saem da tela só visualmente. O leitor de tela continua alcançando os dois, e eles voltam quando recebem foco.
- **Foco ao trocar de página:** vai para o `<h1>`. No primeiro carregamento, não, para "Pular para o conteúdo" ser o primeiro foco.
- **Título da aba:** `"%s — Pulse"` no layout. A Início escreve o título completo, porque o modelo do layout não vale para a página da mesma pasta.

**Marcadores:** `ICONE-Pulse/House/Watch/Play/Notebook-AQUI`.

---

## Fase 3 — Páginas de conteúdo

**O que foi feito:**
- as páginas Início, Solução e Simulador, com os textos exatos da seção 6;
- os componentes `Cartao`, `EspacoImagem`, `IndiceNestaPagina`, `CartaoIntegrante`, `TituloPagina` e `Secao`;
- na Solução, a seção Equipe com os 5 integrantes;
- no Simulador, o bloco `SIMULADOR-AQUI`, com os requisitos para quem for fazer o simulador.

**Decisões, em linguagem simples:**
- **"Principal" dentro do título do ODS 10:** quem navega de título em título com o leitor de tela ouve "Principal, ODS 10…".
- **Os sinais em lista de definições (`<dl>`):** o leitor de tela entende "Modo tátil" e a explicação como um par.
- **Espaço explícito no JSX (`{" "}`):** sem ele, o leitor de tela leria "90%dos" grudado.

**Ponto para o grupo decidir:** a seção 6.3 cita a vibração do celular no simulador, e a seção 3 proíbe vibração do celular. A dúvida está registrada no bloco `SIMULADOR-AQUI`.

**Marcadores:**
- `IMAGEM-ilustração de uma travessia-AQUI`;
- `IMAGEM-ilustração conceitual da pulseira-AQUI`;
- 5 × `IMAGEM-foto de (nome)-AQUI`, com o `alt` sugerido ao lado;
- `ICONE-Image-AQUI`;
- `SIMULADOR-AQUI`.

---

## Fase 4 — Camada de dados (sem API)

**O que foi feito:**
- `services/apiClient.js`: o **único** arquivo que faz `fetch`;
- `services/registrosService.js`: as 5 funções `listar`, `obter`, `criar`, `atualizar` e `excluir`;
- `lib/datas.js`, `lib/rotulos.js` e `lib/validacao.js`: funções puras.

**Decisões, em linguagem simples:**
- **Sem mock.** Enquanto `NEXT_PUBLIC_API_URL` não estiver configurada, toda função lança o erro `{ codigo: "conexao" }`, e as telas mostram "Não foi possível carregar os registros.".
- **O `fetch` já está escrito** seguindo o contrato da seção 7.6. Cada função tem um bloco `API-EXTERNA-AQUI` explicando o que a API recebe, o que devolve e qual linha ajustar se a API for diferente.
- **Função pura:** recebe valores e devolve um resultado, sem chamar API nem mexer na tela. Por exemplo, `formatarData("2026-11-05")` devolve sempre `"05/11/2026"`.
- **Datas como texto:** `new Date("2026-11-05")` lê a data em UTC, e no Brasil viraria o dia 04.
- **Registros de exemplo:** não criados agora (decisão da equipe).

**Para ligar a API:**
1. Crie `projeto-citizentech-1espu/.env.local` com `NEXT_PUBLIC_API_URL=https://endereco-da-api.com`.
2. Reinicie o `npm run dev`.

**Marcadores:** `API-EXTERNA-AQUI` (a URL base + as 5 funções).

---

## Fase 5 — Diário completo

**O que foi feito:**
- as rotas `/diario`, `/diario/novo`, `/diario/[id]` e `/diario/[id]/editar`;
- os componentes `Campo`, `GrupoOpcoes`, `MensagemStatus`, `DialogoConfirmacao`, `EstadoTela`, `ErroCampo`, `LinkVoltar`, `ResumoIndicadores`, `ListaRegistros`, `CartaoRegistro`, `FormularioRegistro`, `DetalheRegistro`, `RegistroNaoEncontrado` e as 4 telas;
- os hooks `useRegistros`, `useRegistro`, `useFormularioRegistro`, `useResumoIndicadores`, `useGuardaDeSaida`, `useMensagemDiario`, `useHoje`, `useTituloDaAba` e `useDigitandoNoCelular`.

**Como funciona:**
- **Formulário:** a validação acontece só ao enviar. A mensagem aparece junto de cada campo, e o foco vai para o primeiro erro. Durante o envio, o botão mostra "Salvando…". Se falhar, as respostas continuam na tela.
- **Saída do formulário:** com respostas preenchidas, tocar na barra, no logo, em "Voltar" ou em "Cancelar" abre o diálogo "Descartar as respostas?". Fechar a aba ou recarregar mostra o aviso padrão do navegador.
- **Exclusão:** abre o diálogo com o foco em "Manter registro". Depois de excluir, a lista mostra "Registro excluído." com o botão "Desfazer", que recria o registro e anuncia "Registro restaurado.".

**Decisões, em linguagem simples:**
- **Contexto (React)** é um valor disponível para todos os componentes de dentro, sem passar por props. Fica no layout e sobrevive à troca de página. É assim que "Registro salvo." chega a `/diario`.
- **`aria-disabled` em vez de `disabled`:** com `disabled`, o navegador tira o foco do botão, e quem usa teclado ou leitor de tela se perde.
- **Região de status criada antes do texto:** o leitor de tela só anuncia mudanças dentro de uma região que já existia na página.
- **`<dialog>` nativo:** o navegador já deixa o fundo inacessível e trata o Esc.
- **Sem `aria-invalid` nos radios:** a ARIA não aceita esse atributo no papel `radio`. O erro chega pelo `<fieldset>`.
- **Textos (decisão da equipe):**
  - Ver e Editar usam "Carregando os registros…" e "Não foi possível carregar os registros." (no plural);
  - a aba de registro inexistente é "Registro não encontrado".

**Marcadores:** `ICONE-Plus`, `ArrowCounterClockwise`, `ArrowClockwise`, `ArrowLeft`, `PencilSimple`, `Trash`, `CheckCircle`, `Warning`, `WarningCircle` e `X`, todos no formato `ICONE-(nome)-AQUI`.

---

## Fase 6 — Responsividade

**O que foi feito:**
- o componente `PaginaComIndice`;
- cartões 2 por linha a partir de 768 px;
- resumo do Diário com 4 indicadores lado a lado a partir de 768 px;
- "Nesta página" como coluna lateral presa ao rolar a partir de 1024 px.

| Elemento | Celular | Tablet (≥ 768 px) | Computador (≥ 1024 px) |
| --- | --- | --- | --- |
| "Nesta página" | cartão no topo | cartão no topo | coluna à direita, presa |
| Cartões | 1 por linha | 2 por linha | 2 por linha |
| Resumo | 2 × 2 | 4 lado a lado | 4 lado a lado |
| Equipe | foto à esquerda | 3 + 2 | 5 lado a lado |

**Decisões, em linguagem simples:**
- **A ordem no HTML não muda com o tamanho da tela.** O CSS Grid só posiciona o índice à direita. O leitor de tela e o Tab seguem sempre título → índice → seções.
- **Índice à direita:** assim a ordem visual acompanha a ordem do HTML. Em telas baixas, ele rola por dentro.
- **Equipe dentro da grade de 59rem**, para os 5 cartões caberem lado a lado.

---

## Fase 7 — Revisão de acessibilidade

**O que foi verificado automaticamente:**

| Verificação | Resultado |
| --- | --- |
| ESLint `jsx-a11y` completo (33 regras; o Next liga só 6) | 0 problemas |
| Contraste calculado nos dois temas (texto ≥ 7:1, bordas e foco ≥ 3:1) | 54 de 54 |
| axe-core (WCAG 2.2 AA + contraste 7:1), em 14 estados e nos dois temas | 0 violações |
| Teclado: primeiro foco, contorno de 3 px, foco nunca escondido | ok |
| Alvos ≥ 48 × 48 px, títulos, regiões, `lang`, títulos de aba únicos | ok |
| Zoom de 400%, espaçamento de texto (1.4.12), texto em 200% | ok |
| Reduzir movimento e alto contraste | ok |

**Defeitos encontrados e corrigidos:**
1. **Campo de data:** perdia o contorno de foco no ícone de calendário do Chrome. Agora usa `:focus-within`.
2. **Barra:** transbordava com espaçamento de letras maior. Agora mede de novo quando os textos mudam de largura.
3. **Palavras longas:** com texto muito ampliado, criavam rolagem lateral. Agora são quebradas só quando não cabem sozinhas na linha (`overflow-wrap: anywhere`).

### Testes que precisam ser feitos por uma pessoa

1. **NVDA (Windows, gratuito, nvaccess.org).**
   - Navegação: `H` pula entre títulos, `D` entre regiões, `NVDA + F7` lista os elementos.
   - Confira os anúncios: "Início, página atual"; o campo, "inválido" e a mensagem; "Salvando"; "Registro salvo"; o diálogo; "Registro excluído"; "Registro restaurado"; e "Ver registro de DD/MM/AAAA".
2. **TalkBack (Android) e VoiceOver (iPhone).**
   - Gestos: deslizar para passar de item em item, toque duplo para ativar; no VoiceOver, o rotor navega por títulos.
   - Repita os fluxos do NVDA.
3. **Zoom de 400%.** Janela de 1280 px e `Ctrl` + `+` até 400%. Esperado: sem rolagem lateral e a barra no fim da página.
4. **Texto ampliado no celular.**
   - Android: Tamanho da fonte no máximo.
   - iPhone: no Safari, "aA" → 200%.
   - Esperado: nada cortado.
5. **Alto contraste do Windows.** Configurações > Acessibilidade > Temas de contraste. Esperado: bordas visíveis, item ativo da barra destacado e foco visível.
6. **Reduzir movimento e tema escuro**, ligados no sistema. Esperado: as barras não somem ao rolar, e o tema acompanha o aparelho.
7. **Teclado e toque num aparelho real.**
   - Teclado: `Tab`, as setas nos radios, `Esc` no diálogo.
   - Celular: a barra sai da frente do teclado ao digitar.
8. **Quando a fonte, os ícones, as imagens e a API entrarem,** repita os testes acima.

---

## Fase 8 — Nova identidade e movimento (em andamento)

A equipe aprovou uma identidade visual e de movimento nova (seção 18 da especificação, com os protótipos em `docs/prototipos/`). A fase é feita em subfases, com uma pausa para aprovação no fim de cada uma. **Cada mudança é registrada aqui.**

### 8.0 — Leitura e plano (sem código)

**O que foi feito:** leitura da seção 18, das notas (Fase 8) das outras seções e dos 3 protótipos; exame do projeto; plano das subfases 8.1 a 8.8, com o comando de instalação e os riscos.

**Decisões da equipe** (vão para a seção 17 da especificação como **Equipe**):

| # | Decisão |
| --- | --- |
| 1 | "Nesta página" em pílulas, depois do resumo (Solução) ou da abertura (Início). A coluna lateral da 9.4 sai. No computador (≥ 1024 px e altura ≥ 700 px), o índice gruda embaixo do cabeçalho ao rolar, e a pílula da seção atual fica dourada (`aria-current="true"`). |
| 2 | Valem os textos da especificação ("O problema", "Cerca de 90%", "7,9 milhões"). Entra a introdução de Tecnologias do protótipo. Com "reduzir movimento", a abertura mostra "Sinais da Pulse" e "Veja cada sinal explicado na página Solução." (a frase do protótipo pedia para desligar uma configuração de acessibilidade). |
| 3 | Rótulos mono: os da 18.5 e os dos protótipos, mais "As pessoas", "No trajeto", "Ecossistema", "Próximos passos" e "Por que a Pulse". O Diário fica sem rótulo. |
| 4 | Cabeçalho: "Pulse" com o marcador `ICONE-Pulse-AQUI` e "GS 2026.2 · CitizenTech" em mono à direita. |
| 5 | A cortina de piso tátil aparece só ao entrar e ao sair do Diário; entre as páginas internas do Diário não há cortina. O diálogo e as mensagens continuam sem animação. |
| 6 | Capa: uma camada sólida, criada por um script no `<head>`, evita que a página apareça por um instante antes da capa. Só existe quando a chave `pulse-capa-vista` não existe; some quando a capa monta ou em no máximo 2 s. |

**Onde o protótipo discorda e a especificação vence:** barra com largura pelo texto e fundo sólido; botões do carrossel com ícone e texto; rodapé com "Protótipo acadêmico com dados públicos e simulados."; densidade de pixels máxima de 1,75; ODS só no rodapé da Solução; textos dos sinais da 6.2.

### 8.1 — Instalação e base do movimento

**Pacotes instalados** (comando aprovado pela equipe, com versões exatas, como o resto do `package.json`):

```
npm install --save-exact lenis@1.3.27 gsap@3.15.0 @gsap/react@2.1.2 motion@14.6.0 three@0.186.1
```

| Pacote | Para quê | Por que esta versão |
| --- | --- | --- |
| `lenis` 1.3.27 | Rolagem suave com a roda do mouse | Última estável (a 2.0 ainda está em desenvolvimento) |
| `gsap` 3.15.0 | Animações e o ScrollTrigger (animação ligada à rolagem) | Estável há meses; a 4.0 está em beta |
| `@gsap/react` 2.1.2 | Hook `useGSAP`, que limpa as animações ao sair da página | Última |
| `motion` 14.6.0 | Microinterações | Mais de 2 semanas de uso (a mais nova saiu um dia antes) |
| `three` 0.186.1 | Pulseira 3D (subfase 8.4) | Mais de 2 semanas de uso |

O `npm audit` mostra 7 avisos moderados. Eles já existiam e vêm do `minimatch`, usado pelas ferramentas do ESLint, e não dos pacotes novos. Não foi rodado `npm audit fix`, porque ele mudaria pacotes fora da lista aprovada.

**Arquivos:**

| Arquivo | Mudança |
| --- | --- |
| `package.json` e `package-lock.json` | Os 5 pacotes acima |
| `lib/movimento.js` (novo) | Registra o ScrollTrigger uma vez (só no navegador) e liga o Lenis ao relógio do GSAP |
| `components/layout/ProvedorMovimento.jsx` (novo) | Lenis na raiz (`anchors: true`, `autoRaf: false`) + `MotionConfig reducedMotion="user"` |
| `app/layout.jsx` | `ProvedorMovimento` em volta do site; marcadores `FONTE-Anton-AQUI`, `FONTE-Atkinson Hyperlegible Next-AQUI` e `FONTE-JetBrains Mono-AQUI`, com o passo a passo |
| `app/globals.css` | Variáveis `--fonte-titulo`, `--fonte-base` e `--fonte-mono` com as fontes de reserva; classes `font-titulo` e `font-mono`; CSS do Lenis; `scroll-behavior: auto` quando o Lenis está ativo |

**Decisões da implementação** (seção 17 como **Implementação**):
- **Um relógio só.** O Lenis não usa o próprio relógio (`autoRaf: false`): o do GSAP chama o Lenis a cada quadro e avisa o ScrollTrigger a cada passo da rolagem. Assim as animações ligadas à rolagem nunca ficam um quadro atrasadas.
- **Âncoras sem desconto extra.** O Lenis já desconta o `scroll-padding-top` do `<html>` (altura do cabeçalho + 16 px). O clique continua sendo um link normal, então o navegador leva o foco para o destino.
- **"Reduzir movimento" na roda do mouse.** O Lenis respeita a configuração, mas ainda amortecia a roda por cerca de 0,1 s (o teste mediu 397 px em 60 ms e 400 px depois). Como a 18.2 pede que nada se mova, com "reduzir movimento" a suavização da roda é desligada (`smoothWheel: false`).
- **Sem `scroll-behavior: smooth` com o Lenis ativo.** Se o navegador também suavizasse, cada passo do Lenis viraria uma rolagem suave por cima da outra. A regra antiga continua valendo se o Lenis não carregar.

**Verificação automática** (Chrome sem janela, servidor de produção): ESLint sem problemas, `next build` sem erros e 17 de 17 testes:
- Lenis ativo e `scroll-behavior: auto`;
- 1º Tab no "Pular para o conteúdo"; Enter leva o foco ao `<main>` e o Tab seguinte continua no conteúdo;
- "Nesta página": rolagem suave, H2 a 80 px do topo (fora do cabeçalho), foco no H2 e o endereço com `#o-problema`;
- roda do mouse suave;
- com "reduzir movimento": âncora e roda instantâneas, foco no H2;
- celular com toque: rolar para baixo esconde o cabeçalho e a barra; rolar para cima mostra o cabeçalho;
- nenhum erro ou aviso no console em Início, Solução, Simulador, Diário e Novo registro.

Observação sobre o teste: o gesto pronto de rolagem do Chrome sem janela (`synthesizeScrollGesture`) não rola nenhuma página, nem uma página simples sem Lenis. O teste passou a simular os toques um a um. Com eles, o site rola como uma página sem Lenis, confirmando que o toque continua o do aparelho.

**Como testar à mão:**
1. `npm run dev` e abra `http://localhost:3000` num computador com mouse.
2. Role com a roda do mouse: a página desliza suave.
3. Aperte `Tab`: o primeiro foco é "Pular para o conteúdo". Aperte `Enter` e depois `Tab`: o foco vai para o primeiro link do conteúdo.
4. No "Nesta página", clique em "O problema": a página rola suave, o título para logo abaixo do cabeçalho, e o próximo `Tab` continua dali.
5. Ligue "reduzir movimento" (Windows: Configurações > Acessibilidade > Efeitos visuais > Efeitos de animação desligado) e repita: tudo instantâneo.
6. No celular (ou no modo celular do navegador), na Início ou na Solução: rolar para baixo esconde o cabeçalho e a barra; rolar para cima mostra.

**Marcadores desta subfase:** `FONTE-Anton-AQUI`, `FONTE-Atkinson Hyperlegible Next-AQUI` e `FONTE-JetBrains Mono-AQUI`, todos em `app/layout.jsx`.

**Sugestão de commit:** `Instala pacotes de movimento e adiciona provedor de rolagem suave`

### 8.2 — Cores, tipografia e linguagem visual

**Arquivos:**

| Arquivo | Mudança |
| --- | --- |
| `app/globals.css` | Tokens da 18.3 nos dois temas, mais decoração, 3D, cortina e rodapé; tokens antigos removidos; H1 e H2 em Anton com maiúsculas só por CSS; corpo com altura de linha 1,55; links e foco na cor da marca; utilitários `textura-piso`, `rotulo-mono` e `palavra-fundo`; textura e palavra de fundo desligadas no alto contraste do Windows |
| `components/ui/PalavraFundo.jsx` (novo) | Palavra gigante decorativa (`aria-hidden`), com tamanho `min(21rem, 150vw ÷ letras)` |
| `components/ui/Botao.jsx` | Pílula de 56 px; principal dourado (no hover: sombra e subida de 2 px, sem trocar a cor); secundário com contorno de 2 px na cor da marca |
| `components/ui/Cartao.jsx`, `Campo.jsx`, `GrupoOpcoes.jsx`, `EspacoImagem.jsx`, `DialogoConfirmacao.jsx` | Fundo `--cor-superficie` no lugar de `--cor-cartao` e `--cor-cromo`; campos e opções com canto de 12 px; título do diálogo no menor tamanho do H2 |
| `components/layout/BarraNavegacao.jsx`, `ItemBarra.jsx`, `Cabecalho.jsx`, `IndiceNestaPagina.jsx`, `LinkPular.jsx` | Cores novas: item ativo e "Pular para o conteúdo" em dourado com texto `#120B24` |
| `components/solucao/CartaoIntegrante.jsx`, `components/diario/CartaoRegistro.jsx`, `app/solucao/page.jsx` | Só a troca das classes de cor e de canto |

**Tokens removidos:** `--cor-cromo`, `--cor-cartao`, `--cor-botao`, `--cor-botao-texto`, `--cor-botao-hover`, `--cor-link` e `--cor-foco`, e as cores `#3B1D8B`, `#2E1670` e `#2A1366` como fundo. O `#2A1366` continua só como texto do botão de perigo no tema escuro, como manda a 18.3.

**Decisões da implementação** (seção 17 como **Implementação**):
- **Hover e borda dos itens da barra calculados a partir da marca.** `--cor-hover` é a marca a 12% (como manda a 18.3). `--cor-linha-item` é a marca a 70%: 4,3:1 no claro e 5,3:1 no escuro (mínimo de 3:1). Como os dois são calculados, acompanham o tema sozinhos.
- **Cantos.** Cartões, fotos e mensagens com 18 px (18.5). Campos, opções do formulário e etiquetas continuam com 12 px (seção 8.3), porque a 18.5 não fala deles. Botões em pílula. O diálogo continua com 16 px. A barra vira pílula na 8.3.
- **Título do diálogo.** É um H2, então usa a Anton, mas no menor tamanho do H2 (2,2rem). O tamanho normal chegaria a 4rem num diálogo estreito.
- **Rótulo mono sem cor fixa.** O utilitário `rotulo-mono` define fonte, tamanho e espaçamento; a cor vem de quem usa (`text-destaque` na página, dourado no rodapé).
- **Subida do botão dourado só com movimento permitido** (`motion-safe:`). A sombra do hover vale sempre.
- **Alto contraste do Windows.** A textura e a palavra de fundo são desligadas nesse modo, para não virarem ruído nem texto gigante.
- **Hover do botão em CSS, não em Motion.** É uma mudança simples de estado e não precisa de JavaScript. O Motion fica para as animações comandadas por código (abertura, nas próximas subfases).

**Verificação automática:**
- ESLint sem problemas e `next build` sem erros.
- **Contraste calculado:** 67 de 67 pares (texto ≥ 7:1; bordas e foco ≥ 3:1), nos dois temas, no rodapé, no hover, nos status, no botão de perigo e no polaroide. Os valores batem com a tabela da 18.3.
- **axe-core** (WCAG 2.2 AA + contraste 7:1): 0 violações em Início, Solução, Simulador, Diário e Novo registro, nos dois temas.
- **320 px:** nenhuma rolagem lateral nas 5 páginas, nos dois temas.
- Nenhum erro no console.

**Como testar à mão:**
1. `npm run dev`. Com o aparelho no tema claro: fundo creme, cartões brancos, títulos H1 e H2 em maiúsculas e em roxo, item ativo da barra em dourado.
2. Troque o aparelho para o tema escuro: fundo `#120B24`, títulos e links em lilás.
3. Passe o mouse num botão dourado (ex.: "Conheça a solução"): aparece uma sombra e o botão sobe 2 px. Com "reduzir movimento" ligado, só a sombra aparece.
4. Navegue com `Tab`: o contorno de foco tem 3 px, na cor da marca.
5. Selecione um título com o mouse e copie: o texto colado vem normal ("Tema CitizenTech"), porque as maiúsculas são só visuais.

**Marcadores desta subfase:** nenhum novo.

**Sugestão de commit:** `Aplica cores, tipografia e botões da nova identidade`

**Decisão da equipe depois da 8.2 — tamanho dos títulos (opção C).** Os tamanhos da 18.4 usavam `vw`, uma unidade que acompanha a largura da tela. Com zoom de 200% (ou texto em 200% nas configurações do navegador), o H1 crescia só 1,14× e o H2 1,2×. Isso falhava a WCAG 1.4.4 (falha F94), que faz parte do piso do projeto. A equipe escolheu deixar o termo do meio mais inclinado, para o título chegar ao tamanho máximo já em 640 px:

| Título | Especificação | Agora |
| --- | --- | --- |
| H1 | `clamp(2.6rem, 8vw, 5.6rem)` | `clamp(2.6rem, 14vw, 5.6rem)` |
| H1 da abertura do Início | `clamp(2.1rem, 5.4vw, 3.6rem)` | `clamp(2.1rem, 9vw, 3.6rem)` (mesma regra) |
| H2 | `clamp(2.2rem, 6vw, 4rem)` | `clamp(2.2rem, 10vw, 4rem)` |

O mínimo e o máximo continuam os da 18.4. Com isso, os títulos dobram de tamanho com zoom de 200%. Em troca, ficam maiores em telas médias (a 375 px, o H1 passa de cerca de 42 para 52 px). Aplicado em `app/globals.css`, junto com a 8.3.

### 8.3 — Layout comum

**Arquivos:**

| Arquivo | Mudança |
| --- | --- |
| `hooks/useTransicaoPagina.js` (novo) | Lógica da cortina de piso tátil: entrada (200 ms), troca de página, saída (220 ms); regra do Diário; Voltar do navegador; trava de 3 s |
| `components/layout/TransicaoPagina.jsx` (novo) | Provedor da transição e a cortina (`aria-hidden`, sem clique) |
| `components/ui/LinkInterno.jsx` (novo) | `<Link>` do Next que passa pela guarda de saída e pela transição |
| `hooks/useFaixaODS.js` (novo) | Pausa e ODS em destaque na área da frase |
| `components/solucao/FaixaODS.jsx` (novo) | Faixa contínua dos 3 ODS, só no rodapé da Solução |
| `hooks/useGuardaDeSaida.jsx` | Se a saída estiver livre, passa a navegação para a transição; "Descartar respostas" também |
| `components/layout/Provedores.jsx` | `TransicaoPagina` por fora da guarda de saída |
| `components/layout/Rodape.jsx` | Rodapé escuro em todas as páginas: 4 links de 48 px, créditos e a faixa dos ODS na Solução; o espaço do fim da página fica dentro dele |
| `components/layout/Cabecalho.jsx` | "Pulse" em Anton com `ICONE-Pulse-AQUI`, rótulo "GS 2026.2 · CitizenTech" à direita, largura de 76rem; mede a própria altura |
| `components/layout/BarraNavegacao.jsx` e `ItemBarra.jsx` | Barra em pílula com item ativo dourado |
| `components/layout/FocoNaTroca.jsx` | Com âncora no endereço (ex.: `/solucao#os-sinais`), o foco vai para o título da âncora, e não para o H1 |
| `components/ui/Botao.jsx`, `components/diario/CartaoRegistro.jsx`, `app/solucao/page.jsx` | Links internos passam a usar `LinkInterno` |
| `app/globals.css` | Títulos (opção C), largura `max-w-pagina` (76rem), CSS da cortina e da faixa dos ODS, foco dourado no rodapé, espaço do fim saindo do `body` |

**Como a navegação funciona agora:**

```
Link (LinkInterno, barra, logo, Voltar, Cancelar)
  → guarda de saída: há respostas não salvas?  sim → diálogo "Descartar as respostas?"
  → não → transição: precisa animar?
       sim → domos crescem → router.push → página nova → domos encolhem
       não → navegação normal, instantânea
```

A cortina **não** anima: com "reduzir movimento" ou alto contraste do Windows; quando a origem e o destino estão dentro do Diário (decisão da equipe); quando o destino é a mesma página. Voltar e Avançar do navegador fazem só a saída.

**Decisões da implementação** (seção 17 como **Implementação**):
- **A guarda de saída é a porta de entrada de todo link interno.** Ela decide primeiro e só depois chama a transição. Assim, nunca há cortina com o diálogo aberto.
- **Trava de segurança de 3 s.** Se a página nova não chegar, a cortina some mesmo assim.
- **Saída no Voltar do navegador com `useLayoutEffect`.** Ele roda antes de a tela ser pintada, então a cortina já aparece cobrindo, sem a página nova "piscar".
- **Alto contraste do Windows: troca instantânea**, como com "reduzir movimento". A máscara de domos não funciona bem nesse modo.
- **Faixa dos ODS com o foco dentro:** ela para e volta ao começo, e o botão focado é rolado até aparecer inteiro (18.2, item 5). Ao tocar num ODS, o clique também mostra a frase, porque o Safari do iPhone não foca botões no toque.
- **Frases dos ODS** em parágrafos com `hidden`, ligados por `aria-describedby`: o leitor de tela lê a frase com o botão, mas não lê de novo ao percorrer a página.
- **Cabeçalho mede a própria altura** e guarda em `--altura-cabecalho`. Com o rótulo quebrando linha (83 px a 320 px), as âncoras continuam parando logo abaixo dele.
- **Rodapé em componente de cliente**, só para saber se está na Solução (`usePathname`). Ele continua vindo pronto do servidor.
- **Cantos da barra.** A partir de 768 px, pílula perfeita. No celular, os itens têm 2 andares (ícone e texto), e a pílula perfeita cortava o texto; o canto lá é de 20 px, e o da barra acompanha.
- **Links do rodapé numa lista simples**, sem um segundo `<nav>`: um `<nav>` precisaria de um nome que a especificação não define.

**Verificação automática** (Chrome sem janela, servidor de produção): ESLint sem problemas, `next build` sem erros e **45 de 45 testes**:
- Transição Início → Solução: os domos cobrem a tela (22 px), a cortina some no fim, foco no H1, cortina com `aria-hidden` e sem clique.
- Voltar do navegador: a cortina só encolhe.
- Entrar no Diário: anima. Novo registro → "Voltar ao Diário": sem cortina.
- Formulário preenchido + barra: abre o diálogo, sem cortina, foco em "Continuar preenchendo". "Descartar respostas" indo para o Início: anima. Indo para o Diário: sem cortina.
- Reduzir movimento: sem cortina; faixa dos ODS parada, sem "Pausar" e sem a cópia, com os botões empilhados.
- Faixa dos ODS: só na Solução; anima por 48 s, linear e infinita; ordem do Tab Pausar → ODS 10 → ODS 9 → ODS 11 → Início; com o foco, a faixa para e o botão aparece inteiro; a frase aparece na área e chega pelo `aria-describedby`; a cópia não recebe o Tab; "Pausar" troca para "Retomar", com `aria-pressed` e a faixa parada.
- axe (WCAG 2.2 AA + contraste 7:1): 0 violações nas 5 páginas, nos dois temas.
- 320 px: sem rolagem lateral nas 5 páginas, nos dois temas; `--altura-cabecalho` acompanha a altura real; a âncora para abaixo do cabeçalho.
- Nenhum erro ou aviso no console.

Ainda não testado: link de outra página com âncora (`/solucao#os-sinais`). Esses links nascem nas subfases 8.5 e 8.6.

**Como testar à mão:**
1. `npm run dev`. Na barra, vá de Início para Solução: domos roxos cobrem a tela e somem, revelando a página nova.
2. Use o Voltar do navegador: os domos aparecem cobrindo e encolhem.
3. Entre no Diário pela barra (anima). Dentro dele, vá para "Novo registro" e volte: troca instantânea.
4. Em "Novo registro", escreva algo nas observações e toque em "Início" na barra: abre "Descartar as respostas?". "Descartar respostas" leva ao Início com a cortina.
5. Na Solução, role até o rodapé: a faixa dos ODS anda. Passe o mouse (para e mostra a frase), aperte "Pausar" (vira "Retomar") e navegue com `Tab` (Pausar → ODS 10 → ODS 9 → ODS 11 → links).
6. Ligue "reduzir movimento": as trocas de página ficam instantâneas, e os ODS ficam parados, um embaixo do outro.
7. Com um leitor de tela, foque um ODS: ele lê o nome e a frase completa.

**Marcadores desta subfase:** `ICONE-Pause-AQUI` e `ICONE-Play-AQUI` (botão Pausar/Retomar), em `components/solucao/FaixaODS.jsx`. O `ICONE-Pulse-AQUI` do cabeçalho continua.

**Sugestão de commit:** `Adiciona transição entre páginas, rodapé novo e faixa dos ODS`

### 8.4 — Pulseira 3D

**Arquivos:**

| Arquivo | Mudança |
| --- | --- |
| `lib/pulseira3d/cena.js` (novo) | Monta a cena com Three.js: tira, furos, módulo, botões, microfone, alto-falante, motores, atuador, luzes, câmera de 32°, anéis de pulso, projeção das âncoras na tela e liberação da memória |
| `lib/pulseira3d/sinais.js` (novo) | Os 5 sinais animados (ciclo de 2,8 s), nomes dos sinais e dos movimentos, quadro apagado e destaque da parte ativa |
| `hooks/usePulseira3D.js` (novo) | Liga a cena ao React: modos `abertura`, `sinal` e `parar`; só anima visível; pausa; quadro parado com "reduzir movimento"; entrada depois da capa; mouse; tema; tamanho; limpeza |
| `components/pulseira/CenaPulseira.jsx` (novo) | Parte que só existe no navegador (carregada com `next/dynamic` e `ssr: false`) |
| `components/pulseira/Pulseira3D.jsx` (novo) | Componente público; mostra a descrição em texto enquanto carrega, sem JavaScript e se o WebGL falhar |
| `components/abertura/AberturaPulseira.jsx` (novo) | Abertura do Início, parcial: rótulo, H1, resumo, pulseira, sinal atual e "Pausar animação"/"Retomar animação" |
| `components/layout/PaginaComIndice.jsx` | O título passa a ser opcional (na Início, o H1 está na abertura) |
| `app/page.jsx` | A Início começa pela abertura com a pulseira |

**Explicando em linguagem simples:** o Three.js desenha em 3D dentro de um `<canvas>`, usando o WebGL (a parte da placa de vídeo que o navegador libera para as páginas). Cada peça da pulseira é uma "malha" = forma (geometria) + aparência (material). Formas e materiais ocupam memória da placa de vídeo e precisam ser liberados à mão quando a pessoa sai da página.

**Decisões da implementação** (seção 17 como **Implementação**):
- **Ritmo do "Parar": um anel a cada 0,35 s** (no protótipo, 0,32 s). Assim nenhum sinal passa de 3 anéis por segundo (WCAG 2.3.1).
- **404 sem anéis sobrando:** os últimos anéis do modo `parar` saem até 3,7 s, para tudo terminar até 4,6 s (WCAG 2.2.2).
- **O `<canvas>` é criado pelo hook, não no JSX.** No modo de desenvolvimento, o React monta, desmonta e monta de novo cada componente; um canvas cujo WebGL já foi liberado não pode ser reaproveitado.
- **A descrição fica na caixa, não no canvas.** A caixa tem `role="img"` e o `aria-label` da 18.7, e só ganha esse papel quando o primeiro quadro fica pronto. Antes disso, quem descreve é o texto de reserva. Assim o leitor de tela nunca lê a descrição duas vezes.
- **Sem WebGL, sem erro no console.** O código pede o WebGL2 antes de chamar o Three.js. Se não houver, aparece a descrição, sem a mensagem de erro que o Three.js escreveria.
- **Legenda parada** ("Sinais da Pulse" / "Veja cada sinal explicado na página Solução.") e sem botão de pausa também enquanto a cena carrega, sem JavaScript e sem WebGL. Nesses casos nada se move, e um botão sem efeito confundiria. É o mesmo texto aprovado para "reduzir movimento".
- **Reserva no fluxo normal:** se o texto ampliado não couber na caixa da pulseira, a caixa cresce, em vez de cortar o texto ou criar uma rolagem interna.
- **Os modos `sinal` e `parar` ficam prontos agora**, mas só entram na página na 8.6 ("Os sinais") e na 8.7 (404).

**Verificação automática** (Chrome sem janela, com WebGL por software): ESLint sem problemas, `next build` sem erros e **30 de 30 testes**, mais os 45 da 8.3 de novo (sem regressão):
- 1 canvas; caixa com `role="img"` e a descrição; canvas com `aria-hidden`; texto de reserva some quando a cena fica pronta.
- Densidade de pixels: 1,75 numa tela 2× (o limite da 18.2).
- Anima visível (cerca de 680 desenhos por segundo no WebGL por software); os sinais se sucedem; o nome do sinal tem `aria-hidden`.
- "Pausar animação" vira "Retomar animação" com `aria-pressed="true"` e 0 desenhos por segundo; "Retomar" volta a animar.
- Fora da tela: 0 desenhos por segundo; de volta à tela, anima.
- 5 idas e voltas Início ↔ Solução: 5 contextos WebGL liberados, 1 canvas só na Início e nenhum na Solução.
- "Reduzir movimento": um quadro desenhado e nenhum depois; legenda parada; sem botão de pausa.
- WebGL desligado: descrição em texto (lida pelo leitor de tela), sem canvas, legenda parada, sem botão de pausa e sem erro no console.
- Sem JavaScript: a descrição e a legenda parada já vêm no HTML do servidor, sem botão de pausa.
- axe sem violações nos dois temas; 320 px sem rolagem lateral; console sem erros.

**Como testar à mão:**
1. `npm run dev` e abra a Início: a pulseira entra crescendo e girando, e passa pelos 5 sinais (Virar à esquerda, Virar à direita, Aguardar, Parar, Continuar). Com o mouse, ela acompanha o movimento.
2. "Pausar animação": tudo para; o botão vira "Retomar animação".
3. Role a página até o rodapé e volte: a pulseira só anima quando aparece.
4. Troque o tema do aparelho: a tira acompanha (`#4F2BAB` no claro, `#5B37BA` no escuro).
5. "Reduzir movimento" ligado: pulseira parada, legenda "Sinais da Pulse" e nenhum botão de pausa.
6. Sem WebGL (Chrome: `chrome://settings/system` → desligar "Usar aceleração gráfica" e reiniciar; se ainda aparecer, abra com `--disable-webgl`): aparece a descrição em texto no lugar da pulseira.
7. Leitor de tela: na pulseira, ele lê "Pulseira Pulse em 3D: uma tira roxa…", e o nome do sinal que muda não é lido.

**Achado para a 8.5 (contraste sobre a textura):** a textura de piso tátil vai atrás da abertura. O contraste do texto sobre o domo mais escuro (claro) e sobre o brilho do domo (escuro) é: claro, marca 7,07:1 e texto secundário 7,82:1; escuro, **rótulo dourado 6,69:1** (abaixo de 7:1). Por isso a textura ainda não entrou na abertura; a forma de aplicar fica para a equipe decidir.

**Marcadores desta subfase:** `ICONE-Pause-AQUI` e `ICONE-Play-AQUI` (botão da abertura), em `components/abertura/AberturaPulseira.jsx`. A pulseira é código, não tem marcador.

**Sugestão de commit:** `Adiciona pulseira 3D na abertura`

**Decisão da equipe depois da 8.4 — textura atrás do texto (opção B).** A textura de piso tátil só aparece no meio da área (atrás da pulseira) e se apaga em direção às bordas, onde fica o texto. Assim nenhum texto fica sobre os domos (seção 18.2, item 1). Vale também para as cabeças de página das próximas subfases.

### 8.5 — Início

**Arquivos:**

| Arquivo | Mudança |
| --- | --- |
| `hooks/useCapaIntro.js` (novo) | Primeira visita da sessão (`sessionStorage`, chave `pulse-capa-vista`, com `try/catch`), saída por clique, roda, toque, tecla ou foco, saída em piso tátil (1 s), Lenis parado com a capa na tela |
| `components/abertura/CapaIntro.jsx` (novo) | Capa (`aria-hidden`, nada focável): logo que pulsa uma vez, rótulo, "PULSE", frase sobre faixa sólida, dica com seta e os marcadores das duas imagens |
| `app/layout.jsx` | Script mínimo no `<head>` com a camada de espera da capa (decisão 6) e `suppressHydrationWarning` na tag `<html>` |
| `hooks/useLinhasPartes.js` (novo) | Linhas tracejadas da abertura: da parte da pulseira (posição 3D projetada na tela) até o nó de cada link, a cada quadro |
| `components/abertura/PartesSolucao.jsx` (novo) | "Partes da solução": `<nav>` com H2 oculto e 1 lista de 6 links; cartões no celular, 3 de cada lado no computador |
| `components/abertura/AberturaPulseira.jsx` | Abertura completa: capa, revelação depois da capa (Motion), palavra de fundo acompanhando o sinal, textura só atrás da pulseira, links e linhas |
| `components/ui/PalavraFundo.jsx` | Troca da palavra com esmaecimento de 0,35 s (instantânea com "reduzir movimento"); área configurável |
| `hooks/useSecaoAtual.js` (novo) | Seção em que a pessoa está, para a pílula dourada do índice |
| `components/layout/IndiceNestaPagina.jsx` | "Nesta página" em pílulas, com H2 oculto, seção atual dourada (`aria-current="true"`) e faixa fixa no computador; mede `--altura-indice` |
| `components/layout/PaginaComIndice.jsx` | Refeito para a Fase 8: título (se houver) → índice → seções, em 76rem; sai a coluna lateral |
| `components/layout/Secao.jsx` | Rótulo mono acima do H2 e a opção `larga` |
| `app/page.jsx` | Início na ordem da 18.6, com os rótulos "Tema", "O problema" e "As pessoas", citação com borda dourada e cartões de dados com o número em Anton |
| `app/globals.css` | Variantes `faixa-fixa` e `abertura-larga`; `scroll-padding-top` com a faixa do índice; textura que some nas bordas; CSS da capa e da camada de espera; alto contraste para `aria-current="true"` e `"step"` |

**Decisões da implementação** (seção 17 como **Implementação**):
- **O logo pulsa sobre o fundo escuro da capa**, e não sobre o fundo da página como no protótipo. A camada de espera já é escura, e trocar para o creme por 1 s e voltar ao escuro piscaria.
- **Capa sem imagem, por enquanto, com fundo sólido `#120B24`.** Todo texto da capa tem contraste de 7:1 ou mais. O marcador explica como colocar o `<picture>` e pede para conferir o contraste depois.
- **Tamanho de "PULSE" na capa** com `vw`, como no protótipo. É decoração (`aria-hidden`) e some com qualquer tecla ou toque. A frase e a dica usam `rem`, para crescerem com o zoom.
- **Revelação com Motion:** com a capa na tela, os títulos e os links ficam escondidos; ao sair, aparecem (0,6 s). Na primeira pintura e sem JavaScript, já aparecem no lugar. Com "reduzir movimento", na hora.
- **A palavra de fundo tem a altura da pulseira e a largura da tela.** No computador, ela passa por trás dos textos dos links, como no protótipo e no tamanho da 18.6. Contraste desses textos sobre ela: texto 13,6:1 (claro) e 14,1:1 (escuro); texto secundário 8,1:1 e 10,8:1. O rótulo dourado do sinal ficaria em 6,84:1 no escuro, por isso a palavra nunca desce até a linha dele.
- **Uma lista só com os 6 links**, posicionados com `subgrid` no computador: a ordem no HTML não muda, e o leitor de tela anuncia "lista, 6 links" em qualquer tela.
- **Linhas escritas direto no SVG**, sem passar pelo estado do React, porque mudam a cada quadro. Elas são redesenhadas também quando a janela muda de tamanho com a pulseira parada.
- **Pílulas do índice sem sublinhado**, como os itens da barra: são controles de navegação em formato de botão, não links no meio do texto.
- **Margem de rolagem nos títulos com rótulo** (`scroll-margin-top` de 40 px): ao pular para a seção, o rótulo aparece junto, em vez de ficar atrás da faixa do índice. A seção atual do índice também desconta essa margem.
- **Número dos cartões de dados em `rem` (3,25rem), não em `vw`.** O protótipo usava `vw`, que teria o mesmo problema de zoom da opção C.

**Verificação automática** (Chrome sem janela, servidor de produção): ESLint sem problemas, `next build` sem erros e **49 de 49 testes**, mais as baterias anteriores de novo (8.1: 17; 8.3: 45; 8.4: 30), sem regressão:
- Capa na primeira visita, `aria-hidden`, nada focável, com os textos da 18.6. A camada de espera sai quando a capa monta, e a abertura fica escondida enquanto ela está na tela.
- Primeiro Tab: a capa sai em piso tátil e o foco já está no "Pular para o conteúdo". A capa some em cerca de 1 s, a chave é gravada e a abertura aparece. Ao recarregar: sem capa e sem camada.
- A capa também sai pela roda do mouse (sem rolar a página por baixo), pelo clique e pelo toque arrastado.
- "Reduzir movimento": capa sem o logo pulsando; sai na hora com uma tecla.
- JavaScript do site bloqueado: a camada de espera cobre a tela e some em 2 s; o conteúdo está no HTML. Sem JavaScript, nenhuma capa.
- Abertura no computador: 1 lista de 6 links na ordem da 18.6; 3 à esquerda e 3 à direita; 6 linhas, cada uma terminando no nó do seu link; tracejado andando; foco em "Os sinais" engrossa a linha do motor esquerdo; palavra de fundo acompanhando o sinal; pausa congela tracejado e palavra.
- Índice: no computador alto, gruda embaixo do cabeçalho; `--altura-indice` correta; o H2 para abaixo da faixa com o rótulo visível; pílula "O problema" atual e foco no H2; no fim da página, a última seção é a atual. Com 650 px de altura, o índice fica parado.
- O link "Tecnologias" leva a `/solucao#tecnologias` (as âncoras da Solução nascem na 8.6).
- 375, 700 e 320 px: sem linhas, cartões em 1 ou 2 colunas, índice parado, sem rolagem lateral (também com a capa a 320 px).
- "Reduzir movimento": palavra "Pulse", linhas desenhadas e paradas.
- axe sem violações nos dois temas; nenhum erro no console.

**Como testar à mão:**
1. Abra o site numa aba nova (`npm run dev`): aparece a capa, com o logo pulsando uma vez. Aperte uma tecla, role ou toque: os domos encolhem e a abertura aparece, com a pulseira entrando.
2. Recarregue: sem capa. Feche a aba e abra outra: a capa volta (nova sessão).
3. No computador: passe o mouse ou o `Tab` pelos 6 links: a linha engrossa, o link ganha borda e a parte da pulseira acende.
4. Role a página: o "Nesta página" gruda embaixo do cabeçalho e a pílula da seção atual fica dourada.
5. "Reduzir movimento": a capa sai na hora, a pulseira fica parada, a palavra fica "Pulse" e as linhas param.
6. Celular: pulseira em cima, links em cartões; o índice não gruda.
7. Leitor de tela: a capa não é lida. A ordem é: H1, resumo, pulseira (descrição), "Pausar animação", "Partes da solução, lista, 6 links", "Nesta página".

**Marcadores desta subfase:**
- `IMAGEM-capa versão computador (horizontal)-AQUI` e `IMAGEM-capa versão celular (vertical)-AQUI` (alt: "Capa da Pulse."), em `components/abertura/CapaIntro.jsx`.
- `ICONE-ArrowDown-AQUI` (dica da capa), em `components/abertura/CapaIntro.jsx`.
- `ICONE-ArrowRight-AQUI` (6 links da abertura), em `components/abertura/PartesSolucao.jsx`.
- `IMAGEM-ilustração de uma travessia-AQUI` continua em `app/page.jsx`.

**Sugestão de commit:** `Adiciona capa e abertura com links da solução no Início`

### 8.6 — Solução

**Arquivos:**

| Arquivo | Mudança |
| --- | --- |
| `app/solucao/page.jsx` | Nova ordem e "Nesta página" (18.8); âncoras `como-funciona`, `os-sinais`, `tecnologias`, `dois-modos`, `semaforos` e `transporte-publico`; seção de ODS retirada; passos em cartões com o número em Anton; rótulos mono; equipe em polaroides |
| `hooks/useRolagemFixa.js` (novo) + `components/solucao/SinaisRolagemFixa.jsx` (novo) | "Os sinais" em rolagem fixa: palco parado, sinal escolhido pela rolagem (ScrollTrigger, sem `pin`), foto em piso tátil, pulseira pequena e pausar; lista comum fora do modo fixo |
| `hooks/useCarrossel.js` (novo) + `components/ui/Carrossel.jsx` (novo) | Carrossel de Tecnologias: rolagem horizontal com encaixe, "Anterior"/"Próximo" com ícone e texto, `aria-disabled` nas pontas, contagem "1 a 3 de 8" |
| `hooks/useGaleriaHorizontal.js` (novo) + `components/solucao/GaleriaHorizontal.jsx` (novo) | Galeria que corre na horizontal com a rolagem no computador; grade no resto |
| `hooks/useInclinacaoMouse.js` (novo) + `components/solucao/CartaoIntegrante.jsx` | Polaroide com inclinação fixa; com mouse, endireita, sobe e inclina até 10° |
| `hooks/useConsultaMidia.js` (novo) | Diz se uma condição de tela vale agora (ex.: "≥ 900 × 600 px e sem reduzir movimento") |
| `components/layout/PaginaComIndice.jsx` e `TituloPagina.jsx` | Rótulo mono na cabeça; textura numa faixa à direita (opção B); `overflow-x-clip` para a galeria de largura total |
| `components/ui/EspacoImagem.jsx` | Formatos "retrato" (4:5) e "livre" |
| `app/globals.css` | `@property --d`; troca de foto e de texto de "Os sinais"; textura lateral das cabeças de página |

**Decisões da implementação** (seção 17 como **Implementação**):
- **Modo fixo pela mesma condição no React e no GSAP.** A 18.1 sugere `gsap.matchMedia()`. Usamos a mesma media query num hook (`useConsultaMidia`) e ligamos o ScrollTrigger com `useGSAP` só quando ela vale, porque o React também precisa dela para trocar o layout (palco fixo × lista).
- **Palco abaixo do cabeçalho e da faixa do índice.** O palco de "Os sinais" e o da galeria grudam em `--altura-cabecalho + --altura-indice`, e o ScrollTrigger começa a contar a partir desse ponto.
- **H3 do "Virar" com o texto da 6.2** ("Virar à esquerda ou à direita"); no índice "Sinais", o link é "Virar", como no protótipo.
- **Nome do movimento na pulseira pequena** com os textos do protótipo: "Pressão contínua", "Vibração contínua", "Vira à esquerda"/"Vira à direita" e "Três vibrações curtas".
- **Tamanho do nome do sinal:** `clamp(2.2rem, 10vw, 3.5rem)`, com a mesma regra da opção C (chega ao máximo cedo, para crescer com o zoom).
- **Carrossel:** a lista recebe o foco pelo Tab e rola com as setas (sem isso, o axe acusaria uma área rolável sem acesso pelo teclado). A contagem é anunciada com educação (`aria-live="polite"`). Os botões e a contagem só aparecem depois que o JavaScript mede a lista. O botão desabilitado ganha borda tracejada, sem perder contraste e sem trocar o cursor (18.9).
- **Galeria:** as fotos não têm nada focável hoje. Mesmo assim, se no futuro algo focável entrar numa foto, a página rola até ela (18.8).
- **Polaroides com cores fixas** (branco e `#1E0F4A`, 17,2:1 nos dois temas), como uma foto de verdade. Ao passar o mouse, o cartão se endireita só sem "reduzir movimento".
- **Condições de tela em `rem`** (`min-[68.75rem]` = 1100 px; `min-[62.5rem]` = 1000 px). Misturadas com as do Tailwind, que são em `rem`, as em `px` ficavam fora de ordem, e a regra de 3 polaroides por linha vencia a de 5 (defeito achado pelo teste).
- **Encaixe do carrossel com `scroll-px-1`.** Sem ele, o encaixe deixava a lista em 4 px, e o "Anterior" aparecia habilitado já no começo (defeito achado pelo teste).
- **Cabeça da Solução com textura só à direita, no computador** (opção B): o H1 e o resumo ficam antes do ponto em que os domos começam a aparecer (conferido no teste). No celular, não há textura, porque o texto ocupa a largura toda.

**Verificação automática** (Chrome sem janela, servidor de produção): ESLint sem problemas, `next build` sem erros e **36 de 36 testes**, mais as baterias anteriores de novo (8.1: 17; 8.3: 45; 8.4: 30; 8.5: 49):
- "Nesta página" com os 9 itens da 18.8, todos com alvo; as 6 âncoras com `tabIndex={-1}`; sem a seção de ODS (os ODS estão no rodapé); cabeça com "A solução" e textura só onde não há texto; 3 passos em `<ol>` com o número decorativo.
- Os sinais (computador): modo fixo; 4 links e 4 artigos sem nada focável; rolando, Continuar → Parar → Virar → Aguardar, com `aria-current="step"`; palco parado abaixo do cabeçalho e da faixa; foto ativa em piso tátil (`--d` de 20 px) e as outras escondidas; pulseira pequena de 132 px, decorativa, com o nome do movimento; 1 canvas só na página; "Pausar animação" com `aria-pressed`; clique em "Virar" vai até o Virar.
- Carrossel: região "Tecnologias", 8 cartões, botões com texto e `aria-controls`, "Anterior" desabilitado no começo, contagem "1 a 3 de 8"; "Próximo" avança e libera o "Anterior".
- Galeria: 6 fotos com legenda; no computador, a lista anda para a esquerda com a rolagem.
- Equipe: 5 polaroides lado a lado a 1280 px, nenhum fora da tela.
- Links da abertura do Início (`#os-sinais`, `#dois-modos`, `#tecnologias`): chegam na âncora, com o foco nela e visível.
- "Reduzir movimento": sinais em lista comum, sem pulseira e sem "Pausar"; galeria em grade, parada; carrossel avança na hora.
- 375 × 800: modo fixo, pulseira de 76 px, galeria em grade, 2 polaroides por linha. 320 × 640: lista comum (menos de 340 px de largura). 1280 × 500: lista comum e galeria em grade (pouca altura). 700 × 900: 3 + 2 polaroides. Nenhum com rolagem lateral nem polaroide cortado.
- axe sem violações nos dois temas; nenhum erro no console.

**Como testar à mão:**
1. `npm run dev` → Solução. Role até "Os sinais": o palco para e, rolando, a foto troca em piso tátil (Continuar, Parar, Virar, Aguardar). A pulseira pequena mostra o sinal e pode ser pausada.
2. Clique em "Aguardar" no índice "Sinais": a página vai até esse sinal.
3. Tecnologias: use "Próximo" e "Anterior", ou deslize com o dedo, ou focalize a lista com `Tab` e use as setas. A contagem acompanha.
4. Galeria (computador): role e veja as fotos correrem para a esquerda.
5. Equipe: passe o mouse nos polaroides.
6. No Início, clique em "Os sinais" ou "Dois modos": a Solução abre na seção certa.
7. "Reduzir movimento": tudo em lista e em grade, sem nada se mexer.
8. Celular: o índice "Sinais" vira uma faixa no topo do palco, com a pulseira de 76 px ao lado de "Pausar".

**Marcadores desta subfase:**
- `IMAGEM-sinal continuar-AQUI`, `IMAGEM-sinal parar-AQUI`, `IMAGEM-sinal virar-AQUI` e `IMAGEM-sinal aguardar-AQUI`, com os alts da 18.13, em `components/solucao/SinaisRolagemFixa.jsx`.
- `IMAGEM-galeria faixa de pedestres-AQUI`, `IMAGEM-galeria calçada com obstáculo-AQUI`, `IMAGEM-galeria semáforo de pedestres-AQUI`, `IMAGEM-galeria ponto de ônibus-AQUI`, `IMAGEM-galeria plataforma do metrô-AQUI` e `IMAGEM-galeria esquina com rampa-AQUI`, com os alts da 18.13, em `components/solucao/GaleriaHorizontal.jsx`.
- `ICONE-CaretLeft-AQUI` e `ICONE-CaretRight-AQUI` (carrossel), em `components/ui/Carrossel.jsx`.
- `ICONE-Pause-AQUI` e `ICONE-Play-AQUI` (pulseira pequena), em `components/solucao/SinaisRolagemFixa.jsx`.
- `ICONE-Image-AQUI` (espaço da foto do polaroide), em `components/solucao/CartaoIntegrante.jsx`.
- Continuam: `IMAGEM-ilustração conceitual da pulseira-AQUI` e `IMAGEM-foto de (nome)-AQUI` (5), em `app/solucao/page.jsx`.

**Sugestão de commit:** `Reorganiza a Solução com sinais em rolagem fixa, carrossel, galeria e polaroides`

---

## Como os testes automáticos foram feitos

- Scripts temporários, **fora do projeto**, controlaram o Chrome sem janela pelo protocolo de depuração: clicam, preenchem formulários, apertam Tab e medem a tela.
- Para testar o CRUD completo, uma **API falsa temporária** rodou só durante os testes. O site continua sem mock, e nada disso entrou no projeto.
- **Total:** 41 testes sem API, 27 de CRUD, 54 de responsividade, 6 a 320 px com dados e 96 da auditoria de acessibilidade. Todos passaram no estado final.

---

## Glossário

| Termo | O que é |
| --- | --- |
| App Router | O sistema de rotas do Next.js: cada pasta dentro de `app/` vira um endereço |
| Componente | Pedaço reutilizável de interface (ex.: `Botao`, `Cartao`) |
| Props | Dados que um componente passa para outro |
| Custom hook | Função `use…` que guarda estado e lógica fora da tela (ex.: `useRegistros`) |
| `useState` / `useEffect` | Hooks do React para guardar um valor e para executar algo depois de desenhar a tela |
| Contexto | Valor compartilhado por vários componentes, sem passar por props |
| Server / Client Component | Componente gerado no servidor / componente que roda no navegador (`"use client"`) |
| Token | Nome de um valor de design, como uma cor (`--cor-texto`) |
| Mock | Dados falsos que fingem ser a API. **Não usado** no projeto |
| Variável de ambiente | Configuração fora do código (`.env.local`), como a URL da API |
| `aria-*` | Atributos que informam o leitor de tela (ex.: `aria-current="page"`) |
| `role="status"` / `role="alert"` | Regiões cujo texto o leitor de tela anuncia sem / com interrupção |
| Container query | Regra de CSS que olha o espaço do componente, e não a tela inteira |
| `ResizeObserver` | Avisa quando um elemento muda de tamanho |
| Lenis | Biblioteca que deixa a rolagem com a roda do mouse suave (Fase 8) |
| GSAP / ScrollTrigger | Biblioteca de animação / plugin dela que liga uma animação à rolagem (Fase 8) |
| Motion | Biblioteca de microinterações para React (Fase 8) |
| Relógio (`ticker`) | Função chamada a cada quadro da tela, cerca de 60 vezes por segundo, que faz as animações andarem |

---

## Pendências

| Pendência | Quem resolve |
| --- | --- |
| Colocar as 3 fontes (Anton, Atkinson Hyperlegible Next e JetBrains Mono), os ícones, as imagens e as fotos nos marcadores | Equipe |
| Conectar a API externa (`.env.local` + blocos `API-EXTERNA-AQUI`) | Equipe |
| Fazer o simulador (`SIMULADOR-AQUI`) e decidir sobre a vibração do celular | Integrante do simulador + equipe |
| ~~Textos da página 404 em português~~ Definidos na seção 18.11; implementação na subfase 8.7 | Fase 8 |
| Textos para esperas acima de 10 s (aviso + cancelar) | Equipe (passar os textos) |
| Alinhamento do logo com a grade no computador; cabeçalho fixo com zoom de 400% | Equipe avalia |
| Testes manuais da Fase 7 (leitor de tela, aparelhos reais) | Equipe |
| Confirmar ou mudar as decisões marcadas "Implementação" na seção 17 da especificação | Equipe |
