import { useSyncExternalStore } from "react";

/*
  usePrefereMovimentoReduzido — devolve true quando a pessoa ativou
  "reduzir movimento" no aparelho (prefers-reduced-motion: reduce).

  Usa useSyncExternalStore, o hook do React feito para ler algo que vive
  FORA do React (aqui, a configuração do sistema) e atualizar a tela
  quando esse valor muda, sem a tela "piscar" com um valor errado.

  Fase 9 (seção 19.2): o "reduzir movimento" do aparelho virou só o valor
  inicial do interruptor "Efeitos". Este hook é usado APENAS pelo
  ProvedorMovimento. Os componentes usam useEfeitos().
*/
const CONSULTA = "(prefers-reduced-motion: reduce)";

function assinar(aoMudar) {
  const consulta = window.matchMedia(CONSULTA);
  consulta.addEventListener("change", aoMudar);
  return () => consulta.removeEventListener("change", aoMudar);
}

function lerNoNavegador() {
  return window.matchMedia(CONSULTA).matches;
}

// No servidor não existe "aparelho": assume que não reduz movimento.
function lerNoServidor() {
  return false;
}

export function usePrefereMovimentoReduzido() {
  return useSyncExternalStore(assinar, lerNoNavegador, lerNoServidor);
}
