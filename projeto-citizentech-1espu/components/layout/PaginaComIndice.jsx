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

  Props: titulo e resumo (opcionais), itensIndice, children (seções),
         secaoLarga, acaoFinal
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
    <div className="pb-8">
      {/* Esta parte é lógica */}
      {titulo && (
        <div className="margem-lateral pt-8 pb-4">
          <div className="mx-auto max-w-pagina">
            <TituloPagina titulo={titulo} resumo={resumo} />
          </div>
        </div>
      )}

      <IndiceNestaPagina itens={itensIndice} />

      <div className="margem-lateral">
        <div className="mx-auto max-w-pagina">
          {children}
          {/* Esta parte é lógica */}
          {secaoLarga}
          {acaoFinal && <p className="mt-16">{acaoFinal}</p>}
        </div>
      </div>
    </div>
  );
}
