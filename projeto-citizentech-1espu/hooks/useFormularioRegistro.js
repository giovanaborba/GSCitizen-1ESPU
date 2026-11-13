import { useEffect, useRef, useState } from "react";
import { useGuardaDeSaida } from "@/hooks/useGuardaDeSaida";
import {
  dadosParaSalvar,
  estaValido,
  foiAlterado,
  primeiroCampoComErro,
  validarRegistro,
} from "@/lib/validacao";

/*
  useFormularioRegistro — custom hook do formulário do Diário (seção 7.3).

  Cuida de:
  - valores dos campos;
  - validação SÓ AO ENVIAR (nunca a cada tecla nem ao sair do campo);
  - foco no primeiro campo com erro;
  - "Salvando…": não aceita um segundo envio;
  - falha ao salvar: mantém as respostas e mostra o erro junto ao botão;
  - "sujo" (respostas preenchidas ou alteradas): liga o aviso
    "Descartar as respostas?" e o aviso do navegador ao fechar a aba.

  Parâmetros:
  - valoresIniciais  vazios no "Novo"; os do registro no "Editar"
  - aoSalvar(dados)  função da página que salva e navega. Se der erro,
                     ela deve lançar (throw) o erro.
*/
export function useFormularioRegistro({ valoresIniciais, aoSalvar }) {
  const [valores, setValores] = useState(valoresIniciais);
  // Os valores do início nunca mudam: servem de comparação para o "sujo"
  const [referencia] = useState(valoresIniciais);
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);
  // "falhouAoSalvar" mostra a mensagem; "falhasAoSalvar" conta as falhas,
  // para a mensagem ser anunciada de novo a cada falha
  const [falhouAoSalvar, setFalhouAoSalvar] = useState(false);
  const [falhasAoSalvar, setFalhasAoSalvar] = useState(0);
  const campoParaFocar = useRef(null);
  const { definirBloqueio } = useGuardaDeSaida();

  const sujo = foiAlterado(valores, referencia);

  // Depois que os erros aparecem na tela, leva o foco ao primeiro campo
  // com problema (em grupos de opções, à primeira opção do grupo).
  useEffect(() => {
    const campo = campoParaFocar.current;
    if (!campo) return;
    campoParaFocar.current = null;
    document.querySelector(`[name="${campo}"]`)?.focus();
  }, [erros]);

  // Liga o aviso "Descartar as respostas?" enquanto houver respostas
  // não salvas. Ao salvar, o aviso é desligado para a navegação seguir.
  useEffect(() => {
    definirBloqueio(sujo && !enviando);
    return () => definirBloqueio(false);
  }, [sujo, enviando, definirBloqueio]);

  // Fechar a aba ou recarregar com respostas não salvas: aviso padrão do
  // navegador (o texto é do próprio navegador; não dá para trocar).
  useEffect(() => {
    if (!sujo || enviando) return;
    function aoSairDaPagina(evento) {
      evento.preventDefault();
      evento.returnValue = "";
    }
    window.addEventListener("beforeunload", aoSairDaPagina);
    return () => window.removeEventListener("beforeunload", aoSairDaPagina);
  }, [sujo, enviando]);

  function alterar(campo, valor) {
    setValores((anteriores) => ({ ...anteriores, [campo]: valor }));
  }

  async function enviar(evento) {
    evento.preventDefault();
    if (enviando) return; // "não aceita um segundo toque"

    const novosErros = validarRegistro(valores);
    setErros(novosErros);
    setFalhouAoSalvar(false);

    if (!estaValido(novosErros)) {
      campoParaFocar.current = primeiroCampoComErro(novosErros);
      return;
    }

    setEnviando(true);
    definirBloqueio(false);
    try {
      await aoSalvar(dadosParaSalvar(valores));
      // Sucesso: a página já navegou. "enviando" continua true para o
      // botão não aceitar outro toque durante a troca de página.
    } catch {
      setFalhouAoSalvar(true);
      setFalhasAoSalvar((anterior) => anterior + 1);
      setEnviando(false);
    }
  }

  return { valores, erros, enviando, falhouAoSalvar, falhasAoSalvar, alterar, enviar };
}
