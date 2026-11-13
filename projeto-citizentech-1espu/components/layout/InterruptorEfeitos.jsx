"use client";

import { motion } from "motion/react";
import { useEfeitos } from "@/hooks/useEfeitos";
import { spring } from "@/lib/presetsMovimento";

/*
  InterruptorEfeitos — botão "Efeitos" do cabeçalho (seções 19.2, 19.15 e
  19.16).

  - É um botão de alternância: <button type="button" aria-pressed>. O
    nome acessível é o próprio texto visível ("Efeitos: ligados" ou
    "Efeitos: desligados"), e o aria-pressed diz o estado. O leitor de
    tela lê algo como "Efeitos: ligados, botão de alternância,
    pressionado". Não precisa de anúncio extra.
  - O trilho com a bolinha é só decoração (aria-hidden): o texto já diz o
    estado, então a cor nunca é a única pista.
  - Ligar ou desligar vale na hora para a página inteira, sem recarregar,
    e a escolha fica guardada (lib/efeitos.js).

  Por que o texto e as cores vêm do CSS (variantes efeitos-ligados: e
  efeitos-desligados:): o atributo data-efeitos do <html> já está certo
  antes de o React assumir a página. Assim o botão nunca mostra o estado
  errado, nem por um instante. A bolinha anda com a mola rápida
  (PADRAO_MOVIMENTO_PULSE); com os efeitos desligados, ela só troca de
  lugar, sem deslizar.
*/
export default function InterruptorEfeitos() {
  // Esta parte é lógica
  const { efeitosLigados, efeitosConhecidos, alternarEfeitos } = useEfeitos();

  return (
    <motion.button
      type="button"
      aria-pressed={efeitosLigados}
      onClick={alternarEfeitos}
      whileTap={{ scale: 0.97 }}
      className="inline-flex min-h-12 items-center gap-2.5 rounded-full border-2 border-borda bg-superficie py-1 pr-4 pl-2.5 text-left leading-tight font-bold text-texto hover:border-marca max-[26.25rem]:gap-2 max-[26.25rem]:pr-3 max-[26.25rem]:text-[0.95rem]"
    >
      {/* Trilho decorativo: 40 × 24 px, preenchido quando ligado */}
      <span
        aria-hidden="true"
        className="relative h-6 w-10 shrink-0 rounded-full border-2 border-borda bg-[color-mix(in_srgb,var(--cor-borda)_35%,transparent)] efeitos-ligados:border-sobre-acao efeitos-ligados:bg-acao"
      >
        {/* Esta parte é lógica */}
        {/* Antes de o React assumir a página, a posição vem do CSS (já
            certa). Depois, a bolinha passa para o Motion, nascendo no lugar
            certo (initial={false}), e só desliza quando a pessoa aperta. */}
        {efeitosConhecidos ? (
          <motion.span
            initial={false}
            animate={{ x: efeitosLigados ? 16 : 0 }}
            transition={spring.rapida}
            className="absolute top-0.5 left-0.5 size-4 rounded-full bg-texto-2 efeitos-ligados:bg-sobre-acao"
          />
        ) : (
          <span className="absolute top-0.5 left-0.5 size-4 rounded-full bg-texto-2 efeitos-ligados:translate-x-4 efeitos-ligados:bg-sobre-acao" />
        )}
      </span>
      <span className="max-[26.25rem]:max-w-[6.5em]">
        Efeitos: <span className="efeitos-desligados:hidden">ligados</span>
        <span className="efeitos-ligados:hidden">desligados</span>
      </span>
    </motion.button>
  );
}
