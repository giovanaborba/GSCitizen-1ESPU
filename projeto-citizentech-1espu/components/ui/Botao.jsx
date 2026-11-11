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
*/
const ESTILO_BASE =
  "inline-flex min-h-14 items-center justify-center gap-2 rounded-cartao border-2 px-6 py-2 text-center font-bold no-underline transicao-fundo disabled:cursor-wait";

const ESTILO_VARIANTE = {
  principal: "border-botao bg-botao text-botao-texto hover:border-botao-hover hover:bg-botao-hover",
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
