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
  Início (/) — textos da seção 6.1.
  Responde às perguntas 02 (qual problema) e 01 (quem é o cidadão
  beneficiado) do briefing da GS.
*/
const SECOES = [
  { id: "tema-citizentech", texto: "Tema CitizenTech" },
  { id: "o-problema", texto: "O problema" },
  { id: "quem-vive-o-problema", texto: "Quem vive o problema" },
];

export default function PaginaInicio() {
  return (
    <>
      {/* Abertura com a pulseira 3D, H1 e resumo (seção 18.6) */}
      <AberturaPulseira />
    <PaginaComIndice
      itensIndice={SECOES}
      acaoFinal={<Botao href="/solucao">Conheça a solução</Botao>}
    >
      <Secao id="tema-citizentech" titulo="Tema CitizenTech">
        <p>
          CitizenTech é tecnologia criada a partir das necessidades reais das
          pessoas, para ampliar direitos e reduzir desigualdades. É o tema da
          Global Solution 2026 da FIAP.
        </p>
        <p>Nosso ponto de partida é a acessibilidade nas ruas de São Paulo.</p>
      </Secao>

      <Secao id="o-problema" titulo="O problema">
        <p>
          Sem enxergar as cores do semáforo, a pessoa depende da audição para
          atravessar. Muitos semáforos não têm sinal sonoro, e o risco de
          atropelamento é diário.
        </p>

        <figure className="border-l-4 border-marca pl-4">
          <blockquote>
            <p className="text-h4">
              “Não sabemos quando o sinal abriu ou fechou para nós.”
            </p>
          </blockquote>
          <figcaption className="mt-2 text-auxiliar text-texto-2">
            — <cite>Depoimento em reportagem da Unicentro, 2024</cite>
          </figcaption>
        </figure>

        <ul className="grid gap-4 md:grid-cols-2">
          <Cartao as="li">
            <p>
              <strong className="block text-numero">Cerca de 90%</strong>{" "}
              dos paulistanos consideram as calçadas não acessíveis para
              pessoas com deficiência.
            </p>
            <p className="mt-2 text-auxiliar text-texto-2">Fonte: G1, 2019</p>
          </Cartao>
          <Cartao as="li">
            <p>
              <strong className="block text-numero">7,9 milhões</strong>{" "}
              de pessoas no Brasil têm dificuldade para enxergar.
            </p>
            <p className="mt-2 text-auxiliar text-texto-2">Fonte: IBGE, Censo 2022</p>
          </Cartao>
        </ul>

        {/* IMAGEM-ilustração de uma travessia-AQUI
            alt sugerido (seção 13.2): "Pessoa cega com bengala esperando para atravessar a rua na faixa de pedestres." */}
        <EspacoImagem texto="Ilustração de uma travessia (a definir)" />

        <div>
          <h3>O que a Pulse quer reduzir</h3>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>A dependência de ajuda de outras pessoas.</li>
            <li>A necessidade de identificar travessias só pelo som do trânsito.</li>
            <li>O tempo perdido por falta de acessibilidade ou por erros de caminho.</li>
          </ul>
        </div>
      </Secao>

      <Secao id="quem-vive-o-problema" titulo="Quem vive o problema">
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
