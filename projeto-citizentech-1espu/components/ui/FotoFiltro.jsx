"use client";

import { useFiltroFoto } from "@/hooks/useFiltroFoto";
import { useParallax } from "@/hooks/useParallax";

/*
  FotoFiltro — moldura de foto com o filtro de domos e o parallax (seção
  19.6), usada em "Quem vive o problema" (e depois na Galeria, nas
  polaroides e em Tecnologias).

  Estrutura: a moldura (parada, com os cantos arredondados e
  overflow: hidden) e, dentro dela, a camada da imagem (.foto-filtro-camada),
  que é o que se move e muda de cor.

  - Filtro (CSS, .foto-filtro): com os efeitos ligados, a imagem fica em
    tons de cinza, com um pontilhado de domos por cima; com o mouse em
    cima (da moldura ou do cartão) ou com o foco, ganha cor e um zoom de
    1,05 (no celular, quando entra na tela: useFiltroFoto). Com "mais
    contraste" no aparelho (prefers-contrast: more), no alto contraste do
    Windows e com os efeitos desligados, a imagem aparece colorida, sem
    filtro.
  - Parallax (useParallax): só a imagem anda, dentro da moldura; o texto
    ao redor nunca é coberto.
  - Os dois só valem quando há uma imagem de verdade (<img>). Enquanto o
    espaço é só o marcador, nada muda.

  Props: velocidade (±0,06), className (formato da moldura) e children
  (a imagem ou o marcador).
*/
export default function FotoFiltro({ velocidade = 0, className = "", children }) {
  // Esta parte é lógica
  const refMoldura = useParallax(velocidade);
  useFiltroFoto(refMoldura);

  return (
    <div ref={refMoldura} className={`foto-filtro ${className}`}>
      <div className="foto-filtro-camada size-full">{children}</div>
    </div>
  );
}
