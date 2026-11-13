import Link from "next/link";
import EspacoIcone from "@/components/ui/EspacoIcone";

/*
  ItemBarra — um item da barra flutuante (seção 9.2).
  - Celular: ícone em cima e texto embaixo, altura mínima de 56 px.
  - A partir de 768 px: ícone e texto lado a lado, altura mínima de 48 px.
  - Não selecionado: sem borda visível (seção 19.5): a pílula da barra já
    mostra a área. A borda continua, transparente, para o item não mudar
    de tamanho e para aparecer no alto contraste do Windows.
  - Selecionado: fundo laranja (--cor-acao) com texto grafite (4,55:1), negrito e
    aria-current="page" (seção 18.9).
  - Texto centralizado (19.5): enquanto o ícone não entra, o espaço dele
    não ocupa lugar (EspacoIcone).
  - Cantos: a partir de 768 px (ícone e texto numa linha), pílula
    perfeita. No celular, o item tem 2 andares (ícone em cima, texto
    embaixo); a pílula perfeita cortaria os cantos do texto, então o
    canto é de 20 px.

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
        className={`flex min-h-14 w-full flex-col items-center justify-center gap-0.5 rounded-[1.25rem] border px-1 py-1 text-auxiliar md:rounded-full no-underline transicao-fundo md:min-h-12 md:flex-row md:gap-2 md:px-4 ${
          ativo
            ? "border-acao bg-acao font-bold text-sobre-acao"
            : "border-transparent bg-superficie text-texto hover:bg-hover"
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
