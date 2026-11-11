"use client";

import { createContext, useContext, useRef, useState } from "react";
import DialogoConfirmacao from "@/components/ui/DialogoConfirmacao";
import { useNavegacaoComTransicao } from "@/hooks/useTransicaoPagina";

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

  Fase 8: a guarda é a porta de entrada de TODO link interno (componente
  LinkInterno, barra, logo, "Voltar", "Cancelar"). Ela decide primeiro.
  Se a saída estiver livre, passa a navegação para a transição de piso
  tátil (useTransicaoPagina), que decide se a cortina anima ou não.
*/
const ContextoGuarda = createContext(null);

export function ProvedorGuardaDeSaida({ children }) {
  const { navegar, irPara } = useNavegacaoComTransicao();
  // Ref (e não state): mudar o bloqueio não precisa redesenhar a tela
  const bloqueado = useRef(false);
  const [destinoPendente, setDestinoPendente] = useState(null);

  // Esta parte é lógica
  function definirBloqueio(valor) {
    bloqueado.current = valor;
  }

  // Esta parte é lógica
  function aoNavegar(evento, destino) {
    if (!bloqueado.current) {
      // Saída livre: a transição de piso tátil cuida da navegação
      navegar(evento, destino);
      return;
    }
    evento.preventDefault();
    setDestinoPendente(destino);
  }

  // Esta parte é lógica
  function aoDescartar() {
    const destino = destinoPendente;
    bloqueado.current = false;
    setDestinoPendente(null);
    // Dentro do Diário a troca é instantânea; ao sair dele, a cortina anima
    irPara(destino);
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
