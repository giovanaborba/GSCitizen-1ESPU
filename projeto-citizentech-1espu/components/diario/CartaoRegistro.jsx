import LinkInterno from "@/components/ui/LinkInterno";
import Cartao from "@/components/ui/Cartao";
import { formatarData } from "@/lib/datas";
import { etiquetasDoRegistro, rotuloDe } from "@/lib/rotulos";

/*
  CartaoRegistro — um registro na lista do Diário (seção 7.1).
  - <h3> "DD/MM/AAAA · Meio de transporte"
  - etiquetas: só texto, sem depender de cor
  - link "Ver registro" com um trecho oculto ("de DD/MM/AAAA"): para o
    leitor de tela, cada link tem um nome único ("Ver registro de
    05/11/2026"), e não uma lista de "Ver registro" iguais.

  Componente de apresentação: só recebe o registro e mostra.
*/
export default function CartaoRegistro({ registro }) {
  const data = formatarData(registro.data);
  const etiquetas = etiquetasDoRegistro(registro);

  return (
    <Cartao as="li">
      <h3>
        {data} · {rotuloDe("meio", registro.meio)}
      </h3>

      <ul className="mt-4 flex flex-wrap gap-2">
        {/* Esta parte é lógica */}
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
    </Cartao>
  );
}
