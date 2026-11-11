import TituloPagina from "@/components/layout/TituloPagina";
import IndiceNestaPagina from "@/components/layout/IndiceNestaPagina";

/*
  PaginaComIndice — estrutura das páginas com "Nesta página" (Início e
  Solução), seções 9.4 e 12.

  Celular e tablet (< 1024 px): uma coluna de até 40rem, nesta ordem:
  título e resumo → cartão "Nesta página" → seções.

  Computador (≥ 1024 px): grade de 2 colunas.
  ┌──────────────────────────┬──────────────┐
  │ título e resumo          │ Nesta página │  ← coluna lateral presa
  │ seções (até 40rem)       │ (sticky)     │    ao rolar
  ├──────────────────────────┴──────────────┤
  │ seção larga (ex.: Equipe, 5 cartões)    │  ← ocupa as 2 colunas
  ├──────────────────────────┐              │
  │ ação final (botão-link)  │              │
  └──────────────────────────┘              ┘
  A ordem no HTML é a mesma nos dois casos (título → índice → seções), e
  é a ordem que o leitor de tela e o Tab seguem.

  Props: titulo, resumo, itensIndice, children (seções), secaoLarga,
         acaoFinal
*/
export default function PaginaComIndice({
  titulo,
  resumo,
  itensIndice,
  children,
  secaoLarga,
  acaoFinal,
}) {
  return (
    <div className="margem-lateral py-8">
      <div className="mx-auto max-w-texto lg:grid lg:max-w-[59rem] lg:grid-cols-[minmax(0,40rem)_16rem] lg:gap-x-12">
        <div className="lg:col-start-1 lg:row-start-1">
          <TituloPagina titulo={titulo} resumo={resumo} />
        </div>

        <div className="mt-8 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0">
          {/* Presa abaixo do cabeçalho. Se a tela for baixa, o índice
              rola por dentro em vez de ficar cortado. */}
          <div className="lg:sticky lg:top-[calc(var(--altura-cabecalho)+1rem)] lg:max-h-[calc(100dvh-var(--altura-cabecalho)-var(--espaco-fim)-1rem)] lg:overflow-y-auto">
            <IndiceNestaPagina itens={itensIndice} />
          </div>
        </div>

        <div className="lg:col-start-1 lg:row-start-2">{children}</div>

        {/* Esta parte é lógica */}
        {secaoLarga && <div className="lg:col-span-2">{secaoLarga}</div>}
        {acaoFinal && <p className="mt-16 lg:col-start-1">{acaoFinal}</p>}
      </div>
    </div>
  );
}
