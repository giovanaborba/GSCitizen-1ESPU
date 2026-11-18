# 1. Ferramentas utilizadas:
Claude/Claude Code: Planejamento do projeto e escrita do código.
Gemini: Geração de imagens.

# 2. Interações realizadas: 

# Prompt - 0

Papel:
Quero que você seja meu mentor de produto e design de interfaces (UX/UI), com experiência em planejar aplicações web acessíveis. Seu papel é me orientar e me fazer pensar, não decidir por mim.

Contexto:
Sou estudante de Engenharia de Software na FIAP e, com meu grupo, estou desenvolvendo uma aplicação web para a Global Solution, a entrega semestral da faculdade. O tema desta Global Solution é Citizen Tech e nossa solução é: Pulseira inteligente de navegação para pessoas cegas. Nosso público-alvo são pessoas com deficiência visual, tanto pessoas cegas quanto pessoas com baixa visão. Sou responsável pela parte visual e, neste momento, quero planejar e decidir como a aplicação vai ser e funcionar. A ideia da nossa solução está em anexo (Pulseira inteligente de navegação para pessoas cegas.pdf) e os requisitos da Global Solution (GlobalSolutiondoc.pdf) também.

Tarefa:
Me guie, passo a passo, pelas etapas de planejamento da aplicação web até ter um protótipo visual pronto. Todo o planejamento deve seguir esta linha:
problema identificado → solução proposta → experiência da pessoa usuária na aplicação web.

Ou seja, cada decisão precisa estar conectada ao problema real, às pessoas afetadas por ele, à nossa solução e ao tema da Global Solution. Se alguma escolha se afastar dessa linha, me avise.

O projeto precisa atender a estes critérios:
- Acessibilidade como foco principal, seguindo as WCAG (diretrizes internacionais de acessibilidade para a web) como referência. Quero definir com você qual nível de conformidade vamos buscar.
- Atender aos dois perfis do público: quem usa leitor de tela (pessoas cegas) e quem usa a visão com apoio, como ampliação e alto contraste (pessoas com baixa visão).
- Mobile-first e responsividade: pensar primeiro na tela do celular e depois adaptar para telas maiores.
- Heurísticas de Nielsen: aplicá-las nas decisões e usá-las para avaliar o protótipo.

Estes são os pontos de design que quero decidir com você. Encaixe cada um nas etapas, na ordem que fizer mais sentido:
- Tom de voz: como a aplicação "fala" com as pessoas usuárias.
- Hierarquia visual e layout.
- Tipografia. (que estejam disponíveis em sites gratuitamente)
- Sistema de cores.
- Imagens.
- Ícones. (que estejam disponíveis em sites gratuitamente)
- Elementos interativos e microinterações.
- Ergonomia e toque.
- Design inclusivo e acessibilidade (WCAG): como os critérios acima se aplicam em cada tela.
- Estados da interface: feedback das ações, validação em tempo real e estados de tela (por exemplo, carregando, vazio, erro e sucesso).

Em cada etapa:
- Faça você as pesquisas necessárias (dados sobre o problema, boas práticas de acessibilidade, exemplos de soluções parecidas) e me traga um resumo com as fontes. As referências visuais quem vai sugerir sou eu.
- Me faça perguntas que me ajudem a decidir. Quando houver mais de um caminho, mostre as opções com prós e contras.
- Espere minha resposta antes de avançar.

Quando as decisões estiverem tomadas, gere você mesmo o protótipo visual das telas com base nas minhas escolhas, começando pela versão de celular. Eu não quero desenhá-lo manualmente. Como o protótipo visual não mostra a experiência de quem usa leitor de tela, descreva também como cada tela funciona sem a visão: a ordem de leitura, os textos alternativos e a forma de navegar.

Ao longo do processo, mantenha um documento de decisões: ao fim de cada etapa, registre o que foi decidido, por quê e como isso se conecta ao problema, à solução, ao tema, às WCAG e às heurísticas de Nielsen. No final, entregue esse documento completo e organizado, para eu usar como documentação do projeto.

Restrições:
- A decisão final é sempre minha, mas você pode me sugerir mudanças. Quando sugerir, explique o motivo.
- Se não conseguir pesquisar algo, gerar o protótipo ou tiver dúvida sobre alguma informação, me avise claramente e sugira uma alternativa.
- Fale em português do Brasil, com linguagem simples, e explique os termos técnicos na primeira vez que aparecerem.

Formato:
- Comece com um mapa geral das etapas, só com os títulos. Depois avance uma etapa por vez.
- Em cada mensagem, inclua: em que etapa estamos, uma explicação curta, até 3 perguntas para mim e qual é o próximo passo.
- Seja direto: respostas curtas e sem enrolação.

