# Pulse — Registro do desenvolvimento

> Resumo de cada fase do desenvolvimento da aplicação web da Pulse (Global Solution 2026.2, CitizenTech, FIAP): o que foi feito, as decisões técnicas em linguagem simples, como testar e o que ficou pendente.
>
> - As regras completas, e cada decisão com o porquê, estão em `docs/ESPECIFICACAO_PULSE.md`.
> - O registro do uso de IA é mantido pela equipe em `AI.md`.
>
> Última atualização: 18/11/2026.

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
| 8 | Nova identidade e movimento (seção 18): cores, fontes, capa, pulseira 3D, rolagens, carrossel, galeria, transição entre páginas, rodapé com os ODS, 404 | — (commits por subfase, feitos pela equipe) |
| 9 | Efeitos, paleta nova, pulseira nova e vídeos (seção 19): interruptor "Efeitos", paleta laranja e grafite, fontes por `next/font/google`, polimento, efeitos e interações novos, Tecnologias em cartões que viram, Galeria em canvas, Equipe no varal, pulseira 3D nova, vídeos, microinterações do Diário e revisão | Por subfase, feitos pela equipe: de `4b4a510` (9.1) a `bbe23f9` (9.10) |
| Depois da 9 | Ícones, imagens, ajustes do celular, `alt`, espera acima de 10 s, limpeza dos comentários, auditoria, repositório novo, Simulador, aviso de espera visível e sobras da auditoria (seção "Depois da Fase 9") | Repositório antigo: de `8f1e389` a `4b8922f`. Repositório novo: `giovanaborba/GSCitizen-1ESPU` |

**Em números:** 7 rotas + página 404 + a rota de API `app/api/rotas` · **72** componentes (o mínimo é 8) · **39** arquivos de hooks (40 hooks, o mínimo é 2: `usePulseiraSimulador.js` exporta também o `useSomSemaforo`) · **3** serviços (`apiClient`, `registrosService` e `simuladorService`) · **12** módulos em `lib/` (entrou `simulador/dados`).

**Como a aplicação é organizada:**

```
Tela (componente)  →  hook (estado)  →  serviço  →  apiClient  →  fetch → API externa
TelaDiario            useRegistros       registrosService.listar()    (único fetch do site)
```

Os componentes de apresentação só recebem dados e funções por props. Se a API mudar, só a pasta `services/` precisa de ajuste.

**Movimento e 3D (Fase 8)** seguem a mesma separação: os componentes só desenham; quem anima são hooks (`usePulseira3D`, `useRolagemFixa`, `useTransicaoPagina`…) e módulos em `lib/`. Nenhum deles chama `fetch`.

```
Componente (ex.: AberturaPulseira)  →  hook (ex.: usePulseira3D)  →  lib/pulseira3d (cena e sinais)  →  Three.js
Componente (ex.: SinaisRolagemFixa) →  hook (ex.: useRolagemFixa) →  GSAP + ScrollTrigger (relógio único com o Lenis)
```

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

---

## Fase 1 — Estilos globais

**Arquivos:** `app/globals.css` e `app/layout.jsx`.

**O que foi feito:**
- todas as cores dos dois temas como variáveis CSS, que trocam sozinhas no modo escuro do aparelho;
- a ligação das cores com o Tailwind, para usar classes como `bg-fundo` e `text-texto`;
- a escala de tipografia, os cantos, as sombras e o contorno de foco (3 px, afastado 2 px);
- regras para o alto contraste do Windows e para "reduzir movimento".

**Decisões, em linguagem simples:**
- **Token** é um nome para um valor de design (`--cor-texto` = `#1E0F4A`). Muda num lugar só e vale para o site todo.
- **`@theme inline`** é o jeito do Tailwind v4 criar classes a partir dos tokens. Quando o tema muda, a classe acompanha, sem precisar de `dark:`.
- **A paleta padrão do Tailwind foi removida.** Assim ninguém usa uma cor sem contraste conferido, e a regra "sem amarelo" fica garantida.
- **`:focus-visible`** mostra o contorno só para quem navega pelo teclado.
- **Hover com cores da paleta:**
  - botão principal claro `#3B1D8B` → `#2A1366`;
  - botão principal escuro `#FFFFFF` → `#EDE8FC`;
  - botões secundários e itens da barra ganham o fundo do cartão.

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

---

## Fase 3 — Páginas de conteúdo

**O que foi feito:**
- as páginas Início, Solução e Simulador, com os textos exatos da seção 6;
- os componentes `Cartao`, `EspacoImagem`, `IndiceNestaPagina`, `CartaoIntegrante`, `TituloPagina` e `Secao`;
- na Solução, a seção Equipe com os 5 integrantes;
- no Simulador, um espaço reservado com os requisitos do simulador.

**Decisões, em linguagem simples:**
- **"Principal" dentro do título do ODS 10:** quem navega de título em título com o leitor de tela ouve "Principal, ODS 10…".
- **Os sinais em lista de definições (`<dl>`):** o leitor de tela entende "Modo tátil" e a explicação como um par.
- **Espaço explícito no JSX (`{" "}`):** sem ele, o leitor de tela leria "90%dos" grudado.

---

## Fase 4 — Camada de dados (sem API)

**O que foi feito:**
- `services/apiClient.js`: o **único** arquivo que faz `fetch`;
- `services/registrosService.js`: as 5 funções `listar`, `obter`, `criar`, `atualizar` e `excluir`;
- `lib/datas.js`, `lib/rotulos.js` e `lib/validacao.js`: funções puras.

**Decisões, em linguagem simples:**
- **Sem mock.** Enquanto `NEXT_PUBLIC_API_URL` não estiver configurada, toda função lança o erro `{ codigo: "conexao" }`, e as telas mostram "Não foi possível carregar os registros.".
- **O `fetch` já está escrito** seguindo o contrato da seção 7.6.
- **Função pura:** recebe valores e devolve um resultado, sem chamar API nem mexer na tela. Por exemplo, `formatarData("2026-11-05")` devolve sempre `"05/11/2026"`.
- **Datas como texto:** `new Date("2026-11-05")` lê a data em UTC, e no Brasil viraria o dia 04.
- **Registros de exemplo:** não criados agora (decisão da equipe).

**Para ligar a API:** seção 7.6 da especificação.

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

---

## Fase 8 — Nova identidade e movimento

A equipe aprovou uma identidade visual e de movimento nova (seção 18 da especificação). A fase foi feita em 9 subfases (8.0 a 8.8), com uma pausa para aprovação no fim de cada uma. **Cada mudança está registrada aqui.**

### 8.0 — Leitura e plano (sem código)

**O que foi feito:** leitura da seção 18 e das notas (Fase 8) das outras seções; exame do projeto; plano das subfases 8.1 a 8.8, com o comando de instalação e os riscos.

**Decisões da equipe**:

| # | Decisão |
| --- | --- |
| 1 | "Nesta página" em pílulas, depois do resumo (Solução) ou da abertura (Início). A coluna lateral da 9.4 sai. No computador (≥ 1024 px e altura ≥ 700 px), o índice gruda embaixo do cabeçalho ao rolar, e a pílula da seção atual fica dourada (`aria-current="true"`). |
| 2 | Valem os textos da especificação ("O problema", "Cerca de 90%", "7,9 milhões"). Entra uma introdução em Tecnologias. Com "reduzir movimento", a abertura mostra "Sinais da Pulse" e "Veja cada sinal explicado na página Solução." (uma frase que pedisse para desligar uma configuração de acessibilidade não serve). |
| 3 | Rótulos mono: os da 18.5, mais "Como usar", "Por dentro", "Quem fez" e "Experimente", e também "As pessoas", "No trajeto", "Ecossistema", "Próximos passos" e "Por que a Pulse". O Diário fica sem rótulo. |
| 4 | Cabeçalho: "Pulse" com o ícone e "GS 2026.2 · CitizenTech" em mono à direita. |
| 5 | A cortina de piso tátil aparece só ao entrar e ao sair do Diário; entre as páginas internas do Diário não há cortina. O diálogo e as mensagens continuam sem animação. |
| 6 | Capa: uma camada sólida, criada por um script no `<head>`, evita que a página apareça por um instante antes da capa. Só existe quando a chave `pulse-capa-vista` não existe; some quando a capa monta ou em no máximo 2 s. |

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
| `app/layout.jsx` | `ProvedorMovimento` em volta do site |
| `app/globals.css` | Variáveis `--fonte-titulo`, `--fonte-base` e `--fonte-mono` com as fontes de reserva; classes `font-titulo` e `font-mono`; CSS do Lenis; `scroll-behavior: auto` quando o Lenis está ativo |

**Decisões da implementação**:
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

### 8.2 — Cores, tipografia e linguagem visual

**Arquivos:**

| Arquivo | Mudança |
| --- | --- |
| `app/globals.css` | Tokens da paleta da Fase 8 (roxo, lilás, dourado e creme) nos dois temas, mais decoração, 3D, cortina e rodapé; tokens antigos removidos; H1 e H2 em Anton com maiúsculas só por CSS; corpo com altura de linha 1,55; links e foco na cor da marca; utilitários `textura-piso`, `rotulo-mono` e `palavra-fundo`; textura e palavra de fundo desligadas no alto contraste do Windows |
| `components/ui/PalavraFundo.jsx` (novo) | Palavra gigante decorativa (`aria-hidden`), com tamanho `min(21rem, 150vw ÷ letras)` |
| `components/ui/Botao.jsx` | Pílula de 56 px; principal dourado (no hover: sombra e subida de 2 px, sem trocar a cor); secundário com contorno de 2 px na cor da marca |
| `components/ui/Cartao.jsx`, `Campo.jsx`, `GrupoOpcoes.jsx`, `EspacoImagem.jsx`, `DialogoConfirmacao.jsx` | Fundo `--cor-superficie` no lugar de `--cor-cartao` e `--cor-cromo`; campos e opções com canto de 12 px; título do diálogo no menor tamanho do H2 |
| `components/layout/BarraNavegacao.jsx`, `ItemBarra.jsx`, `Cabecalho.jsx`, `IndiceNestaPagina.jsx`, `LinkPular.jsx` | Cores novas: item ativo e "Pular para o conteúdo" em dourado com texto `#120B24` |
| `components/solucao/CartaoIntegrante.jsx`, `components/diario/CartaoRegistro.jsx`, `app/solucao/page.jsx` | Só a troca das classes de cor e de canto |

**Tokens removidos:** `--cor-cromo`, `--cor-cartao`, `--cor-botao`, `--cor-botao-texto`, `--cor-botao-hover`, `--cor-link` e `--cor-foco`, e as cores `#3B1D8B`, `#2E1670` e `#2A1366` como fundo. O `#2A1366` continua só como texto do botão de perigo no tema escuro, como manda a paleta da Fase 8.

**Decisões da implementação**:
- **Hover e borda dos itens da barra calculados a partir da marca.** `--cor-hover` é a marca a 12%. `--cor-linha-item` é a marca a 70%: 4,3:1 no claro e 5,3:1 no escuro (mínimo de 3:1). Como os dois são calculados, acompanham o tema sozinhos.
- **Cantos.** Cartões, fotos e mensagens com 18 px (18.5). Campos, opções do formulário e etiquetas continuam com 12 px (seção 8.3), porque a 18.5 não fala deles. Botões em pílula. O diálogo continua com 16 px. A barra vira pílula na 8.3.
- **Título do diálogo.** É um H2, então usa a Anton, mas no menor tamanho do H2 (2,2rem). O tamanho normal chegaria a 4rem num diálogo estreito.
- **Rótulo mono sem cor fixa.** O utilitário `rotulo-mono` define fonte, tamanho e espaçamento; a cor vem de quem usa (`text-destaque` na página, dourado no rodapé).
- **Subida do botão dourado só com movimento permitido** (`motion-safe:`). A sombra do hover vale sempre.
- **Alto contraste do Windows.** A textura e a palavra de fundo são desligadas nesse modo, para não virarem ruído nem texto gigante.
- **Hover do botão em CSS, não em Motion.** É uma mudança simples de estado e não precisa de JavaScript. O Motion fica para as animações comandadas por código (abertura, nas próximas subfases).

**Verificação automática:**
- ESLint sem problemas e `next build` sem erros.
- **Contraste calculado:** 67 de 67 pares (texto ≥ 7:1; bordas e foco ≥ 3:1), nos dois temas, no rodapé, no hover, nos status, no botão de perigo e no polaroide. Os valores batem com a tabela de cores da Fase 8.
- **axe-core** (WCAG 2.2 AA + contraste 7:1): 0 violações em Início, Solução, Simulador, Diário e Novo registro, nos dois temas.
- **320 px:** nenhuma rolagem lateral nas 5 páginas, nos dois temas.
- Nenhum erro no console.

**Como testar à mão:**
1. `npm run dev`. Com o aparelho no tema claro: fundo creme, cartões brancos, títulos H1 e H2 em maiúsculas e em roxo, item ativo da barra em dourado.
2. Troque o aparelho para o tema escuro: fundo `#120B24`, títulos e links em lilás.
3. Passe o mouse num botão dourado (ex.: "Conheça a solução"): aparece uma sombra e o botão sobe 2 px. Com "reduzir movimento" ligado, só a sombra aparece.
4. Navegue com `Tab`: o contorno de foco tem 3 px, na cor da marca.
5. Selecione um título com o mouse e copie: o texto colado vem normal ("Tema CitizenTech"), porque as maiúsculas são só visuais.

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
| `components/layout/Cabecalho.jsx` | "Pulse" em Anton com o ícone, rótulo "GS 2026.2 · CitizenTech" à direita, largura de 76rem; mede a própria altura |
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

**Decisões da implementação**:
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

**Decisões da implementação**:
- **Ritmo do "Parar": um anel a cada 0,35 s**. Assim nenhum sinal passa de 3 anéis por segundo (WCAG 2.3.1).
- **404 sem anéis sobrando:** os últimos anéis do modo `parar` saem até 3,7 s, para tudo terminar até 4,6 s (WCAG 2.2.2).
- **O `<canvas>` é criado pelo hook, não no JSX.** No modo de desenvolvimento, o React monta, desmonta e monta de novo cada componente; um canvas cujo WebGL já foi liberado não pode ser reaproveitado.
- **A descrição fica na caixa, não no canvas.** A caixa tem `role="img"` e o `aria-label` com a descrição, e só ganha esse papel quando o primeiro quadro fica pronto. Antes disso, quem descreve é o texto de reserva. Assim o leitor de tela nunca lê a descrição duas vezes.
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

**Decisão da equipe depois da 8.4 — textura atrás do texto (opção B).** A textura de piso tátil só aparece no meio da área (atrás da pulseira) e se apaga em direção às bordas, onde fica o texto. Assim nenhum texto fica sobre os domos (seção 18.2, item 1). Vale também para as cabeças de página das próximas subfases.

### 8.5 — Início

**Arquivos:**

| Arquivo | Mudança |
| --- | --- |
| `hooks/useCapaIntro.js` (novo) | Primeira visita da sessão (`sessionStorage`, chave `pulse-capa-vista`, com `try/catch`), saída por clique, roda, toque, tecla ou foco, saída em piso tátil (1 s), Lenis parado com a capa na tela |
| `components/abertura/CapaIntro.jsx` (novo) | Capa (`aria-hidden`, nada focável): logo que pulsa uma vez, rótulo, "PULSE", frase sobre faixa sólida e dica com seta |
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

**Decisões da implementação**:
- **O logo pulsa sobre o fundo escuro da capa**, e não sobre o fundo da página. A camada de espera já é escura, e trocar para o creme por 1 s e voltar ao escuro piscaria.
- **Capa sem imagem, por enquanto, com fundo sólido `#120B24`.** Todo texto da capa tem contraste de 7:1 ou mais. Na Fase 9, a capa passou a usar vídeo (9.8).
- **Tamanho de "PULSE" na capa** com `vw`. É decoração (`aria-hidden`) e some com qualquer tecla ou toque. A frase e a dica usam `rem`, para crescerem com o zoom.
- **Revelação com Motion:** com a capa na tela, os títulos e os links ficam escondidos; ao sair, aparecem (0,6 s). Na primeira pintura e sem JavaScript, já aparecem no lugar. Com "reduzir movimento", na hora.
- **A palavra de fundo tem a altura da pulseira e a largura da tela.** No computador, ela passa por trás dos textos dos links, no tamanho da 18.6. Contraste desses textos sobre ela: texto 13,6:1 (claro) e 14,1:1 (escuro); texto secundário 8,1:1 e 10,8:1. O rótulo dourado do sinal ficaria em 6,84:1 no escuro, por isso a palavra nunca desce até a linha dele.
- **Uma lista só com os 6 links**, posicionados com `subgrid` no computador: a ordem no HTML não muda, e o leitor de tela anuncia "lista, 6 links" em qualquer tela.
- **Linhas escritas direto no SVG**, sem passar pelo estado do React, porque mudam a cada quadro. Elas são redesenhadas também quando a janela muda de tamanho com a pulseira parada.
- **Pílulas do índice sem sublinhado**, como os itens da barra: são controles de navegação em formato de botão, não links no meio do texto.
- **Margem de rolagem nos títulos com rótulo** (`scroll-margin-top` de 40 px): ao pular para a seção, o rótulo aparece junto, em vez de ficar atrás da faixa do índice. A seção atual do índice também desconta essa margem.
- **Número dos cartões de dados em `rem` (3,25rem), não em `vw`.** Com `vw`, teria o mesmo problema de zoom da opção C.

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

**Decisões da implementação**:
- **Modo fixo pela mesma condição no React e no GSAP.** A 18.1 sugere `gsap.matchMedia()`. Usamos a mesma media query num hook (`useConsultaMidia`) e ligamos o ScrollTrigger com `useGSAP` só quando ela vale, porque o React também precisa dela para trocar o layout (palco fixo × lista).
- **Palco abaixo do cabeçalho e da faixa do índice.** O palco de "Os sinais" e o da galeria grudam em `--altura-cabecalho + --altura-indice`, e o ScrollTrigger começa a contar a partir desse ponto.
- **H3 do "Virar" com o texto da 6.2** ("Virar à esquerda ou à direita"); no índice "Sinais", o link é só "Virar", para caber na faixa.
- **Nome do movimento na pulseira pequena** com os textos curtos "Pressão contínua", "Vibração contínua", "Vira à esquerda"/"Vira à direita" e "Três vibrações curtas".
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

### 8.7 — Página 404 e Diário

**Arquivos:**

| Arquivo | Mudança |
| --- | --- |
| `app/not-found.jsx` (novo) | Página 404 da 18.11: aba "Página não encontrada — Pulse", rótulo "Erro 404", H1 "Você saiu da rota", texto, botões "Voltar ao Início" (dourado) e "Ir para a Solução" (secundário), pulseira no modo `parar` com a legenda, palavra "Parar" e textura ao fundo |
| `hooks/usePulseira3D.js` | O modo `parar` passa a contar o tempo real (ver abaixo) |
| `components/ui/PalavraFundo.jsx` | Opção `tamanho`, para a palavra caber numa coluna em vez da tela inteira |
| `components/diario/ResumoIndicadores.jsx` | Números grandes em Anton, na cor de destaque (só cor e fonte) |
| `app/simulador/page.jsx` | Rótulo mono "Experimente" e textura numa faixa à direita da cabeça; o "Espaço reservado" continua igual |

**Diário:** conferido em `/diario`, `/diario/novo`, `/diario/[id]` e `/diario/[id]/editar`. Nenhuma textura, palavra de fundo, rótulo mono, cena 3D ou animação. Recebeu só as cores e as fontes (nas subfases 8.2 e 8.7), e o título do diálogo usa o menor tamanho do H2. Entre as páginas do Diário, a troca continua instantânea (decisão 5). A camada de dados (`services/`, `lib/validacao.js`, `lib/datas.js`) não foi tocada.

**Defeito encontrado e corrigido:** na 404, a pulseira continuava se mexendo depois de 5,5 s no teste. O relógio da animação limita cada passo a 0,05 s, para não dar saltos quando o navegador engasga. Num aparelho lento (o WebGL por software do teste faz cerca de 15 quadros por segundo), o tempo da animação anda mais devagar que o real, e os 4,6 s viravam mais de 6 s de verdade. Agora o modo `parar` mede o tempo real (relógio do navegador) desde o primeiro quadro animado. A WCAG 2.2.2 conta segundos de verdade.

