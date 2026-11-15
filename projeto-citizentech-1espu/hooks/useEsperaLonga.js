import { useEffect, useState } from "react";

/*
  useEsperaLonga — seção 11.1 (acima de 10 s).
  Devolve true quando "ativo" continua true por mais de 10 s seguidos
  (carregando, "Salvando…" ou "Excluindo…"). Volta a false assim que
  "ativo" vira false, e a contagem recomeça do zero na próxima espera.
*/
export const LIMITE_ESPERA_LONGA = 10000; // 10 s

export function useEsperaLonga(ativo) {
  const [passou, setPassou] = useState(false);

  useEffect(() => {
    if (!ativo) return;
    const espera = setTimeout(() => setPassou(true), LIMITE_ESPERA_LONGA);
    return () => {
      clearTimeout(espera);
      setPassou(false);
    };
  }, [ativo]);

  return ativo && passou;
}
