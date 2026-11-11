/*
  Cartao — seção 10, item 6.
  Superfície com borda + sombra leve (a borda é o que separa; a sombra só
  reforça e some no alto contraste do Windows).

  - "as": qual elemento HTML usar. Em listas de cartões, use as="li"
    dentro de um <ul> ou <ol>, para o leitor de tela anunciar
    "lista, 3 itens".
  - "destaque": borda mais grossa na cor da marca (ex.: ODS principal).
    A borda nunca é a única pista: quem usa destaque também escreve um
    texto, como "Principal".
  - O título dentro do cartão é escrito por quem usa, no nível certo
    (h3 ou h4), conforme a página.
*/
export default function Cartao({ as: Elemento = "div", destaque = false, className = "", children }) {
  return (
    <Elemento
      className={`rounded-cartao bg-cartao p-6 shadow-cartao ${
        destaque ? "border-2 border-marca" : "border border-borda"
      } ${className}`}
    >
      {children}
    </Elemento>
  );
}