**Decisões da implementação**:
- **"Parar" e textura só na coluna da pulseira.** O tamanho da palavra acompanha a largura dessa coluna (unidade `cqw`, a largura do "contêiner"). Assim nenhum texto da 404 fica sobre a palavra ou os domos (18.2, item 1). No tema escuro, o rótulo dourado sobre a palavra ficaria em 6,84:1.
- **Reserva da pulseira na 404 decorativa**, como a pulseira e a legenda (`aria-hidden`): o texto da página já explica a situação.
- **Números do resumo do Diário com 2,5rem** (em `rem`, para crescerem com o zoom).

**Verificação automática** (Chrome sem janela, servidor de produção): ESLint sem problemas, `next build` sem erros e **28 de 28 testes**, mais todas as baterias anteriores de novo (8.1: 17; 8.3: 45; 8.4: 30; 8.5: 49; 8.6: 36), sem regressão:
- Endereço inexistente responde 404, com a aba "Página não encontrada — Pulse" e `lang="pt-BR"`; os textos da 18.11 já vêm no HTML do servidor.
- H1, rótulo e botões certos (dourado e contorno); legenda, palavra "Parar" e pulseira decorativas; palavra só na coluna da pulseira; texto e pulseira lado a lado no computador; 375 e 320 px com o texto primeiro e a pulseira embaixo, sem rolagem lateral.
- A pulseira vibra no começo e para antes de 5 s; com "reduzir movimento", um quadro parado; sem WebGL, a descrição no lugar, sem erro no console.
- "Voltar ao Início" leva ao Início com o foco no H1.
- Diário (4 páginas): sem textura, palavra de fundo, rótulo mono ou 3D; H1 com a fonte de título em maiúsculas.
- Simulador: rótulo "Experimente", textura só onde não há texto, "Espaço reservado" no lugar.
- axe sem violações na 404 e no Simulador, nos dois temas; nenhum erro no console.

**Como testar à mão:**
1. `npm run dev` e abra um endereço que não existe (ex.: `/qualquer-coisa`): aparece "Você saiu da rota", e a aba diz "Página não encontrada — Pulse".
2. A pulseira faz o sinal de parar e para sozinha em menos de 5 s.
3. "Voltar ao Início" leva ao Início; "Ir para a Solução", à Solução.
4. No celular, a pulseira fica embaixo do texto.
5. Diário: tudo com as cores e as fontes novas, sem nada se mexendo. Quando a API existir, confira os números do Resumo em Anton.
6. Simulador: rótulo "Experimente" acima do título.

### 8.8 — Revisão

**Arquivos:**

| Arquivo | Mudança |
| --- | --- |
| `hooks/useFaixaODS.js` e `components/solucao/FaixaODS.jsx` | A faixa volta ao começo quando o foco sai de um botão para fora dela; a lógica saiu da `<div>` da faixa (que não é interativa) e foi para os botões |
| `hooks/useGaleriaHorizontal.js` e `components/solucao/GaleriaHorizontal.jsx` | O cuidado com o foco dentro de uma foto virou um ouvinte criado no hook, só no modo horizontal (a lista não tem mais um `onFocus`) |
| `components/ui/Carrossel.jsx` | Comentário explicando por que a lista recebe o foco |

**Critérios de aceite da Fase 8:**

| Critério | Resultado | Como foi verificado |
| --- | --- | --- |
| Itens da 18.2 em cada página | ok | Contraste calculado; "reduzir movimento"; pausa em tudo o que se move sozinho por mais de 5 s (pulseira da abertura, pulseira pequena, faixa dos ODS); a 404 para antes de 5 s; no máximo 3 anéis por segundo; nada invisível com foco; cursor nunca trocado; decorações com `aria-hidden`; ícones com texto; desempenho (abaixo) |
| "Reduzir movimento": nada se move | ok | Em todas as 7 páginas: nenhuma animação rodando (`document.getAnimations()`) e nenhum desenho novo na cena 3D; sem rolagens fixas; capa e trocas de página instantâneas |
| 320 px; zoom de 400%; polaroides | ok | Nenhuma página com rolagem lateral a 320 px, com zoom de 400% (320 × 180), com texto em 200% e com espaçamento de texto aumentado (1.4.12); com zoom de 400%, sinais e galeria em lista e índice e barra parados; nenhum polaroide cortado |
| Teclado | ok | Tab do começo ao fim em 7 páginas (de 10 a 33 focos cada): todo elemento focado está visível, tem contorno, não está transparente, não está dentro de `aria-hidden` e não fica coberto por cabeçalho, barra ou índice. A capa nunca prende o foco |
| Contraste com os tokens da Fase 8 | ok | 67 de 67 pares (dois temas e rodapé), mais o texto sobre a textura e sobre a palavra de fundo (os pares abaixo de 7:1 foram evitados: ver 8.4, 8.5 e 8.7) |
| WebGL desligado | ok | Início e 404: descrição em texto, sem erro no console; Solução: a pulseira pequena some |
| Uma cena 3D por vez; memória | ok | 1 canvas por página; em 5 idas e voltas, todos os contextos WebGL liberados |
| ESLint `jsx-a11y` e axe | ok, com 1 exceção registrada | ESLint do projeto: 0 problemas. Varredura com as 33 regras do `jsx-a11y`: 1 aviso conhecido (ver abaixo). axe (WCAG 2.2 AA + contraste 7:1): 0 violações em 10 estados × 2 temas |
| Diário sem efeitos | ok | 4 páginas sem textura, palavra de fundo, rótulo mono, 3D ou cortina interna |

**A exceção do `jsx-a11y`:** a lista do carrossel recebe o foco (`tabIndex={0}`). A regra `no-noninteractive-tabindex` não gosta disso, mas a lista é uma área rolável sem nada focável dentro: sem o foco, quem usa só o teclado não consegue rolá-la, e o axe acusaria `scrollable-region-focusable` (WCAG 2.1.1). O ESLint do projeto não liga essa regra; o motivo está escrito no código.

**Estados testados no axe (nos dois temas):** Início com a capa; Início; Solução no topo; Solução em "Os sinais" (modo fixo); Solução no rodapé com os ODS (carrossel avançado); Simulador; Diário com erro de conexão (sem API); Novo registro com erros de preenchimento; diálogo "Descartar as respostas?"; página 404.

**Checklist da seção 15:**

| Item | Resultado |
| --- | --- |
| Só teclado, foco visível e nunca escondido | ok (automático) |
| "Pular para o conteúdo" é o primeiro foco | ok (automático, também com a capa) |
| Um H1 por página, títulos em ordem, regiões | ok (axe) |
| Título da aba único; foco no H1 ao trocar de rota | ok (automático; com âncora, o foco vai para o título da âncora) |
| Leitor de tela | **manual** (passo a passo abaixo) |
| 320 px; zoom de 200% e 400% | ok (automático) |
| Texto ampliado nas configurações do celular | **manual** (simulado com texto em 200%: ok) |
| Contraste nos dois temas | ok (automático) |
| "Reduzir movimento" | ok (automático) |
| Alto contraste do Windows | ok (simulado: textura e palavra desligadas, item ativo com a cor do sistema, trocas instantâneas); **manual** no Windows real |
| Alvos de toque ≥ 48 × 48 px | ok (axe `target-size` e medidas dos componentes) |
| Nada só por cor; ícone com texto | ok |
| Toda imagem com `alt` | ok (decorações com `aria-hidden`) |
| ESLint `jsx-a11y` e axe | ok (com a exceção explicada) |
| Sem a API: Diário com erro de conexão | ok |
| CRUD com a API | ok (resolvido na 9.9, com o MockAPI) |

**Defeitos corrigidos nesta subfase:** os 3 pontos do `jsx-a11y` acima (2 corrigidos, 1 exceção explicada). Nos testes, duas travas eram do próprio script: medidas que esperavam um quadro de animação em abas fora de primeiro plano, e o aviso "Sair do site?" do formulário preenchido, que estava funcionando e esperando resposta. Na regressão final (todas as baterias seguidas, no mesmo navegador), 1 teste da 8.5 falhou porque dezenas de abas abertas atrasaram o evento de foco. Num navegador limpo, a 8.5 passou inteira (49 de 49).

#### Testes que precisam ser feitos por uma pessoa

1. **Leitor de tela no computador (NVDA, gratuito, nvaccess.org).**
   - Abra o site numa aba nova. A capa não é lida, e o primeiro `Tab` vai para "Pular para o conteúdo".
   - Início, com `H` (títulos) e `D` (regiões): H1 → resumo → pulseira ("Pulseira Pulse em 3D: uma tira roxa…") → "Pausar animação, botão, não pressionado" → "Partes da solução, lista, 6 links" → "Nesta página". O nome do sinal que muda e a palavra gigante **não** podem ser lidos.
   - Solução: navegação "Sinais" com 4 links (o atual lido como "etapa atual") → "Pausar animação" → os 4 sinais em ordem, cada um com o `alt` da foto, o título e "Modo tátil: …". Carrossel lido como "Tecnologias, carrossel", com "Anterior" e "Próximo".
   - Rodapé da Solução: "A Pulse e os ODS" → "Pausar" → cada ODS lido com o nome e a frase completa. A cópia da faixa não é lida.
   - Troca de página: a cortina não é lida; o leitor anuncia o novo H1.
   - 404: "Erro 404" → "Você saiu da rota" → texto → dois botões.
2. **Leitor de tela no celular (TalkBack no Android, VoiceOver no iPhone).** Repita os fluxos acima deslizando o dedo. No VoiceOver, use o rotor em "Títulos".
3. **Aparelho real (celular simples, de preferência):**
   - a pulseira da abertura anima sem engasgar; se engasgar, avise (há uma proposta de material mais leve, a ser decidida antes);
   - em "Os sinais", o palco fica parado ao rolar com o dedo e a foto troca;
   - o toque arrastado tira a capa;
   - a barra e o cabeçalho somem e voltam ao rolar.
4. **"Reduzir movimento" real.** Windows: Configurações > Acessibilidade > Efeitos visuais > Efeitos de animação desligado. Android: Acessibilidade > Remover animações. iPhone: Acessibilidade > Movimento > Reduzir movimento. Esperado: nada se move; capa e trocas instantâneas; sinais e galeria em lista; sem botões de pausa.
5. **Alto contraste do Windows real** (Configurações > Acessibilidade > Temas de contraste). Esperado: textura e palavra de fundo somem, bordas visíveis, item ativo da barra e pílula atual do índice destacados, foco visível.
6. **Zoom de 400%** (janela de 1280 px, `Ctrl` + `+` até 400%). Esperado: sem rolagem lateral; "Os sinais" e a galeria em lista; o índice e a barra não grudam.
7. **Texto ampliado no celular** (Android: tamanho da fonte no máximo; iPhone: "aA" → 200% no Safari). Esperado: nada cortado; os títulos crescem junto.
8. **WebGL desligado** (Chrome: `chrome://settings/system` → desligar "Usar aceleração gráfica" e reiniciar). Esperado: descrição em texto no lugar da pulseira, na Início e na 404.

---

## Fase 9 — Efeitos, paleta nova, pulseira nova e vídeos

A equipe aprovou a Fase 9 (seção 19 da especificação e o padrão `PADRAO_MOVIMENTO_PULSE.md`). A fase é feita em 11 subfases (9.0 a 9.10), com uma pausa para aprovação no fim de cada uma. **Cada mudança está registrada aqui.**

### 9.0 — Leitura e plano (sem código)

**O que foi feito:** leitura da seção 19, das notas (Fase 9) das outras seções e do padrão de movimento; exame do projeto; plano das subfases 9.1 a 9.10; inventário dos lugares que conferem "reduzir movimento"; riscos.

**Conferido no projeto:** nenhum pacote novo é necessário (`next/font` vem com o Next; `SplitText` e `ScrollTrigger` vêm no `gsap` 3.15; `RoundedBoxGeometry` e `RoomEnvironment` vêm no `three`). Os 15 vídeos, os quadros parados e as legendas já estão em `public/videos/` (17 MB no total).

**Inventário de "reduzir movimento"** (a 19.2 estimou cerca de 20 lugares; a contagem real é 22): o hook `usePrefereMovimentoReduzido` em 4 lugares, 10 consultas diretas a `matchMedia`, 5 classes `motion-safe:`/`motion-reduce:` e 3 blocos `@media (prefers-reduced-motion)`, mais o `MotionConfig`. Todos passam para a preferência única na 9.1.

**Decisões da equipe**:

| # | Decisão |
| --- | --- |
| 1 | **Granulado atrás do conteúdo.** A conta prévia mostrou que um grão cinza por cima de tudo baixa 3 pares para menos de 4,5:1, mesmo com o mínimo de 4% (laranja `#CC4200` na faixa clara: 4,44; laranja `#FC4C02` na faixa escura e texto do botão principal: 4,25). Por isso o grão fica só no fundo da página e das faixas (cartões, botões e campos o cobrem), com a cor por tema: clara no tema claro e escura no escuro. Assim o contraste nunca cai. |
| 2 | **Vídeos com os caminhos ligados.** Como os arquivos já estão em `public/videos/`, o `VideoPulse` usa os caminhos reais. Sem o arquivo, a caixa mostra uma reserva, sem erro. |
| 3 | **O padrão de movimento vence** nos 3 pontos em que discorda da seção 19: preloader de 1,4 s (e não 1,2 s); cartão de Tecnologias com `spring.suave` (0,42 s, e não 0,55 s em CSS); "texto que se constrói" com o gesto GUIA, sem a máscara de domos (os domos ficam só na capa, na cortina e na troca de foto). |
| 4 | **Espaço vazio de ícone some em todo o site** até o ícone entrar, para a barra e os botões ficarem com o texto centralizado. Revê a regra antiga "mantém o tamanho final". |

**Propostas da implementação aceitas no plano**:
- **Lenis sem `stop()`.** A 19.2 pede `stop()` com os efeitos desligados, mas o `stop()` põe no `<html>` uma classe com `overflow: clip` (do CSS do próprio Lenis) e cancela a roda do mouse: a página deixaria de rolar. Com os efeitos desligados, o Lenis nem é criado; ao religar, é criado de novo.
- **Abertura:** "Pausar o giro" para também a passagem automática dos sinais (WCAG 2.2.2), e a caixa da pulseira recebe foco para as setas do teclado.
- **Seções fixas com `position: sticky`** do CSS (o GSAP só lê o progresso), para não desalinhar as âncoras e o Lenis.

**Também vence a especificação:** a linha antes do rótulo tem 24 px (19.6); o tema segue só o aparelho, sem um botão de tema.

### 9.1 — Base: preferência de movimento única e o interruptor "Efeitos"

**O que mudou para quem usa:** o cabeçalho ganhou o botão "Efeitos: ligados" / "Efeitos: desligados", à direita do rótulo "GS 2026.2 · CitizenTech". Desligado, nada se move em nenhuma página: sem rolagem suave, sem capa, sem cortina entre páginas, sem faixa dos ODS andando, sem "Os sinais" e galeria em rolagem fixa, com a pulseira 3D parada e as barras sempre visíveis. A escolha vale na hora e continua depois de recarregar. Sem escolha salva, o botão começa desligado quando o aparelho pede "reduzir movimento".

**Arquivos:**

| Arquivo | Mudança |
| --- | --- |
| `lib/presetsMovimento.js` (novo) | Molas (`spring.rapida`, `padrao`, `suave`), `saida`, `cascata` e os gestos `pulso`, `guia` e `tremor`, iguais ao PADRAO_MOVIMENTO_PULSE |
| `lib/efeitos.js` (novo) | O estado único: lê e grava o atributo `data-efeitos` do `<html>` e a escolha no `localStorage` (`pulse-efeitos`, com `try/catch`), e avisa quem assina |
| `hooks/useEfeitos.js` (novo) | Contexto e hook `useEfeitos()`: `efeitosLigados`, `efeitosConhecidos` e `alternarEfeitos()` |
| `hooks/useRolagemSuave.js` (novo) | Devolve o Lenis do site, ou `null` com os efeitos desligados (substitui o `useLenis` do pacote) |
| `components/layout/ProvedorMovimento.jsx` | Fornece o estado; acompanha o aparelho só sem escolha salva; cria o Lenis ao ligar e o destrói ao desligar; `MotionConfig` com `spring.padrao` e `reducedMotion` "never"/"always" |
| `components/layout/InterruptorEfeitos.jsx` (novo) | Botão com `aria-pressed`, texto visível, trilho decorativo (`aria-hidden`), 48 px, contorno de 2 px em `--cor-borda` e a bolinha com `spring.rapida` |
| `components/layout/Cabecalho.jsx` | Botão "Efeitos" à direita do rótulo; abaixo de 640 px, o rótulo desce para a linha de baixo |
| `app/layout.jsx` | Script do `<head>` grava `data-efeitos` antes da pintura e só prepara a camada da capa com os efeitos ligados |
| `app/globals.css` | Variantes `efeitos-ligados:` e `efeitos-desligados:`; os 3 blocos `@media (prefers-reduced-motion)` viraram regras com `data-efeitos` |
| `hooks/useCapaIntro.js` | Sem capa com os efeitos desligados (e ela conta como vista); usa `useRolagemSuave` |
| `hooks/useTransicaoPagina.js`, `useLinhasPartes.js`, `useInclinacaoMouse.js`, `useCarrossel.js` | Leem o estado único (`efeitosLigadosAgora()`) em vez do aparelho |
| `hooks/usePulseira3D.js` | Usa `useEfeitos()`; ligar e desligar redesenha na hora (quadro parado ou animação) |
| `hooks/useDirecaoRolagem.js`, `useRolagemFixa.js`, `useGaleriaHorizontal.js`, `components/ui/PalavraFundo.jsx`, `components/abertura/AberturaPulseira.jsx` | Usam `useEfeitos()`; a revelação da abertura passou para o gesto GUIA com `spring.padrao` |
| `components/abertura/CapaIntro.jsx`, `PartesSolucao.jsx`, `components/ui/Botao.jsx`, `components/solucao/CartaoIntegrante.jsx`, `FaixaODS.jsx` | `motion-safe:` e `motion-reduce:` → `efeitos-ligados:` e `efeitos-desligados:` |
| `hooks/usePrefereMovimentoReduzido.js` | Continua, mas só o `ProvedorMovimento` usa (valor inicial e mudança do aparelho) |
| Comentários em 11 arquivos | "reduzir movimento" → "efeitos desligados" |

**Decisões da implementação**:
- **O estado mora no `<html>`.** O script do `<head>` grava `data-efeitos` antes de a página aparecer. Assim o CSS, o texto do botão e as cores do trilho já nascem certos, sem "piscar". O React lê o mesmo atributo.
- **No servidor, o estado é "desconhecido"** e conta como desligado. Por isso nada (Lenis, GSAP, 3D) começa antes de o React ler o valor real, e nada precisa ser desfeito logo depois.
- **Sem JavaScript, nada se move.** Sem o atributo, as regras de "efeitos desligados" valem (`:root:not([data-efeitos="ligados"])`), então a faixa dos ODS fica parada em lista. Sem JavaScript o botão de pausa não funcionaria, então a faixa não pode andar.
- **O Lenis não fica em volta das páginas.** Ele é criado e destruído num efeito do provedor. Se ficasse em volta (como o `ReactLenis`), ligar e desligar remontaria o site inteiro, e um formulário do Diário perderia o que foi digitado.
- **Com os efeitos desligados, a capa conta como vista:** se a pessoa ligar os efeitos no meio da visita, a capa não aparece de repente na frente da página.

**Verificação automática** (Chrome sem janela, servidor de produção): ESLint sem problemas, `next build` sem erros e **48 de 48 testes**:
- valor inicial: sem "reduzir movimento" → ligados, com Lenis; com "reduzir movimento" → desligados, sem Lenis, sem capa e sem camada de espera;
- efeitos desligados, nas 6 rotas (Início, Solução, Simulador, Diário, Novo registro e 404): `document.getAnimations()` vazio, nenhum quadro 3D novo em 1 s e a roda do mouse rola a página;
- botão: liga na hora, salva `"ligados"`, liga o modo fixo de "Os sinais" sem recarregar; recarregar mantém a escolha mesmo com "reduzir movimento" no aparelho; desligar no meio da página desfaz o Lenis e o modo fixo e zera as animações;
- mudança do aparelho com o site aberto: sem escolha salva, o estado acompanha (e volta); com escolha salva, o aparelho não manda mais;
- efeitos ligados: capa na primeira visita, pulseira animando, roda do mouse suave; alternar duas vezes não apaga o texto digitado no formulário do Diário;
- 320 px, nas 6 rotas: sem rolagem lateral, botão com 48 px ou mais, "Pulse" e "Efeitos" na mesma linha;
- teclado: o Tab chega ao botão (depois de "Pular para o conteúdo" e "Pulse"); Enter liga e Espaço desliga;
- nenhum erro ou aviso no console;
- busca no código: `prefers-reduced-motion` só no script do `<head>` e no hook usado pelo `ProvedorMovimento`; nenhum `motion-safe:` ou `motion-reduce:`.

