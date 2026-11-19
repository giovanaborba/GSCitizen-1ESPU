import { useConsultaMidia } from "@/hooks/useConsultaMidia";

// Regra: só o ProvedorMovimento usa este hook; os componentes usam useEfeitos() (19.2).
export function usePrefereMovimentoReduzido() {
  return useConsultaMidia("(prefers-reduced-motion: reduce)");
}
