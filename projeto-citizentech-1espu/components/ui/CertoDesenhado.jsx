"use client";

import { motion } from "motion/react";
import { useEfeitos } from "@/hooks/useEfeitos";
import { spring } from "@/lib/presetsMovimento";

/*
  CertoDesenhado — a marca de "certo" das mensagens de sucesso do Diário
  ("Registro salvo.", "Registro excluído.", "Registro restaurado."),
  que se desenha quando a mensagem aparece (seção 19.11; padrão de
  movimento, item 6: "o certo que se desenha, pathLength de 0 a 1").

  Decisão da equipe na 9.9: o "certo" fica na mensagem, e não no botão
  "Salvar registro". Assim a página vai direto para /diario depois de
  salvar, e o anúncio "Registro salvo." não espera nenhuma animação.

  - É desenho feito por código (como o logo da capa), e não um ícone da
    equipe: substitui o marcador ICONE-CheckCircle-AQUI das mensagens de
    sucesso. Decorativo (aria-hidden): o texto da mensagem diz o mesmo.
  - Um círculo parado e o traço do "certo", que se desenha de 0 a 1 com a
    mola spring.padrao.
  - Com os efeitos desligados, já aparece desenhado.
  - Cor: a da mensagem (currentColor, --cor-sucesso).
*/
export default function CertoDesenhado() {
  const { efeitosLigados } = useEfeitos();

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 size-6 shrink-0"
    >
      <circle cx="12" cy="12" r="9.5" />
      <motion.path
        d="M7.5 12.5l3 3 6-6.5"
        initial={efeitosLigados ? { pathLength: 0 } : false}
        animate={{ pathLength: 1 }}
        transition={spring.padrao}
      />
    </svg>
  );
}
