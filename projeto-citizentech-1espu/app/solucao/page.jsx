import LinkInterno from "@/components/ui/LinkInterno";
import PaginaComIndice from "@/components/layout/PaginaComIndice";
import Secao from "@/components/layout/Secao";
import Cartao from "@/components/ui/Cartao";
import EspacoImagem from "@/components/ui/EspacoImagem";
import Botao from "@/components/ui/Botao";
import Carrossel from "@/components/ui/Carrossel";
import CartaoIntegrante from "@/components/solucao/CartaoIntegrante";
import SinaisRolagemFixa from "@/components/solucao/SinaisRolagemFixa";
import GaleriaHorizontal from "@/components/solucao/GaleriaHorizontal";

export const metadata = {
  title: "Solução",
};

/*
  Solução (/solucao) — textos da seção 6.2, na ordem da seção 18.8.
  Responde às perguntas 03 (como funcionará), 04 (tecnologias),
  05 (ecossistema) e 06 (como ampliar o impacto) do briefing da GS.

  Fase 8:
  - "Os sinais" é um H2 próprio, em rolagem fixa, logo depois de "A
    pulseira" (e saiu de dentro de "Como funciona");
  - Tecnologias em carrossel; nova seção "Galeria";
  - a seção de ODS saiu desta página: os ODS estão no rodapé dela, numa
    faixa contínua (componente FaixaODS, no Rodape);
  - âncoras para os links da abertura do Início: como-funciona,
    os-sinais, tecnologias (H2) e dois-modos, semaforos,
    transporte-publico (H3), todas com tabIndex={-1} para receber o foco;
  - rótulos mono da 18.5, dos protótipos e os decididos pela equipe.

  Fase 9 (seção 19.5): "A pulseira" e "Equipe" são "bandas" (fundo
  --cor-faixa com o divisor de piso tátil), como na amostra da Solução do
  protótipo pulse-efeitos.html. "Antes e depois" também será banda quando
  entrar (subfase 9.7).
*/
const SECOES = [
  { id: "a-pulseira", texto: "A pulseira" },
  { id: "os-sinais", texto: "Os sinais" },
  { id: "como-funciona", texto: "Como funciona" },
  { id: "tecnologias", texto: "Tecnologias" },
  { id: "galeria", texto: "Galeria" },
  { id: "quem-participa", texto: "Quem participa" },
  { id: "como-ampliar-o-impacto", texto: "Como ampliar o impacto" },
  { id: "o-diferencial", texto: "O diferencial" },
  { id: "equipe", texto: "Equipe" },
];

const PASSOS = [
  {
    numero: "1",
    titulo: "Fale o destino",
    texto: "Aperte o botão e diga para onde quer ir. O reconhecimento de voz identifica o destino.",
  },
  {
    numero: "2",
    titulo: "Sinta o caminho",
    texto: "Vibrações e sinais indicam virar, parar, continuar e aguardar durante todo o trajeto.",
  },
  {
    numero: "3",
    titulo: "Celular no bolso",
    texto: "Sem consultar a tela e sem depender só de instruções por áudio.",
  },
];

// Rótulos mono dos cartões: os da seção 18.8
const TECNOLOGIAS = [
  { rotulo: "Localização", nome: "GPS", descricao: "Localização e navegação." },
  { rotulo: "Destino", nome: "Reconhecimento de voz", descricao: "Identifica o destino." },
  { rotulo: "Cérebro", nome: "ESP32 ou equivalente", descricao: "Microcontrolador que comanda a pulseira." },
  { rotulo: "Tato", nome: "Motores de vibração", descricao: "Sinais táteis e direcionais." },
  { rotulo: "Tato", nome: "Atuadores de pressão", descricao: "Comando de continuar." },
  { rotulo: "Som", nome: "Alto-falante", descricao: "Sinais sonoros." },
  { rotulo: "Dados", nome: "APIs de mapas, semáforos e transporte", descricao: "Informações em tempo real." },
  { rotulo: "Conexão", nome: "Módulo de conectividade", descricao: "Acesso aos serviços e dados." },
];

/*
  Equipe em polaroides (seção 18.8): 2 por linha no celular, 3 + 2 a
  partir de 640 px e 5 lado a lado a partir de 1100 px. A lista é
  centralizada e tem folga nas bordas, para nenhum cartão inclinado sair
  da tela.
*/
const LARGURA_POLAROIDE =
  "w-[calc((100%-1rem)/2)] sm:w-[calc((100%-2.5rem)/3)] min-[68.75rem]:w-[calc((100%-5rem)/5)]";

