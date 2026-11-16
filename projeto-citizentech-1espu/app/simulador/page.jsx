import TituloPagina from "@/components/layout/TituloPagina";

export const metadata = {
  title: "Simulador",
};

export default function PaginaSimulador() {
  return (
    <div className="overflow-x-clip pb-8">
      <div className="relative margem-lateral pt-10 pb-6">
        <div
          aria-hidden="true"
          className="textura-piso textura-lado absolute inset-y-0 right-0 hidden w-[45%] lg:block"
        />
        <div className="relative mx-auto max-w-pagina">
          <TituloPagina
            rotulo="Experimente"
            titulo="Simulador"
            resumo="Experimente os sinais da Pulse antes de usar a pulseira na rua."
          />
        </div>
      </div>

      <div className="margem-lateral">
      <div className="mx-auto max-w-pagina">
      <div className="max-w-texto">

      {/*
        ##################################################################
        ##                                                              ##
        ##                       SIMULADOR-AQUI                         ##
        ##                                                              ##
        ##################################################################

        O componente do simulador SUBSTITUI a <section> "Espaço reservado"
        logo abaixo (apague a section inteira e coloque o simulador aqui).

        Sugestão de organização, seguindo o resto do projeto:
        - componentes em components/simulador/ (ex.: Simulador.jsx);
        - lógica e estado num custom hook (ex.: hooks/useSimulador.js);
        - o componente precisa de "use client" (tem interação e som).

        REQUISITOS (seção 6.3 da especificação):
        1. Cada sinal precisa de equivalente em TEXTO e em SOM.
           Vibração do celular só funciona no Android com Chrome
           (Vibration API); no iPhone, só som e texto.
           Atenção: a seção 3, item 14, proíbe vibração do celular no site
           para não confundir com a pulseira. Combinar com a equipe antes
           de usar a Vibration API.
        2. Mesmos nomes de comandos da pulseira: continuar, parar, virar à
           esquerda, virar à direita, aguardar. E os dois modos: sonoro e
           tátil / exclusivamente tátil.
        3. Sem limite de tempo. O som só começa depois de uma ação da
           pessoa (ex.: tocar em um botão), nunca sozinho.
        4. Avaliar com as heurísticas de Nielsen quando estiver pronto.

        Regras do site que também valem aqui (seção 3):
        - <button> para ações; ícone sempre com texto visível;
        - alvos de toque de 48 × 48 px ou mais; foco sempre visível;
        - texto com contraste de 7:1, usando as cores de globals.css;
        - mensagens de sinal anunciadas ao leitor de tela (ex.: role="status");
        - funcionar a 320 px de largura e com os efeitos desligados.
        ##################################################################
      */}
      <section
        aria-labelledby="espaco-reservado"
        className="mt-8 rounded-cartao border-2 border-dashed border-borda p-6"
      >
        <h2 id="espaco-reservado">Espaço reservado</h2>
        <p className="mt-4">
          O simulador está em desenvolvimento por outro integrante da equipe.
        </p>
        <p className="mt-4">
          Requisito: os sinais terão equivalentes em som e texto, para
          funcionar sem a visão.
        </p>
      </section>
      </div>
      </div>
      </div>
    </div>
  );
}
