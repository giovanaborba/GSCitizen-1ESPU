"use client";

import { AnimatePresence, motion } from "motion/react";
import CartaoRegistro from "@/components/diario/CartaoRegistro";
import { saida } from "@/lib/presetsMovimento";

/*
  ListaRegistros — H2 "Registros" + a lista de cartões, do mais recente
  para o mais antigo (a ordem vem pronta do useRegistros).

  Fase 9 (seção 19.11; decisão da equipe na 9.9):
  - AnimatePresence mode="popLayout" (padrão de movimento: itens que saem
    de uma lista): um cartão que sai da lista sai rápido (preset "saida")
    e já deixa o lugar livre; os outros se reorganizam com "layout", sem
    salto. Hoje a exclusão acontece na página do registro, então a saída
    não aparece; a estrutura fica pronta.
  - "idDestaque": o registro que acabou de ser salvo ou restaurado
    ("Desfazer"). Ele chega com o gesto PULSO (CartaoRegistro). No Diário,
    só esse registro anima (padrão de movimento, item 5): a lista não
    entra em cascata (initial={false}).
  - Com os efeitos desligados, o MotionConfig tira o layout e as escalas.
*/
export default function ListaRegistros({ registros, idDestaque }) {
  return (
    <section className="mt-12">
      <h2>Registros</h2>
      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {registros.map((registro) => (
            <motion.li key={registro.id} layout exit={{ opacity: 0, transition: saida }}>
              <CartaoRegistro registro={registro} destaque={registro.id === idDestaque} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </section>
  );
}
