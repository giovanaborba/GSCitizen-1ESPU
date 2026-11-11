import Link from "next/link";
import EspacoIcone from "@/components/ui/EspacoIcone";

/*
  ItemBarra — um item da barra flutuante (seção 9.2).
  - Celular: ícone em cima e texto embaixo, altura mínima de 56 px.
  - A partir de 768 px: ícone e texto lado a lado, altura mínima de 48 px.
  - Não selecionado: borda --cor-linha-item (mostra onde tocar).
  - Selecionado: fundo dourado (--cor-ouro) com texto #120B24, negrito e
    aria-current="page" (seção 18.9). O formato em pílula entra na 8.3.

  O texto aparece duas vezes empilhado: uma visível e uma invisível em
  negrito. A invisível reserva a largura do negrito, para a barra não
  "pular" quando o item ativo muda. Ela tem aria-hidden, então o leitor de
  tela lê o nome uma vez só.
*/
export default function ItemBarra({ href, texto, icone, ativo, aoNavegar }) {
  return (
    // flex-auto: em uma linha, cada item tem a largura do texto e divide o
    // espaço que sobra; em 2 × 2 (grade), não tem efeito
    <li className="flex flex-auto">
      <Link
        href={href}
        onNavigate={aoNavegar}
        aria-current={ativo ? "page" : undefined}
        className={`flex min-h-14 w-full flex-col items-center justify-center gap-0.5 rounded-campo border px-1 py-1 text-auxiliar no-underline transicao-fundo md:min-h-12 md:flex-row md:gap-2 md:px-4 ${
          ativo
            ? "border-ouro bg-ouro font-bold text-sobre-ouro"
            : "border-linha-item bg-superficie text-texto hover:bg-hover"
        }`}
      >
        <EspacoIcone nome={icone} />
        <span className="grid">
          <span className="col-start-1 row-start-1">{texto}</span>
          <span aria-hidden="true" className="invisible col-start-1 row-start-1 font-bold">
            {texto}
          </span>
        </span>
      </Link>
    </li>
  );
}
