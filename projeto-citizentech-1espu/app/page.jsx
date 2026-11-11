import Link from "next/link";

export const metadata = {
  title: "Início",
};

/*
  PÁGINA PROVISÓRIA (Fase 1)
  Só o H1, o resumo e o botão-link da Início (textos da seção 6.1), para
  testar cores, tipografia, links e foco. A Fase 3 completa a página com
  "Nesta página", as seções, os cartões e o espaço da imagem.
*/
export default function PaginaInicio() {
  return (
    <div className="margem-lateral mx-auto max-w-texto py-8">
      <h1 tabIndex={-1} className="text-marca">
        Inovação que chega a quem precisa
      </h1>
      <p className="mt-4 text-texto-2">
        A Pulse é uma pulseira que guia pessoas cegas e com baixa visão pela
        cidade. Conheça o problema que ela resolve.
      </p>

      <p className="mt-8">
        <Link
          href="/solucao"
          className="inline-flex min-h-14 items-center justify-center rounded-cartao border border-transparent bg-botao px-6 font-bold text-botao-texto no-underline transicao-fundo hover:bg-botao-hover"
        >
          Conheça a solução
        </Link>
      </p>
    </div>
  );
}
