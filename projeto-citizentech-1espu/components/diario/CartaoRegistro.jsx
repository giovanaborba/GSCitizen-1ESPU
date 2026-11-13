"use client";

import { useEffect } from "react";
import { useAnimate } from "motion/react";
import LinkInterno from "@/components/ui/LinkInterno";
import { formatarData } from "@/lib/datas";
import { etiquetasDoRegistro, rotuloDe } from "@/lib/rotulos";
import { useEfeitos } from "@/hooks/useEfeitos";
import { pulso } from "@/lib/presetsMovimento";

/*
  CartaoRegistro — um registro na lista do Diário (seção 7.1).
  - <h3> "DD/MM/AAAA · Meio de transporte"
  - etiquetas: só texto, sem depender de cor
  - link "Ver registro" com um trecho oculto ("de DD/MM/AAAA"): para o
    leitor de tela, cada link tem um nome único ("Ver registro de
    05/11/2026"), e não uma lista de "Ver registro" iguais.

  Fase 9 (seção 19.11): "destaque" = o registro que acabou de ser salvo
  ou restaurado ("Desfazer"). Quando ele aparece, o cartão faz o gesto
  PULSO (batida dupla curta, 0,42 s, uma vez só), como a vibração no
  pulso. O anúncio ("Registro salvo." ou "Registro restaurado.") é da
  mensagem de status e não espera o gesto. Com os efeitos desligados, não
  há batida.

  O <li> fica na ListaRegistros; aqui é o cartão dentro dele.
*/
export default function CartaoRegistro({ registro, destaque = false }) {
  const data = formatarData(registro.data);
  const etiquetas = etiquetasDoRegistro(registro);
  const { efeitosLigados } = useEfeitos();
  const [refCartao, animar] = useAnimate();

  // PULSO quando o cartão em destaque aparece
  useEffect(() => {
    if (!destaque || !efeitosLigados) return;
    const animacao = animar(refCartao.current, { scale: pulso.scale }, pulso.transition);
    return () => animacao.stop();
  }, [destaque, efeitosLigados, animar, refCartao]);

  return (
    <div
      ref={refCartao}
      className="h-full rounded-cartao border border-borda bg-superficie p-6 shadow-cartao"
    >
      <h3>
        {data} · {rotuloDe("meio", registro.meio)}
      </h3>

      <ul className="mt-4 flex flex-wrap gap-2">
        {etiquetas.map((etiqueta) => (
          <li
            key={etiqueta}
            className="rounded-campo border border-borda bg-fundo px-2 text-auxiliar"
          >
            {etiqueta}
          </li>
        ))}
      </ul>

      <p className="mt-4">
        <LinkInterno href={`/diario/${registro.id}`} className="inline-flex min-h-12 items-center">
          Ver registro<span className="sr-only"> de {data}</span>
        </LinkInterno>
      </p>
    </div>
  );
}
