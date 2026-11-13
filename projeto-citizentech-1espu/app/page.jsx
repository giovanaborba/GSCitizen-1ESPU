import AberturaPulseira from "@/components/abertura/AberturaPulseira";
import FraseAcende from "@/components/abertura/FraseAcende";
import TrajetoPulse from "@/components/abertura/TrajetoPulse";
import FaixaTexto from "@/components/ui/FaixaTexto";
import PaginaComIndice from "@/components/layout/PaginaComIndice";
import RotuloSecao from "@/components/layout/RotuloSecao";
import Secao from "@/components/layout/Secao";
import Cartao from "@/components/ui/Cartao";
import EspacoImagem from "@/components/ui/EspacoImagem";
import VideoPulse from "@/components/ui/VideoPulse";
import FotoFiltro from "@/components/ui/FotoFiltro";
import NumeroContado from "@/components/ui/NumeroContado";
import TextoConstroi from "@/components/ui/TextoConstroi";
import Botao from "@/components/ui/Botao";

// O modelo "%s — Pulse" do layout não vale para a página da mesma pasta
// (regra do Next), então a Início escreve o título completo.
export const metadata = {
  title: "Início — Pulse",
};

/*
  Início (/) — textos da seção 6.1, na ordem da seção 19.5:
  capa (primeira visita) → abertura com a pulseira → faixa de texto →
  "Nesta página" → Tema (banda) → frase que acende → O problema → Quem
  vive o problema (banda) → Um trajeto com a Pulse → "Conheça a solução".
  Responde às perguntas 02 (qual problema) e 01 (quem é o cidadão
  beneficiado) do briefing da GS.

  Rótulos mono: "CitizenTech", "O problema" (seção 19.5), "As pessoas"
  (decisão da equipe na Fase 8) e "No caminho" (protótipo).

  Fase 9:
  - Tema e Quem vive o problema são "bandas" (19.5) e têm encaixe da
    rolagem (19.6).
  - Faixa de texto ("Pulse · um guia no pulso") logo depois da abertura
    e antes do "Nesta página": "entre a abertura e o Tema" (19.5 e 19.6).
  - Títulos novos de Tema e O problema. Os ids e os itens do "Nesta
    página" continuam ("Tema CitizenTech", "O problema").
  - Tema em duas colunas no computador.
  - Texto que se constrói (gesto GUIA) em Tema, O problema e Quem vive.
  - O problema (19.6, "Seções fixas"): no computador, com os efeitos
    ligados, o rótulo, o título, o texto e a citação ficam fixos à
    esquerda, e os dados, a ilustração e "O que a Pulse quer reduzir"
    rolam à direita. A ordem no HTML continua a de leitura. Com zoom alto
    ou com os efeitos desligados, é uma lista comum.
  - Números que contam até o valor (o leitor de tela lê o valor real).
  - Fotos de "Quem vive o problema" com o filtro e o parallax (19.6) e os
    marcadores novos (19.14).
  - "Um trajeto com a Pulse" (19.7) entra no "Nesta página" (é uma seção
    com H2, como as outras).
  - Subfase 9.8: o vídeo de "O problema" (com som) entra no lado que rola,
    no lugar da ilustração de uma travessia (decisão da equipe: o
    marcador IMAGEM-ilustração de uma travessia-AQUI saiu). O texto da
    seção é a descrição dele (aria-describedby).
*/
const SECOES = [
  { id: "tema-citizentech", texto: "Tema CitizenTech" },
  { id: "o-problema", texto: "O problema" },
  { id: "quem-vive-o-problema", texto: "Quem vive o problema" },
  { id: "um-trajeto-com-a-pulse", texto: "Um trajeto com a Pulse" },
];

// Número grande dos cartões de dados (Anton, em --cor-destaque)
const ESTILO_NUMERO = "block font-titulo text-[3.25rem] leading-none font-normal text-destaque uppercase";

