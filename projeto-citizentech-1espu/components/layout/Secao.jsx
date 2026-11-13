import RotuloSecao from "@/components/layout/RotuloSecao";

/*
  Secao — uma seção de conteúdo com <h2> (seção 5, item 3.3), no visual
  das Fases 8 e 9 (seções 18.5 e 19.5).

  O <h2> tem "id" (alvo dos links do "Nesta página") e tabIndex={-1}, para
  receber o foco quando a pessoa usa o índice (seção 9.4). Assim o leitor
  de tela começa a ler a partir do título da seção.

  Props:
  - rotulo: rótulo mono acima do título (eyebrow), ex.: "CitizenTech".
    Opcional. Com rótulo, o título ganha uma margem de rolagem
    (scroll-mt-10): ao pular para a seção, o rótulo também aparece, em vez
    de ficar atrás do cabeçalho ou da faixa do "Nesta página".
  - larga: o conteúdo usa a área toda da página (76rem), para fotos e
    cartões lado a lado. Sem ela, o conteúdo fica em até 40rem (50 a 75
    caracteres por linha, seção 5). Quem usa "larga" limita o texto
    corrido com max-w-texto.
  - banda (seção 19.5): seção alternada, com o fundo --cor-faixa de ponta
    a ponta da tela e o divisor de piso tátil no topo. Separa as seções
    pelo fundo (pilar do contraste), em vez de só pelo espaço.
  - duasColunas (seção 19.5): no computador (a partir de 64rem), o rótulo
    e o título ficam à esquerda e o texto à direita, começando na altura
    do título. No celular, um embaixo do outro. A ordem no HTML (e do
    leitor de tela) não muda: rótulo → título → texto.
  - encaixe (seção 19.6): marca a seção com data-encaixe, para a rolagem
    com encaixe por proximidade (useEncaixe) poder assentar nela.

  Rótulo (RotuloSecao): a linha laranja antes dele se desenha quando a
  seção chega (19.6).

  Granulado nas bandas (19.6): o grão da página fica atrás de tudo, então
  o fundo opaco da banda o cobriria. Por isso a banda tem a própria camada
  de grão, por cima do fundo dela e atrás do conteúdo.

  Como a banda vai de ponta a ponta: a Secao fica dentro da área de 76rem
  da página. O fundo e o divisor são duas camadas decorativas
  (aria-hidden) com a largura da tela (w-screen), centralizadas na seção.
  O que passa da tela é cortado pelo overflow-x-clip do PaginaComIndice,
  então não aparece rolagem lateral. "isolate" cria uma camada própria
  para a seção: o fundo (-z-10) fica atrás do conteúdo dela, mas nunca
  atrás da página.
*/
export default function Secao({
  id,
  titulo,
  rotulo,
  larga = false,
  banda = false,
  duasColunas = false,
  encaixe = false,
  className = "",
  children,
}) {
  // Esta parte é lógica
  const classesSecao = banda ? "relative isolate mt-20 py-18" : "mt-20";
  const classesGrade = duasColunas ? "lg:grid lg:grid-cols-2 lg:gap-x-12" : "";
  const classesRotulo = duasColunas ? "lg:col-start-1 lg:row-start-1" : "";
  const classesTitulo = `${rotulo ? "mt-3 scroll-mt-10" : ""} ${duasColunas ? "lg:col-start-1 lg:row-start-2 lg:self-start" : ""}`;
  // Nas duas colunas, o texto começa na altura do título: com rótulo, o
  // título tem 12 px de margem em cima (mt-3), e o texto ganha a mesma.
  const classesConteudo = `mt-6 space-y-6 ${larga ? "" : "max-w-texto"} ${
    duasColunas ? `lg:col-start-2 lg:row-span-2 lg:row-start-2 ${rotulo ? "lg:mt-3" : "lg:mt-0"}` : ""
  }`;

  return (
    <section
      data-encaixe={encaixe ? "" : undefined}
      className={`${classesSecao} ${classesGrade} ${className}`}
    >
      {/* Esta parte é lógica */}
      {banda && (
        <>
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 bg-faixa"
          />
          <span
            aria-hidden="true"
            className="grao absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2"
          />
          <span
            aria-hidden="true"
            className="divisor-piso absolute top-0 left-1/2 w-screen -translate-x-1/2"
          />
        </>
      )}
      {rotulo && <RotuloSecao className={classesRotulo}>{rotulo}</RotuloSecao>}
      <h2 id={id} tabIndex={-1} className={classesTitulo}>
        {titulo}
      </h2>
      <div className={classesConteudo}>{children}</div>
    </section>
  );
}