**Como testar à mão:**
1. `npm run dev` e abra `http://localhost:3000`. O botão "Efeitos" está no cabeçalho, à direita.
2. Clique nele: o texto muda para "Efeitos: desligados" e a bolinha vai para a esquerda. Role a página com a roda do mouse: a rolagem fica seca, sem suavização. Na Solução, "Os sinais" e a galeria viram listas comuns. Na Início, a pulseira para.
3. Recarregue a página (`F5`): continua "desligados". Clique de novo para ligar e recarregue: continua "ligados".
4. Apague a escolha (DevTools > Application > Local Storage > apague `pulse-efeitos`), ligue "reduzir movimento" no aparelho (Windows: Configurações > Acessibilidade > Efeitos visuais > Efeitos de animação desligado) e recarregue: começa "desligados".
5. Teclado: aperte `Tab` até o botão (é o terceiro foco) e use `Enter` ou `Espaço`.
6. Leitor de tela (NVDA): no botão, ele diz algo como "Efeitos: ligados, botão de alternância, pressionado".
7. No modo celular do navegador (320 px): "Pulse" e o botão na primeira linha e o rótulo na segunda, sem rolagem lateral.

### 9.2 — Fontes e paleta

**O que mudou para quem usa:** o site ficou laranja e grafite, nos dois temas, e as 3 fontes de verdade (Anton, Atkinson Hyperlegible Next e JetBrains Mono) aparecem em todas as páginas. As fontes vêm do próprio site, sem nenhum pedido ao Google quando a página abre.

**Arquivos:**

| Arquivo | Mudança |
| --- | --- |
| `app/layout.jsx` | Fontes por `next/font/google` (código da 19.4); as 3 variáveis na tag `<html>`. Sai o passo a passo antigo de instalação manual |
| `app/globals.css` | Tokens da 19.3 nos dois temas e no rodapé: entram `--cor-faixa`, `--cor-apagada`, `--cor-ponto-sombra` e `--grao-opacidade`; `--cor-ouro`/`--cor-sobre-ouro` → `--cor-acao`/`--cor-sobre-acao`; `--cor-rodape-ouro` → `--cor-rodape-destaque`. Saem os roxos, o lilás, o dourado e o creme. Capa, camada de espera e foco do rodapé na paleta nova |
| `components/ui/Botao.jsx` | Principal laranja com texto grafite; secundário com texto grafite no hover |
| `components/abertura/CapaIntro.jsx` | Capa em `#1A1A1D`, branco e laranja |
| `components/solucao/CartaoIntegrante.jsx` | Polaroides com texto grafite e espaço da foto cinza |
| `lib/pulseira3d/cena.js`, `components/pulseira/Pulseira3D.jsx` | Pulseira atual na paleta nova (até a troca da 9.5) e as cores da descrição em texto |
| `app/page.jsx`, `PartesSolucao.jsx`, `IndiceNestaPagina.jsx`, `InterruptorEfeitos.jsx`, `ItemBarra.jsx`, `LinkPular.jsx`, `FaixaODS.jsx`, `SinaisRolagemFixa.jsx` | Classes `…-ouro` → `…-acao` e `rodape-ouro` → `rodape-destaque` |
| Comentários em 7 arquivos | "dourado", "roxo" e "lilás" → as cores novas |

**Decisões da equipe**:
- **Palavra de fundo:** grafite suave, `rgba(36,36,40,.06)` no claro e `rgba(255,255,255,.05)` no escuro (a 19.3 não dava valor).
- **Botões dos ODS no rodapé (`--cor-rodape-cartao`):** o tom vizinho da paleta, `#1A1A1D` no claro e `#242428` no escuro.

**Decisões da implementação**:
- **Hover do botão secundário com texto grafite.** O texto laranja sobre o fundo de hover (laranja a 12%) ficaria em 4,07:1 no claro e 4,00:1 no escuro, abaixo de 4,5:1. Com o grafite, fica em 13:1 (como nos itens da barra).
- **Borda dos itens não selecionados da barra em `--cor-borda`** até a 9.3 tirá-la (19.5). A marca a 70% ficaria entre 2,84:1 e 3,07:1, abaixo de 3:1.
- **Pulseira atual na paleta nova até a 9.5:** tira `#FC4C02`, módulo `#CC4200` (o corpo do módulo novo, 19.12), botões, motores e atuador em grafite, que acendem em laranja; luz de contorno `#FFB088`. A descrição em texto trocou só as cores ("tira laranja", "módulo laranja-escuro", "botão grafite"); a descrição nova entra com o modelo novo.
- **Aviso conhecido no build:** "Failed to find font override values for font Atkinson Hyperlegible Next". O Next 16.4 ainda não tem as medidas dessa família para criar a reserva ajustada e só pula essa etapa; a reserva continua a Verdana. Não é erro (a opção `adjustFontFallback: false` não tira o aviso no Turbopack, então ficou o código da 19.4).

**Contraste recalculado** (script fora do projeto, 81 pares, **nenhum abaixo do mínimo**). O granulado segue a decisão 1 da 9.0 (atrás do conteúdo, claro no tema claro e escuro no escuro): a conta usou o fundo misturado com a cor do grão na opacidade máxima (6% e 8%), a pior combinação. Com essa cor, ele nunca baixa o contraste. Principais pares:

| Par | Claro (fundo / faixa) | Escuro (fundo / faixa) | Mínimo |
| --- | --- | --- | --- |
| Texto | 15,5 / 14,8 | 17,4 / 15,5 (com grão: 17,7 / 16,0) | 7 |
| Texto secundário | 8,2 / 7,9 | 10,5 / 9,4 | 7 |
| Marca (títulos, links, foco) | 4,8 / 4,6 | 5,1 / 4,55 (com grão: 5,2 / 4,7) | 4,5 |
| Borda e palavras apagadas | 5,0 / 4,8 | 6,2 / 5,5 | 3 |
| Erro / sucesso | 6,5 / 6,3 e 6,5 / 6,2 | 7,6 / 6,8 e 9,9 / 8,8 | 4,5 |
| Botão principal (grafite sobre laranja) | 4,55 | 4,55 | 4,5 |
| Botão de perigo preenchido | 6,5 (branco sobre `#B3261E`) | 6,8 (grafite sobre `#FF8A80`) | 4,5 |
| Rodapé: texto / secundário / destaque | 15,5 / 9,4 / 4,55 | 18,4 / 11,2 / 5,4 | 7 / 7 / 4,5 |
| Botões dos ODS: texto / destaque | 17,4 / 5,1 | 15,5 / 4,55 | 7 / 4,5 |
| Capa: texto / frase / laranja sobre `#1A1A1D` | 17,4 / 10,5 / 5,1 | igual | 7 / 7 / 4,5 |

Se o grão fosse da cor contrária (cinza por cima de tudo), a marca na faixa cairia para 4,05:1 (claro) e 3,54:1 (escuro), o que confirma a decisão 1. **A conta é refeita na 9.4**, quando o `Granulado` entrar, com a cor real dele.

**Verificação automática** (Chrome sem janela, servidor de produção): ESLint sem problemas, `next build` sem erros (só o aviso conhecido acima) e **60 de 60 testes**:
- as 3 fontes carregadas e usadas (H1 em Anton, corpo em Atkinson, rótulo em JetBrains Mono); os arquivos `.woff2` vêm de `/_next/static/media/`; **nenhum pedido a `fonts.googleapis.com` ou `fonts.gstatic.com`**;
- cores calculadas nos dois temas: fundo, texto, título, botão principal (laranja com texto grafite) e rodapé;
- nenhuma cor antiga (roxo, lilás, dourado, creme) em nenhum elemento das 6 rotas, nos dois temas;
- **320 px com a Anton de verdade**, nas 6 rotas e nos dois temas: sem rolagem lateral, nenhum H1 ou H2 com palavra quebrada no meio ("DIÁRIO DE DESLOCAMENTOS" cabe em duas linhas inteiras) e os números dos cartões ("Cerca de 90%", "7,9 milhões") dentro do cartão;
- nenhum erro ou aviso no console.

**Como testar à mão:**
1. `npm run build` e `npm start` (ou `npm run dev`) e abra `http://localhost:3000`.
2. Confira o laranja e o grafite na Início, na Solução e no Diário. Troque o tema do aparelho (Windows: Configurações > Personalização > Cores > Modo escuro) e confira o tema escuro.
3. DevTools > Network, filtre por "font" e recarregue: os arquivos `.woff2` vêm de `localhost`, e nada vem de `fonts.gstatic.com`.
4. Modo celular do DevTools a 320 px: "Diário de deslocamentos" em duas linhas, sem palavra cortada, e sem rolagem lateral.
5. Passe o mouse num botão secundário (ex.: "Ir para a Solução" na 404, ou "Cancelar" no formulário do Diário): fundo laranja claro e texto grafite.
6. Desligue os efeitos no cabeçalho e repita os passos 2 e 4: as cores são as mesmas.

### 9.3 — Polimento com os 4 pilares

**O que mudou para quem usa:**
- **Seções alternadas:** algumas seções agora têm fundo cinza bem claro (no escuro, grafite), de ponta a ponta da tela, com uma linha de "piso tátil direcional" no topo. São elas: Tema e Quem vive o problema, no Início, e A pulseira e Equipe, na Solução.
- **Títulos:** os H2 ficaram menores que os H1, e nenhum título quebra no meio da palavra. O Tema e O problema ganharam títulos novos, e o Tema fica em duas colunas no computador.
- **Textura e palavra de fundo:** os domos da textura ganharam relevo, e a palavra gigante de fundo aparece na frente da textura.
- **Barra e botões:** a barra ficou mais limpa, sem borda nos itens não selecionados, e o texto dos itens e dos botões ficou centralizado, sem o espaço vazio de ícone.

**Arquivos:**

| Arquivo | Mudança |
| --- | --- |
| `app/globals.css` | H2 `clamp(2rem, 9vw, 3.2rem)` e H2 compacto de 2rem; `hyphens: manual` e `overflow-wrap: break-word` nos H1 e H2; textura com 3 camadas (brilho, domo e sombra); classe `.divisor-piso`; sai `--cor-linha-item`; o divisor some no alto contraste do Windows |
| `components/layout/Secao.jsx` | Props `banda` (fundo `--cor-faixa` de ponta a ponta e divisor, os dois com `aria-hidden`, `py-18`) e `duasColunas` (a partir de 64rem: rótulo e título à esquerda, texto à direita, começando na altura do título) |
| `app/page.jsx` | Tema: rótulo "CitizenTech", H2 "Tecnologia que nasce de uma necessidade real", banda e duas colunas. O problema: H2 "Atravessar sem saber quando". Quem vive: banda. Ids e "Nesta página" sem mudança |
| `app/solucao/page.jsx` | A pulseira e Equipe como bandas |
| `components/ui/EspacoIcone.jsx` | O espaço vazio do ícone não ocupa lugar (`display: none`) até o ícone entrar (decisão 4 da 9.0) |
| `components/layout/ItemBarra.jsx` | Itens não selecionados com borda transparente (sem borda visível; aparece no alto contraste do Windows) |
| `components/abertura/AberturaPulseira.jsx`, `app/not-found.jsx` | Ordem das camadas: textura → palavra de fundo → pulseira |

**Decisões da implementação**:
- **`overflow-wrap: break-word` nos títulos, em vez do `normal` escrito na 19.5.** A 19.5 pede, ao mesmo tempo, `overflow-wrap: normal` e que a palavra possa quebrar "só nesse caso", se não couber. Com `normal`, ela nunca quebra. Com o texto ampliado a 200% a 320 px, os títulos passavam da tela: 239 px de rolagem lateral no Diário, e no Início os títulos ficavam cortados pelo `overflow-x-clip` (WCAG 1.4.10). O `break-word` quebra a palavra só quando ela não cabe sozinha na linha e, diferente do `anywhere` do corpo, não deixa a palavra encolher para caber ao lado de outra. No tamanho normal, nenhum título quebra no meio da palavra (testado nas 6 rotas, a 320 px, nos dois temas).
- **Bandas da Solução: A pulseira e Equipe** (a 19.5 dá a ordem só do Início). "Antes e depois" vira banda quando entrar (9.7).
- **Espaço das bandas:** 72 px em cima e embaixo, e os 80 px de antes entre as seções.
- **Duas colunas a partir de 64rem** (a 19.5). O texto começa na altura do título, e não do rótulo.

**Contraste com a palavra de fundo na frente da textura:**
- **Abertura (links dos lados):** o texto passa sobre a palavra, mas fora dos domos. Texto: 13,8:1 (claro) e 15,2:1 (escuro). Texto secundário: 7,34:1 e 9,22:1.
- **404 (legenda "A pulseira faz o sinal de parar.", com `aria-hidden`):** fica sobre a palavra e os domos. Pior caso: 5,36:1 no claro, acima do mínimo de 4,5:1 e abaixo da meta de 7:1 do texto corrido.
- **Texto laranja:** nenhum passa por cima da palavra (ficaria em 4,31:1).

**Diário (espaçamentos):** conferidos, sem mudança. As margens entre título, aviso, resumo, botão e lista já são de 32 e 48 px, e as internas são de 8, 16 e 24 px, todas múltiplos de 8 px.

**Verificação automática** (Chrome sem janela, servidor de produção): ESLint sem problemas, `next build` sem erros, **55 de 55 testes da 9.3** e **60 de 60 testes da 9.2 de novo** (sem regressão):
- H2 com 51,2 px a 1280 px e 32 px a 320 px; `hyphens: manual` e `break-word` nos H1 e H2;
- títulos e rótulos novos; o "Nesta página" com os mesmos textos e ids;
- bandas só nas 4 seções certas, nos dois temas: fundo `--cor-faixa` de ponta a ponta, divisor de 6 px no topo, os dois com `aria-hidden`;
- Tema em duas colunas a 1280 px (texto na altura do título; a ordem no HTML é rótulo → título → texto) e em uma coluna a 1000 px;
- palavra de fundo pintada na frente da textura (Início e 404);
- barra a 320, 390 e 1280 px: só o item ativo com borda, texto centralizado (diferença de até 1 px) e o espaço do ícone sem ocupar lugar;
- botões das páginas Início, Solução, Diário e 404 com o texto centralizado (até 1 px);
- 6 rotas a 320 px, nos dois temas: sem rolagem lateral e sem palavra quebrada nos títulos;
- 6 rotas com o texto ampliado a 200% a 320 px: sem rolagem lateral e nenhum título transbordando;
- nenhum erro ou aviso no console, com os efeitos ligados e desligados.

**Como testar à mão:**
1. `npm run dev` e abra a Início.
2. Role até o Tema: fundo cinza claro de ponta a ponta, a linha tracejada no topo, o rótulo "CitizenTech" e o título "Tecnologia que nasce de uma necessidade real" à esquerda, com o texto à direita. Diminua a janela para menos de 1024 px: tudo em uma coluna.
3. Confira "Atravessar sem saber quando" (O problema) e a banda de "Quem vive o problema". Na Solução, as bandas de "A pulseira" e "Equipe".
4. Na abertura, a palavra gigante ("PULSE", "ESQUERDA"…) aparece na frente dos domos.
5. A barra de baixo: só o item da página atual tem borda e fundo laranja; os textos estão no centro de cada item.
6. Modo celular a 320 px: nenhum título corta palavra. Aumente o texto do navegador (Chrome: Configurações > Aparência > Tamanho da fonte > Muito grande): os títulos podem quebrar uma palavra muito longa, mas nada passa da tela.
7. Tema escuro do aparelho: as bandas ficam em grafite `#242428`, e os cartões dentro delas mantêm a borda.
8. Desligue os efeitos no cabeçalho e repita: o visual é o mesmo.

### 9.4 — Efeitos globais

**O que mudou para quem usa** (tudo só com os efeitos ligados; desligados, nada disso se move ou aparece, como na 19.1):
- **Primeira visita:** antes da capa, uma contagem de 0 a 100 em laranja ("Pulse · carregando"). Qualquer tecla, gesto ou foco pula a contagem e a capa.
- **Troca de página:** a cortina grafite entra numa varredura diagonal de domos, do canto de cima à esquerda ao de baixo à direita, e sai na mesma ordem.
- **Leitura:** uma linha laranja de 3 px, embaixo do cabeçalho, mostra quanto da página já foi lido.
- **Rolagem:** a rolagem com a roda do mouse tem um pouco mais de inércia. Na Início, quando a roda para perto da abertura, do Tema ou de "Quem vive o problema", a página assenta na seção.
- **Início:** uma faixa laranja com "Pulse · um guia no pulso" anda entre a abertura e o "Nesta página", e acelera um pouco com a rolagem.
- **Cabeças de seção:** a linha laranja antes do rótulo se desenha quando a seção chega.
- **Rodapé:** ganhou "PULSE" gigante em laranja. No fim da página, o conteúdo sobe e revela o rodapé preso embaixo.
- **Granulado:** fica no fundo da página e das bandas.

**Arquivos:**

| Arquivo | Mudança |
| --- | --- |
| `components/ui/Granulado.jsx` (novo), `app/layout.jsx` | Camada de grão fixa, no começo do `<main>`, atrás do conteúdo (`z-index: -1`) |
| `app/globals.css` | `.grao` (ruído SVG, 6 passos por segundo, só `transform`), `--grao-imagem` por tema (branco no claro, preto no escuro), `.preloader`, `.faixa-texto`, cortina em `<canvas>`, regras do rodapé revelado (`html[data-rodape-revela]`); grão some no alto contraste |
| `components/layout/Secao.jsx` | Camada de grão própria nas bandas; prop `encaixe` (`data-encaixe`); rótulo com a linha (`RotuloSecao`) |
| `components/layout/RotuloSecao.jsx` e `hooks/useLinhaRotulo.js` (novos) | Linha de 24 × 3 px em `--cor-acao` antes do rótulo; desenha-se com `scaleX` 0 → 1 e `spring.padrao` quando a seção chega, só na primeira vez. Usados também em "Os sinais" e na Galeria |
| `components/layout/BarraProgresso.jsx` e `hooks/useProgressoLeitura.js` (novos), `Cabecalho.jsx` | Barra de 3 px que cresce com `scaleX`, embaixo do cabeçalho (`aria-hidden`); escondida com os efeitos desligados |
| `components/layout/ProvedorMovimento.jsx` | Lenis com `lerp: 0.09` |
| `components/abertura/Preloader.jsx` (novo), `hooks/useCapaIntro.js` | Fase "preloader" antes da capa: contagem em 1,4 s, some em 0,35 s; qualquer entrada pula para a saída da capa |
| `components/abertura/AberturaPulseira.jsx` | Capa e preloader desenhados no `<body>` por portal; `data-encaixe`; `useEncaixe()` |
| `lib/cortinaDomos.js` (novo), `hooks/useTransicaoPagina.js`, `components/layout/TransicaoPagina.jsx` | Cortina em `<canvas>` com a varredura diagonal; 0,42 s para cobrir e 0,42 s para revelar |
| `hooks/useEncaixe.js` (novo), `app/page.jsx` | Encaixe por proximidade na abertura, no Tema e em "Quem vive o problema" |
| `components/ui/FaixaTexto.jsx` e `hooks/useFaixaTexto.js` (novos), `app/page.jsx` | Faixa de texto entre a abertura e o "Nesta página" |
| `components/layout/Rodape.jsx` e `hooks/useRodapeRevelado.js` (novo) | "PULSE" gigante (`aria-hidden`) e o rodapé revelado |
| `components/solucao/SinaisRolagemFixa.jsx`, `GaleriaHorizontal.jsx` | Rótulos com `RotuloSecao` |

