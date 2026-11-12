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

// Esta parte é lógica
// Camada de espera da capa (decisão 6 da equipe, seção 18.6). Roda antes
// de a página aparecer. Só na Início e só na primeira visita da sessão
// (sem a chave "pulse-capa-vista"; se o sessionStorage falhar, a capa
// aparece, então a camada também). Marca o <html>, e o CSS cobre a tela
// com uma cor sólida até a capa montar. Se a capa não montar em 2 s (ex.:
// erro no JavaScript), a marca sai sozinha e a página aparece. Sem
// JavaScript, este script não roda e nada muda.
const SCRIPT_CAPA_PENDENTE = `(function () {
  try {
    if (location.pathname !== "/") return;
    var vista = null;
    try { vista = sessionStorage.getItem("pulse-capa-vista"); } catch (e) {}
    if (vista) return;
    var raiz = document.documentElement;
    raiz.setAttribute("data-capa-pendente", "");
    setTimeout(function () { raiz.removeAttribute("data-capa-pendente"); }, 2000);
  } catch (e) {}
})();`;

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning: o script acima pode marcar o <html> antes
    // de o React assumir a página; sem isso, o React avisaria que o
    // atributo não veio do servidor. Vale só para a própria tag <html>.
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_CAPA_PENDENTE }} />
      </head>
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
