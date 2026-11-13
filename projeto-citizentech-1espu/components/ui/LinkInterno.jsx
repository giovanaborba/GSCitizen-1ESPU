"use client";

import Link from "next/link";
import { useGuardaDeSaida } from "@/hooks/useGuardaDeSaida";

/*
  LinkInterno — link para outra página do site (Fase 8).
  É o <Link> do Next com um passo a mais: antes de navegar, passa pela
  guarda de saída ("Descartar as respostas?") e, se a saída estiver
  livre, pela transição de piso tátil (seção 18.9).

  - Recebe as mesmas props do <Link> (href, className, children...).
  - Se quem usa passar o próprio onNavigate (ex.: "Cancelar" do
    formulário), ele é usado no lugar, e precisa chamar aoNavegar.
  - Links para âncoras da mesma página ("#tema") continuam sendo <a>
    comuns: não trocam de página e não precisam deste componente.
*/
export default function LinkInterno({ href, onNavigate, ...resto }) {
  const { aoNavegar } = useGuardaDeSaida();

  function aoNavegarPeloLink(evento) {
    if (onNavigate) {
      onNavigate(evento);
      return;
    }
    aoNavegar(evento, href);
  }

  return <Link href={href} onNavigate={aoNavegarPeloLink} {...resto} />;
}