**Decisões da implementação**:
- **Granulado em duas camadas.** Para ficar atrás do conteúdo (decisão 1 da 9.0), o grão da página fica no `<main>` com `z-index: -1`, e as bandas, que têm fundo opaco, têm a própria camada de grão por cima do fundo delas. A camada se move só por `transform` (6 passos por segundo) e é só 12% maior que a tela (com 200%, ficaria pesado demais para o celular).
- **Capa e preloader no `<body>` (portal).** O rodapé revelado põe o `<main>` numa camada própria (`z-index: 1`); dentro dele, a capa ficaria atrás do cabeçalho.
- **Linha do rótulo com `scaleX` e `spring.padrao`**, em vez de animar a largura. O padrão de movimento só permite `transform` e `opacity`. A linha nasce desenhada (no servidor e sem JavaScript) e só se apaga para se desenhar se a seção estiver abaixo da tela.
- **Cortina em `<canvas>`.** Uma máscara de CSS tem um raio só para todos os domos; a varredura diagonal precisa de um raio por domo. Duração de 0,42 s em cada sentido (padrão, item 5c). Densidade de pixels limitada a 1,75.
- **Preloader de 1,4 s** (decisão 3 da 9.0), na mesma camada de espera da capa. Uma tecla, um gesto ou um foco durante a contagem o tira na hora, para o foco nunca ficar atrás dele.
- **Encaixe só a partir de 64rem e 600 px de altura** (o limite das seções fixas da 19.6, que também desliga o encaixe com zoom alto), só depois da roda do mouse e nunca com o foco num campo. "Topo" = cabeçalho + "Nesta página" fixo (as mesmas medidas das âncoras).
- **Faixa de texto antes do "Nesta página"**: fica "entre a abertura e o Tema", e o índice continua logo antes das seções. Fundo `--cor-marca` e letras `--cor-fundo` (4,8:1 no claro; 5,1:1 no escuro). O controle de pausa dela é o botão "Efeitos" do cabeçalho (19.6). Ela só anda quando está na tela.
- **Barra de progresso escondida** com os efeitos desligados (a 19.6 diz "parada"; uma barra parada em 0 não aparece).
- **Rodapé revelado só quando o rodapé tem menos de 80% da altura da tela**. A 1280 × 900, vale em todas as páginas menos a Solução (com a faixa dos ODS, o rodapé tem 897 px).

**Contraste com o granulado (refeito com o grão real):**
- O grão é branco no tema claro e preto no escuro e fica atrás do conteúdo, então **nenhum par baixa**: no claro, o branco não muda o fundo branco; no escuro, o preto só escurece o fundo (a marca na faixa sobe de 4,55:1 para 4,71:1).
- A opacidade mínima de 4% não foi necessária.
- **Consequência visual:** o grão quase não aparecia. No claro, variava no máximo 0,3 nível de cor na faixa e nada no branco; no escuro, no máximo 2 a 3 níveis.
- **Decisão da equipe (opção B):**
  - **Escuro:** o grão preto passa a 25% (`--grao-opacidade: 0.25`; a 19.3 dizia 0,08) e varia 7 a 9 níveis. Como só escurece o fundo, o contraste sobe: marca 5,43:1 no fundo e 5,05:1 na faixa; texto secundário 11,2:1 e 10,4:1; palavras apagadas 6,6:1 e 6,2:1.
  - **Claro:** continua como estava (grão branco, 6%).
  - **Opções descartadas:** A (manter) e C (grão cinza no claro: o laranja cairia para 4,34:1 nas bandas).

**Verificação automática** (Chrome sem janela, servidor de produção): ESLint sem problemas, `next build` sem erros e **56 de 56 testes da 9.4**, mais as baterias da 9.3 (55 de 55) e da 9.2 (60 de 60) de novo:
- **Preloader e capa:**
  - na primeira visita, o preloader aparece por cima da capa, no `<body>`, `aria-hidden` e sem nada focável;
  - a contagem sobe de 0 a 100 e, em cerca de 1,75 s, some e deixa a capa;
  - a capa cobre o cabeçalho;
  - o Tab tira a capa; uma tecla durante o preloader o tira na hora;
  - com os efeitos desligados, não há preloader nem capa.
- **Granulado:**
  - nos dois temas: fixo, `z-index: -1`, primeiro filho do `<main>`, `aria-hidden`, sem clique e animado;
  - a cor e a opacidade seguem o tema, e as bandas têm a própria camada;
  - fica parado com os efeitos desligados e some no alto contraste.
- **Barra de progresso:** 3 px laranja, em 0 no topo e cheia no fim; escondida com os efeitos desligados.
- **Faixa de texto:** fica depois da abertura, é `aria-hidden`, tem as duas cópias do texto e anda; com os efeitos desligados, fica parada.
- **Linha do rótulo:** abaixo da tela, começa apagada e se desenha quando a seção chega; à vista, já aparece desenhada; com os efeitos desligados, todas aparecem desenhadas e paradas.
- **Rodapé revelado:** nas 6 rotas, ativo conforme a altura do rodapé, com "PULSE" decorativo; com os efeitos desligados, o rodapé é normal.
- **Encaixe:**
  - assenta no Tema quando a roda para a cerca de 150 px dele;
  - não assenta com o teclado, nem longe da seção (mais de 30% da tela);
  - fica desligado com a tela baixa (560 px) e com os efeitos desligados.
- **Transição:**
  - o canvas fica ativo e `aria-hidden`, e a varredura é diagonal (o canto de cima fica coberto antes do de baixo);
  - a página chega à Solução, a cortina some e o foco vai para o H1;
  - com os efeitos desligados, a troca é instantânea.
- **Efeitos desligados:** `document.getAnimations()` vazio nas 6 rotas (19.17).
- **320 px:** nenhuma das 6 rotas tem rolagem lateral, com os efeitos ligados ou desligados.
- **Console:** nenhum erro ou aviso.

**Como testar à mão:**
1. `npm run dev`, abra uma aba anônima em `http://localhost:3000` e confira a contagem de 0 a 100 e, depois, a capa. Aperte uma tecla: a capa se desfaz em domos.
2. Role a Início com a roda do mouse:
   - a linha laranja embaixo do cabeçalho cresce, e a faixa "Pulse · um guia no pulso" anda (mais rápido enquanto você rola);
   - pare a roda um pouco antes do Tema: a página assenta nele;
   - faça o mesmo com a seta para baixo do teclado: não assenta.
3. Role até o fim: o conteúdo sobe e revela o rodapé com "PULSE" gigante.
4. Clique em "Solução" na barra: domos grafite cobrem a tela na diagonal e saem na mesma ordem. Na Solução, a linha antes do rótulo se desenha quando cada seção chega.
5. Desligue os efeitos: a faixa para, a barra de progresso some, o rodapé fica normal, a troca de página é instantânea e o encaixe não acontece.
6. Alto contraste do Windows (`Alt + Shift + Print Screen`): o grão some.

### 9.5 — Pulseira 3D nova

**O que mudou para quem usa:**
- **A pulseira nova** aparece em todas as cenas: tira esportiva laranja com fecho, módulo com face grafite, os dois botões táteis, a célula Braille escrevendo P-U-L-S-E, as zonas de vibração e o atuador por dentro, os contatos de carga e 5 luzes de cada lado da face.
- **Os sinais** aparecem pela vibração e pelas luzes.
- **Na Início:**
  - a pulseira gira sozinha, devagar, e passa pelos sinais;
  - ela gira arrastando, pelas setas do teclado (com o foco nela) e pelos botões "Girar para a esquerda" e "Girar para a direita";
  - "Girar sozinha" para tudo: o giro, os sinais e o Braille.
- **Na Solução, em "A pulseira":** a pulseira para explorar, com os controles, as 8 partes e os 5 sinais. Escolher uma parte gira a pulseira até ela e a acende; a explicação aparece ao lado.

**Arquivos:**

| Arquivo | Mudança |
| --- | --- |
| `lib/pulseira3d/modelo.js` (novo) | O modelo como módulo único, com a pulseira aprovada pela equipe (geometria, materiais, Braille, sinais e luzes); `VISTA_DAS_PARTES` (para onde girar em cada parte); âncoras dos 6 links (as zonas de vibração no lugar dos motores; o fecho no lugar da parte de baixo da tira) |
| `lib/pulseira3d/cena.js` | Reescrito: renderizador (densidade de pixels até 1,75, tons ACES), ambiente `RoomEnvironment`, luz principal e de contorno, câmera por modo, pivô do giro e liberação de tudo da memória (geometrias, materiais, textura do brilho, ambiente, `forceContextLoss`). `criarCena` é assíncrona e compila os shaders em paralelo (opção B) |
| `lib/pulseira3d/sinais.js` | Só os dados (ordem e textos dos sinais da abertura, nome do movimento, ciclo). Saem os anéis de "pulso" da Fase 8: os sinais agora são as luzes |
| `hooks/useGiroPulseira.js` (novo) | Giro automático, arrasto (no toque, só o horizontal: `touch-action: pan-y`), setas, botões, ir até uma parte, ver um sinal |
| `hooks/usePulseira3D.js` | Reescrito para os modos `abertura`, `explorar`, `sinal` e `parar` com o modelo novo; anima só visível e só quando algo se move; quadro parado com os efeitos desligados |
| `components/pulseira/Pulseira3D.jsx`, `CenaPulseira.jsx` | Palco (abertura e explorar): `role="group"`, `aria-roledescription="modelo 3D"`, nome "Pulseira Pulse em 3D. Use as setas do teclado para girar.", `aria-describedby` na descrição nova e foco; prop `adiar` |
| `components/pulseira/ExplorarPulseira.jsx` (novo) | Palco com a textura em relevo, "Arraste para girar", grupo "Girar a pulseira", "Partes da pulseira" (8) e "Os sinais no pulso" (5) com `aria-pressed` e explicação em `aria-live="polite"` |
| `components/abertura/AberturaPulseira.jsx` | "Pausar animação" sai; entra o grupo "Girar a pulseira"; a cena só é montada depois do preloader |
| `app/solucao/page.jsx` | `ExplorarPulseira` em "A pulseira", depois dos 3 passos |

**Decisão da equipe**: o botão de giro tem **texto fixo "Girar sozinha"**, com `aria-pressed="true"` enquanto gira; só o ícone troca (pausa ↔ play). A 19.12 pedia o texto trocando entre "Pausar o giro" e "Girar sozinha" junto com o `aria-pressed`, e o leitor de tela diria "Pausar o giro, pressionado" enquanto a pulseira gira.

**Decisões da implementação**:
- **"Girar sozinha" para também os sinais e o Braille** na abertura (decisão da 9.0): o sinal da vez fica aceso e parado. No explorar, "Girar sozinha" para o giro e o Braille; um sinal ou uma parte escolhidos continuam animando até serem desmarcados (foram pedidos pela pessoa).
- **Zonas de vibração acesas**: na versão aprovada, o sinal apagava o destaque das zonas e do atuador escolhidos na lista de partes. Aqui, o destaque da parte vem por último.
- **Botões de giro só com a cena pronta**; com os efeitos desligados, "Girar sozinha" some e os outros giram sem animação, como pede a 19.12.
- **Sem WebGL** (ou sem JavaScript), a descrição aparece no lugar do palco e os botões de giro somem. As listas de partes e de sinais continuam e explicam cada um.
- **Cena montada depois do preloader**: compilar os shaders da cena nova trava a página por um instante, e a contagem do preloader pulava para o fim.
- **Conferência dos shaders só no desenvolvimento** (`checkShaderErrors`): no site publicado, ela deixava no console avisos do compilador do Windows ("warning X4122"), que não são erros.
- **Entrada da abertura só depois da capa** (cresce de 0,35 para 1); sem capa, a pulseira já aparece no tamanho final.
- **Até a 9.8, "Os sinais" ainda usa a pulseira pequena** (modo `sinal`, com o modelo novo). A 1280 × 900, nunca há mais de uma cena visível ao mesmo tempo.

**Desempenho (opção B da equipe):** na primeira carga da Início, criar a cena travava a página por **1,6 s** de uma vez (placa de vídeo do Windows), por causa da compilação dos shaders dos materiais e do ambiente de reflexos. A equipe escolheu compilar sem travar, mantendo o visual:
- `criarCena` passou a ser assíncrona. Ela compila os materiais em paralelo (`compileAsync`, extensão `KHR_parallel_shader_compile`) e só devolve a cena quando estão prontos; enquanto isso, fica a descrição em texto.
- Os dois shaders internos do gerador de reflexos (desfoque e reflexo) e os materiais da sala também são compilados antes, em paralelo, com a textura intermediária como destino. Isso usa campos internos do Three.js 0.186.1 (`_setSize`, `_allocateTargets`, `_blurMaterial`, `_ggxMaterial`) dentro de um `try/catch`: se um dia mudarem, o ambiente é gerado do jeito normal.
- Sem a extensão no navegador, nada disso é pedido, e o Three.js não escreve aviso no console.

**Medido:**
- **Início (primeira visita):** a maior trava caiu de 1.584 ms para cerca de **700 ms**, mais uma de cerca de 300 ms. O que sobra é a geração do ambiente de reflexos, que o Three.js 0.186 só faz de forma síncrona.
- **Solução:** a maior trava caiu de 326 ms para cerca de **70 ms**.
- Nas visitas seguintes, o navegador guarda os shaders, e a geração do ambiente leva poucos milissegundos. Se a equipe quiser tirar o resto, a saída é trocar o ambiente de reflexos por luzes (opção C da 9.5), com o visual um pouco menos realista.

**Verificação automática** (Chrome sem janela; os testes da cena com WebGL por software, SwiftShader): ESLint sem problemas, `next build` sem erros e **31 de 31 testes da 9.5**, mais as baterias da 9.4 (56), 9.3 (55) e 9.2 (60), todas de novo:
- **Abertura:**
  - palco com `role="group"`, "modelo 3D", o nome, a descrição nova (`aria-describedby`), foco visível, `touch-action: pan-y` e o cursor do sistema;
  - grupo "Girar a pulseira" com os 3 botões; ela gira sozinha e passa pelos sinais; as 6 linhas continuam ligadas às partes;
  - "Girar sozinha" desligado: nada se move (a imagem fica igual por 3 s);
  - a seta para a esquerda e o botão giram; arrastar para o giro automático.
- **Efeitos desligados:** quadro parado, sem "Girar sozinha"; o botão gira na hora, sem animação; `document.getAnimations()` vazio.
- **Explorar:**
  - palco, os 5 controles, as 8 partes e os 5 sinais, e 2 áreas `aria-live`;
  - escolher uma parte marca o botão, gira até ela, explica e para o giro; tocar de novo desmarca;
  - escolher um sinal marca e explica.
- **Sem WebGL:** a descrição aparece, sem palco e sem botões de giro; na Solução, as partes e os sinais continuam.
- **Memória:** ao sair da Início para o Diário, todos os contextos WebGL são liberados.
- **404:** a pulseira para sozinha antes de 5 s.
- **Aguardar:** no máximo 3 piscadas em qualquer janela de 1 s.
- **320 px, nos dois temas:** sem rolagem lateral na Início e na Solução.
- **Console:** nenhum erro ou aviso.

**Como testar à mão:**
1. Abra a Início:
   - a pulseira laranja gira devagar, a legenda passa pelos sinais e as luzes da face acendem conforme o sinal;
   - arraste a pulseira com o mouse;
   - aperte `Tab` até o palco ("Pulseira Pulse em 3D") e use as setas;
   - aperte "Girar sozinha": tudo para, e o sinal da vez fica aceso.
2. Na Solução, em "A pulseira":
   - escolha "Zonas de vibração": a pulseira vira e mostra as zonas por dentro, acesas;
   - escolha o sinal "Aguardar": as luzes piscam 3 vezes e esperam;
   - use "Ver por dentro" e "Vista da frente".
3. Desligue os efeitos: a pulseira fica de frente e parada, e os botões de girar mudam a vista na hora.
4. Leitor de tela (NVDA): no palco, algo como "Pulseira Pulse em 3D. Use as setas do teclado para girar, modelo 3D" e a descrição; em "Girar sozinha", "botão de alternância, pressionado".
5. WebGL desligado (`chrome://settings/system` → "Usar aceleração gráfica" desligado): aparece a descrição em texto.

### 9.6 — Início

**O que mudou para quem usa** (ordem da 19.5: abertura → faixa de texto → "Nesta página" → Tema → frase que acende → O problema → Quem vive → Um trajeto com a Pulse → "Conheça a solução"):
- **Texto que se constrói:** os textos de Tema, O problema e "Quem vive o problema" entram com o gesto GUIA quando chegam à tela.
- **Frase que acende:** entre o Tema e O problema, "Atravessar a rua não deveria depender de **adivinhar.**", com as palavras acendendo uma a uma conforme a rolagem.
- **O problema:**
  - no computador, o rótulo, o título, o texto e a citação ficam fixos à esquerda, e o resto rola à direita;
  - os números contam até o valor ("Cerca de 90%", "7,9 milhões").
- **Quem vive o problema:** os cartões ganharam o espaço da foto (com filtro e parallax quando a foto entrar), e o segundo cartão desce um pouco no computador.
- **Um trajeto com a Pulse (seção nova):** o mapa desenha a rota com a rolagem, o ponto passa pelas paradas, e a lista de 5 paradas acende a atual. No computador, o mapa e a lista ficam presos enquanto a rota anda.
- **Barra de navegação (correção):** as áreas transparentes dos dois lados da pílula não bloqueiam mais o clique nem o mouse no conteúdo que passa atrás.

**Arquivos:**

| Arquivo | Mudança |
| --- | --- |
| `app/page.jsx` | Ordem da 19.5; O problema como seção fixa (CSS sticky, só com os efeitos ligados, a partir de 64rem e 600 px de altura); `TextoConstroi`, `NumeroContado`, `FotoFiltro` com os espaços das fotos novas; `FraseAcende` e `TrajetoPulse`; "Um trajeto com a Pulse" no "Nesta página"; "Quem vive" na largura da página |
| `components/ui/TextoConstroi.jsx` e `hooks/useTextoConstroi.js` (novos) | Gesto GUIA (opacidade e 14 px, `spring.padrao`) na primeira vez que o bloco chega; com o foco dentro, aparece na hora |
| `components/ui/NumeroContado.jsx` e `hooks/useContagem.js` (novos) | Número que conta em 1,2 s (`aria-hidden`) e o valor real em texto escondido |
| `components/abertura/FraseAcende.jsx` e `hooks/useFraseAcende.js` (novos) | Seção `aria-label="Frase de abertura"`; frase inteira para o leitor de tela; palavras visíveis com `aria-hidden` acendendo com a rolagem |
| `components/abertura/TrajetoPulse.jsx` e `hooks/useTrajeto.js` (novos) | Mapa SVG decorativo (`stroke-dashoffset`), `<ol>` das 5 paradas, modo fixo com trilho de 340svh |
| `components/ui/FotoFiltro.jsx`, `hooks/useParallax.js` e `hooks/useFiltroFoto.js` (novos) | Filtro de cinza com pontilhado de domos (cor e zoom de 1,05 com o mouse, o foco ou, no celular, ao entrar na tela) e parallax da imagem dentro da moldura. **(Depois da Fase 9)** Filtro e parallax retirados (item 1 de "Depois da Fase 9"); os dois hooks foram apagados na auditoria (item 6) |
| `app/globals.css` | Variante `secao-fixa:`; estilos da frase, do filtro, do trajeto e do modo fixo; no alto contraste, foto sem filtro |
| `hooks/useSecaoAtual.js` | Seções fixas (`data-secao-fixa`) contam a partir do começo, porque o título fica preso no meio da tela |
| `components/layout/BarraNavegacao.jsx` | `pointer-events: none` na `<nav>` e `auto` na pílula |

**Decisões da implementação**:
- **Parallax só da imagem, dentro da moldura parada.** Mover a foto inteira (até 60 px) cobriria o título e o texto do cartão. A imagem fica 12% maior que a moldura e anda só dentro dessa folga (no máximo 6% da altura e 60 px).
- **Filtro e parallax só com uma imagem de verdade** (`:has(img)`). Enquanto o espaço está vazio, nada muda.
- **Com os efeitos desligados, a foto fica colorida e parada** (19.6: "todos ficam parados ou somem").
- **Texto que se constrói, números e linha do rótulo nascem visíveis** (servidor e sem JavaScript). Eles só se escondem para entrar se estiverem abaixo da tela ao carregar.
- **"Um trajeto com a Pulse" no "Nesta página"**, por ser uma seção com H2 como as outras.
- **Trajeto em modo fixo só no computador** (64rem e 600 px, como as seções fixas da 19.6) e só se o palco couber na tela. Fora disso, a rota anda enquanto o palco passa pela tela.
- **Mapa do trajeto já certo no servidor:** as posições das 5 paradas foram calculadas a partir do caminho (770 unidades), sem precisar de JavaScript.
- **A ilustração de uma travessia continua** no lado que rola de "O problema" até a equipe decidir; o vídeo dessa seção entra na 9.8.
- **Colunas `grid-cols-1` (`minmax(0, 1fr)`) nas grades novas:** sem isso, com o texto ampliado a 200%, a coluna crescia até o conteúdo e criava 249 px de rolagem lateral.

