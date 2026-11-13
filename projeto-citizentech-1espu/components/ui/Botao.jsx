import LinkInterno from "@/components/ui/LinkInterno";
import EspacoIcone from "@/components/ui/EspacoIcone";
import BotaoMagnetico from "@/components/ui/BotaoMagnetico";

/*
  Botao — seção 10, item 4.
  Variantes:
  - "principal": preenchido (ação principal da tela)
  - "secundario": só contorno
  - "secundario-sobre-cor": o secundário com fundo sólido (--cor-superficie),
    para quando ele fica sobre um fundo colorido (mensagens de sucesso,
    erro e aviso). Revisão da Fase 9 (9.10): o laranja #CC4200 sobre os
    fundos claros de status ficava abaixo de 4,5:1 (4,22:1 no erro,
    4,3:1 no sucesso); sobre a superfície branca, fica com 4,8:1.
  - "perigo": contorno na cor de erro (ex.: "Excluir registro" na página)
  - "perigo-preenchido": preenchido na cor de erro (ex.: confirmar no diálogo)

  Vira link (LinkInterno: guarda de saída + transição entre páginas)
  quando recebe "href"; senão, é um <button>.
  Use <button> para ações e link para navegar (seção 3, item 6).
  Altura mínima de 56 px. "icone" recebe o nome do ícone Phosphor; o
  marcador ICONE-(nome)-AQUI fica no lugar onde o Botao é usado.

  Durante "Salvando…" e "Excluindo…" usamos aria-disabled="true" em vez
  de disabled: o botão continua com o foco (com disabled, o navegador
  tiraria o foco dele, e quem usa teclado ou leitor de tela se perderia).
  Quem usa o Botao ignora o segundo toque enquanto estiver ocupado.
*/
/*
  Visual das Fases 8 e 9 (seções 18.5 e 19.3): todos em pílula
  (rounded-full), 56 px de altura.
  - principal: laranja #FC4C02 com texto grafite #242428 (4,55:1). No
    hover, NÃO troca de cor: ganha uma sombra leve e sobe 2 px. A subida
    só acontece com os efeitos ligados (efeitos-ligados:, seção 19.2); a
    sombra vale sempre. Fase 9 (19.6): é sempre magnético (o conteúdo
    segue o mouse até 8 px), pelo componente BotaoMagnetico.
  - secundario: contorno de 2 px na cor da marca; no hover, fundo leve
    (--cor-hover: marca a 12%) e texto grafite. O texto laranja sobre esse
    fundo ficaria em 4,1:1, abaixo do mínimo de 4,5:1.
*/
const ESTILO_BASE =
  "inline-flex min-h-14 items-center justify-center gap-2 rounded-full border-2 px-7 py-2 text-center font-bold no-underline transition-[background-color,color,box-shadow,translate] duration-200 aria-disabled:cursor-wait";

const ESTILO_VARIANTE = {
  principal:
    "border-acao bg-acao text-sobre-acao hover:shadow-barra efeitos-ligados:hover:-translate-y-0.5",
  secundario: "border-marca bg-transparent text-marca hover:bg-hover hover:text-texto",
  "secundario-sobre-cor": "border-marca bg-superficie text-marca hover:text-texto",
  perigo: "border-erro bg-transparent text-erro hover:bg-erro-fundo",
  "perigo-preenchido": "border-erro bg-erro text-perigo-texto",
};

export default function Botao({
  variante = "principal",
  href,
  icone,
  className = "",
  children,
  type = "button",
  ...resto
}) {
  const classes = `${ESTILO_BASE} ${ESTILO_VARIANTE[variante]} ${className}`;

  // Botão laranja principal: conteúdo magnético (seção 19.6)
  if (variante === "principal") {
    return (
      <BotaoMagnetico href={href} icone={icone} type={type} className={classes} {...resto}>
        {children}
      </BotaoMagnetico>
    );
  }

  const conteudo = (
    <>
      {icone && <EspacoIcone nome={icone} />}
      <span>{children}</span>
    </>
  );

  if (href) {
    return (
      <LinkInterno href={href} className={classes} {...resto}>
        {conteudo}
      </LinkInterno>
    );
  }

  return (
    <button type={type} className={classes} {...resto}>
      {conteudo}
    </button>
  );
}
