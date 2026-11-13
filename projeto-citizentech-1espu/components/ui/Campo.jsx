import ErroCampo from "@/components/ui/ErroCampo";
import Tremor from "@/components/ui/Tremor";

/*
  Campo — seção 10, item 8. Campo de data ou área de texto.
  - <label for> ligado ao campo: tocar no rótulo foca o campo.
  - Dica e erro ligados ao campo por aria-describedby: o leitor de tela lê
    os dois junto com o rótulo.
  - Com erro: aria-invalid="true" (o leitor de tela diz "inválido"),
    borda de 2 px na cor de erro e mensagem com ícone junto do campo.

  Fase 9 (19.11): "tremer" (número de envios com erro) faz o campo tremer
  quando ele tem erro (gesto de ERRO do padrão de movimento).

  Props: nome, rotulo, tipo ("date" ou "textarea"), valor, aoMudar, erro,
         dica, max, tremer
*/
export default function Campo({ nome, rotulo, tipo = "date", valor, aoMudar, erro, dica, max, tremer = 0 }) {
  const idCampo = `campo-${nome}`;
  const idDica = `dica-${nome}`;
  const idErro = `erro-${nome}`;

  const descricao = [dica && idDica, erro && idErro].filter(Boolean).join(" ") || undefined;

  const classesControle = `mt-2 block w-full rounded-campo bg-superficie px-4 py-3 text-texto ${
    erro ? "border-2 border-erro" : "border border-borda"
  }`;

  function aoDigitar(evento) {
    aoMudar(evento.target.value);
  }

  return (
    <div>
      <label htmlFor={idCampo} className="block font-bold">
        {rotulo}
      </label>
      {dica && (
        <p id={idDica} className="mt-1 text-auxiliar text-texto-2">
          {dica}
        </p>
      )}
      {erro && (
        <ErroCampo id={idErro} className="mt-2">
          {erro}
        </ErroCampo>
      )}

      <Tremor gatilho={tremer} ativo={Boolean(erro)}>
        {tipo === "textarea" ? (
          <textarea
            id={idCampo}
            name={nome}
            rows={5}
            value={valor}
            onChange={aoDigitar}
            aria-invalid={erro ? true : undefined}
            aria-describedby={descricao}
            className={`${classesControle} resize-y`}
          />
        ) : (
          <input
            id={idCampo}
            name={nome}
            type={tipo}
            max={max}
            value={valor}
            onChange={aoDigitar}
            aria-invalid={erro ? true : undefined}
            aria-describedby={descricao}
            className={`${classesControle} min-h-14`}
          />
        )}
      </Tremor>
    </div>
  );
}