**Contraste:** as palavras ainda apagadas da frase (`--cor-apagada`) são texto grande em negrito, com 5,0:1 (claro) e 6,2:1 (escuro); "adivinhar." em `--cor-destaque`, 4,8:1. No mapa, o número da parada alcançada fica em grafite sobre laranja (4,55:1); o mapa é decorativo.

**Verificação automática** (Chrome sem janela): ESLint sem problemas, `next build` sem erros e **30 de 30 testes da 9.6**, mais as baterias da 9.5 (31), 9.4 (56), 9.3 (55) e 9.2 (60) de novo:
- **Estrutura:** a ordem da 19.5; a faixa de texto logo depois da abertura; o "Nesta página" com os 4 itens.
- **O problema:** fixo a 1280 × 900 enquanto o lado direito rola; lista comum com os efeitos desligados e com zoom de 400%, em uma coluna.
- **Texto que se constrói:** abaixo da tela, começa escondido e deslocado 14 px e entra; com os efeitos desligados, está sempre visível.
- **Números:** começam em 0 abaixo da tela e chegam a "Cerca de 90%" e "7,9 milhões"; o leitor de tela lê o valor real; com os efeitos desligados, aparece o valor final.
- **Frase:** o leitor lê a frase inteira; abaixo da tela, as 8 palavras estão apagadas; a 30% da altura, todas acesas, com "adivinhar." em destaque; com os efeitos desligados, já aparece acesa.
- **Trajeto:**
  - tem as 5 paradas e o mapa com `aria-hidden`;
  - antes de chegar, a rota não está desenhada;
  - no meio, o palco fica fixo, a rota está parcial e a parada atual acende, e o "Nesta página" marca o trajeto;
  - no fim, a rota está inteira e as 5 paradas foram alcançadas;
  - com os efeitos desligados, a rota aparece inteira, o ponto fica no destino, sem destaque e sem fixar.
- **Fotos** (com uma imagem de teste colocada só no navegador do teste):
  - a foto fica em cinza e, com o mouse, ganha cor;
  - o parallax move a imagem dentro da folga, e o título do cartão não se move;
  - com "mais contraste", a foto aparece colorida; com os efeitos desligados, colorida e parada;
  - sem imagem, o espaço fica sem filtro.
- **Efeitos desligados:** `document.getAnimations()` vazio.
- **320 px, nos dois temas, e zoom de 400%:** sem rolagem lateral.
- **Console:** nenhum erro ou aviso.

**Como testar à mão:**
1. Abra a Início no computador e role devagar:
   - o texto do Tema entra deslizando;
   - a frase acende palavra por palavra;
   - em "O problema", o título fica parado à esquerda e os números contam.
2. Em "Um trajeto com a Pulse", a rota laranja se desenha, o ponto passa pelas paradas e a lista acende a parada da vez. O "Nesta página" marca "Um trajeto com a Pulse".
3. Volte para cima: a rota "desfaz" o desenho junto com a rolagem.
4. Desligue os efeitos: a frase aparece acesa, os números finais, a rota inteira e "O problema" vira lista comum.
5. Zoom de 400% (`Ctrl` + `+`): tudo em uma coluna, sem rolagem lateral.
6. **Depois de colocar as fotos de "Quem vive o problema":**
   - com os efeitos ligados, elas ficam em cinza com pontilhado e ganham cor com o mouse;
   - no celular, ganham cor ao entrar na tela;
   - ao rolar, a imagem se move um pouco dentro da moldura.

### 9.7 — Solução

**O que mudou para quem usa** (ordem da Solução: A pulseira → Os sinais → Como funciona → **Antes e depois** → Tecnologias → Galeria → Quem participa → Como ampliar o impacto → O diferencial → Equipe):
- **Como funciona:** no computador, com os efeitos ligados, o fundo da seção mostra a animação do item ativo. Os 4 itens passam por cima dele como cartões. O fundo troca com o mouse, com o foco ou quando o item passa pelo meio da tela. No celular, com zoom alto ou com os efeitos desligados, é uma lista, e cada item mostra a sua miniatura.
- **Antes e depois (seção nova, banda):** a mesma travessia sem e com a Pulse, lado a lado. Uma barra divide as duas, e ela anda com o mouse, o dedo ou as setas do teclado.
- **Tecnologias:** os 8 cartões ficam numa grade (1, 2 ou 4 colunas), sem rolagem lateral. O botão "Ver a peça" vira o cartão e mostra a foto da peça. Sai o carrossel.
- **Galeria:** no computador, as 6 fotos ficam espalhadas num plano maior que a janela. Ele se arrasta com o mouse (com uma inércia leve) ou se move pelas setas, pelos botões "Esquerda", "Cima", "Baixo", "Direita" e "Centralizar" e pelo Tab nas fotos. No resto, é uma grade.
- **Equipe:** os polaroides, menores, ficam pendurados num varal com prendedores laranja. Com o mouse, o polaroide se endireita, sobe e ganha um traço laranja no nome.
- **Botão laranja principal (todo o site):** o texto do botão segue o mouse até 8 px. O botão em si, onde se clica, não se move.

**Arquivos:**

| Arquivo | Mudança |
| --- | --- |
| `hooks/useMagnetico.js` e `components/ui/BotaoMagnetico.jsx` (novos), `components/ui/Botao.jsx` | Conteúdo magnético (mola `spring.rapida`, até 8 px, só com `pointer: fine` e os efeitos ligados). O `Botao` usa o `BotaoMagnetico` sozinho na variante `principal` |
| `components/solucao/ComoFuncionaFundo.jsx` e `hooks/useComoFuncionaFundo.js` (novos) | Fundo preso (`position: sticky`) com os 4 quadros parados trocando por opacidade (`spring.suave`); item ativo pelo mouse, pelo foco e pela rolagem (faixa do meio da tela); miniaturas na lista comum. Textos da 6.2 e âncoras `semaforos`, `dois-modos` e `transporte-publico` |
| `components/solucao/AntesDepois.jsx` (novo) | Duas imagens sobrepostas, a de cima recortada por `clip-path`; `<input type="range">` transparente por cima, com `aria-label`, `aria-describedby` e `aria-valuetext` |
| `components/solucao/CartaoTecnologia.jsx` (novo) | Cartão que vira (`rotateY`, `spring.suave`), verso com `inert`, botão "Ver a peça" com `aria-pressed` e `whileTap` |
| `components/solucao/GaleriaCanvas.jsx` e `hooks/useGaleriaCanvas.js` (novos) | Plano de 2400 × 1500 px movido por `transform`; arrasto com inércia; setas, botões e foco nas fotos; grade fora do computador |
| `components/solucao/CartaoIntegrante.jsx` | Reescrito: polaroide no varal, com Motion (`whileHover` só com os efeitos ligados), `FotoFiltro` com parallax e o nome no traço laranja |
| `app/globals.css` | Fio do varal (`.varal-trecho`), prendedor (`.polaroide::before`) e traço no nome (`.polaroide-nome`) |
| `app/solucao/page.jsx` | Ordem nova; "Antes e depois" no "Nesta página"; os 8 espaços das fotos das peças; o varal |
| Apagados | `components/ui/Carrossel.jsx`, `hooks/useCarrossel.js`, `components/solucao/GaleriaHorizontal.jsx`, `hooks/useGaleriaHorizontal.js` e `hooks/useInclinacaoMouse.js` (sem uso em mais nenhum lugar) |

**Decisões da equipe** (perguntadas antes do código, porque a especificação e o padrão de movimento discordavam):
1. **Como funciona no celular:** lista comum com miniaturas; o fundo que troca existe só no computador, onde troca com o mouse, o foco e a rolagem. A 19.13 dizia "com a rolagem (no celular)", mas a 19.6 diz que as seções fixas são só no computador.
2. **Botão "Ver a peça" com texto fixo** e `aria-pressed="true"` com o cartão virado, como o "Girar sozinha" da 9.5. A 19.8 pedia o texto trocando para "Ver o texto" junto com o `aria-pressed`, e o leitor de tela diria "Ver o texto, pressionado".
3. **Polaroides:** com o mouse, ele se endireita e sobe 6 px com a mola (o "balanço leve"), sem acompanhar o mouse. A inclinação que seguia o mouse (18.8) saiu, e o `useInclinacaoMouse` foi apagado.

**Decisões da implementação**:
- **Botão magnético em todos os botões laranja principais**, inclusive no Diário e na 404 (19.6: "Só os botões laranja principais"). Fica dentro do próprio `Botao`, então ninguém precisa trocar de componente.
- **"Antes e depois" no "Nesta página"**, por ser uma seção com H2 (como "Um trajeto com a Pulse" na 9.6).
- **Os vídeos entram na 9.8.** Nesta subfase, o fundo de "Como funciona", as miniaturas e os dois lados de "Antes e depois" usam os quadros parados que já estão em `public/videos/`.
- **Textos de "Como funciona" da 6.2**, com os cartões de "Dois modos" e a lista de "Transporte público".
- **Miniaturas e fundo como decoração:** ficam dentro de `aria-hidden`, com `alt=""`, porque o texto de cada item diz o mesmo (19.13: "o texto da seção diz o mesmo que o vídeo").
- **Cartões de Tecnologias:**
  - as duas faces ficam na mesma célula da grade (e não em posição absoluta), então o cartão cresce com o texto ampliado, em vez de cortar o texto;
  - com os efeitos desligados, o giro tem duração 0. O `MotionConfig` só tira as animações de posição e de escala, e não a rotação;
  - a foto da peça aparece colorida, porque só aparece quando a pessoa pede.
- **Galeria:**
  - modo canvas a partir de 64rem e 600 px de altura (19.9);
  - fotos em 4:3 (antes eram 4:5);
  - no toque, a janela deixa passar a rolagem vertical da página (`touch-action: pan-y`), para o dedo não ficar preso numa área de 72% da tela;
  - as fotos recebem o foco pelo Tab só no modo canvas, e o plano as leva ao meio da janela;
  - **página sem pulo no foco:** o Chrome rola a página antes do evento de foco, para mostrar a foto onde ela estava, às vezes mais de 900 px. O hook devolve a página à última rolagem conhecida, antes de a tela ser pintada. Se o navegador rolou a própria janela, esse deslocamento vira posição do plano. **(Revisto na 9.8:** a volta da página dependia do momento exato da rolagem e falhou com os vídeos na página; agora o Tab e o Shift+Tab entre as fotos são tratados pelo hook, com `preventScroll`.**)**
  - **inércia com a mola do padrão:** ao soltar, a mola `spring.suave` parte com a velocidade dos últimos 100 ms do arrasto e vai até onde o plano chegaria em 0,25 s. A função `inertia` do Motion não anima um valor sozinho quando o início e o fim são iguais, e o padrão pede "spring sempre".
- **Polaroide sobe 6 px (19.10)**, e não os 2 px do padrão: o padrão fala dos clicáveis, e o polaroide não é clicável.
- **Varal:** cada polaroide desenha o seu trecho do fio, com uma leve curva para baixo onde fica o prendedor. Os trechos vizinhos se emendam, e o fio funciona com 2, 3 + 2 ou 5 por linha.
- **Parallax leve nos polaroides** (19.6, "polaroides"), só quando a foto entrar.
- **Fundo de "Como funciona" em 0,42 s** (`spring.suave`), o preset mais perto dos 0,4 s da 19.13.
- **Antes e depois:** até 56rem de largura (a 16:10, a área toda ficaria com 760 px de altura) e 4:5 abaixo de 32,5rem. Etiquetas "Sem a Pulse" e "Com a Pulse" com cores fixas sobre a imagem: grafite sobre branco (17,4:1) e sobre laranja (5,1:1).

**Contraste:** nada novo baixa. Os textos de "Como funciona" ficam sempre sobre o cartão sólido (`--cor-superficie`); o botão "Ver a peça" é laranja `--cor-marca` sobre a superfície (4,8:1 no claro; 5,1:1 no escuro); o traço do nome é grafite sobre laranja (4,55:1); o polaroide é grafite sobre branco nos dois temas (15,5:1).

**Verificação automática** (Chrome sem janela, servidor de produção): ESLint sem problemas, `next build` sem erros (só o aviso conhecido da Atkinson) e **106 de 106 testes da 9.7**:
- **Estrutura:** ordem dos H2; "Antes e depois" no "Nesta página", como banda e com o rótulo "A diferença"; o carrossel saiu.
- **Como funciona (1280 × 900, efeitos ligados):**
  - fundo preso abaixo do cabeçalho e do índice, `aria-hidden`, com 4 quadros;
  - miniaturas escondidas; cartões opacos; as 3 âncoras com `tabIndex={-1}`;
  - a rolagem ativa o item 2 e o item 4; o mouse ativa o item 3 sem ele estar no meio da tela; o foco em "Semáforos em tempo real" ativa o item 2.
- **Antes e depois:**
  - rótulo, descrição, valor em texto ("50% sem a Pulse, 50% com a Pulse") e as animações `aria-hidden`;
  - as setas movem a divisória (53%), e `Home` diz "Só com a Pulse";
  - com o foco, a moldura ganha o contorno de 3 px.
- **Tecnologias:**
  - 8 cartões, em 4, 2 e 1 coluna (1280, 700 e 375 px);
  - o verso começa `inert`; o Enter vira o cartão (não é instantâneo, termina em 180°), o `aria-pressed` vai a `true`, o texto continua "Ver a peça" e o foco fica no botão; o Espaço desvira.
- **Galeria:**
  - região com foco e instrução, 5 botões com texto, 6 fotos e o cursor "mão" do sistema;
  - a seta move 200 px, o botão "Esquerda" move 320 px, o plano para na borda e "Centralizar" volta ao centro;
  - o arrasto segue o mouse e tem inércia; parado antes de soltar, não tem;
  - o Tab nas 6 fotos leva cada uma para dentro da janela, fora do cabeçalho e da barra, sem mexer a página, e depois vai ao botão "Esquerda".
- **Equipe:**
  - os 5 nomes em 5, 3 + 2 e 2 + 2 + 1 por linha;
  - fio de 2 px e prendedor laranja, polaroides de até 10,5rem;
  - inclinação de −3°; com o mouse, endireita, sobe 6 px e ganha o traço no nome.
- **Botão magnético:** o conteúdo vai a 8 px e não passa; o botão não anda para os lados; volta ao centro quando o mouse sai.
- **Efeitos desligados:**
  - "Como funciona" vira lista com as miniaturas (quadros parados certos) em 2 colunas;
  - a Galeria vira grade, sem região, sem botões e sem foco nas fotos;
  - o cartão vira na hora; o polaroide e o botão não se mexem com o mouse;
  - "Antes e depois" continua funcionando;
  - `document.getAnimations()` vazio.
- **320 px**, nas 6 rotas, nos dois temas, com os efeitos ligados e desligados: sem rolagem lateral, nenhum polaroide fora da tela e o texto dos botões laranja centralizado (até 1 px).
- **Tema escuro:** cartões em `#242428`; o polaroide continua branco com texto grafite.
- **Zoom de 400%** (320 × 225): sem rolagem lateral, "Como funciona" e Galeria em lista.
- **Texto ampliado a 200% a 320 px:** sem rolagem lateral e nenhum texto cortado nos 8 cartões.
- **Console:** nenhum erro ou aviso (só o 404 esperado da rota inexistente).

As baterias de testes das subfases anteriores não foram rodadas de novo, porque os scripts ficaram nas sessões anteriores. No lugar, rodou a conferência de 320 px nas 6 rotas, descrita acima.

**Como testar à mão:**
1. `npm run dev` e abra a Solução no computador (janela com 1024 px ou mais de largura e 600 px ou mais de altura).
2. **Como funciona:** role devagar. O fundo troca quando cada cartão passa pelo meio da tela. Pare num cartão e passe o mouse em outro: o fundo segue o mouse. Na Início, clique no link "Semáforos" da abertura: a página vai ao item, e o fundo troca para o semáforo.
3. **Antes e depois:** arraste a barra branca. Depois, aperte `Tab` até o controle e use as setas, `Home` e `End`. Com NVDA, ele lê "Comparar sem a Pulse e com a Pulse, controle deslizante, 50% sem a Pulse, 50% com a Pulse".
4. **Tecnologias:** clique em "Ver a peça": o cartão gira e mostra o espaço da foto. Clique de novo para desvirar. Pelo teclado, `Tab` até o botão e `Enter` ou `Espaço`.
5. **Galeria:**
   - arraste a área com o mouse e solte "jogando": o plano desliza um pouco e para;
   - use os 5 botões;
   - aperte `Tab` até a área e use as setas;
   - continue com `Tab`: cada foto vai para o meio da janela, e a página não pula.
6. **Equipe:** passe o mouse num polaroide: ele se endireita, sobe e ganha o traço laranja no nome.
7. **Botão magnético:** passe o mouse devagar sobre "Experimente o simulador" (fim da Solução) ou "Conheça a solução" (Início): o texto segue o mouse um pouco.
8. **Desligue os efeitos** e repita: lista comum com miniaturas em "Como funciona", grade na Galeria, cartão que vira na hora, polaroides e botões parados.
9. **Celular** (modo celular do DevTools, 375 px): "Como funciona" em lista com miniaturas, Tecnologias em 1 coluna, Galeria em grade, Equipe 2 + 2 + 1.
10. **Depois de colocar as fotos:** com os efeitos ligados, as fotos da Galeria e dos polaroides ficam em cinza com pontilhado e ganham cor com o mouse ou o foco (no celular, ao entrar na tela).

### 9.8 — Vídeos

**O que mudou para quem usa:**
- **15 vídeos no site**, todos mudos ao começar:
  - na capa, o vídeo horizontal ou o vertical, conforme a tela;
  - em "O problema" (Início), no lugar da ilustração;
  - em "A pulseira", antes dos 3 passos, no lugar da ilustração conceitual;
  - em "Apenas dois botões";
  - em "Os sinais", um por sinal, no lugar da pulseira 3D pequena;
  - no fundo de "Como funciona";
  - os dois de "Antes e depois".
- **Os vídeos de conteúdo** têm, logo abaixo, "Pausar"/"Reproduzir" e, nos que têm som, "Ativar som"/"Desativar som". Com o som ligado, aparecem as legendas dos sons.
- **Só tocam na tela.** Fora dela, pausam; quando voltam, retomam, a não ser que a pessoa tenha pausado.
- **Efeitos desligados:** todos mostram o quadro parado. "Reproduzir" toca uma vez e para.
- **Capa:** um véu escuro cobre o vídeo, e o rótulo "GS 2026.2 · CitizenTech" ganhou uma faixa sólida, como a frase.

**Arquivos:**

| Arquivo | Mudança |
| --- | --- |
| `hooks/useVideoPulse.js` (novo) | Quando tocar e pausar (`IntersectionObserver`, interruptor, pausa da pessoa, `ativo`), som e legendas, "tocar uma vez" com os efeitos desligados, volta ao quadro parado ao desligar, gêmeos sincronizados, falha sem o arquivo e liberação da memória |
| `components/ui/VideoPulse.jsx` (novo) | Vídeo de conteúdo (caixa 16:9 + `ControlesVideo`) ou de fundo (`aria-hidden`, sem botões); caminhos a partir do nome (`caminhosDoVideo`) |
| `app/page.jsx` | Vídeo de "O problema" com som; sai a ilustração de uma travessia; o texto da seção ganha o id da descrição |
| `app/solucao/page.jsx` | Vídeos de "A pulseira" (sai a ilustração conceitual) e de "Apenas dois botões" |
| `components/solucao/SinaisRolagemFixa.jsx` | Sai a pulseira 3D pequena e o "Pausar animação". No modo fixo, o vídeo do sinal atual fica junto do índice; na lista comum, cada sinal tem o seu vídeo. Os H3 e as `<dl>` ganharam ids para o nome e a descrição |
| `components/solucao/ComoFuncionaFundo.jsx` | Fundo com 4 `VideoPulse` de fundo; só o do item ativo toca |
| `components/solucao/AntesDepois.jsx` | Os dois vídeos gêmeos e um botão "Pausar"/"Reproduzir" para o par |
| `components/abertura/CapaIntro.jsx` | Vídeo da capa (horizontal ou vertical, pela orientação), véu de 60% e rótulo numa faixa sólida; saem as imagens da capa |
| `hooks/useGaleriaCanvas.js`, `components/solucao/GaleriaCanvas.jsx` | Correção da 9.7: Tab e Shift+Tab entre as fotos com `preventScroll` (ver abaixo) |

