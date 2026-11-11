import { ROTULOS_INDICADORES, rotuloTotal } from "@/lib/rotulos";

/*
  useResumoIndicadores — custom hook que calcula os 4 indicadores do
  resumo do Diário a partir da lista (seção 7.1).

  Não precisa de useState: os números são DERIVADOS da lista. Sempre que a
  lista muda (criar, excluir, desfazer), o cálculo acompanha sozinho.
  (O React Compiler, ligado no next.config.mjs, evita refazer a conta
  quando a lista não mudou.)

  Devolve uma lista de { chave, numero, rotulo }, na ordem da tela.
*/
// Esta parte é lógica
export function useResumoIndicadores(registros) {
  const total = registros.length;
  const semAjuda = registros.filter((registro) => registro.precisouDeAjuda === false).length;
  const semSePerder = registros.filter((registro) => registro.chegouSemSePerder === true).length;
  const travessiasSeguras = registros.filter((registro) => registro.travessias === "seguro").length;

  return [
    { chave: "total", numero: total, rotulo: rotuloTotal(total) },
    { chave: "semAjuda", numero: semAjuda, rotulo: ROTULOS_INDICADORES.semAjuda },
    { chave: "semSePerder", numero: semSePerder, rotulo: ROTULOS_INDICADORES.semSePerder },
    {
      chave: "travessiasSeguras",
      numero: travessiasSeguras,
      rotulo: ROTULOS_INDICADORES.travessiasSeguras,
    },
  ];
}
