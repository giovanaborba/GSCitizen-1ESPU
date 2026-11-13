import { Anton, Atkinson_Hyperlegible_Next, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import LinkPular from "@/components/layout/LinkPular";
import Cabecalho from "@/components/layout/Cabecalho";
import Rodape from "@/components/layout/Rodape";
import BarraNavegacao from "@/components/layout/BarraNavegacao";
import FocoNaTroca from "@/components/layout/FocoNaTroca";
import Provedores from "@/components/layout/Provedores";
import ProvedorMovimento from "@/components/layout/ProvedorMovimento";
import Granulado from "@/components/ui/Granulado";

/*
  FONTES (seções 18.4 e 19.4), carregadas com next/font/google.

  O next/font já vem com o Next (não é um pacote novo). No momento do
  build, ele baixa os arquivos das fontes e os serve pelo próprio site
  (self-hosting): quando a página abre, o navegador não chama o Google.
  Ele também pré-carrega as fontes e ajusta a fonte de reserva para o
  texto não "pular" quando a fonte de verdade chega.

  Cada família vira uma variável CSS na tag <html> (opção "variable"). O
  globals.css usa essas variáveis em --fonte-titulo, --fonte-base e
  --fonte-mono, com as reservas da 18.4 logo depois.

  | Família                    | Variável          | Uso                                              |
  | Anton (400)                | --fonte-anton     | H1, H2, nomes dos sinais, palavras de fundo, números |
  | Atkinson Hyperlegible Next | --fonte-atkinson  | texto corrido, botões, links, H3, H4 e formulário |
  | JetBrains Mono (500, 700)  | --fonte-jetbrains | rótulos curtos ("MODO TÁTIL", "FONTE: G1, 2019") |

  "latin-ext" entra junto com "latin" para cobrir todos os acentos.
  display "swap": o texto aparece na hora com a reserva e troca quando a
  fonte chega (o texto nunca fica invisível).
*/
// Esta parte é lógica
const anton = Anton({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--fonte-anton",
});
// Aviso conhecido no build: "Failed to find font override values for font
// Atkinson Hyperlegible Next". O Next 16.4 ainda não tem as medidas desta
// família para criar a reserva ajustada; ele só pula essa etapa. A reserva
// continua a Verdana da 18.4 (globals.css), e o texto pode mudar um pouco
// de largura quando a fonte chega. Não é erro. A Anton e a JetBrains Mono
// ganham a reserva ajustada normalmente.
const atkinson = Atkinson_Hyperlegible_Next({
  weight: ["400", "700"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--fonte-atkinson",
});
const mono = JetBrains_Mono({
  weight: ["500", "700"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--fonte-jetbrains",
});

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
// Script do <head>: roda antes de a página aparecer.
// 1. Interruptor "Efeitos" (seção 19.2): grava data-efeitos="ligados" ou
//    "desligados" na tag <html>, para o CSS e o React já nascerem certos,
//    sem "piscar". Vale a escolha salva (localStorage "pulse-efeitos");
//    sem escolha, desligado quando o aparelho pede "reduzir movimento".
//    É um dos dois únicos lugares que consultam o aparelho (o outro é o
//    ProvedorMovimento).
// 2. Camada de espera da capa (decisão 6 da equipe, seção 18.6). Só com os
//    efeitos ligados (desligados, não há capa: 19.1), só na Início e só
//    na primeira visita da sessão (sem a chave "pulse-capa-vista"; se o
//    sessionStorage falhar, a capa aparece, então a camada também). Marca
//    o <html>, e o CSS cobre a tela com uma cor sólida até a capa montar.
//    Se a capa não montar em 2 s (ex.: erro no JavaScript), a marca sai
//    sozinha e a página aparece.
// Sem JavaScript, este script não roda: sem o atributo, o CSS deixa tudo
// parado (nada se move sem JavaScript) e não há capa.
const SCRIPT_INICIAL = `(function () {
  var raiz = document.documentElement;
  var ligados = true;
  try { ligados = !window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
  try {
    var escolha = localStorage.getItem("pulse-efeitos");
    if (escolha === "ligados") ligados = true;
    else if (escolha === "desligados") ligados = false;
  } catch (e) {}
  raiz.setAttribute("data-efeitos", ligados ? "ligados" : "desligados");
  try {
    if (!ligados || location.pathname !== "/") return;
    var vista = null;
    try { vista = sessionStorage.getItem("pulse-capa-vista"); } catch (e) {}
    if (vista) return;
    raiz.setAttribute("data-capa-pendente", "");
    setTimeout(function () { raiz.removeAttribute("data-capa-pendente"); }, 2000);
  } catch (e) {}
})();`;

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning: o script acima marca o <html> antes de o
    // React assumir a página; sem isso, o React avisaria que os atributos
    // não vieram do servidor. Vale só para a própria tag <html>.
    <html
      lang="pt-BR"
      className={`${anton.variable} ${atkinson.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_INICIAL }} />
      </head>
      <body>
        {/* Interruptor "Efeitos", rolagem suave (Lenis), GSAP e Motion —
            seções 18.1 e 19.2 */}
        <ProvedorMovimento>
          <Provedores>
            {/* Ordem da seção 5: é a ordem visual e a de leitura do leitor de tela */}
            <LinkPular />
            <Cabecalho />
            {/* tabIndex={-1}: deixa o "Pular para o conteúdo" mover o foco para cá */}
            <main id="conteudo" tabIndex={-1}>
              {/* Granulado atrás do conteúdo (seção 19.6, decorativo) */}
              <Granulado />
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