**Decisões da equipe**:
1. **Botões dos vídeos com o texto que diz a ação, sem `aria-pressed`:** "Pausar" ↔ "Reproduzir" e "Ativar som" ↔ "Desativar som", como nos tocadores de vídeo. O leitor diz "Reproduzir, botão". A 19.13 pedia o texto trocando e também `aria-pressed`, e o leitor diria "Reproduzir, pressionado" com o vídeo parado.
2. **"Os sinais":** no modo fixo, o vídeo do sinal atual fica junto do índice: no computador, na coluna do índice (15rem, 16:9), com os 2 botões embaixo; no celular, com 8rem, ao lado dos 2 botões empilhados. Na lista comum (efeitos desligados, tela baixa), cada sinal mostra o seu vídeo depois da foto e do texto. A pulseira pequena (132 e 76 px) era pequena demais para um vídeo com botões.
3. **Sai a ilustração de uma travessia:** o vídeo de "O problema" ocupa o lugar dele.
4. **Capa: véu grafite `#1A1A1D` a 60% sobre o vídeo e o rótulo numa faixa sólida.** Sem nada, "PULSE" caía a 2,5:1 e o rótulo laranja a 1,0:1 (medido em 8 momentos do loop, de 375 a 1440 px). Com o véu, "PULSE" fica com 7,8:1 ou mais. O laranja nunca passaria de 4,5:1 sobre o vídeo, nem com véu de 70%, e na faixa fica com 5,1:1.

**Decisões da implementação**:
- **Botões embaixo do vídeo**, e não por cima. Com zoom de 400% (320 × 225), dois botões por cima cobririam o vídeo inteiro.
- **Vídeos de fundo sem botões** (capa e "Como funciona", 19.13: "`aria-hidden`, sem foco"). Quem os pausa é o botão "Efeitos" do cabeçalho, como a faixa de texto da 9.4. A capa some com qualquer tecla, toque ou foco.
- **"Antes e depois" com um botão para o par**, logo abaixo da comparação. Os gêmeos andam mais de 5 s (WCAG 2.2.2) e não são fundo.
- **Nome dos vídeos de conteúdo** pelo `aria-labelledby` no título que já existe ("O problema", "A pulseira", "Apenas dois botões" e o H3 de cada sinal), sem texto novo. A descrição (`aria-describedby`) aponta para o texto que diz o mesmo (WCAG 1.2.1).
- **Legendas:** o `<track>` não tem `default`. As legendas ficam desligadas com o som desligado e aparecem com o som ligado.
- **Efeitos desligados:** ao desligar com um vídeo andando, ele para e volta ao quadro parado (`load()`). "Reproduzir" toca com `loop` desligado e, no fim, o botão volta a "Reproduzir".
- **"Os sinais" no modo fixo:** um só vídeo, que troca de arquivo quando o sinal muda. A pausa e o som que a pessoa escolheu continuam.
- **Sem o arquivo:**
  - o vídeo de conteúdo vira uma caixa 16:9 com "Vídeo (nome) (a definir)", sem os botões; o de fundo some (fica a cor de fundo);
  - o navegador registra o 404 de cada arquivo no console, o que não é erro de JavaScript;
  - se o arquivo falhar antes de o React assumir a página, o evento `error` já passou, e o hook confere `video.error` quando o vídeo é registrado.
- **Memória:** ao sair da página, cada vídeo pausa, perde o `src` e é recarregado vazio. No modo de desenvolvimento, o React liga e desliga a ref duas vezes, e o `src` volta pelo `data-src`.
- **Galeria (correção da 9.7):** com os vídeos na página, a "volta da página" da 9.7 falhou: no primeiro Tab, a página pulou 430 px. A correção dependia do momento exato da rolagem e ainda podia desfazer uma rolagem legítima (a que mostra o botão "Esquerda"). Agora o hook trata o Tab e o Shift+Tab entre as fotos, e o Shift+Tab do botão "Esquerda" para a última foto, com `focus({ preventScroll: true })`. A mola leva a foto ao meio. Ficou só a conversão da rolagem da janela em posição do plano.
- **Peso da página:** a Solução tem até 12 elementos de vídeo (`preload="metadata"`, como pede a 19.13; **depois da Fase 9, `preload="none"`**, item 6), mas só os visíveis tocam. Ela ficou com uma cena 3D a menos (a pulseira pequena de "Os sinais").

**Ambiente:** durante a 9.8, uma pasta temporária de teste apagou por engano parte do `node_modules` (a remoção seguiu um atalho de pasta). O `npm install` repôs exatamente as versões do `package-lock.json`, sem pacote novo. `package.json` e `package-lock.json` ficaram sem mudança, e o `npm ls` não mostra nada faltando. Depois disso, o `npm run dev` que estava aberto desde antes mostrava "Build Error: Error evaluating Node.js code" em todas as páginas: ele tinha guardado no cache a falha `Cannot find module …@tailwindcss/turbopack/dist/index.js` (o carregador do Tailwind, que compila o `globals.css`). O arquivo já tinha voltado, mas o servidor não se recupera sozinho. Solução: parar o servidor, apagar `.next/dev` (cache de desenvolvimento, que se recria) e rodar `npm run dev` de novo. Conferido: as 4 páginas carregam, com o CSS e as fontes, e sem erro.

**Verificação automática** (Chrome sem janela, servidor de produção): ESLint sem problemas, `next build` sem erros (só o aviso conhecido da Atkinson), **60 de 60 testes da 9.8** e **107 de 107 da 9.7** de novo (com o Shift+Tab novo na Galeria), cada bateria rodada duas vezes:
- **O problema:**
  - quadro parado, mudo, nome e descrição; fora da tela, parado;
  - na tela, toca sozinho em loop, mudo e sem legenda, com o botão "Pausar";
  - "Ativar som" liga o som e as legendas; "Desativar som" desliga os dois;
  - "Pausar" para; pausado pela pessoa, continua parado ao voltar à tela; "Reproduzir" volta a tocar;
  - fora da tela, pausa sozinho;
  - nenhum botão com `aria-pressed`.
- **Capa:**
  - vídeo horizontal a 1280 × 900 e vertical a 375 × 800, tocando, sem botões, `aria-hidden` e sem nada focável;
  - véu de 60% e rótulo na faixa; "PULSE" com 8,4:1 no pior pixel (1280 × 900, 6 momentos).
- **Solução:**
  - "A pulseira" antes dos passos e "Apenas dois botões", com nome, descrição e legendas `.vtt` em pt-BR;
  - "Os sinais": 1 vídeo e nenhuma cena 3D na seção, na coluna do índice (240 px); trocar para "Parar" troca o arquivo, o nome, a descrição e as legendas, e o som continua;
  - no celular: vídeo de 128 px, 2 botões empilhados e a foto continua (258 px de altura);
  - com o palco preso, o vídeo e os botões ficam acima da barra (1280 × 900, 1024 × 640 e 375 × 667);
  - "Como funciona": 4 vídeos de fundo, só o do item ativo tocando (item 2 e depois item 4);
  - "Antes e depois": os dois tocam juntos, mudos, com até 0,02 s de diferença; "Pausar" pausa os dois; "Reproduzir" os retoma juntos.
- **Memória:** ao ir da Solução para o Diário, os 9 vídeos da página foram liberados.
- **Efeitos desligados:**
  - todos os vídeos parados no quadro parado, com "Reproduzir";
  - "Os sinais" em lista, cada sinal com o seu vídeo; o fundo de "Como funciona" escondido e parado;
  - "Reproduzir" toca sem loop e, no fim, para e volta a "Reproduzir";
  - `document.getAnimations()` vazio;
  - desligar com o vídeo andando: para e volta ao quadro parado; religar: volta a tocar.
- **320 px** (Início e Solução, nos dois temas, com os efeitos ligados e desligados) e **zoom de 400%:** sem rolagem lateral.
- **Sem os arquivos** (o 404 simulado no navegador):
  - a capa aparece sem vídeo;
  - "O problema" vira a caixa 16:9 de reserva, sem botões;
  - na Solução, nenhum vídeo quebrado e 5 reservas visíveis;
  - nenhum erro de JavaScript.
- **Console:** nenhum erro ou aviso, fora os 404 do teste sem arquivos.

**Como testar à mão:**
1. `npm run dev`, abra uma aba anônima em `http://localhost:3000`.
2. **Capa:** depois da contagem, o vídeo da pulseira aparece atrás de "PULSE", escurecido. Com a janela estreita e alta (modo celular), aparece o vídeo vertical. Aperte uma tecla.
3. **O problema:** role até ele. O vídeo começa sozinho, sem som. Aperte "Ativar som": o som e as legendas aparecem. Aperte "Pausar"; role para longe e volte: ele continua pausado.
4. **Solução:**
   - "A pulseira" e "Apenas dois botões": os mesmos botões;
   - "Os sinais": o vídeo do sinal fica embaixo do índice; role, e o vídeo troca junto com o sinal. No celular (DevTools, 375 px), ele fica pequeno, ao lado dos botões;
   - "Como funciona": o fundo agora se move;
   - "Antes e depois": os dois lados andam juntos; "Pausar" para os dois.
5. **Efeitos desligados:** tudo no quadro parado. "Reproduzir" toca uma vez e para.
6. **Leitor de tela (NVDA):** no vídeo de "O problema", ele lê o nome e a descrição; nos botões, "Pausar, botão" e "Ativar som, botão".
7. **Sem os arquivos:** renomeie `public/videos` para outro nome, recarregue a página e confira as caixas com "Vídeo … (a definir)", sem erro. Depois volte o nome.

### Depois da 9.8 — marcações retiradas

A pedido da equipe, as marcações `// Esta parte é lógica` e `{/* Esta parte é lógica */}` saíram de todo o código (418 linhas em 105 arquivos; só essas linhas, conferido no diff). O código novo não as usa mais.

### 9.9 — Diário: microinterações

**O que mudou para quem usa** (tudo só com os efeitos ligados; desligados, só aparece ou some, sem movimento):
- **Erro de preenchimento:** ao tentar salvar com respostas faltando, cada campo com erro dá um tremor curto para os lados, junto da mensagem em texto que já existia. Cada nova tentativa treme de novo; o campo já respondido não treme.
- **Salvar:** o site continua indo direto para o Diário. Lá, a mensagem "Registro salvo." chega com um "certo" que se desenha, e o cartão do registro salvo dá uma batida dupla curta (o gesto PULSO).
- **Excluir e Desfazer:** "Registro excluído." também traz o "certo". No "Desfazer", o cartão restaurado volta com o PULSO, e os outros se ajeitam sem salto.
- **Pausar ↔ Retomar (site todo):** o ícone dos botões de pausa troca com uma rotação curta. São eles: a faixa dos ODS, o "Girar sozinha" das duas pulseiras e o "Pausar"/"Reproduzir" dos vídeos. Isso aparece quando a equipe colocar os ícones; até lá, o espaço do ícone continua sem ocupar lugar.
- **Mensagens para o leitor de tela:** continuam iguais e no mesmo momento. Nada espera animação.

**Arquivos:**

| Arquivo | Mudança |
| --- | --- |
| `components/ui/Tremor.jsx` (novo) | Gesto de ERRO (`tremor` do padrão: ±4 px, 0,3 s) quando muda o número de envios com erro e o campo tem erro |
| `hooks/useFormularioRegistro.js` | Conta os envios com erro (`enviosComErro`); a validação e o envio não mudaram |
| `components/ui/Campo.jsx`, `components/ui/GrupoOpcoes.jsx`, `components/diario/FormularioRegistro.jsx` | O controle (ou as opções) dentro do `Tremor`; prop `tremer` |
| `components/ui/CertoDesenhado.jsx` (novo), `components/ui/MensagemStatus.jsx` | "Certo" em SVG que se desenha (`pathLength` de 0 a 1, `spring.padrao`) nas mensagens de sucesso, de novo a cada texto; sai o ícone `CheckCircle` das mensagens de sucesso |
| `components/diario/ListaRegistros.jsx`, `components/diario/CartaoRegistro.jsx` | `AnimatePresence mode="popLayout"` (sem cascata), `layout` nos itens, saída com o preset `saida`; PULSO no cartão em destaque (`useAnimate`) |
| `components/diario/TelaDiario.jsx`, `TelaNovoRegistro.jsx`, `TelaEditarRegistro.jsx`, `hooks/useMensagemDiario.jsx` | A mensagem leva `idDestaque` (o registro salvo, alterado ou restaurado) |
| `components/ui/IconeAlternado.jsx` (novo) | Troca de ícone com rotação curta (`AnimatePresence mode="wait"`, `spring.rapida` e `saida`); não ocupa lugar enquanto o ícone é o espaço vazio |
| `components/solucao/FaixaODS.jsx`, `components/abertura/AberturaPulseira.jsx`, `components/pulseira/ExplorarPulseira.jsx`, `components/ui/VideoPulse.jsx` | Ícones de pausa e de reprodução dentro do `IconeAlternado` |

A camada de dados (`services/`, `lib/validacao.js`, `lib/datas.js`) não mudou.

**Decisões da equipe**:
1. **API externa do Diário: MockAPI** (mockapi.io). Ela atende ao requisito "consumir uma API externa com CRUD completo" (seção 2). O formato dela (`GET`/`POST` em `/registros`; `GET`/`PUT`/`DELETE` em `/registros/:id`; lista como array; id em texto) é o que o `registrosService.js` já espera, então o código não muda. O passo a passo está abaixo.
2. **"Certo" na mensagem, e não no botão:** a 19.11 pedia o botão se preenchendo, com o "certo", depois do sucesso. Mas o site vai direto para `/diario`, e mostrar o botão exigiria segurar a tela por ~0,5 s, atrasando o anúncio "Registro salvo.". O padrão proíbe que o anúncio espere uma animação. O "certo" se desenha na mensagem de sucesso, e o anúncio não atrasa.
3. **Excluir: só a volta com o PULSO.** A exclusão acontece na página do registro (no diálogo), e o cartão já não está na lista quando a pessoa volta. A lista fica pronta para saídas (`popLayout`), e o cartão restaurado no "Desfazer" volta com o PULSO.

**Decisões da implementação**:
- **PULSO também no registro salvo e no alterado**, além do restaurado. Padrão de movimento: "PULSO (confirmar): registro salvo" e "no Diário, só o registro novo anima". A lista não entra em cascata.
- **O "certo" é desenho feito por código** (como o logo da capa), e não um ícone da equipe. Por isso ele substitui o ícone `CheckCircle` só nas mensagens de sucesso; os de erro e aviso continuam.
- **O tremor vale para todos os campos com erro** daquele envio, e não só para o primeiro. Cada um tem a sua mensagem.
- **Com os efeitos desligados:** o `MotionConfig` só tira posição, escala e rotação, então o "certo" e o PULSO conferem o interruptor: o "certo" já aparece desenhado, e não há batida nem tremor. Na troca de ícone, fica só a opacidade (19.11).

**Verificação automática** (Chrome sem janela, com uma API falsa temporária que imita o MockAPI, rodando fora do projeto e só durante os testes; o endereço dela entrou só no build de teste, e o build foi refeito sem ele): ESLint sem problemas, `next build` sem erros e **29 de 29 testes da 9.9**, mais as baterias da 9.8 (60) e da 9.7 (107) de novo:
- **Lista:** sem cascata ao carregar.
- **Erro de preenchimento:**
  - envio vazio: os campos com erro tremem até 4 px e voltam a 0, com as 6 mensagens, e o foco vai para a data;
  - um novo envio treme de novo; o campo já respondido não treme.
- **Salvar:**
  - vai direto para `/diario`, e "Registro salvo." está na região de status em 33 ms;
  - o "certo" é decorativo e termina desenhado;
  - o cartão do registro novo bate (escala até ~1,03), e a lista fica com 3 registros, o novo primeiro.
- **Excluir e Desfazer:**
  - excluir volta a `/diario` com "Registro excluído." e 2 registros;
  - "Desfazer" mostra "Registro restaurado.", o cartão volta com o PULSO, e o "certo" se desenha de novo.
- **Ícone que troca:** enquanto vazio, o invólucro não ocupa lugar (texto centralizado). Com um ícone de teste, "Pausar" → "Retomar" gira até 90°.
- **Efeitos desligados:** sem tremor (só as mensagens), sem PULSO, o "certo" já desenhado e `document.getAnimations()` vazio.
- **320 px, nos dois temas,** em `/diario`, `/diario/novo` e `/diario/1`: sem rolagem lateral.
- **Console:** nenhum erro ou aviso.

**Como testar à mão** (depois de configurar o MockAPI, passo a passo abaixo):
1. `npm run dev` e abra `/diario/novo`. Aperte "Salvar registro" sem responder nada: os campos tremem, e as mensagens aparecem. Aperte de novo: tremem de novo.
2. Responda tudo e salve: o Diário abre com "Registro salvo.", o "certo" se desenha, e o cartão novo dá uma batida dupla.
3. Abra um registro, "Excluir registro" → "Excluir registro". Na lista, aperte "Desfazer": o cartão volta com a batida dupla.
4. Desligue os efeitos e repita: nada treme nem bate; as mensagens são as mesmas.
5. Leitor de tela (NVDA): ao salvar, ele diz "Registro salvo." como antes.

**MockAPI: o que a equipe faz à mão**
1. Criar uma conta em mockapi.io e um projeto (o prefixo da API pode ser, por exemplo, `/api/v1`).
2. Criar o recurso **`registros`** (em minúsculas) com estes campos, além do `id` (no MockAPI, um campo de texto se chama `String`, e um de verdadeiro ou falso, `Boolean`):
   - `data` (texto, "AAAA-MM-DD"; não usar o tipo de data do MockAPI, que guarda a hora junto);
   - `meio`, `travessias`, `orientacoes`, `observacoes` (texto);
   - `chegouSemSePerder`, `precisouDeAjuda` (verdadeiro ou falso).
   - Tirar os campos de exemplo que o MockAPI cria sozinho (como `name` e `avatar`).
3. **Não gerar dados de exemplo automáticos** (a barra cinza embaixo do recurso): eles vêm com valores aleatórios que o site não reconhece. Se gerar sem querer, apague esses registros no painel.
4. Copiar o endereço do projeto, **tudo antes de `/registros`**, sem barra no final. Exemplo: `https://abc123.mockapi.io/api/v1`.
5. Em `.env.local`, na raiz do projeto (já ignorado pelo Git): `NEXT_PUBLIC_API_URL=https://abc123.mockapi.io/api/v1`. Depois, parar e rodar de novo o `npm run dev`.
6. Conferir: `/diario` deve mostrar "Nenhum registro ainda" (e não mais o erro de conexão). Criar, ver, editar, excluir e desfazer.
7. **Hospedagem** (Vercel ou outra): criar a mesma variável no painel do projeto e publicar de novo. Variáveis `NEXT_PUBLIC_` entram no código no momento do build.
8. Cuidados:
   - qualquer pessoa com o endereço pode ler e mudar os registros (o site não tem login, seção 7.6), então ele não deve ir para lugares públicos sem necessidade;
   - nada de dados pessoais reais nas observações;
   - o plano gratuito tem limites de quantidade, e um projeto com um recurso basta.

### 9.10 — Revisão

**O que foi feito:** a revisão dos critérios de aceite da 19.17 e do checklist da seção 15, com os efeitos ligados e desligados, "reduzir movimento" no aparelho, 320 px, zoom de 400%, texto em 200%, só teclado, os dois temas, alto contraste, WebGL desligado e sem os arquivos de vídeo. A revisão achou e corrigiu um problema de contraste. A 19.17 da especificação ganhou o resultado.

**Correção feita na revisão:**

| Arquivo | Mudança |
| --- | --- |
| `components/ui/Botao.jsx` | Variante nova `secundario-sobre-cor`: o botão secundário com fundo sólido (`--cor-superficie`) |
| `components/ui/EstadoTela.jsx`, `components/ui/MensagemStatus.jsx` | "Tentar de novo", "Desfazer" e "Fechar" usam a variante nova |

