import { useEffect, useState } from "react";
import { foiCancelado, obter } from "@/services/registrosService";

/*
  useRegistro — busca UM registro pelo id (telas "Ver registro" e
  "Editar registro").

  Devolve:
  - registro       o registro, ou null
  - carregando     true enquanto busca
  - erro           erro de domínio ({ codigo: "conexao" }) ou null
  - naoEncontrado  true quando a API diz que o registro não existe
  - recarregar     busca de novo (botão "Tentar de novo")
*/
export function useRegistro(id) {
  const [estado, setEstado] = useState({
    registro: null,
    carregando: true,
    erro: null,
    naoEncontrado: false,
  });
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    const controle = new AbortController();

    obter(id, { sinal: controle.signal })
      .then((registro) => {
        setEstado({
          registro,
          carregando: false,
          erro: null,
          naoEncontrado: registro === null,
        });
      })
      .catch((erroDaBusca) => {
        if (foiCancelado(erroDaBusca)) return;
        setEstado({ registro: null, carregando: false, erro: erroDaBusca, naoEncontrado: false });
      });

    return () => controle.abort();
  }, [id, tentativa]);

  function recarregar() {
    setEstado({ registro: null, carregando: true, erro: null, naoEncontrado: false });
    setTentativa((anterior) => anterior + 1);
  }

  return { ...estado, recarregar };
}