## RESPOSTA:
Vou primeiro conferir se os dois PDFs chegaram aqui na conversa.
Os dois PDFs chegaram. Vou lê-los antes de montar o mapa.
Li os dois documentos. Agora vou buscar os dados para a primeira etapa.
Os dois PDFs foram lidos. O mapa e a primeira etapa estão abaixo.
Mapa geral das etapas
1.	O papel da aplicação web dentro da solução
2.	Pessoas usuárias e cenários de uso
3.	Nível de conformidade WCAG
4.	Arquitetura de informação e fluxos das telas
5.	Tom de voz
6.	Hierarquia visual e layout (mobile-first)
7.	Tipografia
8.	Sistema de cores
9.	Ícones e imagens
10.	Elementos interativos, ergonomia e toque
11.	Microinterações e estados da interface
12.	Protótipo no celular e descrição para leitor de tela
13.	Adaptação para telas maiores
14.	Avaliação com as heurísticas de Nielsen e ajustes
15.	Documento de decisões final
________________________________________
Etapa 1: O papel da aplicação web dentro da solução
Por que começar aqui: a proposta de vocês diz que a pulseira funciona sem celular e que a pessoa não precisa consultar a tela. Esse é o diferencial do produto. Então, antes de pensar em cores e telas, é preciso responder uma pergunta: para que serve um site, se a pulseira não depende de tela? Se o site repetir o que a pulseira já faz, como navegar até um destino, ele contradiz a solução. Isso quebraria a linha problema → solução → experiência.
O que a pesquisa mostra:
•	Tamanho do problema: 7,9 milhões de pessoas no Brasil têm dificuldade para enxergar, segundo o Censo 2022 do IBGE.
•	Pessoas cegas usam muito o celular. Na pesquisa da WebAIM, 91,3% das pessoas que usam leitor de tela usam esse recurso no celular. O VoiceOver (iPhone) aparece em 70,6% das respostas, e o TalkBack (Android) em 34,7%. Leitor de tela é o programa que lê em voz alta o que está na tela. Esse dado reforça a escolha mobile-first, ou seja, desenhar primeiro para o celular.
•	Como essas pessoas navegam: 71,6% vão primeiro aos títulos da página para achar informação. Os maiores problemas que elas relatam são CAPTCHA (o teste "não sou um robô"), menus que não se comportam como esperado e botões com nomes que não fazem sentido.
•	Produto parecido: a bengala WeWALK tem um app que complementa a bengala. Ele dá rotas por voz e acompanha o transporte público, e os comandos principais ficam na própria bengala. O app não substitui o dispositivo, só adiciona funções.
•	O que o briefing da GS pede: "letras legíveis, bom contraste, linguagem simples e telas pequenas", e nada de dados pessoais reais (só dados simulados).
Caminhos possíveis para o site:
Opção	O que é	Prós	Contras
A. Site de apresentação	Explica a pulseira, os sinais e o impacto	Simples, cabe bem no 1º ano, ajuda no pitch	Pouca interação. O público real seria mais a família e as instituições do que a própria pessoa cega
B. Painel da pulseira	Salvar destinos favoritos, escolher o modo, ajustar a intensidade da vibração	Utilidade real no dia a dia	Precisa justificar por que existe, se a pulseira é independente. Usa dados simulados
C. Treino dos sinais	Aprender e praticar os códigos (parar, aguardar, virar) antes de sair na rua	Resolve uma barreira real (a curva de aprendizado) e é ótimo para demonstrar	A vibração pelo navegador só funciona no Android com Chrome. No iPhone, seria preciso usar som e texto
D. Combinação	Apresentação + área da pessoa usuária (configurar e treinar)	Mais completa	Mais telas para desenhar e construir
Minha sugestão para vocês pensarem: a opção C ou D conecta melhor com o problema. Sem treino, a pessoa não confia nos sinais na hora de atravessar a rua. Mas a decisão é sua.
Perguntas para você:
1.	Qual papel o site vai ter (A, B, C, D ou outro)?
2.	Quem vai usar o site: só a pessoa com deficiência visual, ou também familiares e instrutores de orientação e mobilidade (profissionais que ensinam pessoas cegas a se locomover)?
3.	O grupo já conversou com alguém cego ou com baixa visão? O briefing da GS exige isso, e essa conversa pode validar a escolha acima.
Próximo passo: com suas respostas, eu registro a Etapa 1 no documento de decisões e seguimos para a Etapa 2 (pessoas usuárias e cenários).
Fontes:
•	Agência Brasil: Brasil tem 14,4 milhões de pessoas com deficiência (Censo 2022)
•	WebAIM: Screen Reader User Survey #10
•	WeWALK: página do produto
•	Seus anexos: GlobalSolutiondoc.pdf e Pulseira inteligente de navegação para pessoas cegas.pdf


