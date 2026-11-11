/*
  IndiceNestaPagina — seção 9.4 e seção 10, item 5.
  Só em Início e Solução. Cartão com <h2> "Nesta página" e links para os
  "id" das seções.

  - Celular e tablet: cartão no topo, depois do resumo.
  - A partir de 1024 px: coluna lateral presa ao rolar (ajuste da Fase 6).
  - A rolagem suave já é desligada com "reduzir movimento" (globals.css).

  "itens": lista de { id, texto }, na ordem das seções.
*/
export default function IndiceNestaPagina({ itens }) {
  return (
    <nav
      aria-label="Nesta página"
      className="rounded-cartao border border-borda bg-cartao p-6 shadow-cartao"
    >
      <h2 className="text-h3">Nesta página</h2>
      <ul className="mt-2 flex flex-col gap-2">
        {/* Esta parte é lógica */}
        {itens.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className="inline-flex min-h-12 items-center">
              {item.texto}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
