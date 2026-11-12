/*
  TituloPagina — o <h1> e a frase de resumo do topo de cada página
  (seção 5, item 3.1), no visual da Fase 8.

  O <h1> tem tabIndex={-1} para receber o foco quando a pessoa troca de
  página (FocoNaTroca). Ele não entra na ordem do Tab, e o contorno de
  foco fica escondido nesse caso (globals.css).

  - rotulo: rótulo mono acima do título (seção 18.5), ex.: "A solução".
    Opcional (o Diário fica sem rótulo).
*/
export default function TituloPagina({ titulo, resumo, rotulo }) {
  return (
    <div>
      {/* Esta parte é lógica */}
      {rotulo && <p className="rotulo-mono mb-3 text-destaque">{rotulo}</p>}
      <h1 tabIndex={-1} className="max-w-[16ch]">
        {titulo}
      </h1>
      {resumo && <p className="mt-4 max-w-[46ch] text-texto-2">{resumo}</p>}
    </div>
  );
}
