import { createContext, useContext } from "react";

/*
  useEfeitos — lê e muda a preferência de movimento única do site
  (seções 19.2 e 19.15).

  Devolve:
  - efeitosLigados: true quando tudo pode se mover. Começa false no
    servidor e durante a hidratação (o momento em que o React "assume" a
    página que veio pronta do servidor), para nada começar a se mexer
    antes de o valor real ser lido;
  - efeitosConhecidos: true depois que o valor real foi lido do <html>.
    Use quando "ainda não sei" e "desligado" precisam ser diferentes
    (ex.: a capa só é dispensada quando os efeitos estão desligados DE
    VERDADE);
  - alternarEfeitos(): liga ou desliga e guarda a escolha (botão
    "Efeitos" do cabeçalho).

  Quem fornece o valor é o ProvedorMovimento, que fica em volta do site.

  Exemplo:
    const { efeitosLigados } = useEfeitos();
    if (!efeitosLigados) return; // nada de animação
*/

// O ProvedorMovimento preenche este contexto.
export const ContextoEfeitos = createContext(null);

export function useEfeitos() {
  const contexto = useContext(ContextoEfeitos);
  if (!contexto) {
    throw new Error("useEfeitos precisa estar dentro do <ProvedorMovimento>.");
  }
  return contexto;
}