# Prompt 1
Ajuste o alt de 4 imagens para descrever o que cada foto mostra de verdade (decisão da equipe em 15/11/2026). Troque o alt no código e o "alt sugerido" do comentário do marcador. Não mude mais nada. Não faça commit. - components/solucao/GaleriaCanvas.jsx, lista FOTOS: - galeria-calcada-obstaculo: "Calçada com placas de concreto quebradas e desniveladas." - galeria-esquina-rampa: "Esquina em ladeira, com calçada estreita e sem rampa de acesso." - galeria-semaforo-pedestres: "Semáforo de pedestres com o boneco vermelho aceso." - app/solucao/page.jsx, lista TECNOLOGIAS: - peca-apis: "Ilustração de um chip com a palavra API, ligado a circuitos." Depois: 1. Atualize os alts sugeridos na ESPECIFICACAO (tabelas da 18.13 e da 19.14). 2. Registre no REGISTRO_DESENVOLVIMENTO uma seção "Depois da Fase 9" com: - a ligação das imagens (commit 8f1e389); - as correções do celular (commit 68a7531): modo fixo a partir de 700 px de altura, sinais em 4:3 na lista, "Antes e depois" em 16:9 e o número do ODS sem quebra; - este ajuste dos alts. 3. Acrescente essas decisões na tabela da seção 17 da ESPECIFICACAO. 4. Rode npm run lint e npm run build.

## RESPOSTA
A espera acima de 10 s está pronta e testada no navegador: os 28 testes passaram. O lint e o build passam sem erros, e não fiz commit.
O que mudou para quem usa
•	Carregando (lista, Ver registro e Editar registro): aos 10 s, a região de status ganha "Está demorando mais que o normal. Você pode esperar ou parar.". Abaixo dela, fora da região, aparece o botão "Parar de carregar". Ao tocar, a busca para e entra o erro "Carregamento interrompido." com "Tentar de novo", que recebe o foco. O botão de parar some.
•	Salvando… e Excluindo…: aos 10 s, o leitor de tela anuncia "Está demorando mais que o normal. Aguarde mais um pouco.". Não há botão de parar, e o foco continua no botão travado.
•	Efeitos desligados: o indicador fica parado.
Como foi feito
•	Um hook novo, useEsperaLonga.js, conta os 10 s e serve às três esperas.
•	useRegistros.js e useRegistro.js ganharam parar(), que usa o AbortController que já existia.
•	Os textos e o botão estão em EstadoTela.jsx, e as três telas do Diário foram ligadas a ele.
•	O aviso de "Salvando…" e "Excluindo…" está em FormularioRegistro.jsx e DialogoConfirmacao.jsx.
Como testei
•	Usei o Chrome sem janela e uma API falsa que demorava 13 s para responder, tudo fora do projeto, como nos testes das fases anteriores.
•	Foi conferido nas 3 telas de carregamento e no salvar e no excluir: nenhum aviso aos 3 s, o aviso e o botão aos 11,5 s, o "Parar de carregar" pelo teclado e o foco em "Tentar de novo".
•	npm run lint: 0 erros. Os 6 avisos no-img-element são os mesmos de antes.
•	npm run build: sem erros. Saiu só o aviso de sempre do Turbopack sobre a fonte de reserva da Atkinson Hyperlegible Next.
Como testar a espera longa
1.	Com a API configurada, abra /diario e o DevTools (F12).
2.	Na aba Network, no menu No throttling, escolha Add… e crie um perfil com Latency de 15000 ms. O "Slow 4G" pronto não passa de 10 s numa resposta pequena.
3.	Recarregue a página. Aos 10 s, toque em "Parar de carregar" e confira "Carregamento interrompido." e o foco em "Tentar de novo". Repita em Ver registro e em Editar registro.
4.	Para o salvar: deixe Editar registro carregar sem o perfil lento, ligue o perfil e toque em "Salvar registro". Com o NVDA, você ouve "Salvando" e, aos 10 s, o aviso. Faça o mesmo com "Excluir registro" no diálogo.
5.	No fim, volte para No throttling.
Esse passo a passo também está no REGISTRO, na parte 4 de "Depois da Fase 9".
Documentação
•	ESPECIFICACAO: a 11.1 perdeu o "Pendente" e passou a descrever o comportamento. A 11.2 ganhou 3 linhas na tabela e a 17 ganhou 2. Também risquei a pendência equivalente da seção 16, que era sobre o mesmo assunto.
•	REGISTRO: entrou a parte 4 em "Depois da Fase 9" e a pendência dos textos foi riscada.
Para a equipe decidir (estão como "Implementação" na seção 17):
•	O aviso de "Salvando…" e "Excluindo…" só é ouvido pelo leitor de tela, porque a região de status que já existia é invisível. Quem enxerga continua vendo só o botão travado. Posso deixar o aviso visível também, se a equipe quiser.
•	"Carregamento interrompido." aparece sem a segunda linha "Verifique a conexão e tente de novo.", porque a conexão não falhou.
•	"Parar de carregar" ficou sem ícone.
•	O "Desfazer" da lista, que também grava no servidor, não ganhou o aviso de 10 s, porque não estava no pedido.
Sobre os commits: o seu commit 897c447 levou só o código dos alt. As mudanças de documentação da tarefa anterior continuam sem commit, junto com as de agora. Para separar as duas no histórico, use git add -p nos dois arquivos de docs/.
Sugestão de commit: Adiciona o aviso e o "Parar de carregar" para esperas acima de 10 s


