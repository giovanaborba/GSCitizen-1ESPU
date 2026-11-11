"use client";

import Link from "next/link";
import EspacoIcone from "@/components/ui/EspacoIcone";
import { useDirecaoRolagem } from "@/hooks/useDirecaoRolagem";
import { useGuardaDeSaida } from "@/hooks/useGuardaDeSaida";

/*
  Cabecalho — seção 9.1 e seção 10, item 2.
  Preso no topo (sticky), 64 px, só com o link "Pulse" para a Início.
  Em Início e Solução, no celular, sai da tela ao rolar para baixo
  (useDirecaoRolagem). Esconde só visualmente: continua acessível.
*/
export default function Cabecalho() {
  // Esta parte é lógica
  const escondido = useDirecaoRolagem();
  const { aoNavegar } = useGuardaDeSaida();

  // Esta parte é lógica
  // Sair do formulário pelo logo também pergunta "Descartar as respostas?"
  function aoNavegarParaInicio(evento) {
    aoNavegar(evento, "/");
  }

  return (
    <header
      data-barra-rolagem
      className={`sticky top-0 z-30 border-b border-borda bg-superficie transition-transform duration-200 ${
        escondido ? "max-md:-translate-y-full" : ""
      }`}
    >
      <div className="margem-lateral mx-auto flex min-h-16 w-full max-w-texto items-center">
        <Link
          href="/"
          onNavigate={aoNavegarParaInicio}
          className="inline-flex min-h-12 items-center gap-2 text-logo font-bold text-marca"
        >
          {/* ICONE-Pulse-AQUI */}
          <EspacoIcone nome="Pulse" />
          <span>Pulse</span>
        </Link>
      </div>
    </header>
  );
}
