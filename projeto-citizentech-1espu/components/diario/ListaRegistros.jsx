import CartaoRegistro from "@/components/diario/CartaoRegistro";

/*
  ListaRegistros — H2 "Registros" + a lista de cartões, do mais recente
  para o mais antigo (a ordem vem pronta do useRegistros).
*/
export default function ListaRegistros({ registros }) {
  return (
    <section className="mt-12">
      <h2>Registros</h2>
      <ul className="mt-6 grid gap-4">
        {/* Esta parte é lógica */}
        {registros.map((registro) => (
          <CartaoRegistro key={registro.id} registro={registro} />
        ))}
      </ul>
    </section>
  );
}
