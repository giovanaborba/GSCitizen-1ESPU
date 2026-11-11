"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import ItemBarra from "@/components/layout/ItemBarra";
import { useDirecaoRolagem } from "@/hooks/useDirecaoRolagem";
import { useDigitandoNoCelular } from "@/hooks/useDigitandoNoCelular";
import { useGuardaDeSaida } from "@/hooks/useGuardaDeSaida";
import { useCabeEmUmaLinha } from "@/hooks/useCabeEmUmaLinha";

// Esta parte é lógica
// Layout da lista no celular. A partir de 768 px (md:) vale sempre a
// linha com ícone e texto lado a lado, que quebra linha se precisar.
const LAYOUT_CELULAR = {
  // reserva antes de medir: 2 × 2, ou 1 linha se houver ~20em livres
  null: "grid grid-cols-2 @min-[20em]:flex",
  true: "flex",
  false: "grid grid-cols-2",
};

/*
  BarraNavegacao — seção 9.2 e seção 10, item 3.
  <nav aria-label="Navegação principal">, flutuante em todos os tamanhos
  de tela, 16 px acima da borda inferior + área de segurança.

  Layout no celular (decisão da Fase 2): cada item tem a largura do seu
  texto, numa linha só. Quando não cabe (tela estreita ou texto
  ampliado), a barra passa para 2 × 2. Quem decide é o hook
  useCabeEmUmaLinha, que mede os textos no navegador. Antes da medição
  (primeiro instante da página), vale uma "container query" de reserva.

  Pouca altura (max-height: 480 px): a barra deixa de flutuar e fica no fim
  da página, no fluxo normal.

  No celular, enquanto um campo de digitação está em uso, a barra sai da
  frente do teclado (seção 7.3). Os itens passam pela guarda de saída do
  formulário ("Descartar as respostas?").
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
  const escondidaPelaRolagem = useDirecaoRolagem();
  const digitando = useDigitandoNoCelular();
  const escondida = escondidaPelaRolagem || digitando;
  const { aoNavegar } = useGuardaDeSaida();
  const refLista = useRef(null);
  const cabeEmUmaLinha = useCabeEmUmaLinha(refLista);

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
          className={`mx-auto gap-1.5 rounded-barra border border-borda bg-superficie p-1.5 shadow-barra md:flex md:w-fit md:flex-wrap md:justify-center ${
            LAYOUT_CELULAR[String(cabeEmUmaLinha)]
          }`}
        >
          {/* Esta parte é lógica */}
          {ITENS.map((item) => (
            <ItemBarra
              key={item.href}
              href={item.href}
              texto={item.texto}
              icone={item.icone}
              ativo={estaAtivo(caminho, item.href)}
              aoNavegar={(evento) => aoNavegar(evento, item.href)}
            />
          ))}
        </ul>
      </div>
    </nav>
  );
}
