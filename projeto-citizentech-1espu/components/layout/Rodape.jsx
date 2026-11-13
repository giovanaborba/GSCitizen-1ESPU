"use client";

import { usePathname } from "next/navigation";
import LinkInterno from "@/components/ui/LinkInterno";
import FaixaODS from "@/components/solucao/FaixaODS";
import { useRodapeRevelado } from "@/hooks/useRodapeRevelado";

/*
  Rodape — seção 18.10 (substitui o rodapé da seção 5).
  Escuro nos dois temas, em todas as páginas:
  - links Início, Solução, Simulador e Diário (48 px de altura), que
    passam pela guarda de saída e pela transição (LinkInterno);
  - a linha de créditos.
  Fase 9 (seção 19.6):
  - "PULSE" gigante em laranja no alto do rodapé, decorativo
    (aria-hidden; o leitor de tela não o lê, 19.16). Contraste do laranja
    sobre o rodapé: 4,55:1 no claro e 5,4:1 no escuro;
  - rodapé revelado: com os efeitos ligados, o conteúdo da página sobe e
    revela o rodapé preso embaixo (useRodapeRevelado). Sem o efeito, o
    rodapé é normal.
  Só na página Solução, acima dos links, vem a faixa contínua dos ODS
  (decisão da equipe).

  O espaço extra do fim da página (--espaco-fim, do tamanho da barra
  flutuante + 16 px + área de segurança) fica aqui dentro, para o fundo
  escuro ir até o fim da tela e o último link nunca ficar escondido
  atrás da barra (WCAG 2.4.11).

  É um componente de cliente só para saber em qual página está
  (usePathname). Ele continua vindo pronto do servidor: sem JavaScript, o
  rodapé e a faixa aparecem do mesmo jeito.
*/
const LINKS = [
  { href: "/", texto: "Início" },
  { href: "/solucao", texto: "Solução" },
  { href: "/simulador", texto: "Simulador" },
  { href: "/diario", texto: "Diário" },
];

export default function Rodape() {
  // Esta parte é lógica
  const naSolucao = usePathname() === "/solucao";
  const refRodape = useRodapeRevelado();

  return (
    <footer
      ref={refRodape}
      className="rodape mt-16 bg-rodape-fundo pt-14 pb-[var(--espaco-fim)] text-rodape-texto"
    >
      <div className="margem-lateral mx-auto w-full max-w-pagina">
        <p
          aria-hidden="true"
          className="mb-6 overflow-hidden font-titulo text-[clamp(5.5rem,27vw,21rem)] leading-[0.8] tracking-[0.01em] whitespace-nowrap text-rodape-destaque uppercase"
        >
          Pulse
        </p>

        {/* Esta parte é lógica */}
        {naSolucao && <FaixaODS />}

        <div className="grid gap-4 border-t border-rodape-borda/50 pt-6">
          <ul className="flex flex-wrap gap-x-6 gap-y-1">
            {/* Esta parte é lógica */}
            {LINKS.map((link) => (
              <li key={link.href}>
                <LinkInterno
                  href={link.href}
                  className="inline-flex min-h-12 items-center font-bold text-rodape-texto"
                >
                  {link.texto}
                </LinkInterno>
              </li>
            ))}
          </ul>
          <p className="pb-6 text-auxiliar text-rodape-texto-2">
            Pulse · Global Solution 2026.2 · FIAP · Giovana, Giovane, Mie, Pedro e Thiago.
            Protótipo acadêmico com dados públicos e simulados.
          </p>
        </div>
      </div>
    </footer>
  );
}
