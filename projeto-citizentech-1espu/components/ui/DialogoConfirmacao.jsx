"use client";

import { useEffect, useId, useRef } from "react";
import Botao from "@/components/ui/Botao";
import ErroCampo from "@/components/ui/ErroCampo";
import { useEsperaLonga } from "@/hooks/useEsperaLonga";

/*
  DialogoConfirmacao — seção 10, item 10.
  Usado em "Excluir o registro…?" e em "Descartar as respostas?".

  Usa o <dialog> nativo do HTML com showModal(), que já faz:
  - o conteúdo atrás ficar inacessível (nem clique, nem Tab, nem leitor
    de tela) enquanto o diálogo está aberto;
  - a tecla Esc pedir para fechar (evento "cancel").
  Este componente completa com:
  - foco inicial na opção SEGURA (o botão de cancelar);
  - foco de volta no botão que abriu o diálogo, ao fechar;
  - "processando" (ex.: "Excluindo…"), anunciado ao leitor de tela.
    Depois de 10 s (seção 11.1), o anúncio passa a ser "Está demorando
    mais que o normal. Aguarde mais um pouco.". Não há botão de parar: o
    servidor pode excluir mesmo se a espera for interrompida.

  Props: aberto, titulo, texto, textoConfirmar, textoCancelar,
         aoConfirmar, aoCancelar, processando, textoProcessando, erro
*/
export default function DialogoConfirmacao({
  aberto,
  titulo,
  texto,
  textoConfirmar,
  textoCancelar,
  aoConfirmar,
  aoCancelar,
  processando = false,
  textoProcessando,
  erro,
}) {
  const refDialogo = useRef(null);
  const refCancelar = useRef(null);
  const refOrigem = useRef(null);
  const idTitulo = useId();
  const idTexto = useId();
  const demorando = useEsperaLonga(processando);

  useEffect(() => {
    const dialogo = refDialogo.current;
    if (!dialogo) return;

    if (aberto && !dialogo.open) {
      refOrigem.current = document.activeElement;
      dialogo.showModal();
      refCancelar.current?.focus();
    } else if (!aberto && dialogo.open) {
      dialogo.close();
      const origem = refOrigem.current;
      if (origem?.isConnected) origem.focus();
    }
  }, [aberto]);

  // Esc: o React controla a abertura, então impede o fechamento automático
  // e avisa quem usa o diálogo.
  function aoPedirParaFechar(evento) {
    evento.preventDefault();
    if (!processando) aoCancelar();
  }

  // Garantia: se o navegador fechar o diálogo por conta própria, o estado
  // da tela acompanha.
  function aoFechar() {
    if (aberto) aoCancelar();
  }

  function aoTocarConfirmar() {
    if (!processando) aoConfirmar();
  }

  function aoTocarCancelar() {
    if (!processando) aoCancelar();
  }

  return (
    <dialog
      ref={refDialogo}
      aria-labelledby={idTitulo}
      aria-describedby={idTexto}
      onCancel={aoPedirParaFechar}
      onClose={aoFechar}
      className="m-auto max-h-[calc(100%-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-barra border border-borda bg-superficie p-6 text-texto shadow-barra"
    >
      {/* Título em Anton, como todo H2 (seção 18.4), mas no menor tamanho
          do H2: o diálogo é estreito e não tem efeitos (Diário calmo). */}
      <h2 id={idTitulo} className="text-h2-compacto">
        {titulo}
      </h2>
      <p id={idTexto} className="mt-4">
        {texto}
      </p>

      {erro && (
        <ErroCampo papel="alert" className="mt-4">
          {erro}
        </ErroCampo>
      )}

      {/* Anuncia "Excluindo" (e, depois de 10 s, o aviso) sem mover o foco */}
      <p role="status" className="sr-only">
        {processando && textoProcessando
          ? demorando
            ? "Está demorando mais que o normal. Aguarde mais um pouco."
            : textoProcessando.replace("…", "")
          : ""}
      </p>

      <div className="mt-6 flex flex-wrap gap-4">
        <Botao
          variante="perigo-preenchido"
          aria-disabled={processando || undefined}
          onClick={aoTocarConfirmar}
        >
          {processando && textoProcessando ? textoProcessando : textoConfirmar}
        </Botao>
        <Botao ref={refCancelar} variante="secundario" onClick={aoTocarCancelar}>
          {textoCancelar}
        </Botao>
      </div>
    </dialog>
  );
}