# Prompt 2
Correções do teste no iPhone (357×667). Não mude textos nem cores. Não faça commit. 1. Sinais (hooks/useRolagemFixa.js e components/solucao/SinaisRolagemFixa.jsx): - Em CONSULTA_MODO_FIXO, troque min-height: 560px por min-height: 700px. - No modo lista, troque aspect-video por aspect-[4/3] na <img> do sinal, para a foto aparecer inteira. 2. Antes e depois (components/solucao/AntesDepois.jsx): - Na moldura, troque aspect-[4/5] ... min-[32.5rem]:aspect-[16/10] por aspect-video em todos os tamanhos (os vídeos são 1280×720). 3. ODS (components/solucao/FaixaODS.jsx): - No <span> do número, em ConteudoOds, adicione shrink-0 whitespace-nowrap. 4. Rode npm run lint e npm run build. Registre as 3 correções no REGISTRO_DESENVOLVIMENTO.

## RESPOSTA

Fiz as 3 correções e registrei tudo no registro. O npm run lint e o npm run build passaram sem erros. Não fiz commit, e textos e cores ficaram iguais.
1.	Sinais
o	Em useRolagemFixa.js:31, CONSULTA_MODO_FIXO agora pede min-height: 700px. Com isso, no iPhone testado (667 px de altura), os sinais aparecem em lista comum.
o	Em SinaisRolagemFixa.jsx:205, a <img> do modo lista usa aspect-[4/3].
o	Os comentários dos dois arquivos diziam 560 px e passaram a dizer 700 px. Mudei só os comentários, nenhum texto da tela.
2.	Antes e depois: a moldura em AntesDepois.jsx:90 usa aspect-video em todos os tamanhos. Tirei o aspect-[4/5] e o min-[32.5rem]:aspect-[16/10].
3.	ODS: o <span> do número em ConteudoOds (FaixaODS.jsx:64) ganhou shrink-0 e whitespace-nowrap.
4.	Conferência:
o	O lint mostra 6 avisos no-img-element. Eles já existiam antes destas correções, pelo uso de <img> no lugar do <Image /> do Next. Um deles é na foto do sinal, mas essa <img> já estava lá.
o	O build mostra o aviso de sempre da fonte Atkinson (Failed to find font override values).
o	Registrei as correções em REGISTRO_DESENVOLVIMENTO.md, na seção "Depois da Fase 9 — correções do teste no iPhone", com o teste manual e uma sugestão de commit.
A especificação ainda diz 560 px no "Modo fixo" (ESPECIFICACAO_PULSE.md:1278). Não mexi porque vocês pediram só o registro, e deixei isso como pendente lá. Se quiserem, atualizo essa linha também.

# 3. Aplicação no projeto

**O que é este tópico:** o que, de fato, entrou no projeto com ajuda da IA: funcionalidades, componentes ou trechos de código criados, sugeridos ou modificados.

**Planejamento (Claude):** a especificação `ESPECIFICACAO_PULSE.md`, com rotas, textos das páginas, modelo de dados, validação, cores com contraste calculado, tipografia, estados de tela e o checklist de acessibilidade.

**Código (Claude Code), por área:**

