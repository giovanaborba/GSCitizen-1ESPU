import Link from "next/link";
import PaginaComIndice from "@/components/layout/PaginaComIndice";
import Secao from "@/components/layout/Secao";
import Cartao from "@/components/ui/Cartao";
import EspacoImagem from "@/components/ui/EspacoImagem";
import Botao from "@/components/ui/Botao";
import CartaoIntegrante from "@/components/solucao/CartaoIntegrante";

export const metadata = {
  title: "Solução",
};

/*
  Solução (/solucao) — textos da seção 6.2.
  Responde às perguntas 03 (como funcionará), 04 (tecnologias),
  05 (ecossistema) e 06 (como ampliar o impacto) do briefing da GS.
*/
const SECOES = [
  { id: "a-pulseira", texto: "A pulseira" },
  { id: "como-funciona", texto: "Como funciona" },
  { id: "tecnologias", texto: "Tecnologias" },
  { id: "quem-participa", texto: "Quem participa" },
  { id: "como-ampliar-o-impacto", texto: "Como ampliar o impacto" },
  { id: "ods", texto: "Objetivos de Desenvolvimento Sustentável" },
  { id: "o-diferencial", texto: "O diferencial" },
  { id: "equipe", texto: "Equipe" },
];

const TECNOLOGIAS = [
  { rotulo: "GPS", descricao: "localização e navegação." },
  { rotulo: "Reconhecimento de voz", descricao: "identifica o destino." },
  { rotulo: "ESP32 ou equivalente", descricao: "microcontrolador que comanda a pulseira." },
  { rotulo: "Motores de vibração", descricao: "sinais táteis e direcionais." },
  { rotulo: "Atuadores de pressão", descricao: "comando de continuar." },
  { rotulo: "Alto-falante", descricao: "sinais sonoros." },
  { rotulo: "APIs de mapas, semáforos e transporte", descricao: "informações em tempo real." },
  { rotulo: "Módulo de conectividade", descricao: "acesso aos serviços e dados." },
];

/*
  Equipe (seção 6.2): no computador ocupa as duas colunas da página, para
  caber os 5 cartões lado a lado (seção 12).
  Celular: 1 por linha · Tablet: 3 por linha (3 + 2, segunda linha
  centralizada) · Computador: 5 lado a lado.
*/
const LARGURA_INTEGRANTE = "md:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-4rem)/5)]";

function SecaoEquipe() {
  return (
    <section className="mt-16">
      <h2 id="equipe" tabIndex={-1}>
        Equipe
      </h2>
      <p className="mt-4 max-w-texto">
        Integrantes do grupo que criou a Pulse na Global Solution 2026 da FIAP.
      </p>

      <ul className="mt-6 flex flex-col gap-4 md:flex-row md:flex-wrap md:justify-center">
        {/* IMAGEM-foto de Giovana-AQUI — alt: "Foto de Giovana" */}
        <CartaoIntegrante nome="Giovana" className={LARGURA_INTEGRANTE} />
        {/* IMAGEM-foto de Giovane-AQUI — alt: "Foto de Giovane" */}
        <CartaoIntegrante nome="Giovane" className={LARGURA_INTEGRANTE} />
        {/* IMAGEM-foto de Mie-AQUI — alt: "Foto de Mie" */}
        <CartaoIntegrante nome="Mie" className={LARGURA_INTEGRANTE} />
        {/* IMAGEM-foto de Pedro-AQUI — alt: "Foto de Pedro" */}
        <CartaoIntegrante nome="Pedro" className={LARGURA_INTEGRANTE} />
        {/* IMAGEM-foto de Thiago-AQUI — alt: "Foto de Thiago" */}
        <CartaoIntegrante nome="Thiago" className={LARGURA_INTEGRANTE} />
      </ul>
    </section>
  );
}

