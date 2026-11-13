import { useEffect } from "react";

/*
  useTituloDaAba — troca o título da aba depois que os dados chegam.

  Usado em "Ver registro", cujo título depende da data do registro
  ("Registro de DD/MM/AAAA — Pulse", seção 4.1). A data só é conhecida
  depois que a API responde, no navegador.

  Detalhe do Next 16: o título do "metadata" da página pode ser aplicado
  um pouco DEPOIS que a página abre, e ele sobrescreveria o nosso. Por
  isso o hook observa o <head> (MutationObserver) e reaplica o título,
  mas só enquanto a pessoa continuar na mesma página. Ao ir para outra
  página, ele não interfere no título dela.

  Com null, mantém o título que a página já tem.
*/
export function useTituloDaAba(titulo) {
  useEffect(() => {
    if (!titulo) return;
    const caminhoDaPagina = window.location.pathname;

    function aplicar() {
      if (window.location.pathname !== caminhoDaPagina) return;
      if (document.title !== titulo) document.title = titulo;
    }

    aplicar();
    const observador = new MutationObserver(aplicar);
    observador.observe(document.head, { subtree: true, childList: true, characterData: true });
    return () => observador.disconnect();
  }, [titulo]);
}
