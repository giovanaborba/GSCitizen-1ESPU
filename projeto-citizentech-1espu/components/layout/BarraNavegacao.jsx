"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import ItemBarra from "@/components/layout/ItemBarra";
import { useDirecaoRolagem } from "@/hooks/useDirecaoRolagem";

/*
  BarraNavegacao — seção 9.2 e seção 10, item 3.
  <nav aria-label="Navegação principal">, flutuante em todos os tamanhos
  de tela, 16 px acima da borda inferior + área de segurança.

  Layout no celular (decisão da Fase 2): cada item tem a largura do seu
  texto, numa linha só. Quando não cabe (tela de ~320 px ou texto
  ampliado), a barra passa para 2 × 2. Quem decide é uma "container query":
  ela olha a largura disponível para a barra, e não a da tela.

  Pouca altura (max-height: 480 px): a barra deixa de flutuar e fica no fim
  da página, no fluxo normal.
*/
const ITENS = [
  { href: "/", texto: "Início", icone: "House" }, // ICONE-House-AQUI
  { href: "/solucao", texto: "Solução", icone: "Watch" }, // ICONE-Watch-AQUI
  { href: "/simulador", texto: "Simulador", icone: "Play" }, // ICONE-Play-AQUI
  { href: "/diario", texto: "Diário", icone: "Notebook" }, // ICONE-Notebook-AQUI
];

// Esta parte é lógica
// Início só fica ativo em "/". Os outros ficam ativos também nas subrotas
// (ex.: "Diário" em /diario/novo e /diario/abc123/editar).
function estaAtivo(caminho, href) {
  if (href === "/") return caminho === "/";
  return caminho === href || caminho.startsWith(`${href}/`);
}

export default function BarraNavegacao() {
  const caminho = usePathname();
  // Esta parte é lógica
  const escondida = useDirecaoRolagem();
  const refLista = useRef(null);

  // Esta parte é lógica
  // Mede a altura real da barra e guarda em --altura-barra, para o espaço
  // extra no fim da página ter sempre o tamanho certo (1 linha, 2 × 2 ou
  // texto ampliado).
  useEffect(() => {
    const lista = refLista.current;
    if (!lista) return;
    const raiz = document.documentElement;

    const observador = new ResizeObserver(() => {
      raiz.style.setProperty("--altura-barra", `${lista.offsetHeight}px`);
    });
    observador.observe(lista);

    return () => {
      observador.disconnect();
      raiz.style.removeProperty("--altura-barra");
    };
  }, []);

  return (
    <nav
      aria-label="Navegação principal"
      data-barra-rolagem
      className={`margem-lateral fixed inset-x-0 bottom-[calc(var(--distancia-barra)+env(safe-area-inset-bottom))] z-40 transition-transform duration-200 pouca-altura:static pouca-altura:mt-8 pouca-altura:translate-y-0! ${
        escondida
          ? "max-md:translate-y-[calc(100%+var(--distancia-barra)+env(safe-area-inset-bottom))]"
          : ""
      }`}
    >
      <div className="@container">
        <ul
          ref={refLista}
          className="mx-auto grid grid-cols-2 gap-1.5 rounded-barra border border-borda bg-cromo p-1.5 shadow-barra @min-[21em]:flex md:w-fit md:flex-wrap md:justify-center"
        >
          {/* Esta parte é lógica */}
          {ITENS.map((item) => (
            <ItemBarra
              key={item.href}
              href={item.href}
              texto={item.texto}
              icone={item.icone}
              ativo={estaAtivo(caminho, item.href)}
            />
          ))}
        </ul>
      </div>
    </nav>
  );
}
