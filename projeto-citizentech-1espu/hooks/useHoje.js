import { useSyncExternalStore } from "react";
import { hojeISO } from "@/lib/datas";

/*
  useHoje — a data de hoje ("AAAA-MM-DD") no fuso do APARELHO.

  Por que um hook: as páginas são geradas no servidor, e o servidor pode
  estar em outro fuso ou em outro dia. No servidor o valor é "" (vazio);
  no navegador, a data real. Assim o max={hoje} do campo de data nunca
  fica com o dia errado.
*/
// Esta parte é lógica
function assinar() {
  // A data não "avisa" quando muda; nada para assinar.
  return () => {};
}

// Esta parte é lógica
export function useHoje() {
  return useSyncExternalStore(assinar, hojeISO, () => "");
}