export default function PaginaInicio() {
  return (
    <>
      {/* Capa, abertura com a pulseira 3D, H1 e resumo (seção 18.6) */}
      <AberturaPulseira />

      {/* Faixa de texto entre a abertura e o Tema (seção 19.6, decorativa) */}
      <FaixaTexto />

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
          encaixe
        >
          <TextoConstroi className="space-y-6">
            <p>
              CitizenTech é tecnologia criada a partir das necessidades reais das
              pessoas, para ampliar direitos e reduzir desigualdades. É o tema da
              Global Solution 2026 da FIAP.
            </p>
            <p>Nosso ponto de partida é a acessibilidade nas ruas de São Paulo.</p>
          </TextoConstroi>
        </Secao>

        {/* "Atravessar a rua não deveria depender de adivinhar." (19.7) */}
        <FraseAcende />

        {/* O problema: seção fixa no computador (19.6) */}
        <section className="mt-20">
          {/* grid-cols-1 = minmax(0, 1fr): a coluna encolhe com a tela, em
              vez de crescer até o conteúdo mais largo (texto ampliado) */}
          <div className="grid grid-cols-1 gap-7 lg:grid-cols-2 lg:items-start lg:gap-12">
            <div className="grid grid-cols-1 content-start gap-4 efeitos-ligados:secao-fixa:sticky efeitos-ligados:secao-fixa:top-[calc(var(--altura-cabecalho)+var(--altura-indice,0px)+1.5rem)]">
              <RotuloSecao>O problema</RotuloSecao>
              <h2 id="o-problema" tabIndex={-1} className="scroll-mt-10">
                Atravessar sem saber quando
              </h2>
              <TextoConstroi className="max-w-texto">
                <p id="texto-o-problema">
                  Sem enxergar as cores do semáforo, a pessoa depende da audição para
                  atravessar. Muitos semáforos não têm sinal sonoro, e o risco de
                  atropelamento é diário.
                </p>
              </TextoConstroi>
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
            </div>

            {/* Lado que rola. No modo fixo, começa mais abaixo e termina com
                folga, como no protótipo. */}
            <div className="grid grid-cols-1 gap-7 efeitos-ligados:secao-fixa:pt-[24vh] efeitos-ligados:secao-fixa:pb-[12vh]">
              {/* Cartões de dados: número grande que conta até o valor
                  (aria-hidden) e o valor real para o leitor de tela */}
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <Cartao as="li">
                  <p>
                    <NumeroContado
                      valor={90}
                      antes="Cerca de "
                      depois="%"
                      textoReal="Cerca de 90%"
                      className={ESTILO_NUMERO}
                    />{" "}
                    <span className="mt-2 block">
                      dos paulistanos consideram as calçadas não acessíveis para
                      pessoas com deficiência.
                    </span>
                  </p>
                  <p className="rotulo-mono mt-3 text-texto-2">Fonte: G1, 2019</p>
                </Cartao>
                <Cartao as="li">
                  <p>
                    <NumeroContado
                      valor={7.9}
                      casas={1}
                      depois=" milhões"
                      textoReal="7,9 milhões"
                      className={ESTILO_NUMERO}
                    />{" "}
                    <span className="mt-2 block">
                      de pessoas no Brasil têm dificuldade para enxergar.
                    </span>
                  </p>
                  <p className="rotulo-mono mt-3 text-texto-2">Fonte: IBGE, Censo 2022</p>
                </Cartao>
              </ul>

              {/* VIDEO-animacao-o-problema-AQUI
                  Vídeo: public/videos/animacao-o-problema.mp4 (com som)
                  Quadro parado: public/videos/animacao-o-problema-quadro-parado.jpg
                  Legendas: public/videos/animacao-o-problema-legendas.vtt */}
              <VideoPulse
                nome="animacao-o-problema"
                comSom
                idTitulo="o-problema"
                idDescricao="texto-o-problema"
              />

              <Cartao>
                <h3>O que a Pulse quer reduzir</h3>
                <ul className="mt-2 list-disc space-y-2 pl-6 text-texto-2">
                  <li>A dependência de ajuda de outras pessoas.</li>
                  <li>A necessidade de identificar travessias só pelo som do trânsito.</li>
                  <li>O tempo perdido por falta de acessibilidade ou por erros de caminho.</li>
                </ul>
              </Cartao>
            </div>
          </div>
        </section>

        <Secao id="quem-vive-o-problema" titulo="Quem vive o problema" rotulo="As pessoas" banda encaixe larga>
          <TextoConstroi className="max-w-texto">
            <p>
              Pessoas cegas ou com qualquer nível de deficiência visual que
              dificulte os deslocamentos, especialmente quem usa as ruas e o
              transporte público.
            </p>
          </TextoConstroi>

          {/* No computador, o segundo cartão desce um pouco (protótipo) */}
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Cartao as="li" compacto className="grid grid-cols-1 content-start gap-3">
              <FotoFiltro velocidade={0.06} className="aspect-[4/3]">
                {/* IMAGEM-pessoa cega usando o celular-AQUI
                    alt sugerido (seção 19.14): "Pessoa cega usando o celular com leitor de tela." */}
                <EspacoImagem texto="Foto de uma pessoa cega usando o celular (a definir)" formato="livre" />
              </FotoFiltro>
              <h3>Pessoa cega</h3>
              <p className="text-texto-2">
                Usa leitor de tela no celular e se orienta pela audição e pela
                bengala. Sem sinal sonoro, não sabe quando pode atravessar.
              </p>
            </Cartao>
            <Cartao as="li" compacto className="grid grid-cols-1 content-start gap-3 md:mt-16">
              <FotoFiltro velocidade={-0.06} className="aspect-[4/3]">
                {/* IMAGEM-pessoa com baixa visão ampliando a tela-AQUI
                    alt sugerido (seção 19.14): "Pessoa com baixa visão ampliando a tela do celular." */}
                <EspacoImagem texto="Foto de uma pessoa com baixa visão ampliando a tela (a definir)" formato="livre" />
              </FotoFiltro>
              <h3>Pessoa com baixa visão</h3>
              <p className="text-texto-2">
                Usa ampliação e alto contraste. Pode ter dificuldade para ver o
                semáforo de longe, a placa do ônibus ou o meio-fio.
              </p>
            </Cartao>
          </ul>
        </Secao>

        {/* Um trajeto com a Pulse (19.7): mapa que se desenha e 5 paradas */}
        <TrajetoPulse />
      </PaginaComIndice>
    </>
  );
}
