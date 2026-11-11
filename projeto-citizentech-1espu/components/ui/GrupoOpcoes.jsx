import ErroCampo from "@/components/ui/ErroCampo";

/*
  GrupoOpcoes — seção 10, item 7. Botões de opção (radio).
  - <fieldset> + <legend>: o leitor de tela lê a pergunta ao entrar no grupo.
  - Erro ligado ao <fieldset> por aria-describedby (seção 7.3): ao entrar
    no grupo, o leitor de tela lê a pergunta e a mensagem de erro.
    (aria-invalid não é usado nas opções: a especificação ARIA não o
    aceita no papel "radio", e o leitor de tela o ignoraria.)
  - Cada opção é um rótulo inteiro clicável, com 56 px de altura e 8 px
    entre as opções. A opção marcada ganha borda de 2 px e negrito (além
    do próprio círculo do radio: a cor nunca é a única pista).
  - As setas do teclado trocam a opção dentro do grupo (padrão do HTML).

  Props: nome, legenda, opcoes [{ valor, rotulo }], valor, aoMudar, erro
  O "valor" pode ser texto ou true/false.
*/
export default function GrupoOpcoes({ nome, legenda, opcoes, valor, aoMudar, erro }) {
  const idErro = `erro-${nome}`;

  return (
    <fieldset aria-describedby={erro ? idErro : undefined}>
      <legend className="font-bold">{legenda}</legend>
      {erro && (
        <ErroCampo id={idErro} className="mt-2">
          {erro}
        </ErroCampo>
      )}

      <div className="mt-2 grid gap-2">
        {/* Esta parte é lógica */}
        {opcoes.map((opcao) => {
          const id = `campo-${nome}-${String(opcao.valor)}`;
          const marcada = valor === opcao.valor;
          return (
            <label
              key={id}
              htmlFor={id}
              className={`flex min-h-14 cursor-pointer items-center gap-4 rounded-campo bg-superficie py-2 ${
                marcada
                  ? "border-2 border-marca px-[calc(1rem-1px)] font-bold"
                  : "border border-borda px-4"
              }`}
            >
              <input
                id={id}
                type="radio"
                name={nome}
                value={String(opcao.valor)}
                checked={marcada}
                onChange={() => aoMudar(opcao.valor)}
                className="size-6 shrink-0 accent-marca"
              />
              <span>{opcao.rotulo}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
