/*
  Secao — uma seção de conteúdo com <h2> (seção 5, item 3.3).

  O <h2> tem "id" (alvo dos links do "Nesta página") e tabIndex={-1}, para
  receber o foco quando a pessoa usa o índice (seção 9.4). Assim o leitor
  de tela começa a ler a partir do título da seção.
*/
export default function Secao({ id, titulo, className = "", children }) {
  return (
    <section className={`mt-16 ${className}`}>
      <h2 id={id} tabIndex={-1}>
        {titulo}
      </h2>
      <div className="mt-4 space-y-6">{children}</div>
    </section>
  );
}
