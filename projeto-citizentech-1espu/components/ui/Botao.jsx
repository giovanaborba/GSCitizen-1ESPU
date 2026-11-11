import Link from "next/link";
import EspacoIcone from "@/components/ui/EspacoIcone";

/*
  Botao — seção 10, item 4.
  Variantes:
  - "principal": preenchido (ação principal da tela)
  - "secundario": só contorno
  - "perigo": contorno na cor de erro (ex.: "Excluir registro" na página)
  - "perigo-preenchido": preenchido na cor de erro (ex.: confirmar no diálogo)

  Vira link (<Link>) quando recebe "href"; senão, é um <button>.
  Use <button> para ações e link para navegar (seção 3, item 6).
  Altura mínima de 56 px. "icone" recebe o nome do ícone Phosphor; o
  marcador ICONE-(nome)-AQUI fica no lugar onde o Botao é usado.

  Durante "Salvando…" e "Excluindo…" usamos aria-disabled="true" em vez
  de disabled: o botão continua com o foco (com disabled, o navegador
  tiraria o foco dele, e quem usa teclado ou leitor de tela se perderia).
  Quem usa o Botao ignora o segundo toque enquanto estiver ocupado.
*/
/*
  Visual da Fase 8 (seção 18.5): todos em pílula (rounded-full), 56 px
  de altura.
  - principal: dourado com texto #120B24 (8,3:1). No hover, NÃO troca de
    cor (seção 18.3): ganha uma sombra leve e sobe 2 px. A subida só
    acontece sem "reduzir movimento" (motion-safe:); a sombra vale sempre.
  - secundario: contorno de 2 px na cor da marca; no hover, fundo leve
    (--cor-hover: marca a 12%).
*/
const ESTILO_BASE =
  "inline-flex min-h-14 items-center justify-center gap-2 rounded-full border-2 px-7 py-2 text-center font-bold no-underline transition-[background-color,box-shadow,translate] duration-200 aria-disabled:cursor-wait";

const ESTILO_VARIANTE = {
  principal:
    "border-ouro bg-ouro text-sobre-ouro hover:shadow-barra motion-safe:hover:-translate-y-0.5",
  secundario: "border-marca bg-transparent text-marca hover:bg-hover",
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

  const conteudo = (
    <>
      {icone && <EspacoIcone nome={icone} />}
      <span>{children}</span>
    </>
  );

  // Esta parte é lógica
  if (href) {
    return (
      <Link href={href} className={classes} {...resto}>
        {conteudo}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...resto}>
      {conteudo}
    </button>
  );
}