export default function PaginaSolucao() {
  return (
    <PaginaComIndice
      titulo="A Pulse: um guia no pulso"
      resumo="Uma pulseira que orienta o caminho por vibrações e sinais, com mais autonomia e segurança nos deslocamentos."
      itensIndice={SECOES}
      secaoLarga={<SecaoEquipe />}
      acaoFinal={<Botao href="/simulador">Experimente o simulador</Botao>}
    >
      {/* ---------------------------------------------------------- */}
      <Secao id="a-pulseira" titulo="A pulseira">
        <p>
          Você diz para onde quer ir e recebe as orientações do trajeto
          direto no pulso. A Pulse funciona sozinha, sem precisar estar
          conectada a um celular.
        </p>

        {/* IMAGEM-ilustração conceitual da pulseira-AQUI
            alt sugerido (seção 13.2): "Ilustração da pulseira Pulse no pulso de uma pessoa." */}
        <EspacoImagem texto="Ilustração conceitual da pulseira (a definir)" />

        <ol className="grid gap-4 md:grid-cols-2">
          <Cartao as="li">
            <h3>1. Fale o destino</h3>
            <p className="mt-2">
              Aperte o botão e diga para onde quer ir. O reconhecimento de
              voz identifica o destino.
            </p>
          </Cartao>
          <Cartao as="li">
            <h3>2. Sinta o caminho</h3>
            <p className="mt-2">
              Vibrações e sinais indicam virar, parar, continuar e aguardar
              durante todo o trajeto.
            </p>
          </Cartao>
          <Cartao as="li">
            <h3>3. Celular no bolso</h3>
            <p className="mt-2">
              Sem consultar a tela e sem depender só de instruções por áudio.
            </p>
          </Cartao>
        </ol>

        <div>
          <h3>Apenas dois botões</h3>
          <ul className="mt-2 list-disc space-y-2 pl-6">
            <li>
              <strong>Trocar o modo:</strong> alterna entre o modo sonoro e
              tátil e o modo exclusivamente tátil.
            </li>
            <li>
              <strong>Informar o destino:</strong> ativa o reconhecimento de
              voz.
            </li>
          </ul>
        </div>
      </Secao>

      {/* ---------------------------------------------------------- */}
      <Secao id="como-funciona" titulo="Como funciona">
        <div>
          <h3>Vibrações direcionais</h3>
          <p className="mt-2">
            Precisa virar? A pulseira vibra no lado correspondente: à
            esquerda para virar à esquerda, à direita para virar à direita.
          </p>
        </div>

        <div>
          <h3>Semáforos em tempo real</h3>
          <p className="mt-2">
            A Pulse usa dados dos semáforos de pedestres para indicar parar,
            aguardar ou atravessar, sem adivinhar pelo som do trânsito.
          </p>
        </div>

        <div>
          <h3>Dois modos</h3>
          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            <Cartao as="li">
              <h4>Sonoro e tátil</h4>
              <p className="mt-2">
                Sons curtos indicam parar, continuar ou aguardar. As
                vibrações continuam guiando as conversões.
              </p>
            </Cartao>
            <Cartao as="li">
              <h4>Exclusivamente tátil</h4>
              <p className="mt-2">
                Para quem prefere não usar som ou está em lugares muito
                barulhentos.
              </p>
            </Cartao>
          </ul>
        </div>

        <div>
          <h3>Os sinais</h3>
          <p className="mt-2">Cada comando tem um sinal próprio.</p>
          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            <Cartao as="li">
              <h4>Continuar</h4>
              <dl className="mt-2 space-y-1">
                <div>
                  <dt className="inline font-bold">Modo tátil:</dt>{" "}
                  <dd className="inline">pressão contínua no pulso até você andar.</dd>
                </div>
                <div>
                  <dt className="inline font-bold">Modo sonoro:</dt>{" "}
                  <dd className="inline">som grave e curto.</dd>
                </div>
              </dl>
            </Cartao>
            <Cartao as="li">
              <h4>Parar</h4>
              <dl className="mt-2 space-y-1">
                <div>
                  <dt className="inline font-bold">Modo tátil:</dt>{" "}
                  <dd className="inline">vibração contínua até você parar.</dd>
                </div>
                <div>
                  <dt className="inline font-bold">Modo sonoro:</dt>{" "}
                  <dd className="inline">som agudo e contínuo.</dd>
                </div>
              </dl>
            </Cartao>
            <Cartao as="li">
              <h4>Virar à esquerda ou à direita</h4>
              <dl className="mt-2">
                <div>
                  <dt className="inline font-bold">Nos dois modos:</dt>{" "}
                  <dd className="inline">vibração no lado correspondente.</dd>
                </div>
              </dl>
            </Cartao>
            <Cartao as="li">
              <h4>Aguardar</h4>
              <dl className="mt-2">
                <div>
                  <dt className="inline font-bold">Nos dois modos:</dt>{" "}
                  <dd className="inline">três vibrações curtas, repetidas em intervalos.</dd>
                </div>
              </dl>
            </Cartao>
          </ul>
        </div>

        <div>
          <h3>Transporte público</h3>
          <ol className="mt-2 list-decimal space-y-2 pl-6">
            <li>
              <strong>No local:</strong> identifica que você chegou ao ponto
              de ônibus ou à plataforma e avisa para aguardar.
            </li>
            <li>
              <strong>O veículo:</strong> orienta sobre a chegada do
              transporte e o momento de embarcar.
            </li>
            <li>
              <strong>O embarque:</strong> evita que você passe do local ou
              embarque no veículo errado.
            </li>
          </ol>
          <p className="mt-4">
            Opcional: a pulseira informa quanto falta para o transporte
            chegar, em voz no modo sonoro ou em Braille, com pinos
            retráteis, no modo tátil.
          </p>
          <p className="mt-4 text-auxiliar text-texto-2">
            <strong>Nota:</strong> Depende de essas informações estarem
            disponíveis nos sistemas de transporte público.
          </p>
        </div>
      </Secao>

      {/* ---------------------------------------------------------- */}
      <Secao id="tecnologias" titulo="Tecnologias">
        <ul className="grid gap-4 md:grid-cols-2">
          {/* Esta parte é lógica */}
          {TECNOLOGIAS.map((tecnologia) => (
            <Cartao as="li" key={tecnologia.rotulo}>
              <strong>{tecnologia.rotulo}:</strong> {tecnologia.descricao}
            </Cartao>
          ))}
        </ul>
      </Secao>

      {/* ---------------------------------------------------------- */}
      <Secao id="quem-participa" titulo="Quem participa">
        <ul className="list-disc space-y-2 pl-6">
          <li>Pessoas cegas e com deficiência visual, principais usuárias e participantes dos testes.</li>
          <li>Equipe de desenvolvimento de hardware e software.</li>
          <li>Fabricantes e fornecedores de componentes eletrônicos.</li>
          <li>Prefeituras e órgãos de mobilidade urbana.</li>
          <li>Empresas de transporte público.</li>
          <li>Empresas de APIs de transporte e infraestrutura urbana.</li>
          <li>Instituições de apoio à pessoa com deficiência.</li>
        </ul>
      </Secao>

      {/* ---------------------------------------------------------- */}
      <Secao id="como-ampliar-o-impacto" titulo="Como ampliar o impacto">
        <p>
          Levar a Pulse a outras regiões e cidades, com novas integrações a
          semáforos e ao transporte público, evoluindo as funções conforme o
          retorno de quem usa.
        </p>
        <p>
          <Link href="/diario" className="inline-flex min-h-12 items-center">
            Veja como medimos o impacto no Diário
          </Link>
        </p>
      </Secao>

      {/* ---------------------------------------------------------- */}
      <Secao id="ods" titulo="Objetivos de Desenvolvimento Sustentável">
        <ul className="grid gap-4 md:grid-cols-2">
          <Cartao as="li" destaque>
            {/* "Principal" fica dentro do <h3>: quem navega pelos títulos
                com o leitor de tela também ouve que este é o principal. */}
            <h3>
              <span className="mb-2 block w-fit rounded-cartao border-2 border-marca px-2 text-auxiliar text-marca">
                Principal
              </span>{" "}
              ODS 10: Redução das Desigualdades
            </h3>
            <p className="mt-2">
              Reduz as barreiras enfrentadas por pessoas com deficiência
              visual e promove igualdade de acesso à mobilidade.
            </p>
          </Cartao>
          <Cartao as="li">
            <h3>ODS 9: Indústria, Inovação e Infraestrutura</h3>
            <p className="mt-2">
              Um dispositivo inteligente que melhora a infraestrutura de
              acessibilidade e mobilidade urbana.
            </p>
          </Cartao>
          <Cartao as="li">
            <h3>ODS 11: Cidades e Comunidades Sustentáveis</h3>
            <p className="mt-2">
              Torna as cidades mais acessíveis, inclusivas e seguras nas ruas
              e no transporte público.
            </p>
          </Cartao>
        </ul>
      </Secao>

      {/* ---------------------------------------------------------- */}
      <Secao id="o-diferencial" titulo="O diferencial">
        <p className="text-h3 font-normal">
          Informação importante pelo tato: menos dependência do celular, de
          ajuda externa e de meios inseguros nas travessias.
        </p>
        <p>
          Orientação de trajetos, travessias e transporte público reunidos
          em um único dispositivo.
        </p>
      </Secao>
    </PaginaComIndice>
  );
}