| Área | O que foi desenvolvido | Principais arquivos |
| --- | --- | --- |
| Estilos globais | Tokens de cor para os temas claro e escuro, tipografia, contorno de foco de 3 px e regras para alto contraste e "reduzir movimento" | `app/globals.css`, `app/layout.jsx` |
| Layout comum | "Pular para o conteúdo", cabeçalho, rodapé e barra de navegação que some ao rolar. O foco vai para o título da página nova ao trocar de rota | `LinkPular`, `Cabecalho`, `Rodape`, `BarraNavegacao`, `FocoNaTroca`, `useDirecaoRolagem` |
| Páginas de conteúdo | Início, Solução (com a Equipe), Simulador (espaço reservado) e página 404 | `app/page.jsx`, `app/solucao/page.jsx`, `app/simulador/page.jsx`, `app/not-found.jsx` |
| Camada de dados | Serviço com as 5 funções do CRUD e um único arquivo que faz `fetch`, preparado para a API externa (MockAPI) e sem dados falsos | `services/apiClient.js`, `services/registrosService.js` |
| Funções puras | Validação do formulário, formatação de datas e rótulos | `lib/validacao.js`, `lib/datas.js`, `lib/rotulos.js` |
| Diário de deslocamentos (CRUD) | Listar, criar, ver, editar e excluir registros, com "Desfazer". Também tem o resumo dos indicadores, os estados de carregando, vazio e erro, a validação ao enviar e o aviso "Descartar as respostas?" | `TelaDiario`, `FormularioRegistro`, `DetalheRegistro`, `DialogoConfirmacao`, `useRegistros`, `useFormularioRegistro`, `useResumoIndicadores`, `useGuardaDeSaida` |
| Responsividade | Layouts para celular, tablet e computador, sem mudar a ordem de leitura no HTML | `PaginaComIndice`, classes do Tailwind |
| Acessibilidade | Revisão completa e correções: foco no campo de data, barra com texto ampliado, palavras longas e contraste dos botões | Vários componentes |
| Pulseira 3D | Modelo da pulseira em Three.js que gira, mostra as partes e os sinais e pode ser pausado. Sem WebGL, aparece uma descrição em texto | `lib/pulseira3d/`, `usePulseira3D`, `useGiroPulseira`, `ExplorarPulseira` |
| Movimento e efeitos | Interruptor "Efeitos" (desligado, nada se move), rolagem suave, transição entre páginas, capa e textos que aparecem ao rolar | `InterruptorEfeitos`, `useEfeitos`, `ProvedorMovimento`, `TransicaoPagina` |
| Seções interativas | "Antes e depois" com controle deslizante, cartões de Tecnologias que viram, galeria arrastável e trajeto animado | `AntesDepois`, `CartaoTecnologia`, `GaleriaCanvas`, `TrajetoPulse` |
| Vídeos | Vídeos que começam mudos, com botões de pausa e som, legendas e um quadro parado com os efeitos desligados | `VideoPulse`, `useVideoPulse` |
| Microinterações do Diário | Tremor nos campos com erro, "certo" desenhado na mensagem de sucesso e destaque no registro salvo | `Tremor`, `CertoDesenhado`, `IconeAlternado` |

**Sugerido ou modificado com a IA, mas decidido pelo grupo:** troca da paleta (de roxo para laranja e grafite), tamanho dos títulos para funcionarem com zoom, botões com texto fixo para o leitor de tela e escolha do MockAPI como API externa. Todas essas decisões estão na seção 17 da especificação.

**Em números:** 7 rotas e a página 404, 65 componentes, 38 custom hooks, 2 serviços e 10 módulos em `lib/`.

**Feito à mão pelo grupo:** imagens, conexão com o MockAPI, simulador e todos os commits.

**Exemplo:** o hook `useFormularioRegistro` (validação do formulário do Diário só ao enviar, com o foco indo para o primeiro erro) foi escrito pelo Claude Code, a partir da regra de validação definida na especificação.

# 4. Validação das respostas

Após a execução da geração do código pela IA, testes eram realizado via desktop e mobile visualmente pelo localhost, quando não saía de acordo com o esperado, logo em seguida eram realizados pedidos de correção e ajustes.

# 5. Análise crítica

A IA acelera a execução do código e planejamento do que será feito, porém sem supervisão ou um atento acompanhamento do que está sendo gerado pode trazer uma composição que não é deseja ou esperada. No caso do Claude, a limitação está mais relacionada a limites para pesquisar e acessar sites na internet, com isso a pessoa precisa passar detalhadamente as decisões e referências para que ele consiga entender o que você realmente pretende desenvolver, e a dificuldade é a falta de acesso ao histórico das sessões do claude code que poderiam ser disponíveis para o desenvolvedor ter acesso de maneira mais fácil.

 ## Observação

 As informações completas do projeto estão nos documentos: **ESPECIFICACAO_PULSE.md e REGISTRO_DESENVOLVIMENTO.md em docs**