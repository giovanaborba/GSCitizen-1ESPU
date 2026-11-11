/*
  TituloPagina — o <h1> e a frase de resumo do topo de cada página
  (seção 5, item 3.1).

  O <h1> tem tabIndex={-1} para receber o foco quando a pessoa troca de
  página (FocoNaTroca). Ele não entra na ordem do Tab, e o contorno de
  foco fica escondido nesse caso (globals.css).
*/
export default function TituloPagina({ titulo, resumo }) {
  return (
    <div>
      <h1 tabIndex={-1} className="text-marca">
        {titulo}
      </h1>
      {resumo && <p className="mt-4 text-texto-2">{resumo}</p>}
    </div>
  );
}
