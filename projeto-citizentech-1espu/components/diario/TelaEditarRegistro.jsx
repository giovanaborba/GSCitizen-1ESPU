"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TituloPagina from "@/components/layout/TituloPagina";
import EstadoTela from "@/components/ui/EstadoTela";
import LinkVoltar from "@/components/ui/LinkVoltar";
import FormularioRegistro from "@/components/diario/FormularioRegistro";
import RegistroNaoEncontrado from "@/components/diario/RegistroNaoEncontrado";
import { useMensagemDiario } from "@/hooks/useMensagemDiario";
import { useRegistro } from "@/hooks/useRegistro";
import { useRegistros } from "@/hooks/useRegistros";
import { useTituloDaAba } from "@/hooks/useTituloDaAba";
import { formatarData } from "@/lib/datas";
import { valoresDoRegistro } from "@/lib/validacao";

/*
  TelaEditarRegistro — a tela /diario/[id]/editar (seção 7.3).
  Busca o registro, preenche o formulário com as respostas atuais e, ao
  salvar, volta para /diario com "Registro salvo.".
*/
export default function TelaEditarRegistro({ id }) {
  const router = useRouter();
  const { registro, carregando, erro, naoEncontrado, recarregar } = useRegistro(id);
  const { atualizar } = useRegistros({ carregarAoIniciar: false });
  const { definirMensagem } = useMensagemDiario();
  const [tentativas, setTentativas] = useState(0);

  // Esta parte é lógica
  useTituloDaAba(naoEncontrado ? "Registro não encontrado" : null);

  // Esta parte é lógica
  function aoTentarDeNovo() {
    setTentativas((anterior) => anterior + 1);
    recarregar();
  }

  // Esta parte é lógica
  async function aoSalvar(dados) {
    await atualizar(id, dados);
    definirMensagem({ tipo: "sucesso", texto: "Registro salvo." });
    router.push("/diario");
  }

  // Esta parte é lógica
  if (naoEncontrado) {
    return (
      <div className="margem-lateral mx-auto max-w-texto py-8">
        <RegistroNaoEncontrado />
      </div>
    );
  }

  return (
    <div className="margem-lateral mx-auto max-w-texto py-8">
      <p className="mb-6">
        <LinkVoltar href={`/diario/${id}`}>Voltar ao registro</LinkVoltar>
      </p>

      <TituloPagina
        titulo={registro ? `Editar registro de ${formatarData(registro.data)}` : "Editar registro"}
        resumo="Conte como foi um deslocamento que você já fez."
      />

      {/* Esta parte é lógica */}
      {carregando && <EstadoTela tipo="carregando" />}
      {erro && (
        <EstadoTela
          key={tentativas}
          tipo="erro"
          aoTentarDeNovo={aoTentarDeNovo}
          focarAoMontar={tentativas > 0}
        />
      )}
      {registro && (
        <FormularioRegistro
          valoresIniciais={valoresDoRegistro(registro)}
          aoSalvar={aoSalvar}
          destinoCancelar={`/diario/${id}`}
        />
      )}
    </div>
  );
}
