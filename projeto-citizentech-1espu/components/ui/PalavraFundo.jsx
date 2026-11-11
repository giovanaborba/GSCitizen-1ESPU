/*
  PalavraFundo — palavra gigante decorativa (seções 18.5 e 18.14).
  Ex.: "Pulse" atrás da pulseira na abertura, "Parar" na página 404.

  - É só decoração: aria-hidden="true", então o leitor de tela não lê.
  - Fica atrás do objeto principal, ocupando a área do componente pai
    (que precisa ter position: relative). O que passar da área é cortado
    aqui dentro, então a palavra nunca cria rolagem lateral.
  - Nunca vai atrás de texto (seção 18.2, item 1): quem usa coloca o
    texto sobre um fundo sólido.
  - Tamanho: min(21rem, 150vw ÷ número de letras), seção 18.6. Assim a
    palavra cabe na tela, seja "Parar" ou "Continuar". Palavras com menos
    de 5 letras contam como 5, para não ficarem enormes (como no
    protótipo).
  - "className": ajustes de posição de quem usa (ex.: "pt-[18vh]").
*/

// Esta parte é lógica
function tamanhoDaPalavra(texto) {
  const letras = Math.max(5, texto.length);
  return `min(21rem, ${(150 / letras).toFixed(1)}vw)`;
}

export default function PalavraFundo({ texto, className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden ${className}`}
    >
      <span className="palavra-fundo" style={{ fontSize: tamanhoDaPalavra(texto) }}>
        {texto}
      </span>
    </span>
  );
}
