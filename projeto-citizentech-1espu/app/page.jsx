import Botao from "@/components/ui/Botao";

// O modelo "%s — Pulse" do layout não vale para a página da mesma pasta
// (regra do Next), então a Início escreve o título completo.
export const metadata = {
  title: "Início — Pulse",
};

/*
  PÁGINA PROVISÓRIA (Fases 1 e 2)
  Só o H1, o resumo e o botão-link da Início (textos da seção 6.1), para
  testar cores, tipografia, foco e o layout comum. A Fase 3 completa a
  página com "Nesta página", as seções, os cartões e o espaço da imagem.
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
        <Botao href="/solucao">Conheça a solução</Botao>
      </p>
    </div>
  );
}
