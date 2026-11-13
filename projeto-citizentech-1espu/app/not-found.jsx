import Pulseira3D from "@/components/pulseira/Pulseira3D";
import PalavraFundo from "@/components/ui/PalavraFundo";
import Botao from "@/components/ui/Botao";

// Aba: "Página não encontrada — Pulse" (o modelo do layout completa).
export const metadata = {
  title: "Página não encontrada",
};

/*
  Página 404 (app/not-found.jsx) — seção 18.11. O Next mostra esta página
  sempre que o endereço não existe. Resolve a pendência da página em
  inglês (WCAG 3.1.2): agora ela segue o lang="pt-BR" do site.

  Leitor de tela (seção 18.15): "Erro 404" → H1 "Você saiu da rota" →
  texto → dois botões. A pulseira, a legenda dela, a palavra "Parar" e a
  textura são decorativas (aria-hidden).

  - Texto e pulseira lado a lado a partir de 900 px; no celular, o texto
    primeiro e a pulseira embaixo (seção 18.12).
  - A pulseira faz o sinal de parar por menos de 5 s e para (WCAG
    2.2.2); com os efeitos desligados, fica parada desde o começo.
  - A palavra "Parar" e a textura ficam só atrás da pulseira: o tamanho
    da palavra acompanha a largura dessa coluna (unidade cqw), então
    nenhum texto da página fica sobre elas (seção 18.2, item 1).
*/
export default function PaginaNaoEncontrada() {
  return (
    <section aria-labelledby="titulo-404" className="margem-lateral py-12">
      <div className="mx-auto grid max-w-pagina items-center gap-10 min-[56.25rem]:grid-cols-[1.2fr_1fr]">
        <div className="grid justify-items-start gap-4">
          <p className="rotulo-mono text-destaque">Erro 404</p>
          <h1 id="titulo-404" tabIndex={-1}>
            Você saiu da rota
          </h1>
          <p className="max-w-[46ch] text-texto-2">Esta página não existe ou mudou de endereço.</p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Botao href="/">Voltar ao Início</Botao>
            <Botao href="/solucao" variante="secundario">
              Ir para a Solução
            </Botao>
          </div>
        </div>

        {/* Coluna da pulseira (decorativa). "@container": a palavra de
            fundo mede o tamanho por esta coluna (cqw). */}
        <div className="@container relative grid gap-3">
          {/* De trás para a frente (19.5): textura → palavra → pulseira */}
          <div aria-hidden="true" className="textura-piso textura-centro absolute -inset-4" />
          <PalavraFundo texto="Parar" tamanho="min(21rem, 38cqw)" />
          <Pulseira3D modo="parar" className="mx-auto aspect-square w-full max-w-[22rem]" />
          <p aria-hidden="true" className="relative text-center text-auxiliar text-texto-2">
            A pulseira faz o sinal de parar.
          </p>
        </div>
      </div>
    </section>
  );
}
