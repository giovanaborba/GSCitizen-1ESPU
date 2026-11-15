/*
  FotoFiltro — moldura de foto (cantos arredondados e overflow: hidden),
  usada em "Quem vive o problema", na Galeria e nos polaroides.

  Decisão da equipe: a foto aparece normal, sem filtro em tons de cinza,
  sem pontilhado de domos, sem zoom e sem parallax, com ou sem o mouse em
  cima. A moldura só recorta a imagem. O nome do componente e as props
  ficam como estavam, para não mexer em quem o usa.

  Props: velocidade (não é mais usada), className (formato da moldura) e
  children (a imagem ou o marcador).
*/
export default function FotoFiltro({ className = "", children }) {
  return (
    <div className={`foto-filtro ${className}`}>
      <div className="size-full">{children}</div>
    </div>
  );
}
