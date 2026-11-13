import EspacoIcone from "@/components/ui/EspacoIcone";

/*
  CapaIntro — capa da primeira visita da sessão (seções 18.6 e 18.14).
  Quem decide se ela aparece e quando sai é o hook useCapaIntro (usado
  pela AberturaPulseira, que mostra este componente).

  - A capa inteira tem aria-hidden="true" e nenhum elemento focável: o
    leitor de tela e o teclado vão direto para o site. O primeiro Tab
    (no "Pular para o conteúdo") já tira a capa da frente.
  - Cores fixas, porque a capa é escura nos dois temas: texto #F5F1E8
    sobre #120B24 (16,9:1); dourado #D4A24A sobre #120B24 (8,3:1); texto
    #120B24 sobre o dourado (8,3:1).
  - A frase fica sobre uma faixa sólida (seção 18.6).

  Props: refCapa e saindo (do hook) e aoTocar (clique ou toque: sair).
*/
export default function CapaIntro({ refCapa, saindo, aoTocar }) {
  return (
    // O clique só pede a saída; a mesma ação existe pelo teclado (qualquer
    // tecla) e pelo foco, então nada depende só do mouse (seção 18.2).
    <div
      ref={refCapa}
      aria-hidden="true"
      data-saindo={saindo ? "" : undefined}
      onClick={aoTocar}
      className="capa-intro"
    >
      {/*
        ==================================================================
        IMAGEM-capa versão computador (horizontal)-AQUI
        IMAGEM-capa versão celular (vertical)-AQUI
        alt sugerido (seção 18.13): "Capa da Pulse."
        ==================================================================
        A equipe coloca as duas imagens em public/ e troca o <div> vazio
        logo abaixo por este <picture> (seção 18.12: imagem vertical no
        celular, horizontal a partir de 768 px):

          <picture>
            <source media="(min-width: 48rem)" srcSet="/capa-horizontal.jpg" />
            <img
              src="/capa-vertical.jpg"
              alt="Capa da Pulse."
              className="absolute inset-0 size-full object-cover"
            />
          </picture>

        Os nomes dos arquivos são exemplos. Depois de colocar a imagem,
        confira se o rótulo, a palavra "PULSE" e a dica continuam com
        contraste de 7:1 (a frase já fica numa faixa sólida).
      */}
      <div className="absolute inset-0" />

      {/* O logo "pulsa" uma vez (até 1 s). É código, não imagem (18.13). */}
      <div className="capa-logo absolute inset-0 grid place-items-center efeitos-desligados:hidden">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          stroke="#C4B5FD"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-22"
        >
          <circle className="capa-logo-onda" cx="50" cy="50" r="34" strokeWidth="3" />
          <circle cx="50" cy="50" r="34" />
          <path d="M24 52h14l6-14 10 26 6-12h16" />
        </svg>
      </div>

      <div className="capa-conteudo absolute inset-0 grid content-center justify-items-center gap-4 overflow-hidden px-[max(1rem,env(safe-area-inset-left))] py-6 text-center">
        <span className="rotulo-mono text-[#D4A24A]">GS 2026.2 · CitizenTech</span>
        <span className="font-titulo text-[clamp(5.5rem,24vw,17rem)] leading-[0.85] tracking-[0.01em] uppercase">
          Pulse
        </span>
        <span className="max-w-[26ch] rounded-[0.625rem] bg-[#120B24] px-4 py-1.5 text-xl">
          Um guia no pulso para atravessar a cidade.
        </span>
        <span className="mt-4 inline-flex min-h-12 items-center gap-2.5 rounded-full bg-[#D4A24A] px-6 font-bold text-[#120B24]">
          {/* ICONE-ArrowDown-AQUI */}
          <EspacoIcone nome="ArrowDown" />
          Toque, role ou aperte uma tecla
        </span>
      </div>
    </div>
  );
}
