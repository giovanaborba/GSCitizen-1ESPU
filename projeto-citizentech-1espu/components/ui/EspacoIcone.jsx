import {
  ArrowClockwise,
  ArrowCounterClockwise,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowsClockwise,
  ArrowsOutCardinal,
  CaretLeft,
  CaretRight,
  Eye,
  House,
  Image as ImageIcone,
  Notebook,
  Pause,
  PencilSimple,
  Play,
  Plus,
  Pulse,
  SpeakerHigh,
  SpeakerSlash,
  Trash,
  Warning,
  WarningCircle,
  Watch,
  X,
} from "@phosphor-icons/react/ssr";

/*
  EspacoIcone — desenha o ícone Phosphor (peso Bold, 24 × 24 px) cujo
  nome vem no prop "nome" (seção 13.1).

  - Decisão da equipe (depois da Fase 9): o Claude Code coloca os ícones
    com o pacote @phosphor-icons/react. Os marcadores ICONE-(nome)-AQUI
    continuam em cada lugar que usa este componente, como referência.
  - Fica oculto para o leitor de tela (aria-hidden), porque o texto
    visível ao lado já diz o mesmo.
  - Usa a versão "ssr" do pacote, que funciona tanto em Server
    Components quanto em Client Components.
  - Só os ícones da lista abaixo entram no site. Ícone novo: importe-o
    acima e acrescente-o em ICONES.
  - Nome fora da lista: volta o espaço vazio de antes, que não ocupa
    lugar (decisão 4 da 9.0, seção 19.5). Assim o texto continua
    centralizado e o IconeAlternado esconde o invólucro dele.
*/
const ICONES = {
  ArrowClockwise,
  ArrowCounterClockwise,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowsClockwise,
  ArrowsOutCardinal,
  CaretLeft,
  CaretRight,
  Eye,
  House,
  Image: ImageIcone,
  Notebook,
  Pause,
  PencilSimple,
  Play,
  Plus,
  Pulse,
  SpeakerHigh,
  SpeakerSlash,
  Trash,
  Warning,
  WarningCircle,
  Watch,
  X,
};

export default function EspacoIcone({ nome }) {
  const Icone = ICONES[nome];

  if (!Icone) {
    return <span aria-hidden="true" data-icone={nome} className="hidden" />;
  }

  // shrink-0: em linhas com texto longo (erro, mensagens), o ícone não encolhe
  return <Icone size={24} weight="bold" aria-hidden="true" className="shrink-0" />;
}
