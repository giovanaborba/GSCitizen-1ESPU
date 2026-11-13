/*
  efeitos — a preferência de movimento única do site (seção 19.2).

  Onde o estado mora: no atributo data-efeitos da tag <html>, com o valor
  "ligados" ou "desligados". Por que no <html>:
  - o script do <head> (app/layout.jsx) grava o valor ANTES de a página
    aparecer, então o CSS já nasce certo, sem "piscar";
  - o CSS e o Tailwind leem o mesmo atributo (variantes efeitos-ligados:
    e efeitos-desligados:, no globals.css);
  - o React lê o atributo por useSyncExternalStore (ProvedorMovimento) e
    avisa todos os componentes quando ele muda;
  - funções que não são componentes (a cortina entre páginas, as linhas
    da abertura) leem o atributo na hora, com efeitosLigadosAgora().

  A escolha da pessoa fica no localStorage, chave "pulse-efeitos". Sem
  escolha salva, vale o "reduzir movimento" do aparelho (quem confere isso
  é só o ProvedorMovimento e o script do <head>).

  Este arquivo não sabe de React: só lê, grava e avisa.
*/

export const CHAVE_EFEITOS = "pulse-efeitos";
export const LIGADOS = "ligados";
export const DESLIGADOS = "desligados";
// No servidor, e enquanto o React assume a página (hidratação), o valor
// ainda não é conhecido. Os componentes tratam "desconhecido" como
// desligado: nada começa a se mexer antes da hora.
export const DESCONHECIDO = "desconhecido";

// Quem quer saber das mudanças (o useSyncExternalStore do provedor).
const ouvintes = new Set();

// Esta parte é lógica
// Valor atual, lido do <html>. Sem o atributo (não deveria acontecer com
// JavaScript), vale "desligados".
export function lerEfeitos() {
  const valor = document.documentElement.getAttribute("data-efeitos");
  return valor === LIGADOS ? LIGADOS : DESLIGADOS;
}

// Esta parte é lógica
export function lerEfeitosNoServidor() {
  return DESCONHECIDO;
}

// Esta parte é lógica
// Para funções fora dos componentes (lidas no momento em que rodam).
export function efeitosLigadosAgora() {
  return typeof document !== "undefined" && lerEfeitos() === LIGADOS;
}

// Esta parte é lógica
export function assinarEfeitos(aoMudar) {
  ouvintes.add(aoMudar);
  return () => ouvintes.delete(aoMudar);
}

// Esta parte é lógica
// A escolha salva pela pessoa, ou null se ela nunca mexeu no interruptor
// (ou se o armazenamento falhar, como no modo privado de alguns
// navegadores).
export function lerEscolhaSalva() {
  try {
    const valor = window.localStorage.getItem(CHAVE_EFEITOS);
    return valor === LIGADOS || valor === DESLIGADOS ? valor : null;
  } catch {
    return null;
  }
}

// Esta parte é lógica
// Muda o estado na hora, para a página inteira. "salvar": true quando a
// mudança veio do interruptor (a escolha da pessoa); false quando veio do
// aparelho (assim o aparelho continua mandando até a pessoa escolher).
export function definirEfeitos(ligados, { salvar }) {
  const valor = ligados ? LIGADOS : DESLIGADOS;
  document.documentElement.setAttribute("data-efeitos", valor);
  if (salvar) {
    try {
      window.localStorage.setItem(CHAVE_EFEITOS, valor);
    } catch {
      // Sem armazenamento: a escolha vale até recarregar a página.
    }
  }
  for (const aoMudar of ouvintes) aoMudar();
}
