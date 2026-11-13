/*
  Granulado — camada de ruído do fundo da página (seções 19.1, 19.6 e
  19.15; decisão 1 da equipe na subfase 9.0).

  - Fica no começo do <main>, fixa na tela e ATRÁS do conteúdo
    (z-index: -1): aparece no fundo da página, e cartões, botões e campos
    a cobrem. Assim o contraste do texto nunca cai (registro, 9.2 e 9.4).
    As bandas (Secao) têm a própria camada de grão, por cima do fundo
    delas.
  - Decorativa: aria-hidden e sem receber clique.
  - Troca de posição em 6 passos por segundo (CSS, classe .grao). Com os
    efeitos desligados, fica parada; no alto contraste do Windows, some.
  - Não tem lógica: é só a camada. Funciona sem JavaScript (parada).
*/
export default function Granulado() {
  return <div aria-hidden="true" className="grao grao-pagina" />;
}
