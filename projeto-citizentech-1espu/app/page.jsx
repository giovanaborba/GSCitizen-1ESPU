import AberturaPulseira from "@/components/abertura/AberturaPulseira";
import PaginaComIndice from "@/components/layout/PaginaComIndice";
import Secao from "@/components/layout/Secao";
import Cartao from "@/components/ui/Cartao";
import EspacoImagem from "@/components/ui/EspacoImagem";
import Botao from "@/components/ui/Botao";

// O modelo "%s — Pulse" do layout não vale para a página da mesma pasta
// (regra do Next), então a Início escreve o título completo.
export const metadata = {
  title: "Início — Pulse",
};

/*
  Início (/) — textos da seção 6.1, na ordem da seção 18.6:
  capa (primeira visita) → abertura com a pulseira → "Nesta página" →
  Tema CitizenTech → O problema → Quem vive o problema → "Conheça a
  solução".
  Responde às perguntas 02 (qual problema) e 01 (quem é o cidadão
  beneficiado) do briefing da GS.

  Rótulos mono: "CitizenTech", "O problema" (seção 19.5) e "As pessoas"
  (decisão da equipe na Fase 8).

  Fase 9 (seção 19.5):
  - Tema e Quem vive o problema são "bandas" (fundo --cor-faixa com o
    divisor de piso tátil). A ordem completa da 19.5 (faixa de texto,
    frase que acende e "Um trajeto com a Pulse") entra nas subfases 9.4
    e 9.6.
  - Títulos novos de Tema e O problema. Os ids e os itens do "Nesta
    página" continuam ("Tema CitizenTech", "O problema").
  - Tema em duas colunas no computador.
*/
const SECOES = [
  { id: "tema-citizentech", texto: "Tema CitizenTech" },
  { id: "o-problema", texto: "O problema" },
  { id: "quem-vive-o-problema", texto: "Quem vive o problema" },
];

export default function PaginaInicio() {
  return (
    <>
      {/* Capa, abertura com a pulseira 3D, H1 e resumo (seção 18.6) */}
      <AberturaPulseira />

      <PaginaComIndice
        itensIndice={SECOES}
        acaoFinal={<Botao href="/solucao">Conheça a solução</Botao>}
      >
        <Secao
          id="tema-citizentech"
          titulo="Tecnologia que nasce de uma necessidade real"
          rotulo="CitizenTech"
          banda
          duasColunas
        >
          <p>
            CitizenTech é tecnologia criada a partir das necessidades reais das
            pessoas, para ampliar direitos e reduzir desigualdades. É o tema da
            Global Solution 2026 da FIAP.
          </p>
          <p>Nosso ponto de partida é a acessibilidade nas ruas de São Paulo.</p>
        </Secao>

        <Secao id="o-problema" titulo="Atravessar sem saber quando" rotulo="O problema" larga>
          <p className="max-w-texto">
            Sem enxergar as cores do semáforo, a pessoa depende da audição para
            atravessar. Muitos semáforos não têm sinal sonoro, e o risco de
            atropelamento é diário.
          </p>

          {/* Computador: a ilustração à esquerda e a citação e os dados à
              direita. Celular: um embaixo do outro. */}
          <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-start">
            {/* IMAGEM-ilustração de uma travessia-AQUI
                alt sugerido (seção 13.2): "Pessoa cega com bengala esperando para atravessar a rua na faixa de pedestres." */}
            <EspacoImagem texto="Ilustração de uma travessia (a definir)" />

            <div className="grid gap-4">
              {/* Citação com borda laranja à esquerda (seções 18.6 e 19.3) */}
              <figure className="rounded-r-cartao border-l-4 border-acao bg-superficie p-5">
                <blockquote>
                  <p className="text-h3 font-bold">
                    “Não sabemos quando o sinal abriu ou fechou para nós.”
                  </p>
                </blockquote>
                <figcaption className="mt-2 text-auxiliar text-texto-2">
                  — <cite>Depoimento em reportagem da Unicentro, 2024</cite>
                </figcaption>
              </figure>

              {/* Cartões de dados: número grande em Anton e fonte em mono */}
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <Cartao as="li">
                  <p>
                    <strong className="block font-titulo text-[3.25rem] leading-none font-normal text-destaque uppercase">
                      Cerca de 90%
                    </strong>{" "}
                    <span className="mt-2 block">
                      dos paulistanos consideram as calçadas não acessíveis para
                      pessoas com deficiência.
                    </span>
                  </p>
                  <p className="rotulo-mono mt-3 text-texto-2">Fonte: G1, 2019</p>
                </Cartao>
                <Cartao as="li">
                  <p>
                    <strong className="block font-titulo text-[3.25rem] leading-none font-normal text-destaque uppercase">
                      7,9 milhões
                    </strong>{" "}
                    <span className="mt-2 block">
                      de pessoas no Brasil têm dificuldade para enxergar.
                    </span>
                  </p>
                  <p className="rotulo-mono mt-3 text-texto-2">Fonte: IBGE, Censo 2022</p>
                </Cartao>
              </ul>
            </div>
          </div>

          <div className="max-w-texto">
            <h3>O que a Pulse quer reduzir</h3>
            <ul className="mt-2 list-disc space-y-2 pl-6">
              <li>A dependência de ajuda de outras pessoas.</li>
              <li>A necessidade de identificar travessias só pelo som do trânsito.</li>
              <li>O tempo perdido por falta de acessibilidade ou por erros de caminho.</li>
            </ul>
          </div>
        </Secao>

        <Secao id="quem-vive-o-problema" titulo="Quem vive o problema" rotulo="As pessoas" banda>
          <p>
            Pessoas cegas ou com qualquer nível de deficiência visual que
            dificulte os deslocamentos, especialmente quem usa as ruas e o
            transporte público.
          </p>

          <ul className="grid gap-4 md:grid-cols-2">
            <Cartao as="li">
              <h3>Pessoa cega</h3>
              <p className="mt-2">
                Usa leitor de tela no celular e se orienta pela audição e pela
                bengala. Sem sinal sonoro, não sabe quando pode atravessar.
              </p>
            </Cartao>
            <Cartao as="li">
              <h3>Pessoa com baixa visão</h3>
              <p className="mt-2">
                Usa ampliação e alto contraste. Pode ter dificuldade para ver o
                semáforo de longe, a placa do ônibus ou o meio-fio.
              </p>
            </Cartao>
          </ul>
        </Secao>
      </PaginaComIndice>
    </>
  );
}
