"use client";

import { useRouter } from "next/navigation";
import TituloPagina from "@/components/layout/TituloPagina";
import LinkVoltar from "@/components/ui/LinkVoltar";
import FormularioRegistro from "@/components/diario/FormularioRegistro";
import { useMensagemDiario } from "@/hooks/useMensagemDiario";
import { useRegistros } from "@/hooks/useRegistros";
import { valoresIniciais } from "@/lib/validacao";

/*
  TelaNovoRegistro — a tela /diario/novo (seção 7.3).
  Ao salvar: volta para /diario com a mensagem "Registro salvo.".
*/
export default function TelaNovoRegistro() {
  const router = useRouter();
  const { criar } = useRegistros({ carregarAoIniciar: false });
  const { definirMensagem } = useMensagemDiario();

  async function aoSalvar(dados) {
    await criar(dados);
    definirMensagem({ tipo: "sucesso", texto: "Registro salvo." });
    router.push("/diario");
  }

  return (
    <div className="margem-lateral mx-auto max-w-texto py-8">
      <p className="mb-6">
        <LinkVoltar href="/diario">Voltar ao Diário</LinkVoltar>
      </p>
      <TituloPagina
        titulo="Novo registro"
        resumo="Conte como foi um deslocamento que você já fez."
      />
      <FormularioRegistro
        valoresIniciais={valoresIniciais()}
        aoSalvar={aoSalvar}
        destinoCancelar="/diario"
      />
    </div>
  );
}
