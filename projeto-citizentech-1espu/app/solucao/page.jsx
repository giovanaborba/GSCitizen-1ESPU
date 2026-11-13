import LinkInterno from "@/components/ui/LinkInterno";
import PaginaComIndice from "@/components/layout/PaginaComIndice";
import Secao from "@/components/layout/Secao";
import ExplorarPulseira from "@/components/pulseira/ExplorarPulseira";
import Cartao from "@/components/ui/Cartao";
import EspacoImagem from "@/components/ui/EspacoImagem";
import Botao from "@/components/ui/Botao";
import AntesDepois from "@/components/solucao/AntesDepois";
import CartaoIntegrante from "@/components/solucao/CartaoIntegrante";
import CartaoTecnologia from "@/components/solucao/CartaoTecnologia";
import ComoFuncionaFundo from "@/components/solucao/ComoFuncionaFundo";
import SinaisRolagemFixa from "@/components/solucao/SinaisRolagemFixa";
import GaleriaCanvas from "@/components/solucao/GaleriaCanvas";

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

  Fase 9: "A pulseira" ganha a pulseira 3D no modo "explorar" (19.12),
  depois dos 3 passos.
  Fase 9 (seção 19.5): "A pulseira" e "Equipe" são "bandas" (fundo
  --cor-faixa com o divisor de piso tátil), como na amostra da Solução do
  protótipo pulse-efeitos.html.
  Fase 9 (subfase 9.7):
  - "Como funciona" com a seção fixa e o fundo que troca (19.6 e 19.13);
  - nova seção "Antes e depois" (banda, 19.7), logo depois de "Como
    funciona", também no "Nesta página" (é uma seção com H2, como as
    outras);
  - Tecnologias em cartões que viram (19.8), no lugar do carrossel;
  - Galeria em canvas no computador (19.9);
  - Equipe num varal (19.10);
  - botão laranja principal magnético (19.6), pelo próprio Botao.
