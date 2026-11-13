/*
  LinkPular — seção 10, item 1.
  Primeiro elemento focável da página. Fica invisível até receber foco
  pelo teclado e leva direto ao <main id="conteudo">, pulando o cabeçalho.
*/
export default function LinkPular() {
  return (
    <a
      href="#conteudo"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:inline-flex focus:min-h-12 focus:items-center focus:rounded-full focus:border-2 focus:border-acao focus:bg-acao focus:px-6 focus:font-bold focus:text-sobre-acao"
    >
      Pular para o conteúdo
    </a>
  );
}
