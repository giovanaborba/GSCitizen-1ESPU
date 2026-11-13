"use client";

import { useEffect, useState } from "react";
import EspacoIcone from "@/components/ui/EspacoIcone";
import Botao from "@/components/ui/Botao";
import CertoDesenhado from "@/components/ui/CertoDesenhado";

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

  Fase 9 (seção 19.11, decisão da equipe na 9.9): na mensagem de
  sucesso, o ícone é o "certo" que se desenha (CertoDesenhado), de novo a
  cada texto novo ("Registro excluído." → "Registro restaurado."). O
  anúncio continua igual: o texto entra na região de status como antes,
  sem esperar o desenho.

  Props:
  - texto, tipo, aoFechar
  - acao: { texto, icone, aoClicar, ocupada }  (opcional, ex.: Desfazer)
*/
const ESTILOS = {
  // Sucesso: o "certo" é desenhado por código (CertoDesenhado), sem marcador
  sucesso: { icone: null, classes: "border-sucesso bg-sucesso-fundo text-sucesso" },
  erro: { icone: "WarningCircle", classes: "border-erro bg-erro-fundo text-erro" }, // ICONE-WarningCircle-AQUI
  aviso: { icone: "Warning", classes: "border-aviso bg-aviso-fundo text-aviso" }, // ICONE-Warning-AQUI
};

export default function MensagemStatus({ tipo = "sucesso", texto, aoFechar, acao }) {
  const estilo = ESTILOS[tipo];
  const [pronta, setPronta] = useState(false);

  useEffect(() => {
    const espera = setTimeout(() => setPronta(true), 100);
    return () => clearTimeout(espera);
  }, []);

  return (
    <div className={`rounded-cartao border-2 p-4 ${estilo.classes}`}>
      <div role={tipo === "erro" ? "alert" : "status"}>
        {pronta && (
          <p className="flex items-start gap-2 font-bold">
            {estilo.icone ? <EspacoIcone nome={estilo.icone} /> : <CertoDesenhado key={texto} />}
            <span>{texto}</span>
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {acao && (
          <Botao
            variante="secundario-sobre-cor"
            icone={acao.icone}
            aria-disabled={acao.ocupada || undefined}
            onClick={acao.aoClicar}
          >
            {acao.texto}
          </Botao>
        )}
        {/* ICONE-X-AQUI */}
        <Botao variante="secundario-sobre-cor" icone="X" aria-label="Fechar mensagem" onClick={aoFechar}>
          Fechar
        </Botao>
      </div>
    </div>
  );
}
