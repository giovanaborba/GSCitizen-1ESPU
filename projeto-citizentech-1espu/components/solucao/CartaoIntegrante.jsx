import EspacoImagem from "@/components/ui/EspacoImagem";

/*
  CartaoIntegrante — seção 10, item 14, e seção 6.2 (Equipe).
  Item de uma <ul>: foto quadrada com cantos arredondados + nome em <h3>.

  Layout por tamanho de tela (seção 12):
  - Celular: foto de 64 px à esquerda, nome à direita.
  - Tablet e computador: foto em cima, nome embaixo.
  (A largura de cada cartão, 3 ou 5 por linha, é definida pela lista na
  página Solução.)

  Foto: enquanto não existe, fica o EspacoImagem. O marcador
  IMAGEM-foto de (nome)-AQUI está na página Solução, ao lado de cada
  integrante. Quando a foto entrar, o alt é "Foto de (nome)"
  (ex.: alt="Foto de Giovana"), seção 13.2.
*/
export default function CartaoIntegrante({ nome, className = "" }) {
  return (
    <li
      className={`flex items-center gap-4 rounded-cartao border border-borda bg-cartao p-4 shadow-cartao md:flex-col md:text-center ${className}`}
    >
      <EspacoImagem formato="quadrado" className="size-16 shrink-0 md:size-32" />
      <h3 className="text-h3">{nome}</h3>
    </li>
  );
}
