"use client";

import { ContextoTransicao, useTransicaoPagina } from "@/hooks/useTransicaoPagina";

/*
  TransicaoPagina — provedor da transição entre páginas (seções 18.9 e
  18.14). Fica no layout (dentro de Provedores), em volta do site.

  - Entrega navegar e irPara para a guarda de saída (useGuardaDeSaida),
    que é quem decide primeiro se a pessoa pode sair da página.
  - Desenha a cortina de piso tátil num <canvas> (varredura diagonal de
    domos, seção 19.6): aria-hidden (o leitor de tela não lê; ele anuncia
    o novo <h1>) e pointer-events: none (nunca bloqueia um clique). Ela só
    aparece durante a troca (data-ativa).

  Toda a lógica da animação está no hook useTransicaoPagina.
*/
export default function TransicaoPagina({ children }) {
  // Esta parte é lógica
  const { refCortina, navegar, irPara } = useTransicaoPagina();

  return (
    <ContextoTransicao.Provider value={{ navegar, irPara }}>
      {children}
      <canvas ref={refCortina} aria-hidden="true" className="cortina-piso" />
    </ContextoTransicao.Provider>
  );
}
