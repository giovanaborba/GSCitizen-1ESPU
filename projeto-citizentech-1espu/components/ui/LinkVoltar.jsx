"use client";

import Link from "next/link";
import EspacoIcone from "@/components/ui/EspacoIcone";
import { useGuardaDeSaida } from "@/hooks/useGuardaDeSaida";

/*
  LinkVoltar — "Voltar ao Diário" / "Voltar ao registro", no topo das
  telas do Diário (seções 7.3 e 7.4). Passa pela guarda de saída: se o
  formulário tiver respostas não salvas, abre "Descartar as respostas?".
*/
export default function LinkVoltar({ href, children }) {
  const { aoNavegar } = useGuardaDeSaida();

  // Esta parte é lógica
  function aoNavegarParaDestino(evento) {
    aoNavegar(evento, href);
  }

  return (
    <Link
      href={href}
      onNavigate={aoNavegarParaDestino}
      className="inline-flex min-h-12 items-center gap-2"
    >
      {/* ICONE-ArrowLeft-AQUI */}
      <EspacoIcone nome="ArrowLeft" />
      <span>{children}</span>
    </Link>
  );
}