- **O problema:** o laranja `#CC4200` dos botões secundários, com fundo transparente, ficava sobre os fundos claros de status. Dava 4,22:1 no fundo de erro (`#FDECEC`, achado pelo axe) e 4,3:1 no de sucesso (`#E7F6EC`), abaixo de 4,5:1, só no tema claro.
- **Com o fundo branco da superfície:** 4,8:1. No escuro, fica igual a antes (4,55:1).

**Decisão da implementação**: a configuração `strict` do `jsx-a11y` acusa 4 pontos na Galeria (a janela com `tabIndex`, as fotos focáveis e o teclado na janela e nos botões). Eles ficam como exceção, porque a 19.9 pede exatamente esse comportamento. É a mesma exceção que o carrossel tinha na Fase 7.

**Verificado automaticamente** (Chrome sem janela, servidor de produção; scripts temporários fora do projeto):

| Critério (19.17 e seção 15) | Resultado |
| --- | --- |
| Interruptor: desligado, nada se move | 6 rotas × 2 temas: nenhuma animação, nenhum quadro 3D novo em 1 s (desenhos do WebGL contados), nenhum vídeo tocando |
| Interruptor: valor inicial e memória | Sem escolha salva e com "reduzir movimento": começa desligado. A escolha sobrevive a recarregar |
| Nenhuma consulta a `prefers-reduced-motion` fora do provedor e do `<head>` | Busca no código: só no script do `<head>` e no hook do `ProvedorMovimento`; nenhum `motion-safe:` ou `motion-reduce:` |
| Contraste | Contas da 9.2, 9.4 e 9.8 (capa); axe-core sem violação de contraste nos dois temas, inclusive com as mensagens do Diário |
| Fontes | Nenhum pedido a `fonts.googleapis.com` ou `fonts.gstatic.com` |
| 320 px, zoom de 400% e texto em 200% | 6 rotas, efeitos ligados e desligados: sem rolagem lateral e nenhum polaroide cortado; com 400%, sem seções fixas e sem canvas |
| Teclado | Início (28 focos), Solução (79) e Diário (12): primeiro foco no "Pular para o conteúdo"; cada foco visível, com contorno e fora do cabeçalho e da barra; a Solução alcança a pulseira (palco e giro), os 8 "Ver a peça", o controle do "Antes e depois", os vídeos e a Galeria. Ao trocar de rota, o foco vai para o H1 |
| Estrutura | Cada rota com 1 H1, `header`, `nav`, `main`, `footer` e `lang="pt-BR"`; títulos de aba únicos |
| Alvos de toque, ícones e imagens | Todos os botões e links de navegação com 48 × 48 px ou mais; nenhum botão só com ícone; toda `<img>` com `alt` (os `alt=""` só dentro de decoração `aria-hidden`) |
| Vídeos | Bateria da 9.8 (60 de 60): mudos, som só pelo botão, legendas, pausa visível, quadro parado com os efeitos desligados, sem os arquivos nenhum erro |
| Pulseira 3D | No máximo uma cena visível por vez (Início e Solução, rolando a página inteira); o contexto WebGL é liberado ao sair; sem WebGL, a descrição em texto aparece (Início e Solução) |
| Nada pisca mais de 3 vezes por segundo | Medido na 9.5 (Aguardar: 3 piscadas em qualquer janela de 1 s) |
| Alto contraste (simulado) | Sem rolagem lateral, granulado escondido, item ativo da barra identificável |
| ESLint e axe | ESLint do projeto: 0. `jsx-a11y` completo: as 4 exceções acima. axe-core 4.14 (WCAG 2.2 A/AA): 0 violações em 24 páginas-estado |
| Diário sem a API | Mostra "Não foi possível carregar os registros.", sem quebrar |
| Diário com a API | Com uma API falsa temporária: CRUD, "Desfazer", mensagens e microinterações (bateria da 9.9, 33 de 33) |

**Baterias no estado final:** 9.10 (84 de 84), 9.9 (33 de 33), 9.8 (60 de 60, duas rodadas) e 9.7 (107 de 107).

**Observação sobre a rolagem com o teclado:** com os efeitos ligados, a rolagem que leva o foco até a tela é suave. Num Tab que pula uma seção longa sem nada focável ("Como funciona", uns 6.700 px), o foco leva perto de 1 s para chegar à tela. Com os efeitos desligados, a rolagem é instantânea.

**Testes que precisam ser feitos por uma pessoa** (passo a passo):
1. **Leitor de tela no computador (NVDA + Chrome ou Firefox):**
   - Início: abertura com a pulseira e os botões de giro → "Frase de abertura" lida inteira → números lidos pelo valor real ("Cerca de 90%") → vídeo de "O problema" com "Reproduzir"/"Pausar" e "Ativar som" → "Um trajeto com a Pulse" com as 5 paradas (o mapa não é lido);
   - Solução: "Pulseira Pulse em 3D, modelo 3D", "Partes da pulseira" e "Os sinais no pulso" (a explicação é anunciada); "Comparar sem a Pulse e com a Pulse, controle deslizante" com o valor em palavras; "Ver a peça, botão de alternância"; "Galeria para explorar" com a instrução;
   - cabeçalho: "Efeitos: ligados, botão de alternância, pressionado";
   - Diário: "Registro salvo.", "Registro excluído." e "Registro restaurado." anunciados uma vez cada.
2. **Leitor de tela no celular** (TalkBack no Android ou VoiceOver no iPhone): o mesmo percurso, com toques e deslizes. Conferir que a Galeria vira grade e que os cartões de Tecnologias viram com toque duplo.
3. **Aparelho real (celular):**
   - a capa mostra o vídeo vertical, com "PULSE" legível;
   - a rolagem é a do aparelho (sem a suavização do Lenis);
   - os vídeos só tocam na tela e começam mudos;
   - a pulseira 3D não esquenta nem trava o celular (deixar 2 minutos na Início);
   - "Os sinais" com o vídeo pequeno ao lado dos botões.
4. **"Reduzir movimento" do aparelho:** apagar a escolha (DevTools > Application > Local Storage > `pulse-efeitos`). No Windows, ir em Configurações > Acessibilidade > Efeitos visuais e desligar os efeitos de animação; no iPhone, Ajustes > Acessibilidade > Movimento. Abrir o site: o botão "Efeitos" começa desligado, e nada se move.
5. **Alto contraste real do Windows** (`Alt + Shift + Print Screen`): bordas visíveis, item ativo da barra identificável, sem granulado e fotos sem filtro.
6. **Texto ampliado no celular** (configuração de tamanho da fonte no máximo): nada cortado nos cartões de Tecnologias, nos polaroides e nos botões.
7. **Zoom de 400% no computador** (`Ctrl` + `+` até 400%): "O problema" e "Como funciona" em lista, Galeria em grade, sem rolagem lateral.
8. **Só teclado:** passar por todas as páginas com `Tab`. Na Galeria, usar as setas, os 5 botões e o `Tab` nas fotos; na pulseira, as setas; no "Antes e depois", as setas, `Home` e `End`.
9. **Com o MockAPI configurado (9.9):** criar, ver, editar, excluir e "Desfazer"; sair do formulário com respostas preenchidas (aviso "Descartar as respostas?").

### Depois da Fase 9 — ícones

**O que mudou para quem usa:** todos os ícones aparecem ao lado do texto (Phosphor, peso Bold, 24 px), em todo o site. Para o leitor de tela, nada muda: os ícones continuam ocultos (`aria-hidden="true"`). Textos, cores e layout continuam iguais. Os espaços entre ícone e texto (`gap`) já existiam.

**Como foi feito:**
- Pacote `@phosphor-icons/react` instalado com versão fixa (`2.1.10`), depois da confirmação da equipe.
- `components/ui/EspacoIcone.jsx` passou a desenhar o ícone pelo prop `nome` (`size={24}`, `weight="bold"`, `aria-hidden="true"`), importando de `@phosphor-icons/react/ssr` (funciona em Server e Client Components). Ele usa um mapa explícito com os 26 ícones do site, e o build só leva esses.
- Nenhum outro arquivo precisou de troca: todos os usos já chegavam ao `EspacoIcone`, de forma direta ou indireta. É o caso do `Botao` e do `BotaoMagnetico` (prop `icone`), da `ItemBarra` (lista da `BarraNavegacao`), da `MensagemStatus` (tabela `ESTILOS` e a ação "Desfazer" da `TelaDiario`) e do `IconeAlternado` (os filhos).
- `IconeAlternado`: o código não mudou, só o comentário. O ícone de verdade não tem `data-icone`, então o invólucro aparece e gira na troca Pausar ↔ Retomar.
- Nome que não estiver no mapa: volta o espaço vazio antigo, que não ocupa lugar.

**Ícones colocados (26):** `Pulse`, `House`, `Watch`, `Play`, `Notebook`, `Pause`, `ArrowCounterClockwise`, `ArrowClockwise`, `ArrowsClockwise`, `ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`, `ArrowsOutCardinal`, `CaretLeft`, `CaretRight`, `Eye`, `SpeakerHigh`, `SpeakerSlash`, `Plus`, `PencilSimple`, `Trash`, `X`, `Warning`, `WarningCircle` e `Image`. Todos existem no Phosphor 2.1.10. O `CheckCircle` não entra: o "certo" das mensagens de sucesso continua sendo o `CertoDesenhado` (9.9).

**Conferido:** `eslint` sem avisos e `npm run build` sem erros. No HTML gerado, nenhum espaço vazio ficou (`data-icone`); todos viraram `<svg>` de 24 px com `aria-hidden`.

**Teste manual:** abrir as 6 rotas e conferir os ícones ao lado dos textos; na barra, o texto continua centralizado; em "Pausar"/"Retomar", o ícone gira na troca (com os efeitos ligados); no NVDA, os botões continuam sendo lidos só pelo texto.

### Depois da Fase 9

#### 1. Imagens ligadas no código (commit `8f1e389`, 14/11/2026)

**Origem:** a equipe pôs todos os arquivos em `public/imagens/`.

**O que mudou:** cada espaço de imagem (`EspacoImagem`) virou uma `<img>` com o `src` do arquivo e o `alt` da especificação.
- **Início** (`app/page.jsx`): as 2 fotos de "Quem vive o problema", dentro do `FotoFiltro`.
- **Os sinais** (`SinaisRolagemFixa.jsx`): as 4 fotos, pelos campos `src` e `alt` de cada sinal.
- **Galeria** (`GaleriaCanvas.jsx`): as 6 fotos, pelos campos `src` e `alt` da lista `FOTOS`.
- **Tecnologias** (`app/solucao/page.jsx` e `CartaoTecnologia.jsx`): as 8 peças, pelos campos `src` e `alt` da lista `TECNOLOGIAS`, passados ao cartão.
- **Equipe** (`app/solucao/page.jsx` e `CartaoIntegrante.jsx`): as 5 fotos dos polaroides, pelos props `src` e `alt`.
- No mesmo commit, o `FotoFiltro` passou a só recortar a imagem: sem filtro em tons de cinza, sem pontilhado, sem zoom e sem parallax (decisão da equipe, anotada no comentário do componente).

#### 2. Correções do teste no iPhone (commit `68a7531`, 14/11/2026)

**Origem:** teste num iPhone com janela de 357 × 667 px. Textos e cores não mudaram.

**O que mudou:**
1. **Sinais** (`hooks/useRolagemFixa.js` e `components/solucao/SinaisRolagemFixa.jsx`):
   - o modo fixo agora pede janela com pelo menos **700 px** de altura (antes, 560 px): `CONSULTA_MODO_FIXO = "(min-height: 700px) and (min-width: 340px)"`. Num celular como o testado (667 px de altura), os 4 sinais aparecem em lista comum. Os comentários dos dois arquivos foram atualizados com o novo valor;
   - no modo lista, a `<img>` do sinal troca `aspect-video` por `aspect-[4/3]`, para a foto aparecer inteira.
2. **Antes e depois** (`components/solucao/AntesDepois.jsx`): a moldura usa `aspect-video` em todos os tamanhos (antes, `aspect-[4/5]` e `aspect-[16/10]` a partir de 32,5rem), igual aos vídeos (1280 × 720).
3. **ODS** (`components/solucao/FaixaODS.jsx`): o `<span>` do número, em `ConteudoOds`, ganhou `shrink-0 whitespace-nowrap`, para o número não ser espremido nem quebrar em duas linhas ao lado do nome.

**Conferido:** `npm run lint` sem erros (6 avisos `no-img-element`, que já existiam desde a ligação das imagens) e `npm run build` sem erros.

**Teste manual:** no iPhone, abrir `/solucao` e conferir: os Sinais em lista, com as fotos inteiras; a moldura do Antes e depois sem faixas nem cortes nos vídeos; os números dos ODS inteiros, numa linha só. Num computador (janela com 700 px de altura ou mais), o modo fixo dos Sinais continua funcionando.

#### 3. `alt` de 4 imagens ajustados (15/11/2026)

**Decisão da equipe (15/11/2026):** o `alt` deve descrever o que cada foto mostra de verdade. Só o `alt` mudou.

| Imagem | Onde | `alt` antigo | `alt` novo |
| --- | --- | --- | --- |
| `galeria-calcada-obstaculo` | `GaleriaCanvas.jsx`, lista `FOTOS` | "Calçada com piso tátil interrompido por um poste." | "Calçada com placas de concreto quebradas e desniveladas." |
| `galeria-esquina-rampa` | `GaleriaCanvas.jsx`, lista `FOTOS` | "Esquina com rampa de acesso e piso tátil." | "Esquina em ladeira, com calçada estreita e sem rampa de acesso." |
| `galeria-semaforo-pedestres` | `GaleriaCanvas.jsx`, lista `FOTOS` | "Semáforo de pedestres com botão de acionamento." | "Semáforo de pedestres com o boneco vermelho aceso." |
| `peca-apis` | `app/solucao/page.jsx`, lista `TECNOLOGIAS` | "Foto da peça: APIs de mapas, semáforos e transporte." | "Ilustração de um chip com a palavra API, ligado a circuitos." |

**Conferido:** `npm run lint` sem erros (os mesmos 6 avisos `no-img-element` de antes) e `npm run build` sem erros (só um aviso do Turbopack: não achou os valores da fonte de reserva da Atkinson Hyperlegible Next).

**Teste manual:** com o NVDA, na Galeria da Solução, ouvir os 3 `alt` novos; em Tecnologias, virar o cartão das APIs e ouvir o `alt` da ilustração.

#### 4. Espera acima de 10 s (15/11/2026)

**Decisão da equipe (15/11/2026, opção B):** resolve a pendência da seção 11.1. No carregamento, a pessoa pode parar. Ao salvar e ao excluir, ela só é avisada, porque o servidor pode gravar mesmo se a espera for interrompida.

**O que mudou para quem usa:**
1. **Carregando** (lista, Ver registro e Editar registro): depois de 10 s, abaixo de "Carregando os registros…", aparece "Está demorando mais que o normal. Você pode esperar ou parar." e, embaixo, o botão secundário "Parar de carregar". Ao tocar, entra o erro "Carregamento interrompido." com o botão "Tentar de novo", que recebe o foco. O botão de parar some.
2. **Salvando… e Excluindo…:** depois de 10 s, o leitor de tela anuncia "Está demorando mais que o normal. Aguarde mais um pouco.". O botão continua travado e com o foco. Não há botão de parar. (No item 9, o aviso também passou a aparecer na tela.)
3. Com os efeitos desligados, o indicador continua parado (a regra geral de `data-efeitos` já zera as animações).

**Como foi feito:**
- `hooks/useEsperaLonga.js` (novo): devolve `true` quando uma espera passa de 10 s (`LIMITE_ESPERA_LONGA`). Volta a `false` quando a espera acaba, e a contagem recomeça na próxima.
- `hooks/useRegistros.js` e `hooks/useRegistro.js`: guardam o `AbortController` da busca num `ref` e ganham `parar()`. Ele cancela a busca e define o erro `{ codigo: "interrompido" }`. A busca cancelada continua sendo ignorada no `.catch` (`foiCancelado`).
- `components/ui/EstadoTela.jsx`:
  - o "carregando" ganha o prop `aoParar`. O aviso entra na mesma região `role="status"` (é essa mudança que o leitor de tela anuncia), e o botão fica fora dela;
  - o "erro" ganha o prop `interrompido`, que troca o título para "Carregamento interrompido.". A segunda linha ("Verifique a conexão…") não aparece, porque a conexão não falhou.
- `TelaDiario`, `TelaRegistro` e `TelaEditarRegistro`: passam `aoParar={parar}` e, quando o erro é `interrompido`, `interrompido` e `focarAoMontar`. O foco vai direto para "Tentar de novo", e o botão de parar some no mesmo momento.
- `FormularioRegistro` e `DialogoConfirmacao`: a região `role="status"` (`sr-only`) troca "Salvando"/"Excluindo" pelo aviso depois de 10 s.
- Componentes e tom de voz de sempre: `Botao` (variante `secundario`, sem ícone), `EstadoTela` e as regiões de status que já existiam. Nenhuma cor nova.

**Conferido:**
- `npm run lint` sem erros (os mesmos 6 avisos `no-img-element`) e `npm run build` sem erros.
- 28 testes temporários, fora do projeto: Chrome sem janela, com uma API falsa que demorava 13 s para responder. Eles conferiram, nas 3 telas, que não há aviso aos 3 s; que aos 11,5 s aparecem o aviso e o botão fora da região de status; que "Parar de carregar" (pelo teclado) leva a "Carregamento interrompido." com o foco em "Tentar de novo"; que o botão some; e que "Tentar de novo" volta a carregar, sem o aviso. Também conferiram: o indicador parado com os efeitos desligados; "Salvando" e "Excluindo" anunciados aos 2 s e o aviso aos 11,5 s, sem botão de parar e com o foco no botão. Todos passaram. Nada disso entrou no projeto.

**Teste manual:**
1. Com a API configurada, abrir `/diario` e o DevTools (F12). Na aba **Network**, em **No throttling**, escolher **Add…** e criar um perfil com **Latency** de `15000` ms (o "Slow 4G" pronto não passa de 10 s numa resposta pequena).
2. Recarregar a página. Aos 10 s, aparecem o aviso e "Parar de carregar". Tocar nele (ou Tab + Enter) e conferir "Carregamento interrompido." e o foco em "Tentar de novo". Repetir em "Ver registro" e em "Editar registro".
3. Em "Editar registro", deixar a página carregar sem o perfil lento, ligar o perfil e tocar em "Salvar registro". Com o NVDA, ouvir "Salvando" e, aos 10 s, o aviso. Fazer o mesmo com "Excluir registro" no diálogo.
4. Desligar os efeitos (botão "Efeitos" do cabeçalho) e conferir que o indicador fica parado.
5. Voltar para **No throttling** no fim.

#### 5. Limpeza dos comentários (commit `6c9a086`, 16/11/2026)

**Decisão da equipe (16/11/2026):** um comentário só fica se disser o porquê de uma escolha, uma regra do projeto (começa com "Regra:" e cita a WCAG ou a seção da especificação) ou uma armadilha técnica, em até 2 linhas. Não descreve o que o código faz, não lista props nem formatos e não conta histórico. A regra está na seção 14.1 da especificação.

**O que mudou:**
- Linhas de comentário: de **3.382 para 504**, ou seja, de **27% para 5,5%** de todas as linhas do código. Contagem refeita em 16/11/2026 nos 128 arquivos `.js`, `.jsx`, `.mjs` e `.css` de `projeto-citizentech-1espu/` (sem `public/`), contando só as linhas que são inteiramente comentário. O número muda com o método: contando também os comentários no fim de uma linha de código, fica de 3.786 para 555 (31% para 6%). Os valores citados antes (3.554 para 468) não foram reproduzidos.
- Saíram os marcadores já resolvidos: `ICONE-…-AQUI`, `IMAGEM-…-AQUI`, `VIDEO-…-AQUI`, `FONTE-…-AQUI` e `API-EXTERNA-AQUI`.
- O código não muda de comportamento: só comentários saíram.

**Por quê:** comentários longos e desatualizados confundiam quem lia o código (por exemplo, "a API ainda não existe"). A história do projeto já fica no Git e neste registro.

#### 6. Auditoria e 5 correções de desempenho e limpeza (16/11/2026)

**Origem:** auditoria do código em 3 critérios (código limpo, otimização de recursos, responsividade e compatibilidade). A equipe escolheu as 5 correções de mais impacto e menos risco. Textos, cores e layout não mudaram.

