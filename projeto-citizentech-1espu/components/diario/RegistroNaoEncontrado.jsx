import TituloPagina from "@/components/layout/TituloPagina";
import Botao from "@/components/ui/Botao";

/*
  RegistroNaoEncontrado — quando o registro não existe (seção 7.4).
  Usado em "Ver registro" e em "Editar registro".
*/
export default function RegistroNaoEncontrado() {
  return (
    <>
      <TituloPagina titulo="Registro não encontrado" />
      <p className="mt-4">Esse registro pode ter sido excluído.</p>
      <p className="mt-8">
        <Botao href="/diario">Ir para o Diário</Botao>
      </p>
    </>
  );
}
