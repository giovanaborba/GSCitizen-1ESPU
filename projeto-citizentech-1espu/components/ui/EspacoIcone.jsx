/*
  EspacoIcone — lugar reservado de 24 × 24 px para um ícone Phosphor (peso
  Bold), que a equipe coloca manualmente (seção 13.1).

  - Fica oculto para o leitor de tela (aria-hidden), porque o texto visível
    ao lado já diz o mesmo.
  - Mantém o tamanho final, então o layout não muda quando o ícone entrar.
  - O marcador ICONE-(nome)-AQUI fica em cada lugar que usa este componente.

  Quando o ícone for instalado, troque <EspacoIcone nome="House" /> pelo
  ícone, mantendo tamanho 24 e aria-hidden="true". Exemplo com Phosphor:
  <House size={24} weight="bold" aria-hidden="true" />
*/
export default function EspacoIcone({ nome }) {
  return (
    <span
      aria-hidden="true"
      data-icone={nome}
      className="inline-block size-6 shrink-0"
    />
  );
}
