import "./globals.css";
import LinkPular from "@/components/layout/LinkPular";
import Cabecalho from "@/components/layout/Cabecalho";
import Rodape from "@/components/layout/Rodape";
import BarraNavegacao from "@/components/layout/BarraNavegacao";
import FocoNaTroca from "@/components/layout/FocoNaTroca";
import Provedores from "@/components/layout/Provedores";

/*
  =====================================================================
  FONTE-Atkinson Hyperlegible Next-AQUI
  =====================================================================
  A equipe liga a fonte aqui, manualmente (seção 8.2: pesos 400 e 700).

  Como ligar sem mexer no resto do site:
  1. Carregue a fonte neste arquivo (por exemplo, com next/font) e dê a
     ela a variável CSS "--fonte-atkinson" (opção "variable").
  2. Coloque a classe que o next/font devolve (fonte.variable) no
     className da tag <html> abaixo.
  3. Pronto: o globals.css já usa var(--fonte-atkinson) antes da
     Verdana. Enquanto a fonte não entrar, o site usa Verdana.

  Confira o nome exato da família na versão instalada.
  =====================================================================
*/

// Título de cada página: "Nome da página — Pulse" (seção 4.1).
// Cada page.jsx define só a primeira parte, por exemplo: title: "Início".
export const metadata = {
  title: {
    template: "%s — Pulse",
    default: "Pulse",
  },
};

// viewportFit "cover" ativa as áreas de segurança (env(safe-area-inset-*))
// em celulares com entalhe. Não bloqueamos o zoom (WCAG 1.4.4).
export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <Provedores>
          {/* Ordem da seção 5: é a ordem visual e a de leitura do leitor de tela */}
          <LinkPular />
          <Cabecalho />
          {/* tabIndex={-1}: deixa o "Pular para o conteúdo" mover o foco para cá */}
          <main id="conteudo" tabIndex={-1}>
            {children}
          </main>
          <Rodape />
          <BarraNavegacao />
          <FocoNaTroca />
        </Provedores>
      </body>
    </html>
  );
}
