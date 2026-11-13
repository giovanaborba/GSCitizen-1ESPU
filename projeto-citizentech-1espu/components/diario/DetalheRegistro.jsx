import Botao from "@/components/ui/Botao";
import { PERGUNTAS, rotuloDe, textoObservacoes } from "@/lib/rotulos";

/*
  DetalheRegistro — conteúdo da tela "Ver registro" (seção 7.4).
  Lista de definições (<dl>): a pergunta (<dt>) vem antes da resposta
  (<dd>), e o leitor de tela lê as duas como um par.

  Componente de apresentação: recebe o registro e a função do botão
  "Excluir registro" (quem abre o diálogo é a tela).
*/
const CAMPOS = ["meio", "chegouSemSePerder", "precisouDeAjuda", "travessias", "orientacoes"];

export default function DetalheRegistro({ registro, aoPedirExclusao }) {
  return (
    <>
      <dl className="mt-8 space-y-6">
        {CAMPOS.map((campo) => (
          <div key={campo}>
            <dt className="font-bold">{PERGUNTAS[campo]}</dt>
            <dd className="mt-1">{rotuloDe(campo, registro[campo])}</dd>
          </div>
        ))}
        <div>
          <dt className="font-bold">{PERGUNTAS.observacoes}</dt>
          <dd className="mt-1 whitespace-pre-line break-words">
            {textoObservacoes(registro.observacoes)}
          </dd>
        </div>
      </dl>

      <div className="mt-10 flex flex-wrap gap-4">
        {/* ICONE-PencilSimple-AQUI */}
        <Botao href={`/diario/${registro.id}/editar`} icone="PencilSimple">
          Editar registro
        </Botao>
        {/* ICONE-Trash-AQUI */}
        <Botao variante="perigo" icone="Trash" onClick={aoPedirExclusao}>
          Excluir registro
        </Botao>
      </div>
    </>
  );
}
