/*
  Preloader — contagem antes da capa (seções 19.6 e 19.15).

  - Fundo #1A1A1D, a contagem de 0 a 100 em Anton laranja e "Pulse ·
    carregando" em mono, como no protótipo.
  - Só na primeira visita da sessão, só com os efeitos ligados e por
    cima da capa (que já está montada embaixo). Quem decide quando aparece
    e anima a contagem é o hook useCapaIntro.
  - Decorativo: aria-hidden e nada focável. O leitor de tela e o teclado
    vão direto para o site, e qualquer tecla, gesto ou foco já pula o
    preloader e a capa.

  Props: refPreloader e refContador (do hook) e aoTocar (clique: sair).
*/
export default function Preloader({ refPreloader, refContador, aoTocar }) {
  return (
    // O clique só pede a saída; a mesma ação existe pelo teclado (qualquer
    // tecla) e pelo foco, então nada depende só do mouse (seção 19.1).
    <div ref={refPreloader} aria-hidden="true" onClick={aoTocar} className="preloader">
      <span
        ref={refContador}
        className="font-titulo text-[clamp(5rem,26vw,14rem)] leading-none text-[#FC4C02] tabular-nums"
      >
        0
      </span>
      <span className="rotulo-mono absolute bottom-[calc(2rem+env(safe-area-inset-bottom))] text-[#C9C9CF]">
        Pulse · carregando
      </span>
    </div>
  );
}
