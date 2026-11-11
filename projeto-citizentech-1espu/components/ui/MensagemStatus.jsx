"use client";

import { useEffect, useState } from "react";
import EspacoIcone from "@/components/ui/EspacoIcone";
import Botao from "@/components/ui/Botao";

/*
  MensagemStatus — seção 10, item 9, e seção 11.
  Ícone + texto, botão "Fechar" e, se houver, uma ação extra ("Desfazer").
  NÃO some sozinha: fica até a pessoa tocar em "Fechar" (seção 11.3).

  - tipo "sucesso" ou "aviso": role="status" (anuncia sem interromper)
  - tipo "erro": role="alert" (anuncia na hora)
  - O foco não é movido (WCAG 4.1.3).

  Por que o texto entra um instante depois: o leitor de tela só anuncia
  mudanças DENTRO de uma região de status que já existia na página. Então
  a região é criada vazia e o texto entra logo em seguida.

  Props:
  - texto, tipo, aoFechar
  - acao: { texto, icone, aoClicar, ocupada }  (opcional, ex.: Desfazer)
*/
const ESTILOS = {
  sucesso: { icone: "CheckCircle", classes: "border-sucesso bg-sucesso-fundo text-sucesso" }, // ICONE-CheckCircle-AQUI
  erro: { icone: "WarningCircle", classes: "border-erro bg-erro-fundo text-erro" }, // ICONE-WarningCircle-AQUI
  aviso: { icone: "Warning", classes: "border-aviso bg-aviso-fundo text-aviso" }, // ICONE-Warning-AQUI
};

export default function MensagemStatus({ tipo = "sucesso", texto, aoFechar, acao }) {
  const estilo = ESTILOS[tipo];
  const [pronta, setPronta] = useState(false);

  // Esta parte é lógica
  useEffect(() => {
    const espera = setTimeout(() => setPronta(true), 100);
    return () => clearTimeout(espera);
  }, []);

  return (
    <div className={`rounded-cartao border-2 p-4 ${estilo.classes}`}>
      <div role={tipo === "erro" ? "alert" : "status"}>
        {/* Esta parte é lógica */}
        {pronta && (
          <p className="flex items-start gap-2 font-bold">
            <EspacoIcone nome={estilo.icone} />
            <span>{texto}</span>
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {/* Esta parte é lógica */}
        {acao && (
          <Botao
            variante="secundario"
            icone={acao.icone}
            aria-disabled={acao.ocupada || undefined}
            onClick={acao.aoClicar}
          >
            {acao.texto}
          </Botao>
        )}
        {/* ICONE-X-AQUI */}
        <Botao variante="secundario" icone="X" aria-label="Fechar mensagem" onClick={aoFechar}>
          Fechar
        </Botao>
      </div>
    </div>
  );
}
