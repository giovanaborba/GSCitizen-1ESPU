import EspacoIcone from "@/components/ui/EspacoIcone";
import IconeAlternado from "@/components/ui/IconeAlternado";

// Botões de giro da pulseira 3D (abertura do Início e "A pulseira" na Solução).
// `children` entra entre "Girar para a direita" e "Girar sozinha".
// Regra: "Girar sozinha" só existe com os efeitos ligados (WCAG 2.2.2, decisão da 9.0).
export default function BotoesGiro({ giro, efeitosLigados, estiloBotao, className, children }) {
  return (
    <div role="group" aria-label="Girar a pulseira" className={className}>
      <button type="button" onClick={() => giro.girar(-45)} className={estiloBotao}>
        <EspacoIcone nome="ArrowCounterClockwise" />
        Girar para a esquerda
      </button>
      <button type="button" onClick={() => giro.girar(45)} className={estiloBotao}>
        <EspacoIcone nome="ArrowClockwise" />
        Girar para a direita
      </button>
      {children}
      {efeitosLigados && (
        <button
          type="button"
          aria-pressed={giro.girando}
          onClick={giro.alternarGiro}
          className={estiloBotao}
        >
          <IconeAlternado chave={giro.girando ? "pausar" : "girar"}>
            {giro.girando ? <EspacoIcone nome="Pause" /> : <EspacoIcone nome="Play" />}
          </IconeAlternado>
          Girar sozinha
        </button>
      )}
    </div>
  );
}
