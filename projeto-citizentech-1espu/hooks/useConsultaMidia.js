import { useSyncExternalStore } from "react";

/*
  useConsultaMidia — diz se uma "media query" do CSS vale agora, e
  atualiza a tela quando ela muda (girar o celular, zoom, ligar "reduzir
  movimento").

  Exemplo: useConsultaMidia("(min-width: 900px) and (min-height: 600px)")

  No servidor (e na primeira pintura, antes de o React assumir a página)
  devolve false: a página vem no modo mais simples, e o efeito só liga
  no navegador. Sem JavaScript, fica no modo simples.
*/

// Uma função de "assinatura" por consulta, sempre a mesma, para o React
// não refazer a assinatura a cada renderização.
const assinaturas = new Map();

function assinaturaDa(consulta) {
  if (!assinaturas.has(consulta)) {
    assinaturas.set(consulta, (aoMudar) => {
      const lista = window.matchMedia(consulta);
      lista.addEventListener("change", aoMudar);
      return () => lista.removeEventListener("change", aoMudar);
    });
  }
  return assinaturas.get(consulta);
}

export function useConsultaMidia(consulta) {
  return useSyncExternalStore(
    assinaturaDa(consulta),
    () => window.matchMedia(consulta).matches,
    () => false,
  );
}
