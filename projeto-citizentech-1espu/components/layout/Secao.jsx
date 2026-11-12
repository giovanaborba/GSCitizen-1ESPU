/*
  Secao — uma seção de conteúdo com <h2> (seção 5, item 3.3), no visual
  da Fase 8 (seção 18.5).

  O <h2> tem "id" (alvo dos links do "Nesta página") e tabIndex={-1}, para
  receber o foco quando a pessoa usa o índice (seção 9.4). Assim o leitor
  de tela começa a ler a partir do título da seção.

  Props:
  - rotulo: rótulo mono acima do título (eyebrow), ex.: "Tema". Opcional.
    Com rótulo, o título ganha uma margem de rolagem (scroll-mt-10): ao
    pular para a seção, o rótulo também aparece, em vez de ficar atrás
    do cabeçalho ou da faixa do "Nesta página".
  - larga: o conteúdo usa a área toda da página (76rem), para fotos e
    cartões lado a lado. Sem ela, o conteúdo fica em até 40rem (50 a 75
    caracteres por linha, seção 5). Quem usa "larga" limita o texto
    corrido com max-w-texto.
*/
export default function Secao({ id, titulo, rotulo, larga = false, className = "", children }) {
  return (
    <section className={`mt-20 ${className}`}>
      {/* Esta parte é lógica */}
      {rotulo && <p className="rotulo-mono text-destaque">{rotulo}</p>}
      <h2 id={id} tabIndex={-1} className={rotulo ? "mt-3 scroll-mt-10" : ""}>
        {titulo}
      </h2>
      <div className={`mt-6 space-y-6 ${larga ? "" : "max-w-texto"}`}>{children}</div>
    </section>
  );
}