**O que a auditoria confirmou que já estava bom:**
- O único `fetch` está em `services/apiClient.js`, e as buscas têm cancelamento (`AbortController`).
- Toda animação, listener e observer é limpo ao sair. A cena 3D é liberada (`dispose` e `forceContextLoss`) e para fora da tela e com os efeitos desligados.
- Sem WebGL, a descrição em texto aparece no lugar da pulseira.
- Nenhuma rolagem lateral e nenhum alvo de toque menor que 44 × 44 px, em 6 rotas e 9 telas (320 × 640, 375 × 667, 640 × 800, 768 × 1024, 1024 × 768, 1440 × 900, 667 × 375, 320 × 480 e 1280 × 600).

**O que mudou:**
1. **Three.js fora do carregamento inicial.** `hooks/useGiroPulseira.js` importava `VISTA_DAS_PARTES` de `lib/pulseira3d/modelo.js`, que começa com `import * as THREE`. Assim, um pedaço de 223 KB do Three.js entrava no carregamento de Início e Solução, apesar do `next/dynamic`. As constantes `VISTA_DAS_PARTES` e `PULSE_EM_BRAILLE` foram para `lib/pulseira3d/partes.js` (novo, sem `three`). `modelo.js`, `useGiroPulseira.js` e `usePulseira3D.js` importam de lá.
2. **Fotos adiadas.** As 6 `<img>` (`app/page.jsx`, `SinaisRolagemFixa.jsx`, `GaleriaCanvas.jsx`, `CartaoTecnologia.jsx` e `CartaoIntegrante.jsx`) ganharam `loading="lazy"` e `decoding="async"`.
3. **Código morto apagado:** `hooks/useFiltroFoto.js`, `hooks/useParallax.js`, o prop `velocidade` (2 vezes em `app/page.jsx`, 5 em `app/solucao/page.jsx` e o do `CartaoIntegrante`) e a regra `.polaroide:has([data-colorida])` de `app/globals.css`.
4. **Vídeos adiados.** `VideoPulse.jsx` e `AntesDepois.jsx` passaram de `preload="metadata"` para `preload="none"`. O quadro parado (`poster`) aparece até o vídeo tocar.
5. **Fotos dos sinais menores.** `sinal-continuar`, `-parar`, `-virar` e `-aguardar` foram de 1920 × 1440 para 1200 × 900 (WebP, qualidade 80, com o Pillow, que já estava instalado). Os originais ficaram guardados fora do projeto.

**Resultado:**

| | Antes | Depois |
| --- | --- | --- |
| JavaScript inicial da Início (gzip) | 391 KB | 330 KB |
| JavaScript inicial da Solução (gzip) | 398 KB | 337 KB |
| Fotos baixadas ao abrir a Solução no celular | 25 (cerca de 2,9 MB) | 0 (carregam ao rolar) |
| Vídeos baixados ao abrir a Solução | 12 (cerca de 0,9 MB) | 0 (carregam quando tocam) |
| 4 fotos dos sinais | 1.161 KB | 413 KB |

**Conferido:**
- `npm run lint` sem erros (os mesmos 6 avisos `no-img-element`) e `npm run build` sem erros (o aviso conhecido da fonte de reserva da Atkinson).
- Chrome sem janela, a 375 × 667 e a 1440 × 900: depois de rolar, as 27 imagens da Solução carregaram, inclusive na galeria em canvas, e a pulseira 3D continuou desenhando na Início e na Solução.

**Ficaram da auditoria, para a equipe decidir:** a base de GSAP, Motion e Lenis carregada em todas as rotas (cerca de 305 KB com gzip, inclusive no Diário); o estilo de botão em pílula repetido em 4 arquivos; os ramos de reserva "(a definir)" que nunca aparecem; o padrão de rolagem repetido em 4 hooks; a media query repetida em 4 hooks; o peso 500 da JetBrains Mono carregado sem uso; o `rotulo-mono` com 0,8rem (a especificação diz 0,875rem); e a falta de um `browserslist` no `package.json`.

**Decisão da equipe (18/11/2026):** corrigir os textos "(a definir)", o peso 500 da JetBrains Mono, o tamanho dos rótulos mono (0,875rem) e acrescentar o `browserslist` (feito no item 9). Os outros (bibliotecas de movimento em todas as rotas, botão em pílula repetido e código repetido nos hooks) ficam como estão.

**Teste manual:**
1. No Chrome, F12 → Lighthouse → Mobile → Performance e Acessibilidade em `/`, `/solucao` e `/diario`. Comparar LCP, Total Blocking Time e CLS com o commit anterior.
2. No iPhone, com dados móveis, rolar a Solução devagar e conferir que as fotos dos sinais, da galeria, das peças e da equipe aparecem ao chegar na tela, e que os vídeos mostram o quadro parado e tocam ao aparecer.
3. Na aba Network do DevTools, com "Slow 4G": abrir a Solução e conferir que nenhum `.mp4` e nenhuma foto baixa antes de rolar.

#### 7. Repositório novo e projeto na raiz (18/11/2026)

**O que mudou:**
- O código passou para o repositório **`giovanaborba/GSCitizen-1ESPU`** (privado). O antigo, `othiandrade/GSCitizenTech`, deixou de receber commits.
- O projeto agora fica na **raiz do repositório**: a pasta `projeto-citizentech-1espu/` saiu, e `app/`, `components/`, `hooks/`, `lib/`, `services/`, `public/`, `docs/`, `AI.md`, `README.md` e `INTEGRANTES.txt` ficam lado a lado. Os caminhos citados neste registro com `projeto-citizentech-1espu/` valem agora a partir da raiz.
- **Deploy novo:** `gscitizentech.vercel.app`, feito por uma integrante pelo perfil dela.
- **README** novo: links, descrição do projeto (Simulador, Vitrine e Diário de Deslocamentos), pré-requisitos e instalação e execução pelo ZIP do GitHub e pelo clone.
- **`.gitignore`** novo: `node_modules/`, `dist/`, `.vercel/`, `.env` e `.env.*` (menos o `.env.example`).

**Conferido na pasta local (18/11/2026):** a ESPECIFICACAO e o REGISTRO vieram iguais aos do repositório antigo (commit `4b8922f`). Fora o Simulador, nenhum arquivo de código mudou, nem as imagens e os vídeos.

**Depois:** a pasta `.next/`, que estava versionada, saiu do Git e entrou no `.gitignore`; ela não deve ir para o repositório nem para o ZIP.

#### 8. Simulador integrado (18/11/2026)

**Origem:** feito pelo integrante responsável pelo simulador e trazido para o repositório novo. Ocupa o lugar do espaço reservado da 6.3.

**O que a pessoa encontra em `/simulador`:**
- **Tela inicial:** a pulseira, com o botão de voz e o de modo, e as notas de como **salvar uma rota** pela voz ("salvar rota", depois início, destino e nome) e de como ir a um destino dizendo o endereço. Botões "Rotas salvas", "Conheça como cada comando é feito" e "Testar simulação pronta".
- **Rota no mapa:** mapa com a rota a pé; o sinal atual na pulseira e em texto; os botões CONTINUAR, PARAR, ESQUERDA e DIREITA; o aviso do semáforo ("FECHA EM … SEGUNDOS"); o botão "ÔNIBUS E TREM".
- **Ônibus e trem:** 4 partidas simuladas, com os minutos em Braille e falados.
- **Rotas salvas:** listar, editar e excluir. A "Rota 1" (Alameda Santos → FIAP Paulista) é o exemplo e não pode ser editada nem excluída.
- **Vitrine:** 7 cartões com os comandos (5 táteis e 2 sonoros); o som só toca pelo botão "Som".
- **Modos:** "Sonoro e tátil" e "Exclusivamente tátil" (padrão), guardados no navegador.
- **O celular não vibra:** a vibração aparece na tela e no texto.

**Como foi feito:**
- `components/simulador/`: `Simulador`, `TelaInicial`, `TelaRota`, `TelaTransporte`, `RotasSalvas`, `Vitrine`, `Pulseira` e `MapaRota`, mais `simulador.css` (visual próprio, dentro de `.simulador`) e `fonte.js` (DM Sans por `next/font/google`, só nessa página).
- Hooks: `useNavegacaoSimulador` (telas, voz, rota, passos, semáforo, transporte e simulação pronta) e `usePulseiraSimulador.js` (`usePulseiraSimulador` e `useSomSemaforo`).
- `lib/simulador/dados.js`: modos, rota de exemplo, partidas, origem de reserva e Braille de 0 a 6.
- `services/simuladorService.js`: busca de endereço (Nominatim, do OpenStreetMap), rota a pé (`routing.openstreetmap.de`), rotas salvas, voz e fala (APIs do navegador, em `pt-BR`).
- `app/api/rotas/route.js`: rotas salvas num banco **Neon** (Postgres), pela variável `DATABASE_URL` (ou `POSTGRES_URL` ou `NEON_DATABASE_URL`). Cria a tabela `rotas_salvas` se ela não existir. Sem login: cada navegador tem um identificador aleatório, enviado no cabeçalho `x-pulseira-usuario`.
- **Sem banco:** no `npm run dev`, as rotas ficam no `localStorage`. Na versão de produção (`npm run build` e `npm start`), listar, salvar, editar e excluir rotas dá erro.
- Pacotes novos: `leaflet` 1.9.4 (o mapa, carregado com `next/dynamic` e `ssr: false`) e `@neondatabase/serverless` 1.2.1.

#### 9. Aviso de espera visível e sobras da auditoria (18/11/2026)

**Decisões da equipe (18/11/2026):** o aviso de espera ao salvar e ao excluir também aparece na tela (opção A), e 4 das sobras da auditoria do item 6 foram corrigidas.

**O que mudou para quem usa:**
1. **Salvando… e Excluindo…:** depois de 10 s, o aviso "Está demorando mais que o normal. Aguarde mais um pouco." aparece **na tela**, logo abaixo dos botões, em `--cor-texto-2`, com 16 px, sem ícone e sem animação. O leitor de tela continua ouvindo o aviso **uma vez só**, pela região de status (o texto visível tem `aria-hidden`). "Salvando" e "Excluindo" são anunciados como antes, e o foco continua no botão ocupado.
2. **Vídeo que não carrega:** no lugar de "Vídeo (nome) (a definir)", a caixa mostra o quadro parado do vídeo; se ele também não carregar, "Vídeo indisponível." (`aria-hidden`, porque o texto da seção já descreve o vídeo).
3. **Rótulos mono:** de 12,8 px para 14 px.

**Como foi feito:**
- `FormularioRegistro.jsx` e `DialogoConfirmacao.jsx`: o texto virou a constante `AVISO_DEMORA`, usada na região de status e num `<p aria-hidden="true">` depois da fila de botões, só enquanto o `useEsperaLonga` devolve `true`.
- `GaleriaCanvas.jsx`, `SinaisRolagemFixa.jsx` e `CartaoTecnologia.jsx`: saíram os ramos de reserva das imagens, que nunca apareciam (todas as imagens existem). `components/ui/EspacoImagem.jsx` ficou sem uso e foi apagado.
- `VideoPulse.jsx`: novo componente `ReservaVideo` (quadro parado e, se ele falhar, o texto), usado pelo `VideoPulse` e pelo `AntesDepois`.
- `app/layout.jsx`: JetBrains Mono só no peso 700 (uma busca confirmou que o 500 não era usado). `app/globals.css`: `rotulo-mono` com `font-size: 0.875rem`. `package.json`: `browserslist` com os navegadores do Next.js 16.

**Conferido:**
- `npm run lint` sem erros (7 avisos `no-img-element`: os 6 de antes e o `<img>` do quadro parado) e `npm run build` sem erros (o aviso conhecido da Atkinson).
- 88 testes temporários, fora do projeto, no Chrome sem janela, com uma API falsa que demorava 13 s para salvar e excluir:
  - **31 da espera longa:** aos 2 s, o botão travado, o status "Salvando"/"Excluindo", nenhum aviso na tela e o foco no botão; aos 11,5 s, o aviso visível abaixo dos botões, com 16 px, na cor de `--cor-texto-2`, sem ícone, sem animação e com `aria-hidden`, o status com o aviso, **1 só** nó com o aviso na árvore de acessibilidade e o foco ainda no botão;
  - **48 de layout:** 6 rotas em 4 telas (320 × 640; 1280 × 800 com zoom de 200%; celular 375 × 667; 1440 × 900): nenhuma rolagem lateral e os rótulos mono sem corte;
  - **9 dos vídeos:** com os `.mp4` bloqueados, o quadro parado; bloqueando também os quadros, "Vídeo indisponível."; a reserva fora da árvore de acessibilidade.

**Teste manual:**
1. Com a API configurada, abrir um registro em "Editar registro" e deixar a página carregar. No DevTools (F12), aba **Network**, em **No throttling**, escolher **Add…**, criar um perfil com **Latency** de `15000` ms e ligá-lo.
2. Tocar em "Salvar registro". Aos 10 s, conferir o aviso abaixo dos botões e o foco ainda em "Salvando…". Com o NVDA, ouvir "Salvando" e, aos 10 s, o aviso uma vez só. Fazer o mesmo com "Excluir registro", no diálogo.
3. Na aba **Network**, em **Network request blocking**, bloquear `*.mp4` e recarregar a Solução: as caixas mostram o quadro parado. Bloquear também `*quadro-parado.jpg`: aparece "Vídeo indisponível.". Tirar os bloqueios e voltar para **No throttling** no fim.

#### 10. Título da abertura em duas linhas e limpeza de código (18/11/2026)

**Título da abertura do Início.** O H1 passou a ser **"No seu ritmo, no seu espaço, com a segurança de quem guia cada passo"**, em duas linhas: "No seu ritmo, no seu espaço," e "com a segurança de quem guia cada passo". Cada parte fica num `<span>` em bloco, com espaço de 0,3em entre elas. O leitor de tela lê a frase inteira. O token `--text-h1-abertura` foi para `clamp(1.9rem, 4.6vw, 3.2rem)`, com altura de linha 1,1, para a segunda linha caber inteira no computador. Em telas estreitas, cada parte pode quebrar em mais linhas.

**Pendências resolvidas.** Nome **Pulse** e frase da capa "Um guia no pulso para atravessar a cidade." são definitivos. O CRUD com o MockAPI já funcionava desde a 9.9; a linha "pendente" da tabela da Fase 8 foi atualizada.

**Código repetido, unificado** (sem mudar o que aparece na tela):

| Antes | Agora |
| --- | --- |
| A media query `(min-width: 64rem) and (min-height: 37.5rem)` escrita em 4 hooks (`useComoFuncionaFundo`, `useEncaixe`, `useGaleriaCanvas`, `useTrajeto`) e a de celular em 2 (`useDigitandoNoCelular`, `useDirecaoRolagem`) | `CONSULTA_TELA_GRANDE` e `CONSULTA_CELULAR` em `lib/tela.js` |
| `alturaDoTopo()` (cabeçalho + índice) copiada em `useEncaixe` e `useTrajeto` | Uma só, em `lib/tela.js` |
| O ouvinte de rolagem "um quadro por vez" (`requestAnimationFrame` + `scroll` + `resize`) repetido em `useFraseAcende`, `useProgressoLeitura`, `useSecaoAtual` e `useTrajeto` | `ouvirRolagem(atualizar, aoMudarTamanho)` em `lib/tela.js`, que devolve `{ pedir, parar }` |
| `usePrefereMovimentoReduzido` refazia o `useConsultaMidia` | Chama o `useConsultaMidia` |
| O estilo do botão de controle em pílula repetido em 4 arquivos (`AberturaPulseira`, `ExplorarPulseira`, `GaleriaCanvas`, `VideoPulse`) | `ESTILO_BOTAO_CONTROLE` em `lib/estilos.js`. Os botões de giro da abertura ganharam `text-center`, como os outros |
| Os botões "Girar para a esquerda/direita" e "Girar sozinha" copiados na abertura e na Solução | Componente `components/pulseira/BotoesGiro.jsx`. Os botões só da Solução ("Ver por dentro" e "Vista da frente") entram como filhos |

**Código morto retirado:**
- `useCapaIntro`: a função `terminar()`, que nunca era chamada, e o `refAnimacao`, trocado por uma variável local.
- `useGaleriaCanvas`: o `export` do `TAMANHO_PLANO`, que só o próprio arquivo usa.
- `globals.css`: os tokens `--color-apagada`, `--text-numero` e `--radius-polaroide`, que nenhuma classe usava. O `--cor-apagada` continua, porque é lido direto no CSS.

**Ficou como está:** GSAP, Motion e Lenis carregados em todas as rotas. Não é código morto, e tirar mudaria o carregamento das páginas. O Simulador (`components/simulador/`, `hooks/useNavegacaoSimulador.js` e `lib/simulador/`) ficou fora da limpeza, a pedido da equipe.

**Conferido:**
- `npm run lint` sem erros (os 7 avisos `no-img-element` de antes) e `npm run build` sem erros (o aviso conhecido da Atkinson).
- Nenhum arquivo de código ficou sem uso, e todos os ícones da lista do `EspacoIcone` são usados.
- No CSS gerado, as classes do `ESTILO_BOTAO_CONTROLE` e as variantes `aria-pressed:` continuam presentes.
- Chrome sem janela, no build de produção: as 5 rotas respondem 200 e a rota inexistente, 404; no Início, a frase acende, o trajeto liga e o H1 sai em duas partes; na Solução (com WebGL por software), os botões de giro aparecem com "Ver por dentro" no meio, o índice marca a seção atual e a barra de progresso anda.

**Teste manual:**
1. No Início, conferir o título em duas linhas no computador e em 320 px, e girar a pulseira com os 3 botões.
2. Na Solução, usar os 5 botões da pulseira ("Girar sozinha" fica laranja quando ligado), rolar a página (índice, barra de progresso e trajeto) e mover a galeria pelos botões.
3. No celular, rolar Início e Solução para ver as barras sumirem e voltarem, e tocar num campo do Diário para a barra sair da frente do teclado.

---

## Como os testes automáticos foram feitos

- Scripts temporários, **fora do projeto**, controlaram o Chrome sem janela pelo protocolo de depuração: clicam, preenchem formulários, apertam Tab e medem a tela.
- Para testar o CRUD completo, uma **API falsa temporária** rodou só durante os testes. O site continua sem mock, e nada disso entrou no projeto.
- **Total:** 41 testes sem API, 27 de CRUD, 54 de responsividade, 6 a 320 px com dados e 96 da auditoria de acessibilidade. Todos passaram no estado final.
- **Fase 8:** o Chrome sem janela rodou com WebGL por software (SwiftShader), para testar a pulseira 3D. Uma instrumentação temporária contava os desenhos do WebGL e os contextos liberados. O WebGL desligado foi simulado no próprio navegador, e "reduzir movimento" e alto contraste foram simulados pelo protocolo de depuração. **Total: 17 (8.1) + 45 (8.3) + 30 (8.4) + 49 (8.5) + 36 (8.6) + 28 (8.7) + 23 (8.8) = 228 testes**, todos passando no estado final, mais o cálculo de contraste (67 pares) e a varredura completa do `jsx-a11y`.
- **Fase 9:** os mesmos recursos da Fase 8, mais: axe-core 4.14 injetado nas páginas; uma API falsa temporária, que imita o MockAPI, para o Diário (o endereço dela entrou só no build de teste); o 404 dos vídeos simulado no navegador, para testar a falta dos arquivos; e um segundo Chrome com as APIs 3D desligadas. **Total: 48 (9.1) + 60 (9.2) + 55 (9.3) + 56 (9.4) + 31 (9.5) + 30 (9.6) + 107 (9.7) + 60 (9.8) + 33 (9.9) + 84 (9.10) = 564 testes**, todos passando no estado final de cada subfase, mais o cálculo de contraste (81 pares, 9.2) e o `jsx-a11y` completo.

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
| Leaflet | Biblioteca de mapas usada no Simulador (depois da Fase 9) |
| Neon | Serviço de banco de dados Postgres na nuvem, usado nas rotas salvas do Simulador (depois da Fase 9) |
| Rota de API (`route.js`) | Arquivo do Next.js que responde a pedidos no servidor, como `/api/rotas` |

---

## Pendências

Nenhuma. As duas últimas foram resolvidas pela equipe em 18/11/2026:

| Pendência | Decisão |
| --- | --- |
| Nome definitivo da pulseira | **Pulse** |
| Frase da capa | "Um guia no pulso para atravessar a cidade." |
