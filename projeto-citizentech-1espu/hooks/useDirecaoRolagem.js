import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { usePrefereMovimentoReduzido } from "@/hooks/usePrefereMovimentoReduzido";

/*
  useDirecaoRolagem — custom hook da seção 9.3.
  Devolve true quando o cabeçalho e a barra devem sair da tela.

  Regras:
  - Só em Início e Solução, e só abaixo de 768 px.
  - Rolou para baixo mais que ~64 px (altura do cabeçalho) → esconde.
  - Rolou para cima mais que ~64 px → mostra.
  - Mostra também: no topo, perto do fim da página e quando qualquer
    elemento do cabeçalho ou da barra recebe foco.
  - Com "reduzir movimento": sempre visível.

  Quem usa o hook esconde SÓ visualmente (transform), nunca com
  display: none, para o leitor de tela continuar alcançando as barras.
  Os elementos que contam como "barras" têm o atributo data-barra-rolagem.
*/
const ROTAS_COM_BARRAS_QUE_SOMEM = ["/", "/solucao"];
const CONSULTA_CELULAR = "(max-width: 47.99rem)"; // abaixo de 768 px

// Esta parte é lógica
export function useDirecaoRolagem() {
  const caminho = usePathname();
  const movimentoReduzido = usePrefereMovimentoReduzido();
  const ativo = ROTAS_COM_BARRAS_QUE_SOMEM.includes(caminho);

  // Guarda EM QUAL rota as barras foram escondidas. Ao trocar de página,
  // a rota nova é diferente, então as barras voltam sozinhas.
  const [rotaEscondida, setRotaEscondida] = useState(null);

  // Esta parte é lógica
  useEffect(() => {
    if (!ativo || movimentoReduzido) return;

    const consultaCelular = window.matchMedia(CONSULTA_CELULAR);
    // Distância mínima = altura do cabeçalho (4rem), em pixels
    const tamanhoTexto = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const distanciaMinima = 4 * tamanhoTexto;

    let ultimaPosicao = window.scrollY;
    let pontoDeVirada = window.scrollY; // onde a direção mudou pela última vez
    let direcao = null; // "baixo" ou "cima"

    const esconder = () => setRotaEscondida(caminho);
    const mostrar = () => setRotaEscondida(null);

    // Esta parte é lógica
    function aoRolar() {
      const posicao = window.scrollY;

      if (!consultaCelular.matches) {
        mostrar();
        ultimaPosicao = posicao;
        return;
      }

      const noTopo = posicao <= distanciaMinima;
      const pertoDoFim =
        window.innerHeight + posicao >=
        document.documentElement.scrollHeight - distanciaMinima;

      if (noTopo || pertoDoFim) {
        mostrar();
        pontoDeVirada = posicao;
        ultimaPosicao = posicao;
        return;
      }

      if (posicao > ultimaPosicao) {
        if (direcao !== "baixo") {
          direcao = "baixo";
          pontoDeVirada = ultimaPosicao;
        }
        if (posicao - pontoDeVirada > distanciaMinima) esconder();
      } else if (posicao < ultimaPosicao) {
        if (direcao !== "cima") {
          direcao = "cima";
          pontoDeVirada = ultimaPosicao;
        }
        if (pontoDeVirada - posicao > distanciaMinima) mostrar();
      }

      ultimaPosicao = posicao;
    }

    // Esta parte é lógica
    function aoReceberFoco(evento) {
      if (evento.target instanceof Element && evento.target.closest("[data-barra-rolagem]")) {
        mostrar();
      }
    }

    window.addEventListener("scroll", aoRolar, { passive: true });
    document.addEventListener("focusin", aoReceberFoco);

    return () => {
      window.removeEventListener("scroll", aoRolar);
      document.removeEventListener("focusin", aoReceberFoco);
    };
  }, [ativo, movimentoReduzido, caminho]);

  return ativo && !movimentoReduzido && rotaEscondida === caminho;
}
