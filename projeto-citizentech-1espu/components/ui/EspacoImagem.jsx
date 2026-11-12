import EspacoIcone from "@/components/ui/EspacoIcone";

/*
  EspacoImagem — seção 10, item 13, e seção 13.2.
  Espaço reservado, com borda tracejada, onde a equipe coloca a imagem
  manualmente. Ele já tem o tamanho final, então o layout não muda quando
  a imagem entrar.

  - "texto": o que aparece no espaço enquanto a imagem não existe
    (ex.: "Ilustração de uma travessia (a definir)"). Opcional.
  - "formato": "paisagem" (16:9), "quadrado" (fotos da equipe), "retrato"
    (4:5, galeria) ou "livre" (ocupa a caixa de quem usa, ex.: foto de
    "Os sinais" no modo fixo).
  - O marcador IMAGEM-(descrição)-AQUI e o alt sugerido ficam em
    comentário no lugar onde este componente é usado.

  Quando a imagem entrar, troque o EspacoImagem por <Image> (next/image)
  ou <img> com o mesmo tamanho e o alt SEMPRE preenchido: frase simples,
  clara e direta, sem começar com "imagem de" (seção 13.2).
*/
const FORMATOS = {
  paisagem: "aspect-video w-full",
  quadrado: "aspect-square",
  retrato: "aspect-[4/5] w-full",
  livre: "size-full",
};

export default function EspacoImagem({ texto, formato = "paisagem", className = "" }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 rounded-cartao border-2 border-dashed border-borda bg-superficie text-center text-auxiliar text-texto-2 ${
        texto ? "p-6" : "p-2"
      } ${FORMATOS[formato]} ${className}`}
    >
      {/* ICONE-Image-AQUI */}
      <EspacoIcone nome="Image" />
      {texto && <p>{texto}</p>}
    </div>
  );
}
