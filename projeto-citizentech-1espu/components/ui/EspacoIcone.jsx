/*
  EspacoIcone — lugar de um ícone Phosphor (peso Bold), que a equipe
  coloca manualmente (seção 13.1).

  - Fica oculto para o leitor de tela (aria-hidden), porque o texto visível
    ao lado já diz o mesmo.
  - Fase 9 (decisão 4 da equipe, seção 19.5): enquanto o ícone não entra,
    o espaço vazio NÃO ocupa lugar (display: none). Assim a barra e os
    botões ficam com o texto centralizado, sem um buraco ao lado. Quando
    o ícone entrar, ele ocupa os 24 × 24 px dele, e o texto se ajeita.
  - O marcador ICONE-(nome)-AQUI fica em cada lugar que usa este componente.

  Quando o ícone for instalado, troque <EspacoIcone nome="House" /> pelo
  ícone, com tamanho 24 e aria-hidden="true". Exemplo com Phosphor:
  <House size={24} weight="bold" aria-hidden="true" />
*/
export default function EspacoIcone({ nome }) {
  return <span aria-hidden="true" data-icone={nome} className="hidden" />;
}
