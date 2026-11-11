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

---

## Pendências

| Pendência | Quem resolve |
| --- | --- |
| Colocar a fonte, os ícones, as imagens e as fotos nos marcadores | Equipe |
| Conectar a API externa (`.env.local` + blocos `API-EXTERNA-AQUI`) | Equipe |
| Fazer o simulador (`SIMULADOR-AQUI`) e decidir sobre a vibração do celular | Integrante do simulador + equipe |
| Textos da página 404 em português | Equipe (passar os textos) |
| Textos para esperas acima de 10 s (aviso + cancelar) | Equipe (passar os textos) |
| Alinhamento do logo com a grade no computador; cabeçalho fixo com zoom de 400% | Equipe avalia |
| Testes manuais da Fase 7 (leitor de tela, aparelhos reais) | Equipe |
| Confirmar ou mudar as decisões marcadas "Implementação" na seção 17 da especificação | Equipe |
