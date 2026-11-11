import TelaRegistro from "@/components/diario/TelaRegistro";

/*
  /diario/[id] — "Ver registro".
  O título final ("Registro de DD/MM/AAAA — Pulse") depende da data, que
  só chega quando a API responde no navegador. Até lá, a aba mostra
  "Registro — Pulse", e a TelaRegistro troca o título depois.
*/
export const metadata = {
  title: "Registro",
};

// Esta parte é lógica
// No Next 16, "params" é uma Promise: é preciso esperar (await) para ler o id.
export default async function PaginaRegistro({ params }) {
  const { id } = await params;
  return <TelaRegistro id={id} />;
}