*/
const SECOES = [
  { id: "a-pulseira", texto: "A pulseira" },
  { id: "os-sinais", texto: "Os sinais" },
  { id: "como-funciona", texto: "Como funciona" },
  { id: "antes-e-depois", texto: "Antes e depois" },
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

/*
  Tecnologias: rótulos mono da seção 18.8, nomes e descrições da 6.2.
  Verso de cada cartão: a foto da peça (seção 19.14). Quando a foto
  entrar, troque o EspacoImagem do CartaoTecnologia por <Image> (ou <img>)
  com o alt "Foto da peça: (nome)." Marcadores, um por peça:
*/
const TECNOLOGIAS = [
  // IMAGEM-peça (GPS)-AQUI — alt: "Foto da peça: GPS."
  { rotulo: "Localização", nome: "GPS", descricao: "Localização e navegação." },
  // IMAGEM-peça (Reconhecimento de voz)-AQUI — alt: "Foto da peça: Reconhecimento de voz."
  { rotulo: "Destino", nome: "Reconhecimento de voz", descricao: "Identifica o destino." },
  // IMAGEM-peça (ESP32 ou equivalente)-AQUI — alt: "Foto da peça: ESP32 ou equivalente."
  { rotulo: "Cérebro", nome: "ESP32 ou equivalente", descricao: "Microcontrolador que comanda a pulseira." },
  // IMAGEM-peça (Motores de vibração)-AQUI — alt: "Foto da peça: Motores de vibração."
  { rotulo: "Tato", nome: "Motores de vibração", descricao: "Sinais táteis e direcionais." },
  // IMAGEM-peça (Atuadores de pressão)-AQUI — alt: "Foto da peça: Atuadores de pressão."
  { rotulo: "Tato", nome: "Atuadores de pressão", descricao: "Comando de continuar." },
  // IMAGEM-peça (Alto-falante)-AQUI — alt: "Foto da peça: Alto-falante."
  { rotulo: "Som", nome: "Alto-falante", descricao: "Sinais sonoros." },
  // IMAGEM-peça (APIs de mapas, semáforos e transporte)-AQUI — alt: "Foto da peça: APIs de mapas, semáforos e transporte."
  { rotulo: "Dados", nome: "APIs de mapas, semáforos e transporte", descricao: "Informações em tempo real." },
  // IMAGEM-peça (Módulo de conectividade)-AQUI — alt: "Foto da peça: Módulo de conectividade."
  { rotulo: "Conexão", nome: "Módulo de conectividade", descricao: "Acesso aos serviços e dados." },
];

/*
  Equipe num varal (seções 18.8 e 19.10): polaroides menores (até
  10,5rem), 2 por linha no celular, 3 + 2 a partir de 640 px e 5 lado a
  lado a partir de 1100 px. A lista é centralizada e tem folga nas
  bordas, para nenhum polaroide inclinado (nem o fio) sair da tela.
*/
const LARGURA_POLAROIDE =
  "w-[calc((100%-1rem)/2)] max-w-[10.5rem] sm:w-[calc((100%-2.5rem)/3)] min-[68.75rem]:w-[calc((100%-5rem)/5)]";

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

        {/* Pulseira 3D no modo "explorar" (seção 19.12, decisão da equipe):
            palco, "Girar a pulseira", "Partes da pulseira" e "Os sinais no
            pulso". Ordem da 19.16: vídeo (subfase 9.8) → passos → pulseira. */}
        <ExplorarPulseira />

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
      {/* "Como funciona": seção fixa com o fundo que troca (19.6 e 19.13) */}
      <ComoFuncionaFundo />

      {/* ---------------------------------------------------------- */}
      <Secao id="antes-e-depois" titulo="Antes e depois" rotulo="A diferença" larga banda>
        <AntesDepois />
      </Secao>

      {/* ---------------------------------------------------------- */}
      <Secao id="tecnologias" titulo="Tecnologias" rotulo="Por dentro" larga>
        <p className="max-w-texto">
          O que faz a Pulse funcionar. Vire um cartão para ver a peça.
        </p>
        {/* Grade de 8 cartões que viram (19.8): 1 coluna no celular, 2 a
            partir de 40rem e 4 a partir de 64rem, sem rolagem lateral */}
        <ul className="grid grid-cols-1 gap-3 min-[40rem]:grid-cols-2 lg:grid-cols-4">
          {/* Esta parte é lógica */}
          {TECNOLOGIAS.map((tecnologia) => (
            <CartaoTecnologia
              key={tecnologia.nome}
              rotulo={tecnologia.rotulo}
              nome={tecnologia.nome}
              descricao={tecnologia.descricao}
            />
          ))}
        </ul>
      </Secao>

      {/* ---------------------------------------------------------- */}
      <GaleriaCanvas />

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
        {/* O varal: os trechos de fio de cada item se emendam (19.10) */}
        <ul className="flex flex-wrap justify-center gap-x-4 gap-y-10 px-3 py-4 sm:gap-x-5">
          {/* IMAGEM-foto de Giovana-AQUI — alt: "Foto de Giovana" */}
          <CartaoIntegrante nome="Giovana" inclinacao={-3} velocidade={0.06} className={LARGURA_POLAROIDE} />
          {/* IMAGEM-foto de Giovane-AQUI — alt: "Foto de Giovane" */}
          <CartaoIntegrante nome="Giovane" inclinacao={2} velocidade={-0.06} className={LARGURA_POLAROIDE} />
          {/* IMAGEM-foto de Mie-AQUI — alt: "Foto de Mie" */}
          <CartaoIntegrante nome="Mie" inclinacao={-1.5} velocidade={0.06} className={LARGURA_POLAROIDE} />
          {/* IMAGEM-foto de Pedro-AQUI — alt: "Foto de Pedro" */}
          <CartaoIntegrante nome="Pedro" inclinacao={3} velocidade={-0.06} className={LARGURA_POLAROIDE} />
          {/* IMAGEM-foto de Thiago-AQUI — alt: "Foto de Thiago" */}
          <CartaoIntegrante nome="Thiago" inclinacao={-2} velocidade={0.06} className={LARGURA_POLAROIDE} />
        </ul>
      </Secao>
    </PaginaComIndice>
  );
}
