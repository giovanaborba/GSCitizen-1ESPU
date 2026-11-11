"use client";

import { ProvedorGuardaDeSaida } from "@/hooks/useGuardaDeSaida";
import { ProvedorMensagemDiario } from "@/hooks/useMensagemDiario";

/*
  Provedores — junta os contextos que precisam sobreviver à troca de
  página (por isso ficam no layout):
  - guarda de saída ("Descartar as respostas?");
  - mensagem do Diário ("Registro salvo.", "Registro excluído." + Desfazer).

  "Contexto" no React é um jeito de deixar um valor disponível para todos
  os componentes de dentro, sem passar por props de um em um.
*/
export default function Provedores({ children }) {
  return (
    <ProvedorGuardaDeSaida>
      <ProvedorMensagemDiario>{children}</ProvedorMensagemDiario>
    </ProvedorGuardaDeSaida>
  );
}
