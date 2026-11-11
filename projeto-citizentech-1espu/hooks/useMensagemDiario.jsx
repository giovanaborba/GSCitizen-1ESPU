"use client";

import { createContext, useContext, useState } from "react";
import { usePathname } from "next/navigation";

/*
  useMensagemDiario — leva a mensagem de status de uma tela para outra.

  Exemplo: em "Novo registro", depois de salvar, a pessoa volta para
  /diario e lá aparece "Registro salvo.". A tela do formulário já foi
  fechada, então a mensagem precisa ficar num lugar que sobrevive à troca
  de página: este contexto, que fica no layout.

  Regras (seções 7.5, 11.2 e 11.3):
  - A mensagem não some sozinha: fica até a pessoa tocar em "Fechar".
  - Cada mensagem pertence a uma página (padrão: /diario). Se a pessoa
    for para outra página, ela é apagada, para não reaparecer depois.
  - Depois de excluir, a mensagem guarda o registro excluído, usado pelo
    "Desfazer".

  Formato: { tipo: "sucesso", texto: "Registro excluído.", registroExcluido }
*/
const ContextoMensagem = createContext(null);

export function ProvedorMensagemDiario({ children }) {
  const caminho = usePathname();
  const [estado, setEstado] = useState({ mensagem: null, caminho });

  // Esta parte é lógica
  // Ao trocar de página, só fica a mensagem que pertence à página nova.
  // (Ajustar o estado durante a renderização é o jeito recomendado pelo
  // React para "reiniciar" um valor quando outro muda.)
  if (estado.caminho !== caminho) {
    setEstado({
      mensagem: estado.mensagem?.rota === caminho ? estado.mensagem : null,
      caminho,
    });
  }

  // Esta parte é lógica
  function definirMensagem(mensagem, rota = "/diario") {
    setEstado((anterior) => ({ ...anterior, mensagem: { ...mensagem, rota } }));
  }

  // Esta parte é lógica
  function limparMensagem() {
    setEstado((anterior) => ({ ...anterior, mensagem: null }));
  }

  const mensagem = estado.mensagem?.rota === caminho ? estado.mensagem : null;

  return (
    <ContextoMensagem.Provider value={{ mensagem, definirMensagem, limparMensagem }}>
      {children}
    </ContextoMensagem.Provider>
  );
}

// Esta parte é lógica
export function useMensagemDiario() {
  const contexto = useContext(ContextoMensagem);
  if (!contexto) {
    throw new Error("useMensagemDiario precisa estar dentro de <ProvedorMensagemDiario>.");
  }
  return contexto;
}
