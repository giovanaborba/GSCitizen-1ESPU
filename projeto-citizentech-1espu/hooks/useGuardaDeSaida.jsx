"use client";

import { createContext, useContext, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import DialogoConfirmacao from "@/components/ui/DialogoConfirmacao";

/*
  useGuardaDeSaida — aviso "Descartar as respostas?" (seção 7.3).

  O App Router do Next não bloqueia a navegação sozinho. Então:
  1. O formulário avisa quando tem respostas não salvas:
       definirBloqueio(true)
  2. Os links que saem do formulário (barra, "Voltar", "Cancelar", logo
     "Pulse") passam o evento de navegação para aoNavegar(evento, destino).
     O <Link> do Next 16 tem a prop onNavigate, com evento.preventDefault().
  3. Se estiver bloqueado, a navegação é cancelada e o diálogo abre:
     - "Descartar respostas" → libera e vai para o destino;
     - "Continuar preenchendo" (foco inicial) → fecha e fica na página.

  Limite: o botão Voltar DO NAVEGADOR não pode ser bloqueado de forma
  confiável. Fechar a aba e recarregar são cobertos pelo aviso padrão do
  navegador (beforeunload), no useFormularioRegistro.
*/
const ContextoGuarda = createContext(null);

export function ProvedorGuardaDeSaida({ children }) {
  const router = useRouter();
  // Ref (e não state): mudar o bloqueio não precisa redesenhar a tela
  const bloqueado = useRef(false);
  const [destinoPendente, setDestinoPendente] = useState(null);

  // Esta parte é lógica
  function definirBloqueio(valor) {
    bloqueado.current = valor;
  }

  // Esta parte é lógica
  function aoNavegar(evento, destino) {
    if (!bloqueado.current) return;
    evento.preventDefault();
    setDestinoPendente(destino);
  }

  // Esta parte é lógica
  function aoDescartar() {
    const destino = destinoPendente;
    bloqueado.current = false;
    setDestinoPendente(null);
    router.push(destino);
  }

  // Esta parte é lógica
  function aoContinuar() {
    setDestinoPendente(null);
  }

  return (
    <ContextoGuarda.Provider value={{ definirBloqueio, aoNavegar }}>
      {children}
      <DialogoConfirmacao
        aberto={destinoPendente !== null}
        titulo="Descartar as respostas?"
        texto="As respostas deste registro não serão salvas."
        textoConfirmar="Descartar respostas"
        textoCancelar="Continuar preenchendo"
        aoConfirmar={aoDescartar}
        aoCancelar={aoContinuar}
      />
    </ContextoGuarda.Provider>
  );
}

// Esta parte é lógica
export function useGuardaDeSaida() {
  const contexto = useContext(ContextoGuarda);
  if (!contexto) {
    throw new Error("useGuardaDeSaida precisa estar dentro de <ProvedorGuardaDeSaida>.");
  }
  return contexto;
}
