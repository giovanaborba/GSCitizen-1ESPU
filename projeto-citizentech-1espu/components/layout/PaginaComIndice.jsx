import TituloPagina from "@/components/layout/TituloPagina";
import IndiceNestaPagina from "@/components/layout/IndiceNestaPagina";

/*
  PaginaComIndice — estrutura das páginas com "Nesta página" (Início e
  Solução), no layout da Fase 8 (seções 9.4, 12 e 18; decisão 1 da
  equipe).

  Ordem no HTML (é também a ordem visual e a do leitor de tela):
  título e resumo (se houver) → "Nesta página" em pílulas → seções →
  seção larga (se houver) → ação final.

  ┌───────────────────────────────────────────────┐
  │ título e resumo (na Início, ficam na abertura) │
  ├───────────────────────────────────────────────┤
  │ (Nesta página) (pílulas…)  ← gruda no topo no  │
  ├───────────────────────────────────────────────┤   computador
  │ seções: texto em até 40rem; partes largas      │
  │ (fotos, cartões) usam a área toda de 76rem      │
  └───────────────────────────────────────────────┘

  O índice e as seções ficam dentro do mesmo bloco: é isso que deixa o
  índice "grudado" (position: sticky) enquanto as seções passam.

  Cabeça da página (quando há título): rótulo mono, H1 e resumo, com a
  textura de piso tátil só numa faixa à direita, no computador, que se
  apaga em direção ao texto (opção B da equipe).

  overflow-x-clip: corta o que passar da largura da tela (a galeria
  horizontal usa a tela inteira) sem criar rolagem lateral. Diferente de
  overflow: hidden, o "clip" não desliga o position: sticky de dentro.

  Props: titulo, resumo e rotulo (opcionais), itensIndice, children
         (seções), secaoLarga, acaoFinal
*/
export default function PaginaComIndice({
  titulo,
  resumo,
  rotulo,
  itensIndice,
  children,
  secaoLarga,
  acaoFinal,
}) {
  return (
    <div className="overflow-x-clip pb-8">
      {titulo && (
        <div className="relative margem-lateral pt-10 pb-6">
          <div
            aria-hidden="true"
            className="textura-piso textura-lado absolute inset-y-0 right-0 hidden w-[45%] lg:block"
          />
          <div className="relative mx-auto max-w-pagina">
            <TituloPagina titulo={titulo} resumo={resumo} rotulo={rotulo} />
          </div>
        </div>
      )}

      <IndiceNestaPagina itens={itensIndice} />

      <div className="margem-lateral">
        <div className="mx-auto max-w-pagina">
          {children}
          {secaoLarga}
          {acaoFinal && <p className="mt-16">{acaoFinal}</p>}
        </div>
      </div>
    </div>
  );
}