export default function PaginaSolucao() {
  return (
    <PaginaComIndice
      rotulo="A solução"
      titulo="A Pulse: um guia no pulso"
      resumo="Uma pulseira que orienta o caminho por vibrações e sinais, com mais autonomia e segurança nos deslocamentos."
      itensIndice={SECOES}
      acaoFinal={<Botao href="/simulador">Experimente o simulador</Botao>}
    >
      {/* ---------------------------------------------------------- */}
      <Secao id="a-pulseira" titulo="A pulseira" rotulo="Como usar" larga banda>
        <p className="max-w-texto">
          Você diz para onde quer ir e recebe as orientações do trajeto
          direto no pulso. A Pulse funciona sozinha, sem precisar estar
          conectada a um celular.
        </p>

        <div className="max-w-texto">
          {/* IMAGEM-ilustração conceitual da pulseira-AQUI
              alt sugerido (seção 13.2): "Ilustração da pulseira Pulse no pulso de uma pessoa." */}
          <EspacoImagem texto="Ilustração conceitual da pulseira (a definir)" />
        </div>

        {/* Os 3 passos: o número grande é decorativo (aria-hidden); a
            lista numerada <ol> já diz a ordem ao leitor de tela. */}
        <ol className="grid gap-4 md:grid-cols-3">
          {/* Esta parte é lógica */}
          {PASSOS.map((passo) => (
            <Cartao as="li" key={passo.numero} className="grid content-start gap-2">
              <span aria-hidden="true" className="font-titulo text-5xl leading-none text-destaque">
                {passo.numero}
              </span>
              <h3>{passo.titulo}</h3>
              <p className="text-texto-2">{passo.texto}</p>
            </Cartao>
          ))}
        </ol>

        <div className="max-w-texto">
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
      <SinaisRolagemFixa />

      {/* ---------------------------------------------------------- */}
      <Secao id="como-funciona" titulo="Como funciona" rotulo="No trajeto">
        <div>
          <h3>Vibrações direcionais</h3>
          <p className="mt-2">
            Precisa virar? A pulseira vibra no lado correspondente: à
            esquerda para virar à esquerda, à direita para virar à direita.
          </p>
        </div>

        <div>
          <h3 id="semaforos" tabIndex={-1}>
            Semáforos em tempo real
          </h3>
          <p className="mt-2">
            A Pulse usa dados dos semáforos de pedestres para indicar parar,
            aguardar ou atravessar, sem adivinhar pelo som do trânsito.
          </p>
        </div>

        <div>
          <h3 id="dois-modos" tabIndex={-1}>
            Dois modos
          </h3>
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
          <h3 id="transporte-publico" tabIndex={-1}>
            Transporte público
          </h3>
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
      <Secao id="tecnologias" titulo="Tecnologias" rotulo="Por dentro" larga>
        <p className="max-w-texto">
          O que faz a Pulse funcionar. Use os botões ou deslize para ver todas.
        </p>
        <Carrossel rotulo="Tecnologias" idLista="lista-tecnologias">
          {/* Esta parte é lógica */}
          {TECNOLOGIAS.map((tecnologia) => (
            <li
              key={tecnologia.nome}
              className="grid min-h-44 content-start gap-2 rounded-cartao border border-borda bg-superficie p-5 shadow-cartao"
            >
              <span className="rotulo-mono text-destaque">{tecnologia.rotulo}</span>
              <h3 className="text-[1.35rem] leading-tight">{tecnologia.nome}</h3>
              <p className="text-texto-2">{tecnologia.descricao}</p>
            </li>
          ))}
        </Carrossel>
      </Secao>

      {/* ---------------------------------------------------------- */}
      <GaleriaHorizontal />

      {/* ---------------------------------------------------------- */}
      <Secao id="quem-participa" titulo="Quem participa" rotulo="Ecossistema">
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
      <Secao id="como-ampliar-o-impacto" titulo="Como ampliar o impacto" rotulo="Próximos passos">
        <p>
          Levar a Pulse a outras regiões e cidades, com novas integrações a
          semáforos e ao transporte público, evoluindo as funções conforme o
          retorno de quem usa.
        </p>
        <p>
          <LinkInterno href="/diario" className="inline-flex min-h-12 items-center">
            Veja como medimos o impacto no Diário
          </LinkInterno>
        </p>
      </Secao>

      {/* ---------------------------------------------------------- */}
      <Secao id="o-diferencial" titulo="O diferencial" rotulo="Por que a Pulse">
        <p className="text-h3 font-normal">
          Informação importante pelo tato: menos dependência do celular, de
          ajuda externa e de meios inseguros nas travessias.
        </p>
        <p>
          Orientação de trajetos, travessias e transporte público reunidos
          em um único dispositivo.
        </p>
      </Secao>

      {/* ---------------------------------------------------------- */}
      <Secao id="equipe" titulo="Equipe" rotulo="Quem fez" larga banda>
        <p className="max-w-texto">
          Integrantes do grupo que criou a Pulse na Global Solution 2026 da FIAP.
        </p>
        <ul className="flex flex-wrap justify-center gap-x-4 gap-y-6 px-2 py-4 sm:gap-x-5">
          {/* IMAGEM-foto de Giovana-AQUI — alt: "Foto de Giovana" */}
          <CartaoIntegrante nome="Giovana" inclinacao={-3} className={LARGURA_POLAROIDE} />
          {/* IMAGEM-foto de Giovane-AQUI — alt: "Foto de Giovane" */}
          <CartaoIntegrante nome="Giovane" inclinacao={2} className={LARGURA_POLAROIDE} />
          {/* IMAGEM-foto de Mie-AQUI — alt: "Foto de Mie" */}
          <CartaoIntegrante nome="Mie" inclinacao={-1.5} className={LARGURA_POLAROIDE} />
          {/* IMAGEM-foto de Pedro-AQUI — alt: "Foto de Pedro" */}
          <CartaoIntegrante nome="Pedro" inclinacao={3} className={LARGURA_POLAROIDE} />
          {/* IMAGEM-foto de Thiago-AQUI — alt: "Foto de Thiago" */}
          <CartaoIntegrante nome="Thiago" inclinacao={-2} className={LARGURA_POLAROIDE} />
        </ul>
      </Secao>
    </PaginaComIndice>
  );
}
