"use client";

import TransicaoPagina from "@/components/layout/TransicaoPagina";
import { ProvedorGuardaDeSaida } from "@/hooks/useGuardaDeSaida";
import { ProvedorMensagemDiario } from "@/hooks/useMensagemDiario";

/*
  Provedores — junta os contextos que precisam sobreviver à troca de
  página (por isso ficam no layout):
  - transição de piso tátil entre páginas (Fase 8). Fica por fora,
    porque a guarda de saída usa a transição;
  - guarda de saída ("Descartar as respostas?");
  - mensagem do Diário ("Registro salvo.", "Registro excluído." + Desfazer).

  "Contexto" no React é um jeito de deixar um valor disponível para todos
  os componentes de dentro, sem passar por props de um em um.
*/
export default function Provedores({ children }) {
  return (
    <TransicaoPagina>
      <ProvedorGuardaDeSaida>
        <ProvedorMensagemDiario>{children}</ProvedorMensagemDiario>
      </ProvedorGuardaDeSaida>
    </TransicaoPagina>
  );
}
