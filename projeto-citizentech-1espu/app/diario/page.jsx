import TelaDiario from "@/components/diario/TelaDiario";

export const metadata = {
  title: "Diário",
};

/*
  /diario — a página só define o título da aba (seção 4.1). Todo o
  conteúdo é interativo e fica em TelaDiario, que roda no navegador
  ("use client"). Uma página com "use client" não pode exportar metadata,
  por isso a divisão em dois arquivos.
*/
export default function PaginaDiario() {
  return <TelaDiario />;
}
