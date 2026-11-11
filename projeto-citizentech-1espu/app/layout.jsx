import "./globals.css";
import LinkPular from "@/components/layout/LinkPular";
import Cabecalho from "@/components/layout/Cabecalho";
import Rodape from "@/components/layout/Rodape";
import BarraNavegacao from "@/components/layout/BarraNavegacao";
import FocoNaTroca from "@/components/layout/FocoNaTroca";
import Provedores from "@/components/layout/Provedores";
import ProvedorMovimento from "@/components/layout/ProvedorMovimento";

/*
  =====================================================================
  FONTES (seção 18.4) — colocadas manualmente pela equipe
  =====================================================================
  O site usa 3 famílias. Cada uma tem uma variável CSS no globals.css,
  com fontes de reserva, então o site já funciona antes de elas entrarem:

  | Família                    | Variável que o globals.css espera | Reserva enquanto não entra |
  | Anton                      | --fonte-anton                     | Impact, Arial Narrow       |
  | Atkinson Hyperlegible Next | --fonte-atkinson                  | Verdana                    |
  | JetBrains Mono             | --fonte-jetbrains                 | ui-monospace, Courier New  |

  ---------------------------------------------------------------------
  FONTE-Anton-AQUI
  Títulos H1 e H2, nomes dos sinais, palavras de fundo, números grandes.
  Peso: 400 (a Anton só tem esse peso).
  ---------------------------------------------------------------------
  FONTE-Atkinson Hyperlegible Next-AQUI
  Texto corrido, botões, links, H3, H4 e formulário. Pesos: 400 e 700.
  ---------------------------------------------------------------------
  FONTE-JetBrains Mono-AQUI
  Rótulos curtos em mono ("MODO TÁTIL", "FONTE: G1, 2019").
  Pesos: 500 e 700.
  ---------------------------------------------------------------------

  Passo a passo (igual para as 3):
  1. Carregue a fonte neste arquivo, por exemplo com next/font/google, e
     dê a ela a variável da tabela na opção "variable". Exemplo:

       import { Anton } from "next/font/google";
       const anton = Anton({
         weight: "400",
         subsets: ["latin"],
         display: "swap",
         variable: "--fonte-anton",
       });

     (Para a Atkinson, pesos ["400", "700"] e variável --fonte-atkinson;
     para a JetBrains Mono, pesos ["500", "700"] e --fonte-jetbrains.
     Confira o nome exato de cada família na versão instalada.)
  2. Coloque as classes que o next/font devolve no className da tag
     <html> abaixo, por exemplo:
       <html lang="pt-BR" className={`${anton.variable} ${atkinson.variable} ${jetbrains.variable}`}>
  3. Pronto: o globals.css já usa essas variáveis antes das fontes de
     reserva. Nada mais precisa mudar.
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
        {/* Rolagem suave (Lenis), GSAP e Motion — seção 18.1 */}
        <ProvedorMovimento>
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
        </ProvedorMovimento>
      </body>
    </html>
  );
}
